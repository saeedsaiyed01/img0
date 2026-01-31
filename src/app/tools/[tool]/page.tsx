import { constructMetadata } from "@/components/SEO";
import { tools } from "@/config/tools";
import { generateFAQSchema, generateOrganizationSchema, generateSoftwareApplicationSchema } from "@/lib/schema";
import { ArrowLeft, ArrowRight, Check, Database, Lock, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

// Dynamic Imports for Performance (Code Splitting)
const Base64Tool = dynamic(() => import("@/components/tools/Base64Tool").then(mod => mod.Base64Tool));
const BackgroundRemovalTool = dynamic(() => import("@/components/tools/BackgroundRemovalTool").then(mod => mod.BackgroundRemovalTool));
const BlurBackgroundTool = dynamic(() => import("@/components/tools/BlurBackgroundTool").then(mod => mod.BlurBackgroundTool));
const EditorTool = dynamic(() => import("@/components/tools/EditorTool").then(mod => mod.EditorTool));
const JoinImagesTool = dynamic(() => import("@/components/tools/JoinImagesTool").then(mod => mod.JoinImagesTool));
const SvgToJsxTool = dynamic(() => import("@/components/tools/SvgToJsxTool").then(mod => mod.SvgToJsxTool));
const FaviconTool = dynamic(() => import("@/components/tools/FaviconTool"));
const FormatConverter = dynamic(() => import("@/components/tools/FormatConverter"));
const PdfTool = dynamic(() => import("@/components/tools/PdfTool"));

// Component registry
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  Base64Tool,
  FormatConverter,
  PdfTool,
  FaviconTool,
  SvgToJsxTool,
  EditorTool,
  BackgroundRemovalTool,
  BlurBackgroundTool,
  JoinImagesTool,
};

export function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.id,
  }));
}

