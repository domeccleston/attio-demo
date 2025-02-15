"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuth, useUser, useOrganization } from "@clerk/nextjs";

export function PostHogPageView(): null {
  const PERSONAL_EMAIL_DOMAINS = useMemo(
    () =>
      new Set([
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "aol.com",
        "icloud.com",
        "proton.me",
      ]),
    []
  );

  const extractCompanyDomain = useCallback(
    (email?: string): string | null => {
      if (!email) return null;
      const domain = email.split("@")[1];
      return domain && !PERSONAL_EMAIL_DOMAINS.has(domain) ? domain : null;
    },
    [PERSONAL_EMAIL_DOMAINS]
  );

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

  // Anonymous user handling
  useEffect(() => {
    if (!isSignedIn && posthog && !posthog._isIdentified()) {
      // Only set a new anonymous ID if we don't already have one
      // This will persist for the browsing session but reset when browser is closed
      // due to being in sessionStorage
      let anonymousId = sessionStorage.getItem("ph_anonymous_id");
      if (!anonymousId) {
        anonymousId = Math.random().toString(36).substring(2);
        sessionStorage.setItem("ph_anonymous_id", anonymousId);
        posthog.reset();
        posthog.identify(anonymousId);
      }
    }
  }, [isSignedIn, posthog]);

  // User identification with UTM params
  useEffect(() => {
    if (isSignedIn && userId && user && !posthog._isIdentified()) {
      const utmParams = getUtmParams();

      posthog.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        // Add UTM params if present
        ...(utmParams && {
          utmSource: utmParams.utm_source,
          utmMedium: utmParams.utm_medium,
          utmCampaign: utmParams.utm_campaign,
          utmTerm: utmParams.utm_term,
          utmContent: utmParams.utm_content,
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
        domain: extractCompanyDomain(user?.primaryEmailAddress?.emailAddress),
        // Add UTM params if present
        ...(utmParams && {
          utmSource: utmParams.utm_source,
          utmMedium: utmParams.utm_medium,
          utmCampaign: utmParams.utm_campaign,
          utmTerm: utmParams.utm_term,
          utmContent: utmParams.utm_content,
        }),
      });
    }
  }, [
    extractCompanyDomain,
    getUtmParams,
    organization,
    posthog,
    searchParams,
    user?.primaryEmailAddress?.emailAddress,
  ]); // Added searchParams dependency

  return null;
}
