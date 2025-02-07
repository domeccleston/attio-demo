"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuth, useUser, useOrganization } from "@clerk/nextjs";

export function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  // Extract UTM parameters from URL
  const getUtmParams = useCallback(() => {
    const utmParams: Record<string, string> = {};
    const utmFields = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    utmFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value) {
        utmParams[field] = value;
      }
    });

    return Object.keys(utmParams).length > 0 ? utmParams : null;
  }, [searchParams]);

  // Page view tracking
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

  // User identification with UTM params
  useEffect(() => {
    if (isSignedIn && userId && user && !posthog._isIdentified()) {
      const utmParams = getUtmParams();

      posthog.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
        // Add UTM params if present
        ...(utmParams && {
          initial_utm_source: utmParams.utm_source,
          initial_utm_medium: utmParams.utm_medium,
          initial_utm_campaign: utmParams.utm_campaign,
          initial_utm_term: utmParams.utm_term,
          initial_utm_content: utmParams.utm_content,
        }),
      });
    }
  }, [posthog, user, searchParams, isSignedIn, userId, getUtmParams]); // Added searchParams dependency

  // Workspace/organization identification with UTM params
  useEffect(() => {
    if (organization && posthog) {
      const utmParams = getUtmParams();

      posthog.group("organization", organization.id, {
        name: organization.name,
        created_at: organization.createdAt,
        membership_limit: organization.membersCount,
        // Add UTM params if present
        ...(utmParams && {
          initial_utm_source: utmParams.utm_source,
          initial_utm_medium: utmParams.utm_medium,
          initial_utm_campaign: utmParams.utm_campaign,
          initial_utm_term: utmParams.utm_term,
          initial_utm_content: utmParams.utm_content,
        }),
      });
    }
  }, [getUtmParams, organization, posthog, searchParams]); // Added searchParams dependency

  return null;
}
