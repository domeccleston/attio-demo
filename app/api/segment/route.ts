import { Analytics } from "@segment/analytics-node";

const data = {
  first_name: "Dom",
  last_name: "B",
  email_addresses: [{ email_address: "dom@b.com" }],
  phone_numbers: [{ phone_number: "1234567890" }],
  username: "domb",
  id: "user_123",
  created_at: "2024-01-01",
};

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY!,
  host: "https://events.eu1.segmentapis.com", // Set EU endpoint
  path: "/v1/", // Specify API version
});

export async function GET() {
  const {
    first_name,
    last_name,
    email_addresses,
    phone_numbers,
    username,
    id,
    created_at,
  } = data;

  // Create both promises
  const trackPromise = analytics.track({
    userId: id,
    event: "User Signed Up",
    properties: {
      firstName: first_name,
      lastName: last_name,
      email: email_addresses[0]?.email_address,
      phone: phone_numbers[0]?.phone_number,
      username,
      createdAt: created_at,
    },
  });

  const identifyPromise = analytics.identify({
    userId: id,
    traits: {
      firstName: first_name,
      lastName: last_name,
      email: email_addresses[0]?.email_address,
      phone: phone_numbers[0]?.phone_number,
      username,
      createdAt: created_at,
    },
  });

  // Wait for both operations and flush
  await Promise.all([trackPromise, identifyPromise]);
  await analytics.closeAndFlush();

  return new Response("Success", { status: 200 });
}
