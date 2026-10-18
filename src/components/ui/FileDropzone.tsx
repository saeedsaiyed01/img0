"use client";

import { cn } from "@/lib/utils";
import { File as FileIcon, Upload, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface FileDropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  className?: string;
  title?: string;
  description?: string;
  disablePreview?: boolean;
  compact?: boolean;
}

export function FileDropzone({ onFileSelect, onFilesSelect, className,
  accept = { "image/*": [] }, title = "Choose an image", description = "Drag an image here or choose a file from your device.",
  multiple = false, disablePreview = false, compact = false, disabled = false, onDropRejected, ...props
}: FileDropzoneProps) {
  const [items, setItems] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const urls = useRef<string[]>([]);
  const descriptionId = useId();
  const errorId = useId();
  useEffect(() => () => urls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    ...props, accept, multiple, disabled, maxFiles: multiple ? props.maxFiles : 1,
    noClick: true, noKeyboard: true,
    onDrop: (accepted, rejected) => {
      setError(rejected.length ? rejected.some((entry) => entry.errors.some((error) => error.code === "too-many-files"))
        ? `Choose ${multiple ? "fewer files" : "one image at a time"}.`
        : "Some files could not be accepted. Check the supported formats and try again." : null);
      if (!accepted.length) return;
      urls.current.forEach((url) => URL.revokeObjectURL(url));
      const selected = multiple ? accepted : accepted.slice(0, 1);
      const next = disablePreview ? [] : selected.map((file) => ({ file, url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "" }));
      urls.current = next.map((item) => item.url).filter(Boolean);
      setItems(next);
      if (multiple) onFilesSelect?.(selected);
      else onFileSelect?.(selected[0]);
    },
    onDropRejected,
  });

  function remove(index: number) {
    const removed = items[index];
    if (removed.url) URL.revokeObjectURL(removed.url);
    urls.current = urls.current.filter((url) => url !== removed.url);
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(next);
    onFilesSelect?.(next.map((item) => item.file));
  }

  return <div className="space-y-3">
    <p id={descriptionId} className="sr-only">{description}</p>
    <div {...getRootProps({ role: "group", "aria-label": title, "aria-describedby": `${descriptionId}${error ? ` ${errorId}` : ""}` })}
      className={cn("flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors", isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50", disabled && "opacity-60", className, compact && "min-h-0 md:min-h-0 h-auto p-4 text-left")}>
      <input {...getInputProps({ "aria-label": multiple ? "Choose images" : "Choose image" })} />
      {items.length ? <div className="w-full space-y-4">
        {multiple ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{items.map(({ file, url }, index) => <div key={`${file.name}-${index}`} className="relative rounded-xl border border-slate-200 bg-white p-3">
          {url ? <img src={url} alt={file.name} className="aspect-square w-full rounded-lg object-contain" /> : <FileIcon className="mx-auto my-8 size-10 text-slate-500" />}
          <button type="button" aria-label={`Remove ${file.name}`} disabled={disabled} onClick={() => remove(index)} className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-red-50"><X className="size-4" /></button>
          <p className="mt-2 truncate text-xs text-slate-600">{file.name}</p>
        </div>)}</div> : <>
          {items[0].url ? <img src={items[0].url} alt="Selected image" className="mx-auto max-h-56 max-w-full rounded-lg object-contain" /> : <FileIcon className="mx-auto size-12 text-slate-500" />}
          <p className="truncate text-sm font-medium text-slate-800">{items[0].file.name}</p>
        </>}
        <button type="button" disabled={disabled} onClick={open} className="min-h-11 rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed">Replace{multiple ? " images" : " image"}</button>
      </div> : <div className={compact ? "flex w-full flex-wrap items-center justify-between gap-3" : "flex flex-col items-center"}>
        {!compact && <Upload className="mb-4 size-8 text-slate-500" aria-hidden="true" />}
        <div><h2 className={compact ? "text-sm font-semibold text-slate-900" : "text-lg font-semibold text-slate-900"}>{isDragActive ? "Drop your image here" : title}</h2>
        <p className={cn("max-w-sm text-sm leading-relaxed text-slate-600", compact ? "mt-1" : "mt-2")}>{description}</p></div>
        <button type="button" disabled={disabled} onClick={open} className={cn("min-h-11 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed", !compact && "mt-5")}>{multiple ? "Choose images" : "Choose image"}</button>
        {!compact && <p className="mt-3 text-xs text-slate-500">Files stay on your device</p>}
      </div>}
    </div>
    {error && <p id={errorId} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  </div>;
}
