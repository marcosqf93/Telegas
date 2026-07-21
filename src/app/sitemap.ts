import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://telegasonline.com.br';
  const paths = ['/', '/pedido', '/produtos', '/promocoes', '/chama-premiada', '/sobre', '/unidades', '/unidades/aquidauana', '/unidades/anastacio', '/unidades/miranda', '/avaliacoes', '/contato', '/duvidas', '/links', '/politica-de-privacidade', '/termos-de-uso'];
  return paths.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
}
