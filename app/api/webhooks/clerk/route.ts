import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Analytics } from "@segment/analytics-node";

export const runtime = "edge";

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY!,
  flushAt: 1,
}).on("error", console.error);

export async function GET() {
  return new Response("Hello, World!");
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing CLERK_SIGNING_SECRET" },
      { status: 400 }
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error occurred -- no svix headers");
    return NextResponse.json({ error: "No svix headers" }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret
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
                email: email_addresses[0]?.email_address,
                phone: phone_numbers[0]?.phone_number,
                username,
                signupMethod: external_accounts?.[0]?.provider || "email",
                createdAt: created_at,
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
                email: email_addresses[0]?.email_address,
                phone: phone_numbers[0]?.phone_number,
                username,
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
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Error occurred" }, { status: 400 });
  }
}
