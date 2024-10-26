import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return new Response("Hello, World!");
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_SIGNING_SECRET", { status: 400 });
  }

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

    // Handle the webhook
    const eventType = event.type;
    console.log(`Webhook with type ${eventType}`);

    if (eventType === "user.created") {
      // Log the payload
      console.log("New user created:", event.data);
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }
}
