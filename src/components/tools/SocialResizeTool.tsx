"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Archive, Check, Download, Image as ImageIcon, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface SocialPreset {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  color: string;
  bgColor: string;
}

interface GeneratedImage {
  preset: SocialPreset;
  blob: Blob;
  url: string;
}

const PRESETS: SocialPreset[] = [
  { 
    id: "instagram-post", 
    name: "Post", 
    platform: "Instagram",
    width: 1080, 
    height: 1080,
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-50 to-purple-50"
  },
  { 
    id: "instagram-story", 
    name: "Story", 
    platform: "Instagram",
    width: 1080, 
    height: 1920,
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-50 to-orange-50"
  },
  { 
    id: "youtube-thumb", 
    name: "Thumbnail", 
    platform: "YouTube",
    width: 1280, 
    height: 720,
    color: "text-red-600",
    bgColor: "bg-gradient-to-br from-red-50 to-rose-50"
  },
  { 
    id: "twitter-post", 
    name: "Post", 
    platform: "Twitter/X",
    width: 1200, 
    height: 675,
    color: "text-sky-600",
    bgColor: "bg-gradient-to-br from-sky-50 to-blue-50"
  },
  { 
    id: "linkedin-post", 
    name: "Post", 
    platform: "LinkedIn",
    width: 1200, 
    height: 627,
    color: "text-blue-700",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50"
  },
];

export function SocialResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      generatedImages.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, [generatedImages]);

  const centerCropResize = useCallback((
    img: HTMLImageElement,
    targetWidth: number,
    targetHeight: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Calculate scale to cover target area (center crop)
      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );

      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Center the image
      const x = (targetWidth - scaledWidth) / 2;
      const y = (targetHeight - scaledHeight) / 2;

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        },
        "image/png",
        1
      );
    });
  }, []);

  const generateAllSizes = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    // Cleanup previous URLs
    generatedImages.forEach(img => URL.revokeObjectURL(img.url));

    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      });

      const results: GeneratedImage[] = [];

      for (const preset of PRESETS) {
        const blob = await centerCropResize(img, preset.width, preset.height);
        results.push({
          preset,
          blob,
          url: URL.createObjectURL(blob),
        });
      }

      URL.revokeObjectURL(url);
      setGeneratedImages(results);
      toast.success(`Generated ${PRESETS.length} sizes!`);
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate images");
    } finally {
      setIsProcessing(false);
    }
  }, [centerCropResize, generatedImages]);

  useEffect(() => {
    if (file) {
      generateAllSizes(file);
    }
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownloadSingle = async (generated: GeneratedImage) => {
    setDownloadingId(generated.preset.id);
    
    const fileName = `${generated.preset.platform.toLowerCase().replace("/", "-")}-${generated.preset.name.toLowerCase()}-${generated.preset.width}x${generated.preset.height}.png`;
    saveAs(generated.blob, fileName);
    toast.success(`Downloaded ${generated.preset.platform} ${generated.preset.name}`);
    
    setTimeout(() => setDownloadingId(null), 500);
  };

  const handleDownloadAll = async () => {
    if (generatedImages.length === 0) return;
    
    setIsDownloadingAll(true);
    
    try {
      const zip = new JSZip();
      
      for (const generated of generatedImages) {
        const fileName = `${generated.preset.platform.toLowerCase().replace("/", "-")}-${generated.preset.name.toLowerCase()}-${generated.preset.width}x${generated.preset.height}.png`;
        zip.file(fileName, generated.blob);
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "social-media-images.zip");
      toast.success("Downloaded all images as ZIP!");
    } catch (error) {
      console.error("ZIP creation failed:", error);
      toast.error("Failed to create ZIP");
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleReset = () => {
    generatedImages.forEach(img => URL.revokeObjectURL(img.url));
    setGeneratedImages([]);
    setFile(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      {!file ? (
        <FileDropzone
          onFileSelect={setFile}
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
          title="Upload image to resize"
          description="We'll create versions for all major platforms"
          className="h-80 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {isProcessing ? "Generating..." : `${generatedImages.length} sizes ready`}
                </p>
                <p className="text-sm text-slate-500">{file.name}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Upload Different Image
            </button>
          </div>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-600 font-medium">Generating all sizes...</p>
            </div>
          ) : (
            <>
              {/* Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((generated) => (
                  <motion.div
                    key={generated.preset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "relative group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow",
                      generated.preset.bgColor
                    )}
                  >
                    {/* Platform Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full bg-white/90 backdrop-blur-sm shadow-sm",
                        generated.preset.color
                      )}>
                        {generated.preset.platform}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium text-slate-600 bg-white/80 rounded-full backdrop-blur-sm">
                        {generated.preset.name}
                      </span>
                    </div>

                    {/* Preview Image */}
                    <div className="aspect-video flex items-center justify-center p-4 pt-12">
                      <img
                        src={generated.url}
                        alt={`${generated.preset.platform} ${generated.preset.name}`}
                        className="max-w-full max-h-[180px] w-auto h-auto object-contain rounded-lg shadow-md bg-white"
                      />
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {generated.preset.width} × {generated.preset.height}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadSingle(generated)}
                        disabled={downloadingId === generated.preset.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        {downloadingId === generated.preset.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        Download
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Download All Button */}
              <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 lg:relative lg:p-0 lg:bg-transparent lg:border-t-0 lg:z-auto">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadAll}
                  disabled={generatedImages.length === 0 || isDownloadingAll}
                  className={cn(
                    "w-full h-14 text-base font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md",
                    generatedImages.length > 0 && !isDownloadingAll
                      ? "bg-slate-900 hover:bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isDownloadingAll ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Archive className="w-5 h-5" />
                  )}
                  {isDownloadingAll ? "Creating ZIP..." : "Download All as ZIP"}
                </motion.button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
