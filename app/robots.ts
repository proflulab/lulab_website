import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/seo';

const DISALLOW_PATHS = ['/api', '/admin', '/login', '/checkout', '/return'];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, '');
  const localizedDisallows = routing.locales.flatMap((locale) =>
    DISALLOW_PATHS.map((path) => `/${locale}${path}`)
  );

  return {
    rules: [
      {
        userAgent: '*',
        disallow: [...DISALLOW_PATHS, ...localizedDisallows],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
