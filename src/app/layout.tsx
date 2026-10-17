import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { constructMetadata } from "@/components/SEO";
import { siteConfig } from "@/config/site";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/schema";
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
  ...constructMetadata({
    title: 'Free Online Image Tools — No Uploads',
    description: siteConfig.description,
    canonical: '/',
  }),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([generateOrganizationSchema(), generateWebsiteSchema()]).replace(/</g, '\\u003c') }}
        />
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
