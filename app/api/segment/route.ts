import { Analytics } from "@segment/analytics-node";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY!,
  flushAt: 1,
}).on("error", console.error);

type SegmentEvent = {
  userId: string;
  event: string;
  properties: Record<string, string | number | boolean>;
};

export async function GET(req: NextRequest) {
  console.log("Starting Segment route handler");

  try {
    const segmentEvent: SegmentEvent = {
      userId: "user_123",
      event: "User Signed Up",
      properties: {
        name: "John Doe",
        email: "john@example.com",
      },
    };

    console.log("About to send event to Segment");
    await new Promise<void>((resolve) => {
      analytics.track(segmentEvent, () => {
        console.log("Track call completed");
        resolve();
      });
    });

    console.log("Event sent to Segment");

    return NextResponse.json(
      { success: true, message: "Event sent to Segment" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Caught error in route handler:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send event to Segment" },
      { status: 500 }
    );
  }
}
