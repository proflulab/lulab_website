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
    default: '陆向谦实验室 - 创新时代的教育革新',
    template: '%s | 陆向谦实验室'
  },
  description: '陆向谦实验室致力于培养具备全球视野与创新精神的复合型人才。通过项目式学习和创新教育，探索教育新范式：实践驱动、项目导向、精英聚合、协作共赢。',
  keywords: ['陆向谦实验室', '创新教育', '项目式学习', '训练营', 'AI教育', '创业教育', '实践学习', '教育革新'],
  authors: [{ name: '陆向谦实验室' }],
  creator: '陆向谦实验室',
  publisher: '陆向谦实验室',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.lulabs.org/'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh',
      'en-US': '/en',
    },
  },
  openGraph: {
    url: 'https://dev.lulabs.cn',
    siteName: '陆向谦实验室',
    images: [
      {
        url: 'https://th.bing.com/th/id/OIP.-bOs2je0XBIzmVk1251XtgHaHa?rs=1&pid=ImgDetMain',
        width: 1200,
        height: 630,
        alt: '陆向谦实验室 - 创新教育平台',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ff9300" />
        <meta name="msapplication-TileColor" content="#ff9300" />
        <link rel="manifest" href="/manifest.json" />
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