"use server";
import { slugify } from "@/lib/utils";
import { createClerkClient, currentUser } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function createTeam(formData: FormData) {
  const newOrgName = formData.get("teamName") as string;
  const newOrgSlug = slugify(newOrgName);
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const existingOrgsBySlug =
    await clerkClient.organizations.getOrganizationList({
      query: newOrgSlug,
    });

  if (
    existingOrgsBySlug.data.some(
      (org: { slug: string | null }) =>
        org.slug?.toLowerCase() === newOrgSlug.toLowerCase()
    )
  ) {
    throw new Error("An organization with this slug already exists");
  }

  const newOrg = await clerkClient.organizations.createOrganization({
    name: newOrgName,
    slug: newOrgSlug,
    createdBy: user.id,
  });

  return newOrg.id;
}
