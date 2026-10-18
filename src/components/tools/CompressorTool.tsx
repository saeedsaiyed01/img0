"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import { ExportAction } from "@/components/ui/ExportAction";
import { fileStem, formatBytes, imageExtension, IMAGE_INPUT_TYPES } from "@/lib/image-export";
import { useEffect, useRef, useState } from "react";
import { loadSampleImage } from "@/lib/sample-image";
import { useImageExport } from "./useImageExport";

type ExportFormat = "original" | "webp" | "jpeg" | "png";

export function CompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<ExportFormat>("original");
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const sampleRequest = useRef<AbortController | null>(null);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("sample") !== "landscape") return;
    const controller = new AbortController();
    sampleRequest.current = controller;
    loadSampleImage(controller.signal).then((sample) => {
      if (controller.signal.aborted) return;
      setFormat("webp");
      setFile(sample);
    }).catch((error) => {
      if (!controller.signal.aborted) setSampleError(error instanceof Error ? error.message : "Could not load the sample.");
    });
    return () => controller.abort();
  }, []);
  useEffect(() => () => sampleRequest.current?.abort(), []);
  async function trySample() {
    sampleRequest.current?.abort();
    const controller = new AbortController();
    sampleRequest.current = controller;
    setLoadingSample(true);
    setSampleError(null);
    try {
      const sample = await loadSampleImage(controller.signal);
      if (!controller.signal.aborted) { setFormat("webp"); setFile(sample); }
    } catch (error) {
      if (!controller.signal.aborted) setSampleError(error instanceof Error ? error.message : "Could not load the sample.");
    } finally {
      if (!controller.signal.aborted) setLoadingSample(false);
    }
  }
  function chooseFile(selected: File) {
    sampleRequest.current?.abort();
    setLoadingSample(false);
    setSampleError(null);
    setFile(selected);
  }
  const mime = format === "original" ? file?.type || "image/png" : `image/${format}`;
  const { result, error, isProcessing } = useImageExport(file, mime, quality);
  const difference = file && result ? result.blob.size - file.size : 0;
  const percentage = file && result ? Math.abs(difference / file.size * 100) : 0;
  const percentLabel = percentage > 0 && percentage < 1 ? "less than 1" : String(Math.round(percentage));
  const lossy = mime === "image/jpeg" || mime === "image/webp";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {!file ? <div className="space-y-3"><FileDropzone onFileSelect={chooseFile} accept={IMAGE_INPUT_TYPES} title="Choose an image to compress" description="JPG, PNG, or WebP. Drag a file here or choose one." /><div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500"><span>Just looking around?</span><button type="button" onClick={trySample} disabled={loadingSample} className="min-h-11 rounded-lg px-2 font-semibold text-blue-700 underline underline-offset-4 disabled:opacity-60">{loadingSample ? "Loading sample…" : "Try a sample image"}</button></div>{sampleError && <p role="alert" className="text-sm text-red-700">{sampleError}</p>}</div> : <>
          <div className="grid gap-4 sm:grid-cols-2">
            {[{ title: "Original", url: result?.originalUrl, size: file.size }, { title: "Output", url: result?.previewUrl, size: result?.blob.size }].map((preview) => (
              <section key={preview.title} className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
                <h2 className="px-4 pt-4 font-semibold">{preview.title}</h2>
                <div className="m-4 flex aspect-[4/3] items-center justify-center rounded-xl bg-slate-100 p-3">
                  {preview.url ? <img src={preview.url} alt={preview.title === "Original" ? "Original image" : "Output image"} className="max-h-full max-w-full object-contain" /> : <p className="text-sm text-slate-500">{isProcessing ? "Preparing preview…" : "Preview unavailable"}</p>}
                </div>
                <div className="border-t border-slate-100 px-4 py-3"><p className="font-semibold">{preview.size !== undefined ? formatBytes(preview.size) : "—"}</p><p className="truncate text-xs text-slate-500">{preview.title === "Original" ? file.name : result ? `${result.width} × ${result.height} px · ${imageExtension(mime).toUpperCase()}` : "Waiting for result"}</p></div>
              </section>
            ))}
          </div>
          <button onClick={() => setFile(null)} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50">Choose a different image</button>
        </>}
      </div>
      <div className="space-y-4">
        <section className="space-y-4 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Export settings</h2>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Format</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["original", "webp", "jpeg", "png"] as ExportFormat[]).map((option) => <button key={option} type="button" aria-pressed={format === option} onClick={() => setFormat(option)} className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium ${format === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{option === "original" ? "Original format" : option === "jpeg" ? "JPG" : option.toUpperCase()}</button>)}
            </div>
          </fieldset>
          {lossy ? <div className="space-y-3">
            <label htmlFor="compression-quality" className="flex justify-between text-sm"><span>Quality</span><span>{quality}%</span></label>
            <input id="compression-quality" type="range" min="10" max="100" step="5" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-500"><span>Smaller file</span><span>Better quality</span></div>
          </div> : <p className="text-sm text-slate-600">PNG has no quality setting here. Choose WebP or JPG for adjustable compression.</p>}
          {mime === "image/jpeg" && <p className="text-sm text-slate-600">Transparent areas become white in JPG.</p>}
        </section>
        <section aria-live="polite" aria-busy={isProcessing} className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-600">Result</h2>
          {error ? <p role="alert" className="text-sm text-red-700">{error} Choose a different image to try again.</p> : result && file ? <>
            <p className={`text-lg font-semibold ${difference < 0 ? "text-emerald-700" : difference > 0 ? "text-amber-800" : "text-slate-700"}`}>{difference < 0 ? `${percentLabel}% smaller` : difference > 0 ? `${percentLabel}% larger` : "Same file size"}</p>
            <p className="mt-2 text-sm text-slate-600">{formatBytes(file.size)} → {formatBytes(result.blob.size)}</p>
            {difference >= 0 && <><p className="mt-3 text-sm text-slate-600">{difference > 0 ? "This output is larger than your original." : "This image is already well optimized."} Try WebP or keep your original.</p><a href={result.originalUrl} download={file.name} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">Download original</a></>}
          </> : <p className="text-sm text-slate-600">{isProcessing ? "Processing current settings…" : "Choose an image to compare file sizes."}</p>}
        </section>
        <ExportAction visible={Boolean(file)} url={result?.url} filename={`${fileStem(file?.name || "image")}-optimized.${imageExtension(mime)}`} processing={isProcessing} label="Download output" />
      </div>
    </div>
  );
}
