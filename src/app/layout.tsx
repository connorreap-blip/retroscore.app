import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Providers from "./providers";
import "./globals.css";

const SITE_URL = "https://retroscore.app";

export const metadata: Metadata = {
  title: "RetroScore — Live MLB scoreboard for your TV",
  description:
    "A hyper-realistic outfield wall baseball scoreboard with live MLB scores, standings, and ballpark ambiance. Built for TVs, desktops, and second monitors.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "RetroScore",
    description:
      "The most beautiful way to watch baseball on your TV. Live scores on a vintage outfield wall scoreboard.",
    type: "website",
    url: SITE_URL,
    siteName: "RetroScore",
  },
  twitter: {
    card: "summary_large_image",
    title: "RetroScore",
    description:
      "Live MLB scoreboard with outfield wall aesthetics. Ballpark sounds. Built for your TV.",
  },
  keywords: [
    "MLB scoreboard",
    "baseball scoreboard",
    "live scores",
    "retro scoreboard",
    "outfield wall",
    "tv scoreboard",
    "baseball standings",
  ],
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1e3a2d" },
    { media: "(prefers-color-scheme: light)", color: "#2b5341" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
