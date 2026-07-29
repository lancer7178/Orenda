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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
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
            <div className="flex flex-1 flex-col">{children}</div>
          </CalmProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
