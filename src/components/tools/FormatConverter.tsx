"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";
import { Download, RefreshCw, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormatConverterProps {
  targetFormat: string;
  quality?: number; // 0 to 1
}

export default function FormatConverter({
  targetFormat,
  quality: defaultQuality = 0.9,
}: FormatConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(defaultQuality * 100);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);


  const processImage = async (file: File, q: number) => {
    setIsProcessing(true);
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Fill background for non-transparent formats
      if (targetFormat === 'image/jpeg' || targetFormat === 'image/x-icon') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      const qVal = q / 100;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newUrl = URL.createObjectURL(blob);
            setConvertedUrl(newUrl);
            setFileSize(blob.size);
          }
          setIsProcessing(false);
          URL.revokeObjectURL(url);
        },
        targetFormat,
        qVal
      );
    };
    
    img.src = url;
  };

  useEffect(() => {
    if (file) {
      processImage(file, quality);
    }
  }, [file, quality, targetFormat]);

  const handleDownload = () => {
    if (convertedUrl && file) {
      const link = document.createElement('a');
      const ext = targetFormat.split('/')[1].replace('x-icon', 'ico').replace('jpeg', 'jpg');
      const name = file.name.substring(0, file.name.lastIndexOf('.')) + `.${ext}`;
      link.href = convertedUrl;
      link.download = name;
      link.click();
      toast.success("Download started!");
    }
  };

  const extension = targetFormat.split('/')[1].replace('x-icon', 'ico').toUpperCase();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <FileDropzone
                onFileSelect={setFile}
                title="Drop image to convert"
                description={`Convert to ${extension}`}
                className="h-80 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
            />
        </div>

        {/* Controls Section */}
        <div className="space-y-6">
            <div className="p-6 border border-slate-200 bg-white shadow-sm rounded-2xl space-y-6">
                 <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Settings2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">
                        Conversion Settings
                    </h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>Target Format</span>
                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold">{extension}</span>
                        </div>
                    </div>

                    {(extension === 'JPG' || extension === 'WEBP') && (
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <span>Quality</span>
                                <span>{quality}%</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    )}
                 </div>
            </div>

            {/* Output Status */}
            <div className="p-6 border border-slate-200 bg-white shadow-sm rounded-2xl flex flex-col justify-between min-h-[120px]">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 mb-2">
                    Estimated Size
                </div>
                
                {fileSize ? (
                    <div className="space-y-1">
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            {(fileSize / 1024).toFixed(1)} <span className="text-lg font-medium text-slate-500">KB</span>
                        </div>
                        <div className="text-xs text-emerald-600 font-bold uppercase flex items-center gap-1.5 bg-emerald-50 w-fit px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Ready to Export
                        </div>
                    </div>
                ) : (
                     <div className="text-sm text-slate-400 py-4 italic">
                        Upload an image to see preview
                     </div>
                )}
            </div>

            <button
                onClick={handleDownload}
                disabled={!convertedUrl}
                className={cn(
                    "w-full h-14 text-base font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95",
                    convertedUrl 
                        ? "bg-slate-900 hover:bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
            >
                {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                {isProcessing ? "Processing..." : "Download Image"}
            </button>
        </div>
      </div>
    </div>
  );
}
