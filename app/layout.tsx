import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

import { PostHogProvider } from "./providers";

import "./styles/globals.css";

export const metadata: Metadata = {
  title: "ModelFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PostHogProvider>
      <ClerkProvider>
        <html lang="en">
          <body className="antialiased">{children}</body>
        </html>
      </ClerkProvider>
    </PostHogProvider>
  );
}
