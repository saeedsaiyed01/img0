
export function Footer() {
    return (
      <footer className="border-t border-slate-200 py-8 mt-auto bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl text-sm text-slate-500">
          <p>© {new Date().getFullYear()} IMG0.site. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Offline Ready
            </span>
            <span className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors cursor-help" title="Files are processed entirely in your browser">
                Privacy First
            </span>
          </div>
        </div>
      </footer>
    );
  }
