"use client";

import { cn } from "@/lib/utils";
import { File as FileIcon, UploadCloud } from "lucide-react"; // Import renamed File icon
import { useCallback, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface FileDropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  className?: string;
  accept?: Record<string, string[]>;
  title?: string;
  description?: string;
  multiple?: boolean;
  disablePreview?: boolean;
}

export function FileDropzone({
  onFileSelect,
  onFilesSelect,
  className,
  accept = { "image/*": [] },
  title = "Upload an image",
  description = "Drag & drop or click to upload",
  multiple = false,
  disablePreview = false,
  ...props
}: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        if (multiple) {
          if (disablePreview) {
            onFilesSelect?.(acceptedFiles);
            setFiles([]);
          } else {
            setFiles(acceptedFiles);
            onFilesSelect?.(acceptedFiles);
          }
        } else {
          setFiles([acceptedFiles[0]]);
          onFileSelect?.(acceptedFiles[0]);
        }
      }
    },
    [multiple, disablePreview, onFileSelect, onFilesSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: multiple ? undefined : 1,
    multiple,
    accept,
    ...props,
  });

  const clearFile = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (multiple) {
      onFilesSelect?.(newFiles);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group flex flex-col items-center justify-center w-full min-h-[350px] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
        isDragActive
          ? "border-blue-400 bg-blue-50 scale-[0.99]"
          : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50",
        files.length > 0 ? "border-solid border-slate-200 bg-slate-50/30 p-0" : "", // Remove padding when file is loaded to let footer flush
        className
      )}
    >
      <input {...getInputProps()} />

      {files.length > 0 ? (
        multiple ? (
          // Multi-file grid view
          <div className="w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 p-6 overflow-auto">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 bg-white shadow-sm">
                    {file.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <FileIcon className="size-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={clearFile(index)}
                    className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ✕
                  </button>
                  <p className="mt-1.5 text-xs font-medium text-slate-600 truncate">{file.name}</p>
                </div>
              ))}
            </div>
            <div className="w-full bg-white border-t border-slate-200 p-4 flex items-center justify-between gap-4 mt-auto">
              <div className="text-sm font-semibold text-slate-700">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFiles([]);
                  onFilesSelect?.([]);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        ) : (
          // Single file view
          <div className="w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Image Preview Area */}
            <div className="flex-1 flex items-center justify-center p-8 min-h-[200px]">
              {files[0].type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(files[0])}
                  alt="Preview"
                  className="max-w-full max-h-[240px] w-auto h-auto object-contain rounded-lg shadow-sm bg-white"
                />
              ) : (
                <div className="size-24 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                  <FileIcon className="size-10 text-slate-400" />
                </div>
              )}
            </div>

            {/* Footer Info Bar */}
            <div className="w-full bg-white border-t border-slate-200 p-4 flex items-center justify-between gap-4 mt-auto">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {files[0].type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(files[0])}
                      className="size-full object-cover rounded-lg opacity-80"
                      alt=""
                    />
                  ) : (
                    <FileIcon className="size-5 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate max-w-[150px] md:max-w-[200px]">
                    {files[0].name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {(files[0].size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>

              <div className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                Replace
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center text-center p-8 space-y-6">
          <div
            className={cn(
              "p-6 rounded-2xl bg-white shadow-sm border border-slate-200 transition-transform duration-300",
              isDragActive ? "scale-110 rotate-3" : "group-hover:scale-110 group-hover:-rotate-3"
            )}
          >
            <UploadCloud
              className={cn(
                "size-10 transition-colors duration-300",
                isDragActive ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"
              )}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {isDragActive ? "Drop it here!" : title}
            </h3>
            <p className="text-base text-slate-500 max-w-xs mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-slate-100/50 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Supports Drag & Drop
          </div>
        </div>
      )}

      {/* Background decoration - only show when empty */}
      {files.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </div>
  );
}
