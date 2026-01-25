import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "img0.site | Simple Image Tools",
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
    <html lang="en" className="antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-white text-[#1a1a1a] font-sans antialiased relative overflow-x-hidden selection:bg-black selection:text-white`}
      >
        {/* Indigo Corner Deep Background */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle 600px at 0% 200px, #f3f5ffff, transparent),
              radial-gradient(circle 600px at 100% 200px, #f3f5ffff, transparent)
            `,
          }}
        />
        
        <div className="relative z-10 flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 w-full mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
