import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { Analytics } from "@segment/analytics-node";

export async function GET() {
  return new Response("Hello, World!");
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;
  const SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY;

  if (!SEGMENT_WRITE_KEY) {
    return new Response("Missing SEGMENT_WRITE_KEY", { status: 400 });
  }

  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_SIGNING_SECRET", { status: 400 });
  }

  // Initialize Segment
  const analytics = new Analytics({
    writeKey: process.env.SEGMENT_WRITE_KEY!,
  });

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret
  const webhook = new Webhook(WEBHOOK_SECRET);

  try {
    const event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    const { type, data } = event;

    if (type === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        created_at,
        // Add any other user data you want to track
        phone_numbers,
        username,
        external_accounts,
      } = data;

      try {
        // Track the signup event
        await analytics.track({
          userId: id,
          event: "User Signed Up",
          properties: {
            firstName: first_name,
            lastName: last_name,
            email: email_addresses[0]?.email_address,
            phone: phone_numbers[0]?.phone_number,
            username,
            signupMethod: external_accounts?.[0]?.provider || "email",
            createdAt: created_at,
          },
        });

        // Create/update the user profile in Segment
        await analytics.identify({
          userId: id,
          traits: {
            firstName: first_name,
            lastName: last_name,
            email: email_addresses[0]?.email_address,
            phone: phone_numbers[0]?.phone_number,
            username,
            // Add any other persistent user traits
          },
        });

        console.log("Successfully tracked new user signup in Segment");
      } catch (error) {
        console.error("Error tracking user in Segment:", error);
        return new Response("Error tracking user", { status: 500 });
      }
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }
}
