import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "FlowMate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
