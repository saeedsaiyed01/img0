"use client";

import { ToolActionBar } from "@/components/ui/ToolActionBar";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Check, Copy, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function Base64Tool() {
  const [base64, setBase64] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBase64(reader.result);
        setCopied(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(base64);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      toast.error("Could not copy. Select the output and copy it manually.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workspace */}
          <div className="lg:col-span-2 space-y-4">
            <FileDropzone 
                onFileSelect={handleFile} 
                accept={{'image/*': []}} 
                title="Upload Image to Convert"
                description="Drag & drop or click to upload"
                className="bg-slate-50 border-slate-200 rounded-3xl min-h-64 md:min-h-72"
            />
          </div>

          {/* Control Panel  */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-300 shadow-sm space-y-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <h2 className="text-lg font-bold text-slate-900">Output</h2>
                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Base64</span>
                </div>

                {base64 ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                         <div className="relative group">
                            <textarea readOnly aria-label="Base64 output" spellCheck={false} value={base64} className="w-full h-64 p-4 font-mono text-xs bg-slate-900 text-slate-300 rounded-xl overflow-auto border border-slate-800 shadow-inner custom-scrollbar whitespace-pre-wrap break-all resize-y min-h-40" />
                             <button
                                onClick={copyToClipboard}
                                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all shadow-sm"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                            </button>
                         </div>
                         <ToolActionBar>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={copyToClipboard}
                                className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {copied ? <Check className="size-5 text-emerald-400" /> : <Copy className="size-5" />}
                                {copied ? "Copied!" : "Copy Base64"}
                            </motion.button>
                         </ToolActionBar>
                         
                         <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 leading-relaxed">
                            <strong>Usage:</strong> Use directly in <code>&lt;img src=&quot;...&quot; /&gt;</code> or CSS <code>background-image</code>.
                        </div>
                    </div>
                ) : (
                    <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                        <FileText className="size-8 mb-2 opacity-50" />
                         <p className="text-sm">No image loaded</p>
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
}
