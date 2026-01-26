import {
  Code2,
  FileCode,
  FileImage,
  FileText,
  Image,
  LucideIcon,
  MonitorSmartphone,
  RotateCw,
  Scissors,
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
}

export const tools: ToolConfig[] = [
  // Base64 Tool
  {
    id: "image-to-base64",
    title: "Image to Base64",
    description: "For developers who need to turn images into code.",
    icon: FileCode,
    href: "/tools/image-to-base64",
    component: "Base64Tool",
    category: "encode",
  },

  // Format Converters
  {
    id: "image-to-png",
    title: "Image to PNG",
    description: "Turn any image into a high-quality PNG file.",
    icon: FileImage,
    href: "/tools/image-to-png",
    component: "FormatConverter",
    props: { targetFormat: "image/png" },
    category: "convert",
  },
  {
    id: "image-to-jpg",
    title: "Image to JPG",
    description: "Make images smaller and faster to load.",
    icon: FileImage,
    href: "/tools/image-to-jpg",
    component: "FormatConverter",
    props: { targetFormat: "image/jpeg", quality: 0.9 },
    category: "convert",
  },
  {
    id: "image-to-webp",
    title: "Image to WebP",
    description: "The modern web format for websites.",
    icon: FileImage,
    href: "/tools/image-to-webp",
    component: "FormatConverter",
    props: { targetFormat: "image/webp", quality: 0.9 },
    category: "convert",
  },
  {
    id: "image-to-ico",
    title: "Image to Icon",
    description: "Create small icons for browser tabs.",
    icon: Image,
    href: "/tools/image-to-ico",
    component: "FormatConverter",
    props: { targetFormat: "image/x-icon" },
    category: "convert",
  },

  // PDF Tool
  {
    id: "image-to-pdf",
    title: "Turn Images into PDF",
    description: "Combine your photos into a single PDF document.",
    icon: FileText,
    href: "/tools/image-to-pdf",
    component: "PdfTool",
    category: "pdf",
  },

  // Favicon Generator
  {
    id: "favicon-generator",
    title: "Make App Icons",
    description: "Create all the icons you need for a new website or app.",
    icon: MonitorSmartphone,
    href: "/tools/favicon-generator",
    component: "FaviconTool",
    category: "generator",
  },

  // SVG to JSX
  {
    id: "svg-to-jsx",
    title: "SVG to Code",
    description: "Turn SVG icons into React component code.",
    icon: Code2,
    href: "/tools/svg-to-jsx",
    component: "SvgToJsxTool",
    category: "encode",
  },

  // Editor Tools
  {
    id: "crop-image",
    title: "Cut & Crop",
    description: "Trim your images to the perfect size.",
    icon: Scissors,
    href: "/tools/crop-image",
    component: "EditorTool",
    props: { mode: "crop" },
    category: "editor",
  },
  {
    id: "rotate-image",
    title: "Rotate Image",
    description: "Spin your photos until they look right.",
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
    description: "Blur the background of your photo just like Portrait mode.",
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
];

// Group tools by category for potential future use
export const toolCategories = {
  convert: tools.filter(t => t.category === "convert").map(t => t.id),
  encode: tools.filter(t => t.category === "encode").map(t => t.id),
  generator: tools.filter(t => t.category === "generator").map(t => t.id),
  edit: tools.filter(t => t.category === "editor").map(t => t.id),
  pdf: tools.filter(t => t.category === "pdf").map(t => t.id),
};

export const CATEGORY_THEMES: Record<ToolCategory, { bg: string; text: string; icon: string }> = {
  convert: {
    bg: "bg-blue-50 hover:bg-blue-100", // Soft interactive background
    text: "text-blue-900",
    icon: "bg-blue-100 text-blue-600" // Pastel Icon Container
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
// Keeping generic type for backward compatibility if needed, but we will mostly use CATEGORY_THEMES
export const CATEGORY_COLORS = CATEGORY_THEMES;
