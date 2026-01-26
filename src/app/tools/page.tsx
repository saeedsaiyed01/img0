"use client";

import { ToolCard } from "@/components/ui/ToolCard";
import { tools } from "@/config/tools";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const presenceAnimations = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
} as const;

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-32 pt-16 px-4 space-y-16">
      {/* Header */}
      <motion.section 
        {...presenceAnimations}
        className="text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-medium tracking-[-0.05em] text-slate-900">
           Image Tools
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 tracking-tight font-medium">
            A unified collection of professional-grade, browser-based utilities. <br className="hidden md:block" />
            Zero server interaction. Total data privacy.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-md mx-auto relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 md:h-auto bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 placeholder:font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all"
          />
        </div>
      </motion.section>

      {/* Tools Grid / Empty State */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <ToolCard
                index={index}
                id={tool.id}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                category={tool.category}
                icon={<tool.icon className="w-full h-full" />}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-slate-100 mb-4">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">No tools found</h3>
            <p className="text-slate-500">We couldn't find any tool matching "{searchQuery}"</p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
          >
            Request a Tool
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
