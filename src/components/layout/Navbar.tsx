"use client";

import { Github } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 font-sans">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden">
            <Image 
              src="/insert-picture-icon.png" 
              alt="IMG0" 
              fill
              className="object-contain p-1.5" 
            />  
          </div>
          <span className="font-bold text-xl tracking-tighter text-slate-900 uppercase">
            img0
          </span>
        </Link>
        
        <nav className="flex items-center gap-8">
            <Link 
              href="/tools" 
              className="text-sm font-bold tracking-tight text-slate-500 hover:text-slate-900 transition-colors hidden md:block"
            >
              Browse Tools
            </Link>

            <div className="h-4 w-px bg-slate-100 hidden md:block"></div>

            <Link 
              href="https://github.com/saeedsaiyed01/img0" 
              target="_blank"
              className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
            >
              <Github className="size-5" />
            </Link>

            <Link href="/tools">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-tight transition-all shadow-xl shadow-slate-900/10"
              >
                Get Started
              </motion.button>
            </Link>
        </nav>
      </div>
    </header>
  );
}
