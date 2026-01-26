import { Metadata } from 'next';

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
  url = "https://img0.site",
  image = "/OG-img0.png",
  keywords = [
    "Image Converter",
    "Background Remover",
    "Private Image Tools",
    "Local Image Processing",
    "WebAssembly Tools",
    "Browser-based PDF Combiner"
  ],
  canonical,
  noIndex = false,
}: SEOProps): Metadata {
  
  const fullTitle = title.includes("img0.site") ? title : `${title} | img0.site`;
  const canonicalUrl = canonical || (url.startsWith('http') ? url : `https://img0.site${url}`);

  return {
    title: fullTitle,
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
    metadataBase: new URL("https://img0.site"),
  };
}
