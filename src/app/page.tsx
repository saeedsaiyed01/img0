import { ToolCard } from "@/components/ui/ToolCard";
import { tools } from "@/config/tools";

export default function Home() {
  return (
    <div className="space-y-20 animate-in fade-in zoom-in duration-700 max-w-6xl mx-auto pb-24 pt-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative z-10 px-4">
        
        {/* Trust Badge - Refined */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 text-slate-600 text-xs font-bold tracking-wide uppercase mb-2">
             <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             v1.0 • Browser Based
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.04em] text-[#1a1a1a] mb-8 antialiased leading-[0.95] drop-shadow-sm">
          Instant Image Tools. <br />
          Purely Local.
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#666666] font-medium leading-relaxed mb-12 tracking-tight">
          Professional-grade utilities reimagined for the privacy-conscious. <br className="hidden md:block"/>
          No server uploads, zero latency, and absolute data sovereignty.
        </p>

        <div className="flex justify-center gap-4">
            <button className="bg-[#1a1a1a] hover:bg-black text-white px-10 py-4 rounded-full font-semibold text-lg tracking-tight transition-all shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-0.5 border border-transparent">
                Explore Tools
            </button>
        </div>
      </section>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {tools.map((tool, index) => (
          <ToolCard
            key={tool.id}
            index={index}
            id={tool.id}
            title={tool.title}
            description={tool.description}
            href={tool.href}
            category={tool.category}
            icon={<tool.icon className="w-full h-full" />}
          />
        ))}
      </div>
      
      {/* Simple Footer Note */}
      <div className="text-center pt-12">
          <p className="text-sm font-medium text-slate-400">
             ✨ Free forever. Privacy focused.
          </p>
      </div>
    </div>
  );
}

