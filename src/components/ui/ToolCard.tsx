"use client";

import { CATEGORY_THEMES, ToolCategory } from "@/config/tools";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
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

export function ToolCard({ title, description, href, category, icon, index }: ToolCardProps) {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.encode;

  return (
    <Link href={href} className="flex h-full">
      <motion.div
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "group relative flex flex-col w-full p-8 bg-white border border-slate-100 rounded-[32px] transition-all duration-300 font-sans",
          "hover:border-slate-200 hover:shadow-[-20px_30px_60px_-15px_rgba(0,0,0,0.1)]"
        )}
      >
        {/* Header with Icon */}
        <div className="flex justify-between items-start mb-8">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
            theme.icon || "bg-slate-50 text-slate-900"
          )}>
            <div className="w-7 h-7 [&>svg]:w-full [&>svg]:h-full">
              {icon}
            </div>
          </div>
          
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 group-hover:text-slate-900 transition-colors">
            {category.substring(0,3)}-{String(index + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-slate-500 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-900 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            Launch Tool
          </span>
          <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-slate-900 flex items-center justify-center transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
