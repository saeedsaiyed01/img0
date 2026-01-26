"use client";

import { ArrowRight, CheckCircle2, FileCode, FileText, Image as ImageIcon, Lock, Shield, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const presenceAnimations = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
} as const;

export default function LandingPage() {
  return (
    <div className="bg-white font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-48 md:pb-32 px-4">
        {/* Subtle Tech Pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container mx-auto max-w-6xl text-center space-y-8 md:space-y-12 mt-4 md:mt-[-150px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5  rounded-full bg-slate-50 border border-slate-500 text-slate-500 text-xs font-medium uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
            </span>
            100% Secure
          </motion.div>

          <div className="space-y-4 md:space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-8xl  font-semibold tracking-[-0.05em] leading-[0.9]"
            >
              Instant Image Tools.
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mt-4"
            >
              <span className="relative inline-block px-6 md:px-6 py-1 md:py-3 text-4xl md:text-8xl font-semibold tracking-[-0.05em] leading-[0.9] text-slate-900 whitespace-nowrap">

                Purely Local.
              </span>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 leading-relaxed font-normal tracking-tight mt-8"
          >
            Professional utilities that run entirely in your browser RAM. <br className="hidden md:block" />
            No server uploads. No data leaks. Absolute sovereignty.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
          >
            <Link href="/tools">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-10 py-5 font-semibold text-white transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
              >
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  Explore the Tools
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Bento Grid */}
      <section className="py-16 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            {...presenceAnimations}
            className="flex flex-col items-center mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Utilities.</h2>
            <p className="text-slate-500 text-lg">Curated essentials for modern image workflows.</p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            {/* Background Remover (Large) */}
            <motion.div 
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-8 hover:border-slate-200 transition-all shadow-sm hover:shadow-[-20px_30px_60px_-15px_rgba(0,0,0,0.1)]"
            >
              <div className="flex flex-col h-full">
                <div className="mb-auto">
                   <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-8">
                      <Sparkles className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4 tracking-tight">Background Remover</h3>
                   <p className="text-xl text-slate-500 max-w-sm leading-relaxed">
                     Industry-leading AI segmentation that runs locally. Perfect edges, zero latency.
                   </p>
                </div>
                <Link href="/tools/remove-background">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center text-slate-900 font-bold text-lg group-hover:gap-3 transition-all"
                  >
                    Launch Tool <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </Link>
              </div>
              {/* Decorative element */}
              <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <ImageIcon className="w-64 h-64 rotate-12" />
              </div>
            </motion.div>

            {/* Image to PDF */}
            <motion.div 
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-[32px] border border-slate-100 bg-slate-50 p-8 hover:bg-white hover:border-slate-200 transition-all shadow-sm hover:shadow-[-20px_30px_60px_-15px_rgba(0,0,0,0.1)]"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Multi-Image to PDF</h3>
                  <p className="text-slate-500">Merge images into professional documents instantly.</p>
                </div>
                <Link href="/tools/image-to-pdf" className="mt-auto">
                   <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </motion.div>

            {/* Base64 Encoder */}
            <motion.div 
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-[32px] border border-slate-100 bg-slate-900 p-8 transition-all hover:scale-[1.02] hover:border-slate-800 hover:shadow-[-20px_30px_60px_-15px_rgba(0,0,0,0.3)]"
            >
              <div className="flex flex-col h-full text-white">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Image to Base64</h3>
                  <p className="text-slate-400">Directly embed assets into your codebases.</p>
                </div>
                <Link href="/tools/image-to-base64" className="mt-auto">
                   <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Checklist */}
      <section className="py-16 md:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div {...presenceAnimations} className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold">No Server Uploads</h4>
              <p className="text-slate-500 leading-relaxed">
                Files are processed via WebAssembly and Canvas API directly in your browser. Not a single packet of your image data hits any server.
              </p>
            </motion.div>

            <motion.div {...presenceAnimations} className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold">Works Offline</h4>
              <p className="text-slate-500 leading-relaxed">
                Once loaded, img0 functions perfectly without an internet connection. Complete your tasks anywhere, with maximum security.
              </p>
            </motion.div>

            <motion.div {...presenceAnimations} className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold">No File Size Limits</h4>
              <p className="text-slate-500 leading-relaxed">
                Unlock the power of your own hardware. Process massive high-res images that would crash or trigger paywalls on cloud-based tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>



      
      {/* Local-Only Visualizer */}
      <motion.section 
        {...presenceAnimations}
        className="py-16 md:py-32 px-4 bg-slate-50 border-y border-slate-100"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="relative p-12 md:p-20 rounded-[40px] border-2 border-dashed border-slate-100 bg-white shadow-sm overflow-hidden text-center space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative">
              {/* Input */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="w-24 h-24 rounded-2xl border-2 border-slate-100 bg-slate-50 flex items-center justify-center"
              >
                <ImageIcon className="w-10 h-10 text-slate-400" />
              </motion.div>

              {/* Connector */}
              <div className="flex-1 h-0.5 max-w-[100px] bg-slate-100 relative hidden md:block">
                <motion.div 
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full blur-sm"
                />
              </div>

              {/* Lock (Processor) */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-32 h-32 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center shadow-2xl shadow-slate-400/20 z-10"
              >
                <div className="relative">
                  <Lock className="w-12 h-12 text-slate-900" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-6 border border-slate-200 border-t-slate-900 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Connector */}
              <div className="flex-1 h-0.5 max-w-[100px] bg-slate-100 relative hidden md:block">
                <motion.div 
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full blur-sm"
                />
              </div>

              {/* Output */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="w-24 h-24 rounded-2xl border-2 border-slate-900 bg-slate-900 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-slate-900">End-to-End Local</h3>
              <p className="text-lg text-slate-500 max-w-md mx-auto">
                Your data stays in your browser's memory, period. 
                Processing completes before the first byte could even leave your network.
              </p>
            </div>
          </div>
        </div>
      </motion.section>


      <motion.section 
        {...presenceAnimations}
        className="py-16 md:py-32 px-4 border-t border-slate-100"
      >
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Tools without the telemetry.</h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            Experience professional image processing that respects your privacy. 100% free, forever.
          </p>
          <div className="pt-8">
            <Link href="/tools">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-900 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl shadow-slate-900/40"
              >
                Get Started Now
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
