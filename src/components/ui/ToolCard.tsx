import { CATEGORY_THEMES, ToolCategory } from "@/config/tools";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  href: string;
  category: ToolCategory;
  icon: ReactNode;
  index: number;
}

export function ToolCard({ title, description, href, category, icon }: ToolCardProps) {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.encode;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between h-full p-6",
        "bg-white",
        "border border-slate-200",
        "rounded-2xl", 
        "shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-md hover:-translate-y-1", // Lift off effect
        "hover:border-slate-300"
      )}
    >
      {/* Header with Icon and Arrow */}
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
            "p-3 rounded-xl", // Squircle shape
            theme.icon
        )}>
           <div className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full">
             {icon}
           </div>
        </div>
        
        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
             <h3 className="text-[17px] font-semibold text-[#1a1a1a] tracking-tight group-hover:text-black transition-colors">
                {title}
            </h3>
            {/* Technical ID for "UI Density" look */}
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {category.substring(0,3).toUpperCase()}-0{Math.floor(Math.random() * 9) + 1}
            </span>
        </div>
        
        <p className="text-[14px] text-[#666666] leading-snug font-normal">
          {description}
        </p>
      </div>
    </Link>
  );
}
