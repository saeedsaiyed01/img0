"use client";

import { Cpu, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                0
              </div>
              <span className="font-bold text-xl tracking-tighter text-slate-900 uppercase">
                img0.site
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
           100% secure and local Image utilities designed with absolute privacy in mind. Every pixel processed locally on your machine.
            </p>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">Home</Link></li>
              <li><Link href="/tools" className="text-slate-500 hover:text-slate-900 transition-colors">All Tools</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 2: Tools */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">Top Tools</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/tools/image-to-png" className="text-slate-500 hover:text-slate-900 transition-colors">Image to PNG</Link></li>
              <li><Link href="/tools/image-to-pdf" className="text-slate-500 hover:text-slate-900 transition-colors">Image to PDF</Link></li>
              <li><Link href="/tools/remove-background" className="text-slate-500 hover:text-slate-900 transition-colors">Background Remover</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">Trust</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                Privacy Guaranteed
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Cpu className="w-4 h-4 text-slate-900" />
                100% Client-Side
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Globe className="w-4 h-4 text-slate-900" />
                No Cloud Latency
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-base text-slate-500 font-medium tracking-tight">
          <div>
            © {currentYear} IMG0.site 
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200"></div>
          <div>
            Made by <Link href="https://x.com/saeedsaiyedtwt" target="_blank" className="text-slate-900 hover:text-blue-500 transition-colors underline decoration-slate-200 underline-offset-4 hover:decoration-blue-500">Saeed</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
