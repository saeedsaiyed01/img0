import { ToolConfig } from "@/config/tools";

export const siteConfig = {
  name: "img0.site",
  url: "https://img0.site",
  description: "Free, private, and 100% client-side image tools. Process images purely in your browser memory without any uploads.",
  links: {
    twitter: "https://x.com/img0dotsite", 
  },
  ogImage: "/OG-img0.png",
};

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/OG-img0.png`,
    "description": "Privacy-first web-based image utilities.",
    "sameAs": [
      siteConfig.links.twitter
    ]
  };
}

export function generateSoftwareApplicationSchema(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": tool.description,
    "url": `${siteConfig.url}${tool.href}`,
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": "Offline processing, 100% Private, Client-side AI, Browser RAM processing, Zero Uploads",
    "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
    "isAccessibleForFree": true,
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
