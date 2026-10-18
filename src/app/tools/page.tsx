"use client";

import { ToolCard } from "@/components/ui/ToolCard";
import { tools, ToolCategory } from "@/config/tools";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

const filters: { value: ToolCategory | "all"; label: string }[] = [
  { value: "all", label: "All tools" }, { value: "convert", label: "Convert" },
  { value: "editor", label: "Edit & optimize" }, { value: "pdf", label: "PDF" },
  { value: "generator", label: "Icons & presets" }, { value: "encode", label: "Developer" },
];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory | "all">("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean).map((word) => word === "img" ? "image" : word === "bg" ? "background" : word);
  const filtered = tools.filter((tool) => {
    const text = [tool.title, tool.description, tool.id.replaceAll("-", " "), tool.category, ...(tool.keywords || [])].join(" ").toLowerCase();
    return (category === "all" || tool.category === category) && words.every((word) => text.includes(word));
  });

  return <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8 pb-20 md:pt-12">
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">Image tools</h1>
      <p className="max-w-2xl text-base text-slate-600 md:text-lg">Convert, edit, and optimize your images. Your files are processed on your device.</p>
    </header>
    <div className="space-y-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm md:p-5">
      <div className="relative max-w-xl">
        <label htmlFor="tool-search" className="sr-only">Search image tools</label>
        <Search className="pointer-events-none absolute left-4 top-3.5 size-5 text-slate-500" aria-hidden="true" />
        <input ref={searchRef} id="tool-search" type="text" role="searchbox" inputMode="search" autoComplete="off" spellCheck={false} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setQuery(""); } }} placeholder="Search tools, e.g. compress or favicon" className="h-12 w-full rounded-xl border border-slate-300 bg-white pr-14 pl-12 text-slate-900 placeholder:text-slate-500" />
        {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); searchRef.current?.focus(); }} className="absolute right-1 top-0.5 flex size-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"><X className="size-4" aria-hidden="true" /></button>}
      </div>
      <div role="group" aria-label="Filter tools by category" className="flex flex-wrap gap-2">
        {filters.map((filter) => <button key={filter.value} aria-pressed={category === filter.value} onClick={() => setCategory(filter.value)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium ${category === filter.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"}`}>{filter.label}</button>)}
      </div>
      <p role="status" aria-live="polite" className="text-sm text-slate-600">{filtered.length} {filtered.length === 1 ? "tool" : "tools"}{query.trim() ? ` matching “${query.trim()}”` : " available"}</p>
    </div>
    {filtered.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((tool, index) => <ToolCard key={tool.id} {...tool} index={index} icon={<tool.icon className="size-6" />} />)}
    </div> : <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
      <h2 className="text-xl font-semibold">No matching tools</h2>
      <p className="mt-2 text-slate-600">Try another name or browse all tools.</p>
      <button onClick={() => { setQuery(""); setCategory("all"); searchRef.current?.focus(); }} className="mt-5 min-h-11 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white">Clear search and filters</button>
    </div>}
  </div>;
}
