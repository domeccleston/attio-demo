import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
