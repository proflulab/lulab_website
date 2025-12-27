import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/seo';

const PUBLIC_PATHS = ['/', '/bootcamp', '/about', '/course', '/clubs', '/agreement.html'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl().toString().replace(/\/$/, '');
  const lastModified = new Date();

  const localizedEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    PUBLIC_PATHS.map((path) => {
      const normalizedPath = path === '/' ? '' : path;

      return {
        url: `${baseUrl}/${locale}${normalizedPath}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: path === '/' ? 1 : 0.8,
      };
    })
  );

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...localizedEntries,
  ];
}
