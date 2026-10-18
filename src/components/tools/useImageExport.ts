"use client";

import { useEffect, useMemo, useState } from "react";
import { encodeImage, loadImage } from "@/lib/image-export";

export function useImageExport(file: File | null, mime: string, quality: number) {
  // PNG and ICO do not have a lossy quality setting.
  const effectiveQuality = mime === "image/png" || mime === "image/x-icon" ? 100 : quality;
  const request = useMemo(() => ({ file, mime, quality: effectiveQuality }), [file, mime, effectiveQuality]);
  const [output, setOutput] = useState<{
    request: typeof request; file: File; mime: string; quality: number; blob: Blob; url: string;
    previewUrl: string; originalUrl: string; width: number; height: number;
  } | null>(null);
  const [failure, setFailure] = useState<{ request: typeof request; message: string } | null>(null);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const urls: string[] = [];
    const originalUrl = URL.createObjectURL(file);
    urls.push(originalUrl);
    async function run() {
      try {
        const image = await loadImage(originalUrl);
        if (cancelled) return;
        const encoded = await encodeImage(image, mime, effectiveQuality);
        if (cancelled) return;
        const url = URL.createObjectURL(encoded.blob);
        const previewUrl = encoded.preview === encoded.blob ? url : URL.createObjectURL(encoded.preview);
        urls.push(url);
        if (previewUrl !== url) urls.push(previewUrl);
        setOutput({ request, file: file!, mime, quality: effectiveQuality, ...encoded, url, previewUrl, originalUrl });
      } catch (error) {
        if (!cancelled) setFailure({ request, message: error instanceof Error ? error.message : "Image processing failed. Choose another image." });
      }
    }
    const timer = setTimeout(run, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      urls.forEach((url) => URL.revokeObjectURL(url));
      setOutput((current) => current?.request === request ? null : current);
      setFailure((current) => current?.request === request ? null : current);
    };
  }, [file, mime, effectiveQuality, request]);

  const matches = (value: { request: typeof request } | null) => value?.request === request;
  const result = matches(output) ? output : null;
  const error = matches(failure) && !result ? failure!.message : null;
  return { result, error, isProcessing: Boolean(file && !result && !error) };
}
