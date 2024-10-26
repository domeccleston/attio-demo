import { Analytics } from '@segment/analytics-node';

// Initialize the Segment client
const analytics = new Analytics({ writeKey: process.env.SEGMENT_WRITE_KEY! });

export async function GET() {
  try {
    // Basic user data
    const userId = 'user_123';
    const event = 'User Signed Up';
    const properties = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    // Send a single track event
    await new Promise((resolve, reject) => {
      analytics.track({
        userId: userId,
        event: event,
        properties: properties
      }, (err) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    console.log('Event sent to Segment');

    return new Response(JSON.stringify({ success: true, message: 'Event sent to Segment' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending event to Segment:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send event to Segment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
