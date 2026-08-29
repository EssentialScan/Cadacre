import type { Metadata } from "next";
import { Source_Serif_4, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
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
    <html
      lang="en"
      className={`${sourceSerif.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-parchment text-charcoal"
        suppressHydrationWarning
      >
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
