"use client";

import { ToolActionBar } from "@/components/ui/ToolActionBar";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { removeBackground } from "@imgly/background-removal";
import { saveAs } from "file-saver";
import { Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function BackgroundRemovalTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState("Preparing...");
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setOriginalFile(file);
    setProcessedImageUrl(null);
    setError(null);
    setIsProcessing(true);
    setLoadingText("Processing image...");

    try {
      const imageUrl = URL.createObjectURL(file);
      
      // Process image directly
      const blob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(blob);
      setProcessedImageUrl(url);
    } catch (error) {
      console.error("Background removal failed:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImageUrl && originalFile) {
      const fileName = originalFile.name.replace(/\.[^/.]+$/, "") + "-no-bg.png";
      saveAs(processedImageUrl, fileName);
      toast.success("Download started!");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {!originalFile ? (
        <FileDropzone
          onFileSelect={handleFileSelect}
          accept={{
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp']
          }}
          title="Upload image to remove background"
          description="Supports PNG, JPG, and WebP"
          className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 min-h-64 md:min-h-72"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
             {/* Comparison View */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Original</span>
                    <div className="rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-sm aspect-square relative">
                        <img
                        src={URL.createObjectURL(originalFile)}
                        alt="Original"
                        className="w-full h-full object-contain p-4"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Processed</span>
                     <div
                        className="rounded-2xl overflow-hidden border border-purple-100 shadow-sm aspect-square relative bg-white"
                        style={{
                        backgroundImage:
                            "linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                        }}
                    >
                         {isProcessing ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 text-center z-10">
                            <Loader2 className="size-10 animate-spin text-purple-600 mb-3" />
                            <p className="text-sm font-bold text-slate-800">{loadingText}</p>
                        </div>
                        ) : error ? (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/90 backdrop-blur-sm p-6 text-center z-10">
                                <Sparkles className="size-8 text-red-500 mb-2" />
                                <p className="text-sm font-bold text-red-800">Failed</p>
                                <p className="text-xs text-red-600 mt-1">{error}</p>
                             </div>
                        ) : processedImageUrl && (
                            <img
                                src={processedImageUrl}
                                alt="Processed"
                                className="w-full h-full object-contain p-4 relative z-0"
                            />
                        )}
                    </div>
                </div>
             </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <div className="space-y-2 lg:sticky lg:top-24">
               <span className="text-xs font-semibold text-slate-500 uppercase">Controls</span>
               <div className="p-6 bg-white rounded-2xl border border-slate-300 shadow-sm space-y-6">
               <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <h2 className="text-lg font-bold text-slate-900">Actions</h2>
                </div>

               <ToolActionBar>
                  <div className="flex flex-col gap-3">
                       <motion.button
                       whileTap={{ scale: 0.95 }}
                       onClick={handleDownload}
                       disabled={!processedImageUrl || isProcessing}
                       className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                       <Download className="size-5" />
                       Download PNG
                       </motion.button>
   
                       <motion.button
                       whileTap={{ scale: 0.95 }}
                       onClick={() => {
                           setOriginalFile(null);
                           setProcessedImageUrl(null);
                       }}
                       className="w-full h-12 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-colors flex items-center justify-center gap-2"
                       >
                       <RefreshCw className="size-4" />
                       Reset / New Image
                       </motion.button>
                  </div>
               </ToolActionBar>

                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed">
                    <div className="flex items-center gap-2 font-bold mb-1 text-purple-800">
                        <Sparkles className="size-3" />
                        <span>Privacy First</span>
                    </div>
                    Processing happens 100% in your browser. No data leaves your device.
                </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
