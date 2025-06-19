import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.com'
  const locales = ['zh', 'en']
  
  // 静态页面
  const staticPages = [
    '',
    '/about',
    '/bootcamp',
    '/clubs',
    '/course'
  ]
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // 为每个语言版本生成页面
  locales.forEach(locale => {
    staticPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            'zh': `${baseUrl}/zh${page}`,
            'en': `${baseUrl}/en${page}`,
          }
        }
      })
    })
  })
  
  return sitemap
}