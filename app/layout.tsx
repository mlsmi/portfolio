import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FallingDrops } from "@/components/falling-drops";
import { GlowField } from "@/components/glow-field";
import { SITE, siteUrl } from "@/lib/site-config";

const TITLE = `${SITE.name} | ${SITE.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: TITLE,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: SITE.description,
    url: "/",
    siteName: SITE.name,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <FallingDrops />
        <SiteHeader />
        {children}
        <SiteFooter />
        <GlowField />
        <Analytics />
      </body>
    </html>
  );
}
