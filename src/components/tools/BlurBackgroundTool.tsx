"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { removeBackground } from "@imgly/background-removal";
import { saveAs } from "file-saver";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BlurBackgroundTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blurAmount, setBlurAmount] = useState(20);

  const handleFileSelect = async (file: File) => {
    setOriginalFile(file);
    setProcessedImageUrl(null);
    processImageWithBlur(file, blurAmount);
  };

  const processImageWithBlur = async (file: File, blur: number) => {
    setIsProcessing(true);

    try {
      const imageUrl = URL.createObjectURL(file);
      const foregroundBlob = await removeBackground(imageUrl);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // Load original image
      const originalImg = new Image();
      await new Promise((resolve, reject) => {
        originalImg.onload = resolve;
        originalImg.onerror = reject;
        originalImg.src = imageUrl;
      });

      canvas.width = originalImg.width;
      canvas.height = originalImg.height;

      // Draw blurred background
      ctx.filter =  `blur(${blur}px)`;
      ctx.drawImage(originalImg, 0, 0);

      // Reset filter and draw foreground
      ctx.filter = "none";
      const foregroundImg = new Image();
      await new Promise((resolve, reject) => {
        foregroundImg.onload = resolve;
        foregroundImg.onerror = reject;
        foregroundImg.src = URL.createObjectURL(foregroundBlob);
      });

      ctx.drawImage(foregroundImg, 0, 0);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setProcessedImageUrl(url);
        }
        setIsProcessing(false);
      }, "image/png");
    } catch (error) {
      console.error("Blur background failed:", error);
      alert("Failed to blur background. Please try another image.");
      setIsProcessing(false);
    }
  };

  const handleBlurChange = (newBlur: number) => {
    setBlurAmount(newBlur);
    if (originalFile) {
      processImageWithBlur(originalFile, newBlur);
    }
  };

  const handleDownload = () => {
    if (processedImageUrl && originalFile) {
      const fileName = originalFile.name.replace(/\.[^/.]+$/, "") + "-blurred-bg.png";
      saveAs(processedImageUrl, fileName);
      toast.success("Download started!");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {!originalFile ? (
        <FileDropzone
          onFileSelect={handleFileSelect}
          title="Upload image to blur background"
          description="AI-powered background blur, 100% in your browser"
          className="h-[400px] bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
   
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Original</span>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm aspect-square relative">
          
                        <img
                        src={URL.createObjectURL(originalFile)}
                        alt="Original"
                        className="w-full h-full object-contain p-4"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Blurred</span>
                    <div className="rounded-2xl overflow-hidden border-2 border-slate-100 bg-white shadow-sm aspect-square relative">
                         {isProcessing ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 text-center z-10">
                            <Loader2 className="size-10 animate-spin text-cyan-600 mb-3" />
                            <p className="text-sm font-bold text-slate-800">Blurring...</p>
                        </div>
                        ) : processedImageUrl && (
                        <img
                            src={processedImageUrl}
                            alt="Processed"
                            className="w-full h-full object-contain p-4"
                        />
                        )}
                    </div>
                </div>
            </div>
          </div>

          {/* Control Panel (Right - 33%) */}
          <div className="space-y-6">
            <div className="space-y-2 sticky top-8">
                <span className="text-xs font-bold text-slate-400 uppercase">Configuration</span>
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <h2 className="text-lg font-bold text-slate-900">Configuration</h2>
                </div>

                {/* Blur Control */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Blur Intensity</label>
                        <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-lg">
                            {blurAmount}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={blurAmount}
                        onChange={(e) => handleBlurChange(Number(e.target.value))}
                        disabled={isProcessing}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600 disabled:opacity-50"
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                     <button
                        onClick={handleDownload}
                        disabled={!processedImageUrl || isProcessing}
                        className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {isProcessing ? <Loader2 className="size-5 animate-spin"/> : <Download className="size-5" />}
                        Download PNG
                    </button>

                    <button
                        onClick={() => {
                            setOriginalFile(null);
                            setProcessedImageUrl(null);
                        }}
                        className="w-full h-12 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                        <RefreshCw className="size-4" />
                        Reset Algorithm
                    </button>
                </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
