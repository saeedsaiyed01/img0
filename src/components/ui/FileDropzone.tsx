"use client";

import { cn } from "@/lib/utils";
import { File as FileIcon, UploadCloud } from "lucide-react"; // Import renamed File icon
import { useCallback, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface FileDropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onFileSelect: (file: File) => void;
  className?: string;
  accept?: Record<string, string[]>;
  title?: string;
  description?: string;
}

export function FileDropzone({
  onFileSelect,
  className,
  accept = { "image/*": [] },
  title = "Upload an image",
  description = "Drag & drop or click to upload",
  ...props
}: FileDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.[0]) {
        setFile(acceptedFiles[0]);
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept,
    ...props,
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group flex flex-col items-center justify-center w-full min-h-[350px] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
        isDragActive
          ? "border-blue-400 bg-blue-50 scale-[0.99]"
          : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50",
        file ? "border-solid border-slate-200 bg-slate-50/30 p-0" : "", // Remove padding when file is loaded to let footer flush
        className
      )}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-200">
           {/* Image Preview Area */}
           <div className="flex-1 flex items-center justify-center p-8 min-h-[200px]">
               {file.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(file)}
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
                        {file.type.startsWith("image/") ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={URL.createObjectURL(file)} className="size-full object-cover rounded-lg opacity-80" alt="" />
                        ) : (
                            <FileIcon className="size-5 text-slate-500" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate max-w-[150px] md:max-w-[200px]">
                            {file.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                            {(file.size / 1024).toFixed(0)} KB
                        </p>
                    </div>
                </div>

                <div 
                    className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                    Replace
                </div>
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-8 space-y-6">
          <div className={cn(
            "p-6 rounded-2xl bg-white shadow-sm border border-slate-200 transition-transform duration-300",
            isDragActive ? "scale-110 rotate-3" : "group-hover:scale-110 group-hover:-rotate-3"
          )}>
            <UploadCloud className={cn(
                "size-10 transition-colors duration-300",
                 isDragActive ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"
            )} />
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
      {!file && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </div>
  );
}
