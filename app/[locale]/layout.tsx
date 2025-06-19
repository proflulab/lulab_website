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
    default: "陆向谦实验室 Lu Lab",
    template: "%s | 陆向谦实验室 Lu Lab",
  },

};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string };
}) {

  const messages = await getMessages();

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "陆向谦实验室 Lu Lab",
    "alternateName": "Lu Lab",
    "url": "https://www.lulabs.org",
    "logo": "https://www.lulabs.org/images/logo.svg",
    "description": "陆向谦实验室致力于创新教育和创业实践，通过项目式学习培养复合型人才",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Beijing",
      "addressCountry": "CN"
    },
    "founder": {
      "@type": "Person",
      "name": "陆向谦"
    }
  };

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