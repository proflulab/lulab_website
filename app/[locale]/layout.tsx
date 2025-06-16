/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-09-08 03:01:48
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-31 05:34:18
 * @FilePath: /lulab_website_next_js/app/[locale]/layout.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import React from 'react';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: {
    default: '陆向谦实验室 - Lu Lab | 创新教育与创业实践平台',
    template: '%s | 陆向谦实验室 - Lu Lab'
  },
  description: '陆向谦实验室(Lu Lab)致力于培养具备全球视野与创新精神的复合型人才，通过项目式学习、实践驱动的教育模式，打造创新时代的教育革新平台。陆向谦教授领导的创新创业教育实验室。',
  keywords: ['陆向谦', 'Lu Lab', '陆向谦实验室', 'Lu Lab实验室', '创新教育', '创业实践', '项目式学习', '清华经管', '创新创业', '教育革新', '复合型人才', '陆向谦教授'],
  authors: [{ name: '陆向谦实验室 Lu Lab' }],
  creator: '陆向谦实验室 Lu Lab',
  publisher: '陆向谦实验室 Lu Lab',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    url: 'https://www.lulabs.org/',
    siteName: '陆向谦实验室 - Lu Lab',
    title: '陆向谦实验室 - Lu Lab | 创新教育与创业实践平台',
    description: '陆向谦实验室(Lu Lab)致力于培养具备全球视野与创新精神的复合型人才，通过项目式学习、实践驱动的教育模式，打造创新时代的教育革新平台。',
    images: [
      {
        url: 'https://www.lulabs.org/images/logo.svg',
        width: 1200,
        height: 630,
        alt: '陆向谦实验室 - Lu Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '陆向谦实验室 - Lu Lab | 创新教育与创业实践平台',
    description: '陆向谦实验室(Lu Lab)致力于培养具备全球视野与创新精神的复合型人才，通过项目式学习、实践驱动的教育模式，打造创新时代的教育革新平台。',
    images: ['https://www.lulabs.org/images/logo.svg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://www.lulabs.org/',
    languages: {
      'zh-CN': 'https://www.lulabs.org/zh',
      'en-US': 'https://www.lulabs.org/en',
    },
  },
};

// 结构化数据
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.lulabs.org/#organization",
      "name": "陆向谦实验室",
      "alternateName": ["Lu Lab", "陆向谦实验室 Lu Lab", "Lu Lab 陆向谦实验室"],
      "url": "https://www.lulabs.org/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.lulabs.org/images/logo.svg",
        "width": 400,
        "height": 400
      },
      "description": "陆向谦实验室(Lu Lab)致力于培养具备全球视野与创新精神的复合型人才，通过项目式学习、实践驱动的教育模式，打造创新时代的教育革新平台。",
      "founder": {
        "@type": "Person",
        "name": "陆向谦",
        "alternateName": "Professor Lu Xiangqian",
        "jobTitle": "清华经管学院创新创业课程教授",
        "description": "清华经管学院创新创业课程教授，教育部全国高教教师网络培训中心创新/创业特聘教授，Lu Lab创始人",
        "affiliation": {
          "@type": "Organization",
          "name": "清华大学经济管理学院"
        }
      },
      "sameAs": [
        "https://www.lulabs.org/"
      ],
      "keywords": "陆向谦,Lu Lab,创新教育,创业实践,项目式学习"
    },
    {
      "@type": "WebSite",
      "@id": "https://www.lulabs.org/#website",
      "url": "https://www.lulabs.org/",
      "name": "陆向谦实验室 - Lu Lab",
      "description": "创新时代的教育革新，培养具备全球视野与创新精神的复合型人才",
      "publisher": {
        "@id": "https://www.lulabs.org/#organization"
      },
      "inLanguage": "zh-CN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.lulabs.org/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "keywords": "陆向谦,Lu Lab,陆向谦实验室,创新教育,创业实践"
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.lulabs.org/#educational-organization",
      "name": "陆向谦实验室 Lu Lab",
      "url": "https://www.lulabs.org/",
      "description": "探索教育新范式：实践驱动、项目导向、精英聚合、协作共赢",
      "educationalCredentialAwarded": "创新创业实践证书",
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "name": "创新创业实践认证",
        "description": "通过项目式学习获得的创新创业实践能力认证"
      },
      "founder": {
        "@type": "Person",
        "name": "陆向谦"
      }
    },
    {
      "@type": "Person",
      "@id": "https://www.lulabs.org/#person-luxiangqian",
      "name": "陆向谦",
      "alternateName": "Professor Lu Xiangqian",
      "jobTitle": "清华经管学院创新创业课程教授",
      "description": "陆向谦教授，Lu Lab创始人，清华经管学院创新创业课程教授，致力于创新教育和创业实践",
      "affiliation": [
        {
          "@type": "Organization",
          "name": "清华大学经济管理学院"
        },
        {
          "@type": "Organization",
          "name": "陆向谦实验室 Lu Lab"
        }
      ],
      "knowsAbout": ["创新教育", "创业实践", "项目式学习", "教育革新"],
      "url": "https://www.lulabs.org/"
    }
  ]
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string };
}) {

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="陆向谦,Lu Lab,陆向谦实验室,Lu Lab实验室,创新教育,创业实践,项目式学习,清华经管,创新创业,教育革新,复合型人才,陆向谦教授" />
        <meta name="author" content="陆向谦实验室 Lu Lab" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        
        {/* 地理位置标签 */}
        <meta name="geo.region" content="CN-11" />
        <meta name="geo.placename" content="Beijing" />
        <meta name="geo.position" content="39.9042;116.4074" />
        <meta name="ICBM" content="39.9042, 116.4074" />
        
        {/* 语言标签 */}
        <meta httpEquiv="content-language" content={locale} />
        
        {/* 品牌相关标签 */}
        <meta name="application-name" content="陆向谦实验室 Lu Lab" />
        <meta name="apple-mobile-web-app-title" content="Lu Lab" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://www.lulabs.org/${locale === 'zh' ? 'zh' : 'en'}`} />
        
        {/* 语言替代链接 */}
        <link rel="alternate" hrefLang="zh-CN" href="https://www.lulabs.org/zh" />
        <link rel="alternate" hrefLang="en-US" href="https://www.lulabs.org/en" />
        <link rel="alternate" hrefLang="x-default" href="https://www.lulabs.org/" />
        
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* 预连接 */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            {children}
            
            <Toaster />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}