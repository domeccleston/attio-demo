import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClerkClient } from "@clerk/nextjs/server";
import { slugify } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
  try {
    const { teamName } = await req.json();
    const teamSlug = slugify(teamName);

    // Check if team name is already taken
    const existingOrgs = await clerkClient.organizations.getOrganizationList({
      query: teamSlug,
    });

    if (
      existingOrgs.data.some(
        (org: { slug: string | null }) =>
          org.slug?.toLowerCase() === teamSlug.toLowerCase()
      )
    ) {
      return NextResponse.json(
        { error: "Team name already taken" },
        { status: 400 }
      );
    }

    // If validation passes, create the setup intent
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ["card"],
      metadata: {
        teamName,
      },
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Error creating subscription" },
      { status: 500 }
    );
  }
}
