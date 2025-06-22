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
import { DefaultSeo } from 'next-seo';

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
      url: 'https://www.lulabs.org/',
      siteName: 'Lu Lab',
      images: [
        {
          url: 'https://th.bing.com/th/id/OIP.-bOs2je0XBIzmVk1251XtgHaHa?rs=1&pid=ImgDetMain',
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
      title: 'Lu Lab',
      description: t('陆向谦实验室的创立源于陆教授对自己两个孩子教育的深切思考。在香港科技大学教授数理金融期间，他见证了互联网浪潮的兴起，预见了技术革命带来的机遇，随即开始创业并实现财务自由。'),
      images: ['https://th.bing.com/th/id/OIP.-bOs2je0XBIzmVk1251XtgHaHa?rs=1&pid=ImgDetMain'],
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
  };
}

async function RootLayout({
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DefaultSeo
        titleTemplate="Lu Lab"
        defaultTitle="Lu Lab"
        description="陆向谦实验室的创立源于陆教授对自己两个孩子教育的深切思考。在香港科技大学教授数理金融期间，他见证了互联网浪潮的兴起，预见了技术革命带来的机遇，随即开始创业并实现财务自由。"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://www.lulabs.org',
          site_name: 'Lu Lab',
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
      {children}
    </>
  );
}
