import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import CinematicIntro from "@/components/CinematicIntro";
import { getSettings } from "@/lib/data";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Amazing Viral Studios (AVS) | Creativity That Makes You Viral",
    template: "%s | Amazing Viral Studios",
  },
  description:
    "AVS is a creative agency for branding, graphic design, digital marketing, website development, printing and video production.",
  openGraph: {
    title: "Amazing Viral Studios (AVS)",
    description: "Creativity That Makes You Viral.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="preload" as="image" href="/avs-logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try { if (sessionStorage.getItem("avs-cinematic-intro-played")) document.documentElement.dataset.avsIntroSeen = "true"; } catch { document.documentElement.dataset.avsIntroSeen = "true"; }',
          }}
        />
      </head>
      <body className="flex flex-col">
        <MotionConfig reducedMotion="user">
          <Navbar />
          <main className="min-w-0 flex-1 pt-[calc(4rem+env(safe-area-inset-top))]">
            {children}
          </main>
          <Footer settings={settings} />
          <FloatingActions settings={settings} />
          <CinematicIntro />
        </MotionConfig>
      </body>
    </html>
  );
}
