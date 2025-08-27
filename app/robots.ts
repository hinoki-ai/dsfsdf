import { MetadataRoute } from 'next'
import { robotsConfig } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: robotsConfig.rules.disallow,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: robotsConfig.rules.disallow,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: robotsConfig.rules.disallow,
      }
    ],
    sitemap: robotsConfig.sitemap,
    host: robotsConfig.host
  }
}