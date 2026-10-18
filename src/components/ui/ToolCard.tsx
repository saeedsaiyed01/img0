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

const labels: Record<ToolCategory, string> = { convert: "Convert", pdf: "Documents", generator: "Create", editor: "Edit & optimize", encode: "Developer" };

export function ToolCard({ title, description, href, category, icon }: ToolCardProps) {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.encode;
  return <Link href={href} className="tool-card group flex h-full flex-col rounded-2xl border border-slate-300 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md focus-visible:border-blue-600 focus-visible:shadow-md md:p-6">
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl [&>svg]:size-5", theme.icon)} aria-hidden="true">{icon}</div>
      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">{labels[category]}</span>
    </div>
    <h3 className="text-balance text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-slate-600">{description}</p>
    <div className="-mx-5 -mb-5 mt-5 flex items-center justify-between rounded-b-2xl border-t border-slate-200 bg-slate-50 px-5 py-3.5 group-hover:bg-blue-50 group-focus-visible:bg-blue-50 md:-mx-6 md:-mb-6 md:px-6"><span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 group-focus-visible:text-blue-700">Open tool</span><ArrowUpRight className="size-4 text-slate-500 group-hover:text-blue-700 group-focus-visible:text-blue-700" aria-hidden="true" /></div>
  </Link>;
}
