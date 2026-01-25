"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import "cropperjs/dist/cropper.css";
import { saveAs } from "file-saver";
import { Crop, Download, Loader2, RefreshCw, RotateCw } from "lucide-react";
import { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";

interface EditorToolProps {
  mode?: "crop" | "rotate" | "both";
}

export function EditorTool({ mode = "both" }: EditorToolProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
      setRotation(0);
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

  const handleReset = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
      setRotation(0);
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
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${fileName}-edited.png`);
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <FileDropzone
          onFileSelect={handleFile}
          title={
            showCrop && showRotate
              ? "Upload image to crop & rotate"
              : showCrop
              ? "Upload image to crop"
              : "Upload image to rotate"
          }
          description="Supports all common image formats"
          className="h-[300px] bg-slate-50 border-slate-200"
        />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              {showRotate && (
                <button
                  onClick={handleRotate}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  <RotateCw className="size-4" />
                  Rotate 90°
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                <RefreshCw className="size-4" />
                Reset
              </button>
            </div>

            <button
              onClick={() => setImageSrc(null)}
              className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              Cancel & Replace
            </button>
          </div>

          {/* Cropper */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
            <Cropper
              ref={cropperRef}
              src={imageSrc || undefined}
              style={{ height: 400, width: "100%" }}
              initialAspectRatio={NaN}
              aspectRatio={NaN}
              guides={true}
              viewMode={1}
              dragMode={showCrop ? "crop" : "move"}
              autoCropArea={1}
              background={true}
              responsive={true}
              checkOrientation={true}
            />
          </div>

          {/* Info bar */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800">
            <div className="flex items-center gap-6 text-sm font-medium">
              {showCrop && (
                <span className="flex items-center gap-2">
                  <Crop className="size-4" />
                  Drag corners to crop
                </span>
              )}
              {showRotate && (
                <span className="flex items-center gap-2">
                  <RotateCw className="size-4" />
                  Rotation: {rotation}°
                </span>
              )}
            </div>
            <span className="text-xs uppercase font-bold tracking-wide opacity-70">Editor Ready</span>
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={processing}
            className="w-full h-16 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="size-5" />
                Download Edited Image
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
