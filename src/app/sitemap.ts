import type { MetadataRoute } from 'next';
import { brand } from '@/lib/site-data';

const siteUrl = process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? `https://${brand.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/pedido', '/produtos', '/promocoes', '/chama-premiada', '/sobre', '/unidades', '/unidades/aquidauana', '/unidades/anastacio', '/unidades/miranda', '/avaliacoes', '/contato', '/duvidas', '/links', '/politica-de-privacidade', '/termos-de-uso'];
  return paths.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }));
}
