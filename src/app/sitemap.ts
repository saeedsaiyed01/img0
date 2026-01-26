import { tools } from '@/config/tools';
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://img0.site';

  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
       url: `${baseUrl}/privacy-policy`,
       lastModified: new Date(),
       changeFrequency: 'monthly',
       priority: 0.5,
    },
    ...toolUrls,
  ];
}
