import { constructMetadata } from "@/components/SEO";
import { ArrowLeft, Lock, Shield, WifiOff, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description: "Learn how img0 processes image files locally in your browser, how anonymous usage analytics work, and what offline use requires.",
  canonical: "/privacy-policy",
});

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 font-sans">
      
      {/* Header */}
      <div className="space-y-6 text-center">
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          We believe your photos are yours alone. That is why img0.site processes your images on your device.
        </p>
      </div>

      {/* Core Principle Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Shield className="w-64 h-64 text-slate-900" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-emerald-600" />
          The &quot;Zero Upload&quot; Promise
        </h2>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
          <p>
            Unlike most online converters, <strong>img0.site does NOT upload your files to any server</strong>. 
            All image processing happens directly inside your web browser using advanced technologies like <strong>WebAssembly (Wasm)</strong> and HTML5 Canvas.
          </p>
          <p className="mt-4">
            When you select a file, it stays on your device. It is processed in your device&apos;s memory (RAM), and the result is saved directly to your downloads folder.
            No cloud servers ever touch your images. This means:
          </p>
          <ul className="grid md:grid-cols-2 gap-4 list-none pl-0 mt-6">
             <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <WifiOff className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Offline use:</strong> Previously cached tools may work offline. AI tools require an initial model download. Availability depends on cached assets and your browser.</span>
             </li>
             <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No image uploads:</strong> Your sensitive documents never leave your computer.</span>
             </li>
             <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>On-device processing:</strong> Speed and image capacity depend on your device and browser.</span>
             </li>
          </ul>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-10 text-slate-800 leading-relaxed">
        <section>
          <h3 className="text-xl font-bold mb-3 text-slate-900">What data do we collect?</h3>
          <p>
            We use Vercel Analytics to understand <strong>anonymous site usage trends</strong>, such as page visits. Loading the site and AI models makes network requests; image processing happens locally.
            Image contents and file names are not sent to analytics. Our analytics are not configured to collect:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
            <li>The content of your images or files.</li>
            <li>Your file names.</li>
            <li>Your personal identity.</li>
          </ul>
        </section>

        <section>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Contact Us</h3>
            <p>
                For questions about img0, contact <Link href="https://x.com/saeedsaiyedtwt" className="underline underline-offset-4">Saeed on X</Link>.
            </p>
        </section>
      </div>

    </div>
  );
}
