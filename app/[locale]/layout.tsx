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
import { getMessages, getTranslations } from 'next-intl/server';
import React from 'react';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: {
      template: '%s | Lu Lab',
      default: 'Lu Lab - 创新教育与科技研究实验室'
    },
    description: t('description'),
    keywords: ['教育', '科技', '研究', '实验室', 'bootcamp', '编程', '人工智能'],
    authors: [{ name: 'Lu Lab' }],
    creator: 'Lu Lab',
    publisher: 'Lu Lab',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://your-domain.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh': '/zh',
        'en': '/en',
      },
    },
    openGraph: {
      title: 'Lu Lab - 创新教育与科技研究实验室',
      description: t('description'),
      url: 'https://your-domain.com',
      siteName: 'Lu Lab',
      images: [
        {
          url: '/images/logo.svg',
          width: 1200,
          height: 630,
          alt: 'Lu Lab Logo',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lu Lab - 创新教育与科技研究实验室',
      description: t('description'),
      images: ['/images/logo.svg'],
    },
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
    verification: {
      google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // yahoo: 'your-yahoo-verification-code',
    },
  };
}

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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.svg" />
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