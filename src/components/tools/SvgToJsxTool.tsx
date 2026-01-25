"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { Check, Code, Copy } from "lucide-react";
import { useState } from "react";

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

  // Remove xmlns attributes (optional, keeps JSX cleaner)
  // jsx = jsx.replace(/\s*xmlns="[^"]*"/g, "");

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
  const [fileName, setFileName] = useState("");

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const converted = convertSvgToJsx(text);
      setJsxCode(converted);
      setFileName(file.name);
      setCopied(false);
    } catch (error) {
      console.error(error);
      alert("Failed to read SVG file");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsxCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <FileDropzone
        onFileSelect={handleFile}
        accept={{ "image/svg+xml": [".svg"], "text/plain": [".svg"] }}
        title="Upload SVG file"
        description="We'll convert it to JSX-compatible code"
        className="h-[300px] bg-slate-50 border-slate-200"
      />

      {jsxCode && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Code className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800">JSX Output</h3>
                <p className="text-sm font-medium text-slate-500">{fileName}</p>
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={jsxCode}
              className="w-full h-96 p-6 font-mono text-xs bg-slate-900 text-emerald-400 border border-slate-700 rounded-2xl resize-none focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed shadow-lg selection:bg-amber-500/30"
              spellCheck={false}
            />
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 font-medium">
            <p>
              <strong>Converted attributes:</strong> class → className, fill-rule →
              fillRule, stroke-width → strokeWidth, and more.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
