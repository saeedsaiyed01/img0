"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";
import { Download, Image as ImageIcon, Loader2, Move, RotateCcw, Type } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type WatermarkMode = "text" | "image";

interface WatermarkPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export function WatermarkTool() {
  const [baseImage, setBaseImage] = useState<File | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [watermarkMode, setWatermarkMode] = useState<WatermarkMode>("text");
  
  // Text watermark settings
  const [text, setText] = useState("Your Watermark");
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState("#ffffff");
  
  // Image watermark settings
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkImageUrl, setWatermarkImageUrl] = useState<string | null>(null);
  
  // Shared settings
  const [opacity, setOpacity] = useState(50);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<WatermarkPosition>({ x: 50, y: 50 });
  
  // Preview state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (baseImageUrl) URL.revokeObjectURL(baseImageUrl);
      if (watermarkImageUrl) URL.revokeObjectURL(watermarkImageUrl);
    };
  }, [baseImageUrl, watermarkImageUrl]);

  // Create base image URL
  useEffect(() => {
    if (baseImage) {
      const url = URL.createObjectURL(baseImage);
      setBaseImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [baseImage]);

  // Create watermark image URL
  useEffect(() => {
    if (watermarkImage) {
      const url = URL.createObjectURL(watermarkImage);
      setWatermarkImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watermarkImage]);

  const renderCanvas = useCallback(async () => {
    if (!baseImageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load base image
    const baseImg = new Image();
    baseImg.src = baseImageUrl;
    
    await new Promise<void>((resolve) => {
      baseImg.onload = () => resolve();
    });

    canvas.width = baseImg.width;
    canvas.height = baseImg.height;

    // Draw base image
    ctx.drawImage(baseImg, 0, 0);

    // Calculate position in pixels
    const posX = (position.x / 100) * canvas.width;
    const posY = (position.y / 100) * canvas.height;

    // Save context state
    ctx.save();

    // Apply transformations
    ctx.translate(posX, posY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = opacity / 100;

    if (watermarkMode === "text" && text) {
      const scaledFontSize = (fontSize * scale) / 100;
      ctx.font = `bold ${scaledFontSize}px sans-serif`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Text shadow for visibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = scaledFontSize / 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(text, 0, 0);
    } else if (watermarkMode === "image" && watermarkImageUrl) {
      const wmImg = new Image();
      wmImg.src = watermarkImageUrl;
      
      await new Promise<void>((resolve) => {
        wmImg.onload = () => resolve();
      });

      const scaledWidth = (wmImg.width * scale) / 100;
      const scaledHeight = (wmImg.height * scale) / 100;

      ctx.drawImage(
        wmImg,
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight
      );
    }

    // Restore context
    ctx.restore();
  }, [baseImageUrl, watermarkMode, text, fontSize, fontColor, watermarkImageUrl, opacity, scale, rotation, position]);

  // Re-render canvas when settings change
  useEffect(() => {
    if (baseImageUrl) {
      renderCanvas();
    }
  }, [renderCanvas, baseImageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    updatePosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updatePosition = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });
      
      if (blob) {
        const baseName = baseImage?.name.substring(0, baseImage.name.lastIndexOf(".")) || "image";
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${baseName}-watermarked.png`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success("Download started!");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBaseImage(null);
    setBaseImageUrl(null);
    setWatermarkImage(null);
    setWatermarkImageUrl(null);
    setText("Your Watermark");
    setOpacity(50);
    setScale(100);
    setRotation(0);
    setPosition({ x: 50, y: 50 });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      {!baseImage ? (
        <FileDropzone
          onFileSelect={setBaseImage}
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
          title="Upload image to watermark"
          description="Then add text or image overlay"
          className="h-80 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Canvas Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              ref={containerRef}
              className="relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJib2FyZCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cmVjdCBmaWxsPSIjZjFmNWY5IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZjFmNWY5IiB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNjaGVja2VyYm9hcmQpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] border border-slate-200 rounded-2xl overflow-hidden shadow-sm cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                <Move className="w-3.5 h-3.5" />
                Drag to position watermark
              </div>
              
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-[500px] object-contain"
              />
              
              {/* Position indicator */}
              <div 
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  backgroundColor: "rgba(59, 130, 246, 0.8)"
                }}
              />
            </div>

            <button
              onClick={handleReset}
              className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors"
            >
              Start Over with New Image
            </button>
          </div>

          {/* Right: Settings Panel */}
          <div className="space-y-6">
            {/* Watermark Mode Toggle */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setWatermarkMode("text")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
                    watermarkMode === "text"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <Type className="w-4 h-4" />
                  Text
                </button>
                <button
                  onClick={() => setWatermarkMode("image")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
                    watermarkMode === "image"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>
              </div>
            </div>

            {/* Mode-specific Settings */}
            <div className="p-6 border border-slate-200 bg-white shadow-sm rounded-2xl space-y-6">
              {watermarkMode === "text" ? (
                <>
                  {/* Text Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter watermark text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span>Font Size</span>
                      <span>{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="200"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Font Color */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Text Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Watermark Image
                    </label>
                    {watermarkImage ? (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <img
                          src={watermarkImageUrl || ""}
                          alt="Watermark"
                          className="w-12 h-12 object-contain rounded-lg bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {watermarkImage.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(watermarkImage.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setWatermarkImage(null);
                            setWatermarkImageUrl(null);
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <FileDropzone
                        onFileSelect={setWatermarkImage}
                        accept={{ "image/*": [".png", ".svg", ".webp"] }}
                        title="Upload logo"
                        description="PNG with transparency works best"
                        className="h-32 bg-slate-50 border border-dashed border-slate-300"
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Shared Controls */}
            <div className="p-6 border border-slate-200 bg-white shadow-sm rounded-2xl space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800">Transform</h3>
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span>Opacity</span>
                  <span>{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Scale */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span>Scale</span>
                  <span>{scale}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span>Rotation</span>
                  <span>{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Download Button */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 lg:relative lg:p-0 lg:bg-transparent lg:border-t-0 lg:z-auto">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isProcessing}
                className={cn(
                  "w-full h-14 text-base font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md",
                  !isProcessing
                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isProcessing ? "Processing..." : "Download Watermarked"}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
