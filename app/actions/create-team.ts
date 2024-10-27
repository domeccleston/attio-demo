"use server";
import { createClerkClient, currentUser } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function createTeam(formData: FormData) {
  const newOrgName = formData.get("teamName") as string;
  const newOrgSlug = formData.get("teamSlug") as string;
  const user = await currentUser();

  console.log({ newOrgName, newOrgSlug });

  if (!user) {
    throw new Error("User not found");
  }

  const existingOrgsByName =
    await clerkClient.organizations.getOrganizationList({
      query: newOrgName,
    });

  if (
    existingOrgsByName.data.some(
      (org: { name: string }) =>
        org.name.toLowerCase() === newOrgName.toLowerCase()
    )
  ) {
    throw new Error("An organization with this name already exists");
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

  const newOrg =await clerkClient.organizations.createOrganization({
    name: newOrgName,
    slug: newOrgSlug,
    createdBy: user.id,
  });

  return newOrg.id;
}
