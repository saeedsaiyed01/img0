import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://img0.site"),
  title: {
    default: "img0 (image0) | Instant Image Tools. Purely Local & Private.",
    template: "%s | img0.site",
  },
  description: "img0 (image0): Free, private, and 100% client-side image tools. Process images purely in your browser memory without any uploads. Offline capable.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "img0",
  },
  icons: {
    icon: "/insert-picture-icon.png",
    apple: "/insert-picture-icon.png", // Add apple icon too if possible, reusing the distinct icon
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://img0.site",
    title: "img0 (image0) | Instant Image Tools. Purely Local & Private.",
    description: "img0 (image0): Zero uploads. 100% Privacy. Process images directly in your browser.",
    siteName: "img0.site",
    images: [
      {
        url: "/OG-img0.png",
        width: 1200,
        height: 630,
        alt: "img0.site - Private Browser-Based Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "img0 (image0) | Instant Image Tools. Purely Local & Private.",
    description: "img0 (image0): Zero uploads. 100% Privacy. Free browser-based image utilities.",
    images: ["/OG-img0.png"],
  },
  alternates: {
    canonical: "./",
  },
};

import { PwaRegister } from "@/components/PwaRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`antialiased ${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white overflow-x-hidden`}
      >
        <PwaRegister />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
