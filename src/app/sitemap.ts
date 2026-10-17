import { tools } from '@/config/tools';
import { canonicalUrl } from '@/config/site';
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/tools/', '/privacy-policy/', ...tools.map(tool => tool.href)]
    .map(path => ({ url: canonicalUrl(path) }));
}
