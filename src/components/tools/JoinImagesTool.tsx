"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { saveAs } from "file-saver";
import { Download, Image as ImageIcon, LayoutGrid, LayoutList, Loader2, Minus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type JoinDirection = "horizontal" | "vertical" | "grid";

export function JoinImagesTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [joinedImageUrl, setJoinedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [direction, setDirection] = useState<JoinDirection>("horizontal");
  const [spacing, setSpacing] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const handleFilesSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    // processImages will be triggered by useEffect
  };

  const processImages = useCallback(async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const loadedImages = await Promise.all(
        files.map(
          (file) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = URL.createObjectURL(file);
            })
        )
      );

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      let width = 0;
      let height = 0;

      if (direction === "horizontal") {
        width =
          loadedImages.reduce((sum, img) => sum + img.width, 0) +
          spacing * (loadedImages.length - 1);
        height = Math.max(...loadedImages.map((img) => img.height));
      } else if (direction === "vertical") {
        width = Math.max(...loadedImages.map((img) => img.width));
        height =
          loadedImages.reduce((sum, img) => sum + img.height, 0) +
          spacing * (loadedImages.length - 1);
      } else {
        // Grid (approximate square)
        const cols = Math.ceil(Math.sqrt(loadedImages.length));
        const rows = Math.ceil(loadedImages.length / cols);
        const maxWidth = Math.max(...loadedImages.map((img) => img.width));
        const maxHeight = Math.max(...loadedImages.map((img) => img.height));
        width = cols * maxWidth + (cols - 1) * spacing;
        height = rows * maxHeight + (rows - 1) * spacing;
      }

      canvas.width = width;
      canvas.height = height;

      // Fill background
      if (spacing > 0) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      let x = 0;
      let y = 0;
      const maxWidth = Math.max(...loadedImages.map((img) => img.width));
      const maxHeight = Math.max(...loadedImages.map((img) => img.height));
      const cols = Math.ceil(Math.sqrt(loadedImages.length));

      loadedImages.forEach((img, index) => {
        if (direction === "horizontal") {
          ctx.drawImage(img, x, (height - img.height) / 2); // Center vertically
          x += img.width + spacing;
        } else if (direction === "vertical") {
          ctx.drawImage(img, (width - img.width) / 2, y); // Center horizontally
          y += img.height + spacing;
        } else {
          // Grid
          const col = index % cols;
          const row = Math.floor(index / cols);
          const gridX = col * (maxWidth + spacing);
          const gridY = row * (maxHeight + spacing);
          
          // Center in cell
          const drawX = gridX + (maxWidth - img.width) / 2;
          const drawY = gridY + (maxHeight - img.height) / 2;
          
          ctx.drawImage(img, drawX, drawY);
        }
      });

      canvas.toBlob((blob) => {
        if (blob) {
          setJoinedImageUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    } catch (error) {
      console.error("Join images failed:", error);
      setIsProcessing(false);
    }
  }, [files, direction, spacing, backgroundColor]);

  // Auto-refresh when settings change
  useEffect(() => {
    if (files.length >= 2) {
      const timer = setTimeout(() => {
        processImages();
      }, 100); // 100ms debounce
      return () => clearTimeout(timer);
    }
  }, [processImages, files.length]);

  const handleDownload = () => {
    if (joinedImageUrl) {
      saveAs(joinedImageUrl, "joined-image.png");
      toast.success("Download started!");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <FileDropzone
        onFilesSelect={handleFilesSelect}
        multiple={true}
        disablePreview={true}
        title="Upload images to join"
        description="Select multiple images to stitch together"
        className="h-[250px] bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200"
      />

      {files.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Workspace (Left Column - 66%) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="min-h-[500px] flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm">
              {joinedImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={joinedImageUrl}
                  alt="Joined result"
                  className="max-w-full max-h-[600px] object-contain shadow-xl rounded-lg border border-slate-100"
                />
              ) : (
                <div className="w-full flex gap-4 min-h-[300px]">
                     {/* Clean Placeholder when processing or waiting */}
                     <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-white">
                        <Loader2 className="size-8 animate-spin mb-3 text-blue-500" />
                        <span className="font-medium">Synthesizing...</span>
                     </div>
                </div>
              )}
            </div>

            {/* Single Image Placeholder Hint - Only if we have 1 file but waiting for 2nd */}
            {files.length === 1 && (
               <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
                     <ImageIcon className="size-4" />
                  </div>
                  <span className="font-medium">Add one more image to see the preview!</span>
               </div>
            )}
          </div>

          {/* Control Panel (Right Column - 33%) */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-8 sticky top-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <h4 className="font-bold text-slate-900 text-lg">Configuration</h4>
                 <button 
                    onClick={() => setFiles([])}
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                 >
                    Reset
                 </button>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Layout Direction</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setDirection("horizontal")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      direction === "horizontal"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-100 hover:border-slate-300 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Minus className="size-6 mb-2" />
                    <span className="text-[10px] font-bold uppercase">Row</span>
                  </button>
                  <button
                    onClick={() => setDirection("vertical")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      direction === "vertical"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-100 hover:border-slate-300 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <LayoutList className="size-6 mb-2" />
                    <span className="text-[10px] font-bold uppercase">Column</span>
                  </button>
                  <button
                    onClick={() => setDirection("grid")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      direction === "grid"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-100 hover:border-slate-300 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <LayoutGrid className="size-6 mb-2" />
                    <span className="text-[10px] font-bold uppercase">Grid</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Spacing</label>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md min-w-[3rem] text-center">
                    {spacing}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {spacing > 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Background</label>
                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="size-8 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-600 uppercase font-medium">
                      {backgroundColor}
                    </span>
                  </div>
                </div>
              )}
            
            <div className="pt-4 border-t border-slate-100">
               <button
                onClick={handleDownload}
                disabled={!joinedImageUrl || isProcessing}
                className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                   <>
                    <Loader2 className="size-5 animate-spin" />
                    Processing...
                   </>
                ) : (
                   <>
                    <Download className="size-5" />
                    Download Merged
                   </>
                )}
              </button>
            </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
