"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import { Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const generatePDF = async () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const doc = new jsPDF({
        orientation: img.width > img.height ? "l" : "p",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      const widthRatio = pageWidth / img.width;
      const heightRatio = pageHeight / img.height;
      const ratio = Math.min(widthRatio, heightRatio) * 0.9; // 10% margin safety

      const w = img.width * ratio;
      const h = img.height * ratio;
      
      const x = (pageWidth - w) / 2;
      const y = (pageHeight - h) / 2;

      doc.addImage(img, "JPEG", x, y, w, h);
      
      const pdfName = file.name.substring(0, file.name.lastIndexOf('.')) + ".pdf";
      doc.save(pdfName);
      
    } catch (e) {
      console.error("PDF Generation failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Input Area */}
        <div className="md:col-span-2">
            <FileDropzone
                onFileSelect={setFile}
                accept={{ 'image/*': [] }}
                title="Drop your image here"
                description="Supports JPG, PNG, WEBP"
                className="h-[500px] bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
            />
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
            <div className="border border-slate-200 bg-white p-6 shadow-sm rounded-2xl space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">
                        PDF Settings
                    </h3>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Page Size</span>
                        <span className="text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 text-xs">A4 Standard</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resolution</span>
                        <span className="text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 text-xs">300 DPI</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Margins</span>
                        <span className="text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 text-xs">Auto</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={generatePDF}
                disabled={!file || isProcessing}
                className={cn(
                    "w-full py-4 text-base font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5",
                    file 
                        ? "bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
            >
                {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                <span>
                    {isProcessing ? "Generating PDF..." : "Download PDF"}
                </span>
            </button>

            {/* File Info */}
            {file && (
                <div className="text-xs text-slate-400 text-center font-medium">
                    Preparing to convert <span className="text-slate-600">{file.name}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
