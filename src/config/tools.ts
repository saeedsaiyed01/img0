import {
  Code2,
  FileCode,
  FileImage,
  FileText,
  Image,
  LayoutGrid,
  LucideIcon,
  Minimize2,
  MonitorSmartphone,
  PenTool,
  RotateCw,
  Scissors
} from "lucide-react";

export type ToolCategory = "convert" | "pdf" | "generator" | "editor" | "encode";

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  component: string;
  props?: Record<string, unknown>;
  category: ToolCategory;
  keywords?: string[];
}

export const tools: ToolConfig[] = [
  // Base64 Tool
  {
    id: "image-to-base64",
    title: "Image to Base64",
    description: "Encode an image as a Base64 data URL and copy it for HTML or CSS.",
    icon: FileCode,
    href: "/tools/image-to-base64",
    component: "Base64Tool",
    category: "encode",
  },

  // Format Converters
  {
    id: "image-to-png",
    title: "Image to PNG",
    description: "Convert JPG, PNG, or WebP images to PNG in your browser.",
    icon: FileImage,
    href: "/tools/image-to-png",
    component: "FormatConverter",
    props: { targetFormat: "image/png" },
    category: "convert",
  },
  {
    id: "image-to-jpg",
    keywords: ["jpeg"],
    title: "Image to JPG",
    description: "Convert images to JPG with adjustable quality and a white background.",
    icon: FileImage,
    href: "/tools/image-to-jpg",
    component: "FormatConverter",
    props: { targetFormat: "image/jpeg", quality: 0.9 },
    category: "convert",
  },
  {
    id: "image-to-webp",
    title: "Image to WebP",
    description: "Convert JPG or PNG images to WebP with adjustable quality.",
    icon: FileImage,
    href: "/tools/image-to-webp",
    component: "FormatConverter",
    props: { targetFormat: "image/webp", quality: 0.9 },
    category: "convert",
  },
  {
    id: "image-to-ico",
    title: "Image to ICO",
    description: "Create a 256-pixel ICO icon from a JPG, PNG, or WebP image.",
    icon: Image,
    href: "/tools/image-to-ico",
    component: "FormatConverter",
    props: { targetFormat: "image/x-icon" },
    category: "convert",
  },

  // PDF Tool
  {
    id: "image-to-pdf",
    title: "Images to PDF",
    description: "Combine your photos into a single PDF document.",
    icon: FileText,
    href: "/tools/image-to-pdf",
    component: "PdfTool",
    category: "pdf",
  },

  // Favicon Generator
  {
    id: "favicon-generator",
    keywords: ["app icon", "website icon", "browser tab", "pwa"],
    title: "Favicon Generator",
    description: "Generate PNG favicon sizes, an ICO icon, and a web manifest ZIP.",
    icon: MonitorSmartphone,
    href: "/tools/favicon-generator",
    component: "FaviconTool",
    category: "generator",
  },

  // SVG to JSX
  {
    id: "svg-to-jsx",
    keywords: ["react", "component", "svg to code"],
    title: "SVG to JSX",
    description: "Convert an SVG file to JSX-compatible markup for React.",
    icon: Code2,
    href: "/tools/svg-to-jsx",
    component: "SvgToJsxTool",
    category: "encode",
  },

  // Editor Tools
  {
    id: "crop-image",
    title: "Crop Image",
    description: "Crop a photo with a freeform selection or an aspect ratio.",
    icon: Scissors,
    href: "/tools/crop-image",
    component: "EditorTool",
    props: { mode: "crop" },
    category: "editor",
  },
  {
    id: "rotate-image",
    title: "Rotate Image",
    description: "Rotate or flip a photo and download the edited PNG.",
    icon: RotateCw,
    href: "/tools/rotate-image",
    component: "EditorTool",
    props: { mode: "rotate" },
    category: "editor",
  },
  
  // Magic Tools
  {
    id: "remove-background",
    title: "Remove Background",
    description: "Remove image backgrounds automatically with AI.",
    icon: Scissors,
    href: "/tools/remove-background",
    component: "BackgroundRemovalTool",
    category: "editor",
  },
  {
    id: "blur-background",
    title: "Blur Background",
    description: "Soften a photo background using AI subject detection.",
    icon: Image,
    href: "/tools/blur-background",
    component: "BlurBackgroundTool",
    category: "editor",
  },

  {
    id: "join-images",
    title: "Join Images",
    description: "Combine multiple images into one frame.",
    icon: FileImage,
    href: "/tools/join-images",
    component: "JoinImagesTool",
    category: "editor",
  },

  // Compression & Optimization
  {
    id: "compress-image",
    keywords: ["reduce size", "reduce file size", "optimize", "shrink photo"],
    title: "Compress Image",
    description: "Compare JPG, PNG, and WebP output sizes with local processing.",
    icon: Minimize2,
    href: "/tools/compress-image",
    component: "CompressorTool",
    category: "editor",
  },

  // Social Media Tools
  {
    id: "social-resize",
    title: "Social Media Resize",
    description: "Create center-cropped images using social media size presets.",
    icon: LayoutGrid,
    href: "/tools/social-resize",
    component: "SocialResizeTool",
    category: "generator",
  },

  // Watermark Tool
  {
    id: "add-watermark",
    title: "Add Watermark",
    description: "Protect images with text or logo overlays.",
    icon: PenTool,
    href: "/tools/add-watermark",
    component: "WatermarkTool",
    category: "editor",
  },
];

export const CATEGORY_THEMES: Record<ToolCategory, { bg: string; text: string; icon: string }> = {
  convert: {
    bg: "bg-blue-50 hover:bg-blue-100", 
    text: "text-blue-900",
    icon: "bg-blue-100 text-blue-600" 
  },
  pdf: {
    bg: "bg-rose-50 hover:bg-rose-100",
    text: "text-rose-900",
    icon: "bg-rose-100 text-rose-600"
  },
  generator: {
    bg: "bg-violet-50 hover:bg-violet-100",
    text: "text-violet-900",
    icon: "bg-violet-100 text-violet-600"
  },
  editor: {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    text: "text-emerald-900",
    icon: "bg-emerald-100 text-emerald-600"
  },
  encode: {
    bg: "bg-amber-50 hover:bg-amber-100",
    text: "text-amber-900",
    icon: "bg-amber-100 text-amber-600"
  },
};

