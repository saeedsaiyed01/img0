"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import { ArrowDown, ArrowUp, Download, FileText, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PdfImage {
  id: string;
  file: File;
  preview: string;
}

export default function PdfTool() {
  const [images, setImages] = useState<PdfImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<"a4" | "fit">("fit");

  const handleFilesSelect = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Revoke URL to avoid memory leaks
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    )
      return;

    setImages((prev) => {
      const newImages = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      return newImages;
    });
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4", // Initial format, will change per page if "fit" is selected
      });

      // Remove default first page
      doc.deletePage(1);

      for (const imgData of images) {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imgData.preview;
        });

        const imgWidthPx = img.width;
        const imgHeightPx = img.height;
        
        // Convert px to mm (approx 96 DPI)
        const imgWidthMm = imgWidthPx * 0.264583;
        const imgHeightMm = imgHeightPx * 0.264583;

        if (pageSize === "fit") {
            // Add page with exact image dimensions
            doc.addPage([imgWidthMm, imgHeightMm], imgWidthMm > imgHeightMm ? "l" : "p");
            doc.addImage(img, "JPEG", 0, 0, imgWidthMm, imgHeightMm);
        } else {
            // A4 Logic
            doc.addPage("a4", imgWidthMm > imgHeightMm ? "l" : "p");
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            const ratio = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm) * 0.9;
            const w = imgWidthMm * ratio;
            const h = imgHeightMm * ratio;
            const x = (pageWidth - w) / 2;
            const y = (pageHeight - h) / 2;
            
            doc.addImage(img, "JPEG", x, y, w, h);
        }
      }

      doc.save("converted_images.pdf");
      toast.success("PDF Downloaded!");
    } catch (e) {
      console.error("PDF Generation failed", e);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <FileDropzone
        onFilesSelect={handleFilesSelect}
        multiple={true}
        disablePreview={true}
        title="Add images to PDF"
        description="Drag & drop multiple images here. They will be added to the list below."
        className="h-[250px] bg-slate-50 border-slate-300"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-600 uppercase flex items-center justify-between">
              <span>Pages ({images.length})</span>
              <button 
                onClick={() => setImages([])} 
                className="text-red-500 hover:text-red-700 text-xs normal-case"
              >
                Clear All
              </button>
            </h3>
            
            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={img.id} className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-blue-300 transition-colors">
                  <div className="size-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.preview} alt="" className="size-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {img.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Page {index + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide h-6 flex items-center">
               Configuration
             </h3>
             <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-8">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="size-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800">PDF Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Page Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPageSize("fit")}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all",
                        pageSize === "fit"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-100 hover:border-slate-300 text-slate-600"
                      )}
                    >
                      Fit Image
                    </button>
                    <button
                      onClick={() => setPageSize("a4")}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all",
                        pageSize === "a4"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-100 hover:border-slate-300 text-slate-600"
                      )}
                    >
                      A4 Page
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    "Fit Image" creates a page exactly the size of each image (no whitespace). "A4" centers images on standard pages.
                  </p>
                </div>
              </div>

              <button
                onClick={generatePDF}
                disabled={isProcessing}
                className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Download className="size-5" />
                )}
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
