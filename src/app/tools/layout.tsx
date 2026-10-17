import { constructMetadata } from '@/components/SEO';

export const metadata = constructMetadata({
  title: 'Free Online Image Tools — Convert, Compress & Edit',
  description: 'Browse free image converters, compression, background removal, PDF, favicon, and editing tools. Process your images in your browser without uploads.',
  canonical: '/tools/',
});

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
