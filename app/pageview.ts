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

  // Page view tracking
  useEffect(() => {
    if (pathname && posthog) {
      let url = pathname;
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
        last_login_date: new Date().toISOString(),
      });
    }
  }, [posthog, user, searchParams, isSignedIn, userId]); // Added searchParams dependency

  // Workspace/organization identification with UTM params
  useEffect(() => {
    if (organization && posthog && !posthog._isIdentified()) {
      console.log("group", {
        id: organization.id,
        name: organization.name,
        domain: extractCompanyDomain(user?.primaryEmailAddress?.emailAddress),
      });
      posthog.group("organization", organization.id, {
        name: organization.name,
        domain: extractCompanyDomain(user?.primaryEmailAddress?.emailAddress),
        userId: userId,
        // Add UTM params if present
      });
    }
  }, [
    extractCompanyDomain,
    organization,
    posthog,
    searchParams,
    user?.primaryEmailAddress?.emailAddress,
    userId,
  ]); // Added searchParams dependency

  return null;
}
