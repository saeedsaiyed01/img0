"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { ExportAction } from "@/components/ui/ExportAction";
import { fileStem, formatBytes, imageExtension, IMAGE_INPUT_TYPES } from "@/lib/image-export";
import { useState } from "react";
import { useImageExport } from "./useImageExport";

interface FormatConverterProps { targetFormat: string; quality?: number }

export default function FormatConverter({ targetFormat, quality: defaultQuality = 0.9 }: FormatConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(defaultQuality * 100);
  const { result, error, isProcessing } = useImageExport(file, targetFormat, quality);
  const extension = imageExtension(targetFormat).toUpperCase();
  const lossy = targetFormat === "image/jpeg" || targetFormat === "image/webp";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <FileDropzone onFileSelect={setFile} accept={IMAGE_INPUT_TYPES} title="Choose an image to convert" description="JPG, PNG, or WebP. Drag a file here or choose one." />
        {result && <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Output preview</h2>
          <div className="flex min-h-40 items-center justify-center rounded-xl bg-slate-100 p-4">
            <img src={result.previewUrl} alt={`Converted ${extension} preview`} className="max-h-80 max-w-full object-contain" />
          </div>
          <p className="mt-3 text-sm text-slate-600">{result.width} × {result.height} px · {extension} · {formatBytes(result.blob.size)}</p>
        </div>}
      </div>
      <div className="space-y-5">
        <section className="space-y-5 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Export settings</h2>
          <div className="flex justify-between text-sm"><span>Format</span><strong>{extension}</strong></div>
          {lossy && <div className="space-y-3">
            <label htmlFor="conversion-quality" className="flex justify-between text-sm"><span>Quality</span><span>{quality}%</span></label>
            <input id="conversion-quality" type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-500"><span>Smaller file</span><span>Better quality</span></div>
          </div>}
          {targetFormat === "image/jpeg" && <p className="text-sm text-slate-600">Transparent areas become white in JPG.</p>}
          {targetFormat === "image/x-icon" && <p className="text-sm text-slate-600">Exports a 256 × 256 ICO. Your image is fitted with transparent padding to keep its proportions.</p>}
          {targetFormat === "image/png" && <p className="text-sm text-slate-600">PNG preserves transparency. File size may increase when converting.</p>}
        </section>
        <section aria-live="polite" aria-busy={isProcessing} className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-semibold">Output size</h2>
          {error ? <p role="alert" className="text-sm text-red-700">{error} Use Replace to try another file.</p> : result ? <><p className="text-2xl font-semibold">{formatBytes(result.blob.size)}</p><p className="mt-2 text-sm text-emerald-700">Ready to download</p></> : <p className="text-sm text-slate-600">{isProcessing ? "Converting your image…" : "Choose an image to see the result."}</p>}
        </section>
        <ExportAction visible={Boolean(file)} url={result?.url} filename={`${fileStem(file?.name || "image")}.${imageExtension(targetFormat)}`} processing={isProcessing} label={`Download ${extension}`} />
      </div>
    </div>
  );
}
