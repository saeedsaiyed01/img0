"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";
import { ArrowRight, Download, Minimize, RefreshCw, Settings2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ExportFormat = "original" | "webp" | "jpeg" | "png";

interface CompressionResult {
  blob: Blob;
  url: string;
  size: number;
}

export function CompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("original");
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Ref to track previous URLs for cleanup (avoids re-render loop)
  const prevResultUrlRef = useRef<string | null>(null);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (originalPreview) URL.revokeObjectURL(originalPreview);
      if (prevResultUrlRef.current) URL.revokeObjectURL(prevResultUrlRef.current);
    };
  }, []);

  const getTargetMimeType = useCallback((file: File, format: ExportFormat): string => {
    if (format === "original") {
      const type = file.type;
      // Default to jpeg for unsupported formats
      if (!["image/jpeg", "image/png", "image/webp"].includes(type)) {
        return "image/jpeg";
      }
      return type;
    }
    return `image/${format}`;
  }, []);

  const compressImage = useCallback(async (fileToCompress: File, q: number, format: ExportFormat) => {
    setIsProcessing(true);
    
    const img = new Image();
    const url = URL.createObjectURL(fileToCompress);
    setOriginalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      const mimeType = getTargetMimeType(fileToCompress, format);
      
      // Fill white background for JPEG (no transparency support)
      if (mimeType === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Revoke previous result URL using ref
            if (prevResultUrlRef.current) {
              URL.revokeObjectURL(prevResultUrlRef.current);
            }
            
            const newUrl = URL.createObjectURL(blob);
            prevResultUrlRef.current = newUrl;
            
            setResult({
              blob,
              url: newUrl,
              size: blob.size,
            });
          }
          setIsProcessing(false);
        },
        mimeType,
        q / 100
      );
    };

    img.onerror = () => {
      toast.error("Failed to load image");
      setIsProcessing(false);
    };

    img.src = url;
  }, [getTargetMimeType]);

  // Re-compress when settings change
  useEffect(() => {
    if (file) {
      const debounce = setTimeout(() => {
        compressImage(file, quality, exportFormat);
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [file, quality, exportFormat, compressImage]);

  const handleDownload = () => {
    if (!result || !file) return;

    const ext = exportFormat === "original" 
      ? file.name.split(".").pop() || "jpg"
      : exportFormat;
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const fileName = `${baseName}-compressed.${ext}`;

    const link = document.createElement("a");
    link.href = result.url;
    link.download = fileName;
    link.click();
    toast.success("Download started!");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const compressionRatio = file && result 
    ? Math.round((1 - result.size / file.size) * 100) 
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Upload & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {!file ? (
            <FileDropzone
              onFileSelect={setFile}
              accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
              title="Drop image to compress"
              description="Supports JPG, PNG, WEBP"
              className="h-80 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
            />
          ) : (
            <div className="space-y-4">
              {/* Before/After Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-slate-900/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                    Original
                  </div>
                  <div className="aspect-[4/3] flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJib2FyZCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cmVjdCBmaWxsPSIjZjFmNWY5IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZjFmNWY5IiB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNjaGVja2VyYm9hcmQpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')]">
                    {originalPreview && (
                      <img 
                        src={originalPreview} 
                        alt="Original" 
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-100 bg-slate-50">
                    <p className="text-sm font-bold text-slate-900">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-slate-500 truncate">{file.name}</p>
                  </div>
                </div>

                {/* Compressed */}
                <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
                    Compressed
                  </div>
                  <div className="aspect-[4/3] flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJib2FyZCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cmVjdCBmaWxsPSIjZjFmNWY5IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZjFmNWY5IiB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNjaGVja2VyYm9hcmQpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')]">
                    {isProcessing ? (
                      <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
                    ) : result?.url ? (
                      <img 
                        src={result.url} 
                        alt="Compressed" 
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : null}
                  </div>
                  <div className="p-3 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">
                        {result ? formatFileSize(result.size) : "—"}
                      </p>
                      {compressionRatio > 0 && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          -{compressionRatio}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Replace Button */}
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  if (originalPreview) URL.revokeObjectURL(originalPreview);
                  setOriginalPreview(null);
                }}
                className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors"
              >
                Upload Different Image
              </button>
            </div>
          )}
        </div>

        {/* Right: Settings Panel */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="p-6 border border-slate-200 bg-white shadow-sm rounded-2xl space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Settings2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800">Compression Settings</h3>
            </div>

            {/* Quality Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Quality</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {/* Export Format */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Export Format
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["original", "webp", "jpeg", "png"] as ExportFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all border",
                      exportFormat === format
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {format === "original" ? "Original" : format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 border border-slate-200 bg-white shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Minimize className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800">Compression Stats</h3>
            </div>

            {file && result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Before</p>
                    <p className="text-lg font-bold text-slate-900">{formatFileSize(file.size)}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase">After</p>
                    <p className="text-lg font-bold text-emerald-600">{formatFileSize(result.size)}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${100 - compressionRatio}%` }}
                  />
                </div>
                <p className="text-center text-sm text-slate-600">
                  Reduced by <span className="font-bold text-emerald-600">{compressionRatio}%</span>
                </p>
              </div>
            ) : (
              <div className="text-sm text-slate-400 py-4 text-center italic">
                Upload an image to see stats
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 lg:relative lg:p-0 lg:bg-transparent lg:border-t-0 lg:z-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className={cn(
                "w-full h-14 text-base font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md",
                result && !isProcessing
                  ? "bg-slate-900 hover:bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? "Compressing..." : "Download Compressed"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
