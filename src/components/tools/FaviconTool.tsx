"use client";

import { ToolActionBar } from "@/components/ui/ToolActionBar";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Archive, LayoutGrid, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { canvasBlob, iconCanvas, loadImage, pngToIco, IMAGE_INPUT_TYPES } from "@/lib/image-export";

const SIZES = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

export default function FaviconTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const generatePackage = async () => {
    if (!file || isProcessing) return;
    const imageUrl = URL.createObjectURL(file);
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      const img = await loadImage(imageUrl);
      for (const { size, name } of SIZES) {
        zip.file(name, await canvasBlob(iconCanvas(img, size), "image/png"));
      }

      // Add manifest.json
      const manifest = {
        name: "My PWA App",
        short_name: "App",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      };
      zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

      const png = await canvasBlob(iconCanvas(img, 32), "image/png");
      zip.file("favicon.ico", pngToIco(new Uint8Array(await png.arrayBuffer()), 32, 32));

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "favicon-package.zip");
      toast.success("Download started!");

    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create icons. Choose another image.");
    } finally {
      URL.revokeObjectURL(imageUrl);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Preview Grid */}
        <div className="md:col-span-2 space-y-4">
             <div className="relative group">
                <FileDropzone
                    onFileSelect={setFile}
                    accept={IMAGE_INPUT_TYPES}
                    disabled={isProcessing}
                    title="Upload App Icon"
                    description="JPG, PNG, or WebP. Non-square images receive transparent padding."
                    className="bg-slate-50 border-slate-200 min-h-64 md:min-h-72"
                />
            </div>
        </div>

        {/* Specs & Download */}
        <div className="space-y-6">
            <div className="border border-slate-300 bg-white p-6 shadow-sm rounded-2xl relative">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
                     <div className="p-2 bg-violet-50 rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-violet-600" />
                     </div>
                     <h3 className="font-bold text-slate-800">
                        Package Contents
                     </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-500">
                    {SIZES.map(s => (
                        <div key={s.size} className="border border-slate-100 bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                            {s.size}px PNG
                        </div>
                    ))}
                    <div className="border border-slate-100 bg-slate-50 p-2 rounded-lg flex items-center gap-2 text-slate-400">
                         <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        + site.webmanifest & ICO
                    </div>
                </div>
            </div>

            <ToolActionBar visible={Boolean(file)}>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={generatePackage}
                    disabled={!file || isProcessing}
                    className={cn(
                        "w-full h-14 text-base font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm",
                        file 
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                >
                     {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Archive className="w-5 h-5" />
                    )}
                    {isProcessing ? "Bundling..." : "Download ZIP Package"}
                </motion.button>
            </ToolActionBar>
        </div>
      </div>
    </div>
  );
}
