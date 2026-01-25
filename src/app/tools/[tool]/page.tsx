import { Base64Tool } from "@/components/tools/Base64Tool";
import { EditorTool } from "@/components/tools/EditorTool"; // Assuming this is named, if error I will fix.
import FaviconTool from "@/components/tools/FaviconTool";
import FormatConverter from "@/components/tools/FormatConverter";
import PdfTool from "@/components/tools/PdfTool";
import { SvgToJsxTool } from "@/components/tools/SvgToJsxTool";
import { tools } from "@/config/tools";
import { ArrowLeft, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Component registry mapping string names to actual components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  Base64Tool,
  FormatConverter,
  PdfTool,
  FaviconTool,
  SvgToJsxTool,
  EditorTool,
};

// Required for static export
export function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.id,
  }));
}

// Generate metadata for each tool page
export async function generateMetadata(props: { params: Promise<{ tool: string }> }) {
  const params = await props.params;
  const toolConfig = tools.find((t) => t.id === params.tool);

  if (!toolConfig) {
    return {
      title: "Tool Not Found | img0.site",
      description: "The requested utility could not be located."
    };
  }

  return {
    title: `${toolConfig.title} | img0.site`,
    description: toolConfig.description,
  };
}

export default async function ToolPage(props: { params: Promise<{ tool: string }> }) {
  const params = await props.params;
  const toolConfig = tools.find((t) => t.id === params.tool);

  if (!toolConfig) {
    return notFound();
  }

  const ToolComponent = COMPONENT_MAP[toolConfig.component];

  if (!ToolComponent) {
    return (
      <div className="p-8 text-center font-mono text-red-500 border border-red-500">
        ERR: COMPONENT_LOAD_FAIL [{toolConfig.component}]
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pt-8">
       {/* Navigation / Header */}
       <div className="space-y-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
          </Link>

          <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                     <div className="flex items-center gap-4">
                         <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <toolConfig.icon className="size-8 text-blue-600" strokeWidth={1.5} />
                         </div>
                         <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                           {toolConfig.title}
                         </h1>
                    </div>
                    <p className="text-lg text-slate-500 max-w-2xl leading-relaxed pl-1 font-medium">
                       {toolConfig.description}
                    </p>
                </div>

                {/* Status Badges - Soft Pills */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide border border-emerald-100 bg-emerald-50 rounded-full px-4 py-2 text-emerald-700">
                         <span className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Privacy
                         </span>
                         <span>Local</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide border border-blue-100 bg-blue-50 rounded-full px-4 py-2 text-blue-700">
                         <span className="flex items-center gap-2">
                            <Database className="w-3.5 h-3.5" />
                            Process
                         </span>
                         <span>Client</span>
                    </div>
                </div>
            </div>
          </div>
       </div>

      <div className="min-h-[400px]">
        {/* Render tool component with its props */}
        <ToolComponent {...(toolConfig.props || {})} />
      </div>
    </div>
  );
}

