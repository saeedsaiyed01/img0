import { ArrowUpRight, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const linkClass = "inline-flex min-h-11 items-center gap-1.5 text-[13px] text-slate-500 transition-colors hover:text-blue-700";
  return <footer className="border-t border-slate-200/70 bg-white">
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-5">
      <div className="grid gap-8 pb-7 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
        <div>
          <Link href="/" aria-label="img0 home" className="inline-flex items-center gap-2"><span className="relative size-8 overflow-hidden rounded-lg border border-slate-200"><Image src="/insert-picture-icon.png" alt="" fill className="object-contain p-1.5" /></span><span className="text-lg font-bold tracking-tighter text-slate-900">img0</span></Link>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-slate-500">A useful little toolkit for your images.<br />Free to use. Made for your browser.</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-800"><LockKeyhole className="size-3.5" aria-hidden="true" />Your images stay on your device.</p>
        </div>
        <nav aria-label="Image tools" className="grid grid-cols-2 gap-6 md:col-span-2">
          <div><h2 className="mb-1 text-[11px] font-semibold tracking-wide text-slate-800">THE TOOLKIT</h2><ul><li><Link href="/tools/compress-image" className={linkClass}>Compress images</Link></li><li><Link href="/tools/remove-background" className={linkClass}>Remove backgrounds</Link></li><li><Link href="/tools/image-to-pdf" className={linkClass}>Images to PDF</Link></li></ul></div>
          <div><h2 className="mb-1 text-[11px] font-semibold tracking-wide text-slate-800">EXPLORE</h2><ul><li><Link href="/tools" className={linkClass}>All tools</Link></li><li><Link href="/privacy-policy" className={linkClass}>Privacy policy</Link></li><li><Link href="https://github.com/saeedsaiyed01/img0" target="_blank" rel="noreferrer" className={linkClass}>Source on GitHub <ArrowUpRight className="size-3" aria-hidden="true" /></Link></li></ul></div>
        </nav>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500"><p>© {new Date().getFullYear()} img0</p><p>Made by <Link href="https://x.com/saeedsaiyedtwt" target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center text-slate-700 underline decoration-slate-300 underline-offset-4">Saeed</Link></p></div>
    </div>
  </footer>;
}