export async function generateMetadata(props: { params: Promise<{ tool: string }> }) {
  const params = await props.params;
  const toolConfig = tools.find((t) => t.id === params.tool);

  if (!toolConfig) {
    return constructMetadata({
      title: "Tool Not Found",
      description: "The requested utility could not be located.",
      noIndex: true,
    });
  }

  const customTitles: Record<string, string> = {
    "image-to-png": "Convert Image to PNG Instantly | 100% Private, No Uploads",
    "image-to-pdf": "Combine Images into PDF Online | Local-First, Zero Data Leaks",
    "image-to-base64": "Convert Image to Base64 String | Fast, Secure, Local",
    "remove-background": "AI Background Remover | Browser-Based, Privacy-Native",
  };

  const title = customTitles[toolConfig.id] || toolConfig.title;

  return constructMetadata({
    title,
    description: toolConfig.description + " Zero uploads, 100% privacy context. Process images directly in browser memory.",
    canonical: toolConfig.href,
  });
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

  const jsonLd = [
    generateOrganizationSchema(),
    generateSoftwareApplicationSchema(toolConfig),
    generateFAQSchema([
      { question: `Is this ${toolConfig.title} free?`, answer: "Yes, this tool is completely free to use without any limits." },
      { question: "Is my data private?", answer: "Absolutely. We use WebAssembly technology to process your files locally on your device. They are never uploaded to our servers." },
      { question: "Does this work offline?", answer: "Yes! img0.site is a PWA (Progressive Web App). Once loaded, you can use it without an internet connection." },
    ]),
  ];

  const relatedTools = tools
    .filter(t => t.id !== toolConfig.id)
    .sort((a, b) => (a.category === toolConfig.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-32 pt-16 space-y-16 animate-in fade-in duration-500 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- HERO / HEADER --- */}
      <div className="space-y-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
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
                <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-900 leading-tight">
                    {toolConfig.title}
                </h1>
              </div>
              <p className="text-lg text-slate-500 max-w-2xl leading-relaxed pl-1 font-medium">
                {toolConfig.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide border border-emerald-100 bg-emerald-50 rounded-full px-4 py-2 text-emerald-700">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privately Secure
                </span>
                <span>Local</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide border border-blue-100 bg-blue-50 rounded-full px-4 py-2 text-blue-700">
                <span className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  WebAssembly
                </span>
                <span>Speed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN TOOL COMPONENT --- */}
      <div className="min-h-[400px]">
        <ToolComponent {...(toolConfig.props || {})} />
      </div>

      {/* --- SEO CONTENT SECTIONS --- */}
      <div className="border-t border-slate-200 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 text-slate-800 items-start">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* H2: Why Choose */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why choose img0 for {toolConfig.title}?</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Lock className="w-8 h-8 text-emerald-600 mb-4" />
                        <h3 className="text-lg font-bold mb-2">100% Private</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Most online coverters upload your images to a remote server. We don't. Your files never leave your device.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Zap className="w-8 h-8 text-amber-500 mb-4" />
                        <h3 className="text-lg font-bold mb-2">Instant Processing</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">No queue times, no slow uploads. We use your computer's power to process images instantly.</p>
                    </div>
                </div>
            </section>

             {/* H2: Comparison Table */}
             <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">img0 vs. Cloud Converters</h2>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold text-slate-900">Feature</th>
                                <th className="px-6 py-4 text-left font-bold text-emerald-700 bg-emerald-50/50">img0.site (Local)</th>
                                <th className="px-6 py-4 text-left font-bold text-slate-500">Cloud Tools</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-700">Privacy</td>
                                <td className="px-6 py-4 text-emerald-700 font-bold flex items-center gap-2 bg-emerald-50/30">
                                    <Check className="size-4" /> 100% Private
                                </td>
                                <td className="px-6 py-4 text-red-500 flex items-center gap-2">
                                     <X className="size-4" /> Files Uploaded
                                </td>
                            </tr>
                             <tr>
                                <td className="px-6 py-4 font-medium text-slate-700">Speed</td>
                                <td className="px-6 py-4 text-emerald-700 font-bold bg-emerald-50/30">Instant (0ms latency)</td>
                                <td className="px-6 py-4 text-slate-500">Depends on Upload</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-700">File Limit</td>
                                <td className="px-6 py-4 text-emerald-700 font-bold bg-emerald-50/30">Unlimited</td>
                                <td className="px-6 py-4 text-slate-500">Often Restricted</td>
                            </tr>
                             <tr>
                                <td className="px-6 py-4 font-medium text-slate-700">Offline Use</td>
                                <td className="px-6 py-4 text-emerald-700 font-bold bg-emerald-50/30">Yes (PWA)</td>
                                <td className="px-6 py-4 text-slate-500">No</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

             {/* H2: How to use */}
             <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">How to use {toolConfig.title}</h2>
                <ol className="list-decimal pl-5 space-y-4 text-slate-700 marker:text-slate-400 marker:font-bold">
                    <li className="pl-2">
                        <span className="font-bold text-slate-900">Select your file:</span> Click the box above or drag and drop your image.
                    </li>
                    <li className="pl-2">
                        <span className="font-bold text-slate-900">Adjust settings:</span> Customize options if available (e.g., quality, format).
                    </li>
                    <li className="pl-2">
                        <span className="font-bold text-slate-900">Download:</span> Instantly save the processed file to your device.
                    </li>
                </ol>
             </section>

        </div>

        {/* Right Column (Related Tools) */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="size-5 text-purple-600" />
                    <h3 className="font-bold text-slate-900">Related Tools</h3>
                </div>
                <div className="space-y-3">
                    {relatedTools.map((tool) => (
                        <Link 
                            key={tool.id} 
                            href={tool.href}
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group bg-white/50 border border-transparent hover:border-slate-100"
                        >
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                <tool.icon className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                    {tool.title}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                    {tool.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                <Link 
                    href="/" 
                    className="mt-6 flex items-center justify-center w-full py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
                >
                    View All Tools <ArrowRight className="ml-2 size-4" />
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
