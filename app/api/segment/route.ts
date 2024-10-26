const data = {
  first_name: "Dom",
  last_name: "B",
  email_addresses: [{ email_address: "dom@b.com" }],
  phone_numbers: [{ phone_number: "1234567890" }],
  username: "domb",
  id: "user_123",
  created_at: "2024-01-01",
};

const SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY!;
const SEGMENT_API_URL = "https://api.segment.io/v1";

type SegmentPayload = {
  userId: string;
  event?: string;
  traits?: Record<string, string | number | boolean>;
  properties?: Record<string, string | number | boolean>;
  timestamp?: string;
};

async function makeSegmentRequest(endpoint: string, payload: SegmentPayload) {
  const response = await fetch(`${SEGMENT_API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(SEGMENT_WRITE_KEY + ":").toString(
        "base64"
      )}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Segment API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

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

  const commonProperties = {
    firstName: first_name,
    lastName: last_name,
    email: email_addresses[0]?.email_address,
    phone: phone_numbers[0]?.phone_number,
    username,
    createdAt: created_at,
  };

  try {
    // Make both requests
    const [trackResult, identifyResult] = await Promise.all([
      makeSegmentRequest("track", {
        userId: id,
        event: "User Signed Up",
        properties: commonProperties,
        timestamp: new Date().toISOString(), // Add timestamp
      }),
      makeSegmentRequest("identify", {
        userId: id,
        traits: commonProperties,
        timestamp: new Date().toISOString(), // Add timestamp
      }),
    ]);

    console.log("Track result:", trackResult);
    console.log("Identify result:", identifyResult);

    return new Response(JSON.stringify({ trackResult, identifyResult }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error making Segment requests:", error);
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
