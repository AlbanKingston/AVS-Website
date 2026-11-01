import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getSettings } from "@/lib/data";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex flex-col">
        <Navbar />
        <main className="min-w-0 flex-1 pt-16">{children}</main>
        <Footer settings={settings} />
        <FloatingActions settings={settings} />
      </body>
    </html>
  );
}
