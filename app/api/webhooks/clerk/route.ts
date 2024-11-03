import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { WebhookEvent, createClerkClient } from "@clerk/nextjs/server";
import { Analytics } from "@segment/analytics-node";
import { Webhook } from "svix";

// Segment Node SDK doesn't play well with AWS Lambda, so use edge runtime
export const runtime = "edge";

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY!,
  flushAt: 1,
}).on("error", console.error);

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
]);

const extractCompanyDomain = (email?: string): string | null => {
  if (!email) return null;
  const domain = email.split("@")[1];
  return domain && !PERSONAL_EMAIL_DOMAINS.has(domain) ? domain : null;
};

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing CLERK_SIGNING_SECRET" },
      { status: 400 }
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error occurred -- no svix headers");
    return NextResponse.json({ error: "No svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const webhook = new Webhook(WEBHOOK_SECRET);

  try {
    console.log("Verifying webhook");
    const event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    const { type, data } = event;

    if (type === "user.created") {
      console.log("User created");
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        created_at,
        phone_numbers,
        username,
        external_accounts,
        image_url,
      } = data;

      try {
        console.log("Tracking user signup");
        await new Promise<void>((resolve) => {
          analytics.track(
            {
              userId: id,
              event: "User Signed Up",
              properties: {
                firstName: first_name,
                lastName: last_name,
                fullName: `${last_name}, ${first_name}`,
                email: email_addresses[0]?.email_address,
                phone: phone_numbers[0]?.phone_number,
                username,
                signupMethod: external_accounts?.[0]?.provider || "email",
                createdAt: created_at,
                avatarUrl: image_url,
              },
            },
            () => resolve()
          );
        });

        console.log("Tracking user profile");
        await new Promise<void>((resolve) => {
          analytics.identify(
            {
              userId: id,
              traits: {
                firstName: first_name,
                lastName: last_name,
                fullName: `${last_name}, ${first_name}`,
                email: email_addresses[0]?.email_address,
                phone: phone_numbers[0]?.phone_number,
                username,
                avatarUrl: image_url,
                domain: extractCompanyDomain(email_addresses[0]?.email_address),
              },
            },
            () => resolve()
          );
        });

        console.log("Successfully tracked new user profile in Segment");
      } catch (error) {
        console.error("Error tracking user in Segment:", error);
        return NextResponse.json(
          { error: "Error tracking user" },
          { status: 500 }
        );
      }
    } else if (type === "organization.created") {
      console.log("Organization created");
      const {
        id,
        name,
        slug,
        created_at,
        image_url,
        members_count,
        created_by,
      } = data;

      const user = await clerkClient.users.getUser(created_by);
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );
      const domain = primaryEmail?.emailAddress.split("@")[1] || null;

      try {
        console.log("Tracking organization creation");
        await new Promise<void>((resolve) => {
          analytics.group(
            {
              groupId: id,
              userId: created_by, // Use created_by as userId
              traits: {
                name,
                slug,
                createdAt: new Date(created_at * 1000),
                avatarUrl: image_url,
                memberCount: members_count,
                domain,
              },
            },
            () => resolve()
          );
        });

        console.log("Tracking organization creation event");
        await new Promise<void>((resolve) => {
          analytics.track(
            {
              event: "Organization Created",
              userId: created_by, // Use created_by as userId
              properties: {
                organizationId: id,
                name,
                slug,
                createdAt: created_at,
                avatarUrl: image_url,
                memberCount: members_count,
                domain,
              },
            },
            () => resolve()
          );
        });

        console.log("Successfully tracked new organization in Segment");
      } catch (error) {
        console.error("Error tracking organization in Segment:", error);
        return NextResponse.json(
          { error: "Error tracking organization" },
          { status: 500 }
        );
      }
    } else if (type === "session.created") {
      console.log("Session created");
      const { id, user_id, created_at, status, client_id, last_active_at } =
        data;

      try {
        // Fetch user details to maintain consistent identify payload
        const user = await clerkClient.users.getUser(user_id);
        const {
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          username,
          emailAddresses,
          phoneNumbers,
        } = user;

        console.log("Tracking session creation");
        await new Promise<void>((resolve) => {
          analytics.track(
            {
              userId: user_id,
              event: "Session Started",
              properties: {
                sessionId: id,
                clientId: client_id,
                createdAt: new Date(created_at),
                status,
                lastActiveAt: new Date(last_active_at),
              },
            },
            () => resolve()
          );
        });

        console.log("Updating user's last login time");
        await new Promise<void>((resolve) => {
          analytics.identify(
            {
              userId: user_id,
              traits: {
                firstName: first_name,
                lastName: last_name,
                fullName: `${last_name}, ${first_name}`,
                email: emailAddresses[0]?.emailAddress,
                phone: phoneNumbers[0]?.phoneNumber,
                username,
                avatarUrl: image_url,
                domain: extractCompanyDomain(emailAddresses[0]?.emailAddress),
                lastLoginAt: new Date(created_at),
              },
            },
            () => resolve()
          );
        });

        console.log("Successfully tracked new session in Segment");
      } catch (error) {
        console.error("Error tracking session in Segment:", error);
        return NextResponse.json(
          { error: "Error tracking session" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Error occurred" }, { status: 400 });
  }
}
