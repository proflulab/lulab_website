import { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const DEFAULT_FALLBACK_SITE_URL = 'https://lulabs.org';
const DEFAULT_OG_IMAGE = '/images/leadership.webp';

const seoLocaleMap: Record<string, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

const siteCopy = {
  name: 'Lu Lab',
  slogans: {
    en: 'Building a borderless Stanford-style lab',
    zh: '打造没有围墙的网上斯坦福大学',
  },
  descriptions: {
    en: 'Lu Lab is an innovation-focused education lab delivering project-based bootcamps, clubs, and mentorship to help students grow with a global mindset.',
    zh: '陆向谦实验室专注创新教育，提供项目式训练营、俱乐部与导师辅导，帮助学员以全球视野成长。',
  },
  keywords: {
    en: [
      'Lu Lab',
      'project-based learning',
      'innovation education',
      'bootcamp',
      'entrepreneurship',
      'STEM education',
      'global mindset',
    ],
    zh: [
      '陆向谦实验室',
      'Lu Lab',
      '创新教育',
      '项目式学习',
      '训练营',
      '创业教育',
      '科技教育',
      '国际化视野',
    ],
  },
};

const getConfiguredSiteUrl = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    DEFAULT_FALLBACK_SITE_URL;

  try {
    return new URL(envUrl);
  } catch (error) {
    console.warn('Invalid site URL provided, falling back to default', error);
    return new URL(DEFAULT_FALLBACK_SITE_URL);
  }
};

export const getSiteUrl = getConfiguredSiteUrl;

const buildLanguageAlternates = (pathname: string) => {
  const normalizedPath = pathname === '/' ? '' : pathname;

  return routing.locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `/${locale}${normalizedPath}`;
    return acc;
  }, {});
};

const buildOgImageUrl = (imagePath: string) => {
  const base = getConfiguredSiteUrl();
  return new URL(imagePath, base).toString();
};

export const getBaseMetadata = (locale: string): Metadata => {
  const metadataBase = getConfiguredSiteUrl();
  const description = siteCopy.descriptions[locale as 'en' | 'zh'] ?? siteCopy.descriptions.zh;
  const keywords = siteCopy.keywords[locale as 'en' | 'zh'] ?? siteCopy.keywords.zh;
  const ogLocale = seoLocaleMap[locale] ?? seoLocaleMap.zh;
  const alternateLocales = routing.locales.filter((value) => value !== locale).map((value) => seoLocaleMap[value] ?? value);
  const ogImage = buildOgImageUrl(DEFAULT_OG_IMAGE);

  return {
    metadataBase,
    applicationName: siteCopy.name,
    title: {
      default: `${siteCopy.name} | ${siteCopy.slogans[locale as 'en' | 'zh'] ?? siteCopy.slogans.zh}`,
      template: `%s | ${siteCopy.name}`,
    },
    description,
    keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: buildLanguageAlternates('/'),
    },
    openGraph: {
      title: `${siteCopy.name} | ${siteCopy.slogans[locale as 'en' | 'zh'] ?? siteCopy.slogans.zh}`,
      description,
      url: `/${locale}`,
      siteName: siteCopy.name,
      locale: ogLocale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteCopy.name} hero image`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteCopy.name} | ${siteCopy.slogans[locale as 'en' | 'zh'] ?? siteCopy.slogans.zh}`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    creator: siteCopy.name,
    publisher: siteCopy.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
};

export const buildPageMetadata = ({
  locale,
  path = '/',
  title,
  description,
  keywords,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}): Metadata => {
  const metadataBase = getConfiguredSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const localizedPath = `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
  const ogLocale = seoLocaleMap[locale] ?? seoLocaleMap.zh;
  const alternateLocales = routing.locales.filter((value) => value !== locale).map((value) => seoLocaleMap[value] ?? value);
  const ogImage = buildOgImageUrl(image);

  return {
    metadataBase,
    title,
    description,
    keywords: keywords ?? siteCopy.keywords[locale as 'en' | 'zh'] ?? siteCopy.keywords.zh,
    alternates: {
      canonical: localizedPath,
      languages: buildLanguageAlternates(normalizedPath),
    },
    openGraph: {
      title,
      description,
      url: localizedPath,
      siteName: siteCopy.name,
      locale: ogLocale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteCopy.name}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
};

export const seoDefaults = {
  siteCopy,
  seoLocaleMap,
  DEFAULT_OG_IMAGE,
  DEFAULT_FALLBACK_SITE_URL,
};
