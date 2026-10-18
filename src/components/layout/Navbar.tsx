import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20">
      <Link href="/" aria-label="img0 home" className="flex items-center gap-2">
        <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white"><Image src="/insert-picture-icon.png" alt="" fill className="object-contain p-1.5" /></div>
        <span className="text-xl font-bold tracking-tighter text-slate-900">img0</span>
      </Link>
      <nav aria-label="Main navigation" className="flex items-center gap-3 md:gap-5">
        <Link href="https://github.com/saeedsaiyed01/img0" target="_blank" rel="noreferrer" aria-label="View img0 on GitHub" className="flex size-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900"><Github className="size-5" aria-hidden="true" /></Link>
        <Link href="/tools" className="inline-flex min-h-11 items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">All tools</Link>
      </nav>
    </div>
  </header>;
}
