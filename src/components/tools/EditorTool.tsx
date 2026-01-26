"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import "cropperjs/dist/cropper.css";
import { saveAs } from "file-saver";
import {
  ArrowLeftRight,
  ArrowUpDown,
  Crop,
  Download,
  Loader2,
  Maximize,
  Monitor,
  RefreshCw,
  RotateCw,
  Square,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { toast } from "sonner";

interface EditorToolProps {
  mode?: "crop" | "rotate" | "both";
}

export function EditorTool({ mode = "both" }: EditorToolProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState("");
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
      setRotation(0);
      setScaleX(1);
      setScaleY(1);
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const newRotation = rotation + 90;
      setRotation(newRotation);
      cropper.rotateTo(newRotation);
    }
  };

  const handleFlipHorizontal = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const newScaleX = scaleX === 1 ? -1 : 1;
      setScaleX(newScaleX);
      cropper.scaleX(newScaleX);
    }
  };

  const handleFlipVertical = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const newScaleY = scaleY === 1 ? -1 : 1;
      setScaleY(newScaleY);
      cropper.scaleY(newScaleY);
    }
  };

  const handleAspectRatio = (ratio: number | undefined) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(ratio || NaN);
    }
  };

  const handleZoom = (delta: number) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoom(delta);
    }
  };

  const handleReset = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
      setRotation(0);
      setScaleX(1);
      setScaleY(1);
    }
  };

  const handleDownload = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    setProcessing(true);

    try {
      const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
        fillColor: '#fff',
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${fileName}-edited.png`);
          toast.success("Download started!");
        }
        setProcessing(false);
      }, "image/png");
    } catch (error) {
      console.error(error);
      setProcessing(false);
    }
  };

  const showCrop = mode === "crop" || mode === "both";
  const showRotate = mode === "rotate" || mode === "both";

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      {!imageSrc ? (
        <FileDropzone
          onFileSelect={handleFile}
          title={
            showCrop && showRotate
              ? "Upload image to edit"
              : showCrop
              ? "Upload image to crop"
              : "Upload image to rotate"
          }
          description="Crop, rotate, flip, and resize your images"
          className="h-[400px] bg-slate-50 border-slate-200"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Main Cropper Area (Workspace - 66%) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-[#e5e5e5] shadow-sm h-[600px] flex items-center justify-center">
              <Cropper
                ref={cropperRef}
                src={imageSrc || undefined}
                style={{ height: "100%", width: "100%" }}
                initialAspectRatio={NaN}
                aspectRatio={NaN}
                guides={true}
                viewMode={1}
                dragMode={showCrop ? "crop" : "move"}
                autoCropArea={0.8}
                background={true}
                responsive={true}
                checkOrientation={true}
                className="edit-cropper-container" 
              />
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <h2 className="text-lg font-bold text-slate-900">Editor Tools</h2>
                 <button
                    onClick={() => setImageSrc(null)}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Close
                  </button>
              </div>

            {/* Transform Tools */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transform</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={handleRotate}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all text-slate-700 shadow-sm"
                    title="Rotate 90°"
                 >
                    <RotateCw className="size-6 mb-2 text-blue-600" />
                    <span className="text-xs font-bold">Rotate</span>
                 </button>
                 <button
                    onClick={handleReset}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all text-slate-700 shadow-sm"
                    title="Reset All"
                 >
                    <RefreshCw className="size-6 mb-2 text-red-500" />
                    <span className="text-xs font-bold">Reset</span>
                 </button>
                 <button
                    onClick={handleFlipHorizontal}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all text-slate-700 shadow-sm"
                    title="Flip Horizontal"
                 >
                    <ArrowLeftRight className="size-6 mb-2 text-slate-500" />
                    <span className="text-xs font-bold">Flip X</span>
                 </button>
                 <button
                    onClick={handleFlipVertical}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all text-slate-700 shadow-sm"
                    title="Flip Vertical"
                 >
                    <ArrowUpDown className="size-6 mb-2 text-slate-500" />
                    <span className="text-xs font-bold">Flip Y</span>
                 </button>
              </div>
            </div>

            {/* Aspect Ratio */}
            {showCrop && (
              <div className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aspect Ratio</h3>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleAspectRatio(undefined)} className="px-3 py-2 text-xs font-bold bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2">
                        <Maximize className="size-3.5" /> Freeform
                    </button>
                    <button onClick={() => handleAspectRatio(1)} className="px-3 py-2 text-xs font-bold bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2">
                        <Square className="size-3.5" /> Square (1:1)
                    </button>
                    <button onClick={() => handleAspectRatio(16/9)} className="px-3 py-2 text-xs font-bold bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2">
                        <Monitor className="size-3.5" /> 16:9
                    </button>
                    <button onClick={() => handleAspectRatio(4/3)} className="px-3 py-2 text-xs font-bold bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2">
                        <Crop className="size-3.5" /> 4:3
                    </button>
                 </div>
              </div>
            )}

            {/* Scale/Zoom */}
            <div className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Zoom</h3>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleZoom(-0.1)}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ZoomOut className="size-5 text-slate-600" />
                    </button>
                    <button
                        onClick={() => handleZoom(0.1)}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ZoomIn className="size-5 text-slate-600" />
                    </button>
                 </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button
                onClick={handleDownload}
                disabled={processing}
                className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {processing ? (
                    <>
                    <Loader2 className="size-5 animate-spin" />
                    Processing...
                    </>
                ) : (
                    <>
                    <Download className="size-5" />
                    Download Edited
                    </>
                )}
                </button>
            </div>
          </div>
          </div>
        </div>
      )}
      
      {/* Custom Styles for Cropper to override basics */}
      <style jsx global>{`
        .cropper-bg {
          background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
                            linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
                            linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .cropper-modal {
            background-color: rgba(255, 255, 255, 0.4);
        }
        .cropper-view-box {
            outline: 2px solid #2563eb;
            outline-color: rgba(37, 99, 235, 0.75);
        }
        .cropper-line {
            background-color: #2563eb;
        }
        .cropper-point {
            background-color: #2563eb;
            width: 8px;
            height: 8px;
        }
      `}</style>
    </div>
  );
}
