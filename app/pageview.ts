"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuth, useUser, useOrganization } from "@clerk/nextjs";

export function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  // Get both user and organization data from Clerk
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  // Page view tracking (unchanged)
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, posthog]);

  // User identification
  useEffect(() => {
    if (isSignedIn && userId && user && !posthog._isIdentified()) {
      posthog.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
      });
    }
  }, [posthog, user, userId, isSignedIn]);

  // Workspace/organization identification
  useEffect(() => {
    if (organization && posthog) {
      // Identify the workspace/organization
      posthog.group("organization", organization.id, {
        name: organization.name,
        // You might want to add:
        // plan_type: organization.subscription?.plan,
        // industry: organization.metadata.industry,
        // etc.
      });
    }
  }, [organization, posthog]);

  return null;
}
