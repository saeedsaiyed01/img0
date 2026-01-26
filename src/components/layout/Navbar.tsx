
import { Github } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/insert-picture-icon.png" 
            alt="img0 Logo" 
            className="size-8 object-contain group-hover:scale-110 transition-transform" 
          />
          <span className="font-bold text-xl tracking-tight text-slate-900">
            IMG0

          </span>
        </Link>
        
        <div className="flex items-center gap-4">
            <Link 
              href="https://github.com" 
              target="_blank"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
            >
              <Github className="size-5" />
            </Link>
        </div>
      </div>
    </header>
  );
}
