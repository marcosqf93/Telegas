import type { MetadataRoute } from 'next';
import { brand } from '@/lib/site-data';

const siteUrl = process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? `https://${brand.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
