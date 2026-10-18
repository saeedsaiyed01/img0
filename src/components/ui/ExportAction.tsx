"use client";

import { Download, Loader2 } from "lucide-react";
import { ToolActionBar } from "./ToolActionBar";

export function ExportAction({ visible, url, filename, processing, label }: {
  visible: boolean; url?: string; filename: string; processing: boolean; label: string;
}) {
  if (!visible) return null;
  return <ToolActionBar>
      {url && !processing ? <a href={url} download={filename} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"><Download className="size-5" aria-hidden="true" />{label}</a> : <button disabled className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-500">{processing && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}{processing ? "Processing…" : "Choose another image"}</button>}
  </ToolActionBar>;
}
