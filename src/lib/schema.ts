import type { ToolConfig } from "@/config/tools";
import { canonicalUrl, siteConfig } from "@/config/site";
import { toolSeo } from "@/config/tool-seo";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    "name": siteConfig.name,
    "url": canonicalUrl(),
    "logo": `${siteConfig.url}/insert-picture-icon.png`,
    "description": "img0 (image0): Privacy-first web-based image utilities. Process images locally without uploads.",
    "sameAs": [
      siteConfig.links.twitter
    ]
  };
}

export function generateSoftwareApplicationSchema(tool: ToolConfig) {
  const content = toolSeo[tool.id];
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": content.description,
    "url": canonicalUrl(tool.href),
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [tool.description, "Local image processing", "No image uploads"],
    "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
    "isAccessibleForFree": true,
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    alternateName: "image0",
    url: canonicalUrl(),
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function generateBreadcrumbSchema(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl() },
      { "@type": "ListItem", position: 2, name: "Image Tools", item: canonicalUrl('/tools/') },
      { "@type": "ListItem", position: 3, name: tool.title, item: canonicalUrl(tool.href) },
    ],
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}
