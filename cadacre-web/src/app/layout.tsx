import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Cadacre — A plain record of where to rentvest",
  description:
    "A data-backed shortlist of regional Australian towns to rentvest in, drawn from public records — no sponsored placements, no sales pressure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
      >
        <body
          className="min-h-full flex flex-col bg-parchment text-charcoal"
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
