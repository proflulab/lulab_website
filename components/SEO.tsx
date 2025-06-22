import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
  structuredData?: object;
}

export default function SEO({
  title = '陆向谦实验室 - 创新时代的教育革新',
  description = '陆向谦实验室致力于培养具备全球视野与创新精神的复合型人才。通过项目式学习和创新教育，探索教育新范式：实践驱动、项目导向、精英聚合、协作共赢。',
  keywords = '陆向谦实验室,创新教育,项目式学习,训练营,AI教育,创业教育,实践学习,教育革新',
  image = 'https://th.bing.com/th/id/OIP.-bOs2je0XBIzmVk1251XtgHaHa?rs=1&pid=ImgDetMain',
  url = 'https://dev.lulabs.cn',
  type = 'website',
  locale = 'zh_CN',
  structuredData
}: SEOProps) {
  return (
    <Head>
      {/* 基础元数据 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="陆向谦实验室" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="陆向谦实验室" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 规范链接 */}
      <link rel="canonical" href={url} />
      
      {/* 语言替代 */}
      <link rel="alternate" hrefLang="zh-CN" href={url.replace('/en', '/zh')} />
      <link rel="alternate" hrefLang="en-US" href={url.replace('/zh', '/en')} />
      
      {/* 结构化数据 */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      
      {/* 预加载关键资源 */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* DNS预解析 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//th.bing.com" />
    </Head>
  );
}