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

  const result = await analytics.track({
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

  console.log(result);

  // Create/update the user profile in Segment
  const result2 = await analytics.identify({
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

  console.log(result2);

  return new Response("Success", { status: 200 });
}
