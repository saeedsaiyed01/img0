"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { Check, Copy, FileCode } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// SVG attribute conversions for JSX
const SVG_ATTRS: Record<string, string> = {
  "class": "className",
  "for": "htmlFor",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "fill-opacity": "fillOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-style": "fontStyle",
  "font-weight": "fontWeight",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "dominant-baseline": "dominantBaseline",
  "alignment-baseline": "alignmentBaseline",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
  "xmlns:xlink": "xmlnsXlink",
  "clip-path": "clipPath",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "pointer-events": "pointerEvents",
  "marker-start": "markerStart",
  "marker-mid": "markerMid",
  "marker-end": "markerEnd",
};

function convertSvgToJsx(svgString: string): string {
  let jsx = svgString;

  // Convert all kebab-case attributes to camelCase
  for (const [attr, jsxAttr] of Object.entries(SVG_ATTRS)) {
    const regex = new RegExp(`\\b${attr}=`, "g");
    jsx = jsx.replace(regex, `${jsxAttr}=`);
  }

  // Convert style strings to objects (basic conversion)
  jsx = jsx.replace(
    /style="([^"]*)"/g,
    (_, styleString: string) => {
      const styleObj = styleString
        .split(";")
        .filter((s: string) => s.trim())
        .map((s: string) => {
          const [key, value] = s.split(":").map((p: string) => p.trim());
          const camelKey = key.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
          return `${camelKey}: "${value}"`;
        })
        .join(", ");
      return `style={{ ${styleObj} }}`;
    }
  );

  return jsx;
}

export function SvgToJsxTool() {
  const [jsxCode, setJsxCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text();
      const converted = convertSvgToJsx(text);
      setJsxCode(converted);
      setCopied(false);
    } catch (error) {
      console.error(error);
      alert("Failed to read SVG file");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsxCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Workspace (Left - 66%) */}
         <div className="lg:col-span-2 space-y-4">
            <FileDropzone
                onFileSelect={handleFileSelect}
                accept={{ "image/svg+xml": [".svg"], "text/plain": [".svg"] }}
                title="Upload SVG file"
                description="We'll convert it to JSX-compatible code"
                className="h-[500px] bg-slate-50 border-slate-200 rounded-3xl"
            />
         </div>

         {/* Control Panel (Right - 33%) */}
         <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <h2 className="text-lg font-bold text-slate-900">Output</h2>
                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">JSX</span>
                </div>

                {jsxCode ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                         <div className="relative group">
                            <pre className="w-full h-[400px] p-4 font-mono text-[10px] bg-slate-900 text-teal-400 rounded-xl overflow-auto border border-slate-800 shadow-inner custom-scrollbar">
                                {jsxCode}
                            </pre>
                         </div>
                         <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 lg:relative lg:p-0 lg:bg-transparent lg:border-t-0 lg:z-auto">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={copyToClipboard}
                                className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {copied ? <Check className="size-5 text-emerald-400" /> : <Copy className="size-5" />}
                                {copied ? "Copied!" : "Copy JSX"}
                            </motion.button>
                         </div>
                         
                         <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 leading-relaxed">
                             <strong>Tip:</strong> Attributes like <code>class</code> are automatically converted to <code>className</code>.
                        </div>
                    </div>
                ) : (
                    <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                        <FileCode className="size-8 mb-2 opacity-50" />
                         <p className="text-sm">No code generated</p>
                    </div>
                )}
            </div>
         </div>
       </div>
    </div>
  );
}
