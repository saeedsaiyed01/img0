import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "IMG0.site | Simple Image Tools",
  description: "Free, private, and client-side image tools for everyone.",
  icons: {
    icon: "/insert-picture-icon.png",
  },
};

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
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" />
        </div>
      </body>
    </html>
  );
}
