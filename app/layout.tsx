import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { CalmProvider } from "@/components/calm-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// No `axes` here on purpose. Fraunces ships SOFT/WONK/opsz as extra variable
// axes, and asking for them roughly doubles the file — but nothing in the app
// sets `font-variation-settings`, so every one of those bytes was paying for
// an axis that never moves off its default.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  // 300 was never used — the app only reaches for 400, 500 and 600.
  weight: ["400", "500", "600"],
  subsets: ["arabic", "latin"],
  display: "swap",
  // The document is always server-rendered as `lang="en"`; Arabic is applied
  // only after the client reads the stored locale. So preloading it is wrong
  // on first paint for everyone, and for an English reader it is weight that
  // is never rendered at all. Dropped to an on-demand fetch: the @font-face
  // rules still ship, and the browser pulls the files the moment Arabic text
  // is actually laid out.
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Orenda — a private check-in with yourself",
    template: "%s · Orenda",
  },
  description:
    "A calm, private screening for emotional well-being built on validated scales. Every answer is processed in your browser and nothing is ever sent anywhere.",
  applicationName: "Orenda",
};

export const viewport: Viewport = {
  themeColor: "#f9f8f6",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="orenda-wash bg-cream text-ink flex min-h-full flex-col">
        <LanguageProvider>
          <CalmProvider>
            <SiteHeader />
            {/* Several screens bleed a decorative glow past the reading
                column. `clip` (not `hidden`) keeps that bleed from turning
                into sideways scroll on a phone without making this a scroll
                container, so the sticky header and smooth anchor jumps
                still work. */}
            <div className="flex flex-1 flex-col overflow-x-clip">
              {children}
            </div>
          </CalmProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
