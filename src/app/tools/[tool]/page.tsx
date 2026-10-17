import { constructMetadata } from "@/components/SEO";
import { tools } from "@/config/tools";
import { toolSeo } from "@/config/tool-seo";
import { generateBreadcrumbSchema, generateFAQSchema, generateSoftwareApplicationSchema } from "@/lib/schema";
import { ArrowRight, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
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
const CompressorTool = dynamic(() => import("@/components/tools/CompressorTool").then(mod => mod.CompressorTool));
const SocialResizeTool = dynamic(() => import("@/components/tools/SocialResizeTool").then(mod => mod.SocialResizeTool));
const WatermarkTool = dynamic(() => import("@/components/tools/WatermarkTool").then(mod => mod.WatermarkTool));

// Component registry
const COMPONENT_MAP = {
  Base64Tool,
  FormatConverter,
  PdfTool,
  FaviconTool,
  SvgToJsxTool,
  EditorTool,
  BackgroundRemovalTool,
  BlurBackgroundTool,
  JoinImagesTool,
  CompressorTool,
  SocialResizeTool,
  WatermarkTool,
};

export function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.id,
  }));
}

export async function generateMetadata(props: { params: Promise<{ tool: string }> }) {
  const { tool } = await props.params;
  const config = tools.find(item => item.id === tool);
  if (!config) return constructMetadata({ title: "Tool Not Found", description: "The requested image tool could not be found.", noIndex: true });
  const content = toolSeo[config.id];
  return constructMetadata({ title: content.title, description: content.description, canonical: config.href });
}

export default async function ToolPage(props: { params: Promise<{ tool: string }> }) {
  const { tool } = await props.params;
  const toolConfig = tools.find(item => item.id === tool);
  if (!toolConfig) notFound();
  const content = toolSeo[toolConfig.id];
  const ToolComponent = COMPONENT_MAP[toolConfig.component as keyof typeof COMPONENT_MAP] as React.ComponentType<Record<string, unknown>>;
  if (!ToolComponent) throw new Error("Missing tool component: " + toolConfig.component);
  const faqs = [
    ...content.faqs,
    { question: "Are my image files uploaded?", answer: "No. Image processing happens locally in your browser. The website downloads its code and, for AI tools, model assets. Anonymous site usage analytics are separate from your image files." },
    { question: "Is this tool free to use?", answer: "Yes. No account or payment is required. Processing capacity depends on your browser, image dimensions, and available device memory." },
  ];
  const jsonLd = [generateSoftwareApplicationSchema(toolConfig), generateBreadcrumbSchema(toolConfig), generateFAQSchema(faqs)];
  const relatedTools = content.related.map(id => tools.find(item => item.id === id)).filter((item): item is (typeof tools)[number] => Boolean(item));

  return (
    <div className="max-w-6xl mx-auto px-4 pb-32 pt-6 space-y-6 md:pt-8 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link><span aria-hidden="true">/</span>
        <Link href="/tools/" className="hover:text-slate-900">Image Tools</Link><span aria-hidden="true">/</span>
        <span aria-current="page" className="text-slate-900">{toolConfig.title}</span>
      </nav>
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-4">
            <div className="hidden p-2 border border-slate-100 rounded-xl md:block"><toolConfig.icon className="size-6 text-blue-600" strokeWidth={1.5} aria-hidden="true" /></div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{toolConfig.title}</h1>
          </div>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">{toolConfig.description}</p>
        </div>
        <span className="inline-flex items-center self-start gap-2 text-xs font-semibold rounded-full px-4 py-2 bg-emerald-50 text-emerald-800"><ShieldCheck className="size-4" aria-hidden="true" />No image uploads</span>
      </header>
      <div className="min-h-[400px]"><ToolComponent {...(toolConfig.props || {})} /></div>
      <div className="border-t border-slate-200 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 text-slate-800 items-start">
        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">About {toolConfig.title}</h2>
            <p className="text-slate-600 leading-relaxed">{content.overview}</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">How to use {toolConfig.title}</h2>
            <ol className="list-decimal pl-5 space-y-3 text-slate-600">{content.steps.map(step => <li key={step} className="pl-2 leading-relaxed">{step}</li>)}</ol>
          </section>
          <section className="grid sm:grid-cols-2 gap-6" aria-label="Local processing">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <Lock className="size-7 text-emerald-700 mb-3" aria-hidden="true" /><h2 className="text-lg font-bold mb-2">Your files stay on your device</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Your images are processed in your browser and downloaded to your device. Learn more in our <Link href="/privacy-policy/" className="underline underline-offset-4">privacy policy</Link>.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <Zap className="size-7 text-amber-600 mb-3" aria-hidden="true" /><h2 className="text-lg font-bold mb-2">Powered by your browser</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Processing time and image limits depend on your device. Cached tools may work offline; AI features need their model assets downloaded first.</p>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
            <div className="divide-y divide-slate-200">{faqs.map(faq => <details key={faq.question} className="py-4 group"><summary className="cursor-pointer font-semibold text-slate-900 py-1">{faq.question}</summary><p className="pt-3 text-slate-600 leading-relaxed">{faq.answer}</p></details>)}</div>
          </section>
        </div>
        <aside className="lg:col-span-4">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><Sparkles className="size-5 text-purple-600" aria-hidden="true" />Related image tools</h2>
            {relatedTools.map(related => <Link key={related.id} href={related.href} className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-colors"><h3 className="font-semibold text-slate-900">{related.title}</h3><p className="text-sm text-slate-600 mt-1">{related.description}</p></Link>)}
            <Link href="/tools/" className="inline-flex items-center gap-2 py-3 font-semibold text-sm">View all image tools<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
