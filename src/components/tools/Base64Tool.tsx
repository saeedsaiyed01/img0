"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <FileDropzone 
        onFileSelect={handleFile} 
        accept={{'image/*': []}} 
        title="Upload Image to Convert"
        className="h-[300px] bg-slate-50 border-slate-200"
      />

      {base64 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-slate-800">Base64 Output</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy String"}
            </button>
          </div>
          
          <div className="relative">
            <textarea
              readOnly
              value={base64}
              className="w-full h-80 p-6 font-mono text-xs bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-amber-500 outline-none text-slate-600 leading-relaxed shadow-inner"
            />
          </div>
          
           <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 font-medium">
              <p>
                  <strong>Tip:</strong> This string can be used directly in HTML <code>&lt;img src="..." /&gt;</code> tags or CSS.
              </p>
          </div>
        </div>
      )}
    </div>
  );
}
