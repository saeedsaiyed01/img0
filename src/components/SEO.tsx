import { Metadata } from 'next';
import { canonicalUrl as resolveCanonicalUrl, siteConfig } from '@/config/site';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  url = siteConfig.url,
  image = "/OG-img0.png",
  keywords = [
    "image0",
    "img0",
    "image zero",
    "img zero",
    "Image Converter",
    "Background Remover",
    "Private Image Tools",
    "Local Image Processing",
    "WebAssembly Tools",
    "Browser-based PDF Combiner",
    "Free Image Tools",
    "Offline Image Editor"
  ],
  canonical,
  noIndex = false,
}: SEOProps): Metadata {
  
  const fullTitle = title.includes("img0.site") ? title : `${title} | img0.site`;
  const canonicalUrl = resolveCanonicalUrl(canonical || url);

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'img0.site',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    metadataBase: new URL(siteConfig.url),
  };
}
