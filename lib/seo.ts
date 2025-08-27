// SEO Configuration and Meta Tags for Liquor Store
// Comprehensive SEO optimization with Chilean market focus

import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'

// ===========================================
// SEO CONSTANTS
// ===========================================

const SITE_NAME = 'ΛRΛMΛC Liquor Store'
const SITE_DESCRIPTION = {
  es: 'Tienda de licores premium en Chile. Whisky, ron, vodka y más. Entrega a domicilio en Santiago y regiones.',
  en: 'Premium liquor store in Chile. Whisky, rum, vodka and more. Home delivery in Santiago and regions.'
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://liquor.aramac.dev'
const BUSINESS_PHONE = '+56 9 1234 5678'
const BUSINESS_EMAIL = 'contacto@liquor.aramac.dev'
const BUSINESS_ADDRESS = 'Santiago, Región Metropolitana, Chile'

// ===========================================
// BASE METADATA CONFIGURATION
// ===========================================

export function generateBaseMetadata(locale: Locale = 'es'): Metadata {
  const isSpanish = locale === 'es'
  
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: SITE_NAME
    },
    description: SITE_DESCRIPTION[locale as keyof typeof SITE_DESCRIPTION],
    keywords: isSpanish 
      ? 'licores, whisky, ron, vodka, pisco, cerveza, vino, destilados, premium, Santiago, Chile, entrega domicilio'
      : 'liquor, whisky, rum, vodka, pisco, beer, wine, spirits, premium, Santiago, Chile, home delivery',
    
    // Basic SEO
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
    
    // Language and location
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        'es-CL': `${SITE_URL}/es`,
        'en-US': `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/es`
      }
    },
    
    // Open Graph
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION[locale as keyof typeof SITE_DESCRIPTION],
      url: SITE_URL,
      locale: locale === 'es' ? 'es_CL' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_CL',
      images: [{
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      }],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: '@aramac_liquor',
      creator: '@aramac_liquor',
      title: SITE_NAME,
      description: SITE_DESCRIPTION[locale as keyof typeof SITE_DESCRIPTION],
      images: [`${SITE_URL}/images/twitter-image.jpg`],
    },
    
    // Additional metadata
    applicationName: SITE_NAME,
    authors: [{ name: 'ΛRΛMΛC Team', url: SITE_URL }],
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    colorScheme: 'dark light',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
      { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
    ],
    
    // App-specific
    category: 'E-commerce',
    classification: 'Liquor Store',
    
    // Verification tags (add your actual verification codes)
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    }
  }
}

// ===========================================
// PRODUCT PAGE METADATA
// ===========================================

interface ProductMetadataProps {
  name: string
  description: string
  price: number
  category: string
  brand: string
  images: string[]
  availability: boolean
  locale: Locale
}

export function generateProductMetadata({
  name,
  description,
  price,
  category,
  brand,
  images,
  availability,
  locale = 'es'
}: ProductMetadataProps): Metadata {
  const isSpanish = locale === 'es'
  const currency = 'CLP'
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(price)

  const title = `${name} - ${brand} | ${SITE_NAME}`
  const metaDescription = isSpanish
    ? `${name} de ${brand}. ${description.substring(0, 120)}... Precio: ${formattedPrice}. ${availability ? 'Disponible' : 'Agotado'}.`
    : `${name} by ${brand}. ${description.substring(0, 120)}... Price: ${formattedPrice}. ${availability ? 'In Stock' : 'Out of Stock'}.`

  return {
    title,
    description: metaDescription,
    
    // Product-specific keywords
    keywords: isSpanish
      ? `${name}, ${brand}, ${category}, licor, destilado, premium, comprar, Santiago, Chile, ${formattedPrice}`
      : `${name}, ${brand}, ${category}, liquor, spirit, premium, buy, Santiago, Chile, ${formattedPrice}`,
    
    openGraph: {
      type: 'website',
      title,
      description: metaDescription,
      images: images.map(img => ({
        url: img,
        width: 800,
        height: 600,
        alt: `${name} - ${brand}`,
      })),
      siteName: SITE_NAME,
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: images.slice(0, 1),
    },
    
    // Product-specific structured data will be handled by JSON-LD
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': currency,
      'product:availability': availability ? 'in_stock' : 'out_of_stock',
      'product:brand': brand,
      'product:category': category,
    }
  }
}

// ===========================================
// CATEGORY PAGE METADATA
// ===========================================

interface CategoryMetadataProps {
  category: string
  productCount: number
  locale: Locale
}

export function generateCategoryMetadata({
  category,
  productCount,
  locale = 'es'
}: CategoryMetadataProps): Metadata {
  const isSpanish = locale === 'es'
  
  const title = isSpanish
    ? `${category} - ${productCount} productos | ${SITE_NAME}`
    : `${category} - ${productCount} products | ${SITE_NAME}`
  
  const description = isSpanish
    ? `Descubre nuestra selección de ${category.toLowerCase()}. ${productCount} productos premium disponibles con entrega a domicilio en Chile.`
    : `Discover our selection of ${category.toLowerCase()}. ${productCount} premium products available with home delivery in Chile.`

  return {
    title,
    description,
    
    keywords: isSpanish
      ? `${category}, licores, destilados, premium, comprar, Santiago, Chile, entrega domicilio`
      : `${category}, liquors, spirits, premium, buy, Santiago, Chile, home delivery`,
    
    openGraph: {
      type: 'website',
      title,
      description,
      images: [{
        url: `${SITE_URL}/images/categories/${category.toLowerCase()}.jpg`,
        width: 1200,
        height: 630,
        alt: `${category} - ${SITE_NAME}`,
      }],
    },
  }
}

// ===========================================
// JSON-LD STRUCTURED DATA
// ===========================================

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      'https://www.facebook.com/aramac.liquor',
      'https://www.instagram.com/aramac.liquor',
      'https://twitter.com/aramac_liquor'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_PHONE,
      contactType: 'Customer Service',
      email: BUSINESS_EMAIL,
      availableLanguage: ['Spanish', 'English']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
      addressRegion: 'Región Metropolitana',
      addressLocality: 'Santiago'
    }
  }
}

export function generateWebsiteJsonLd(locale: Locale = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION[locale as keyof typeof SITE_DESCRIPTION],
    inLanguage: locale === 'es' ? 'es-CL' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateProductJsonLd({
  name,
  description,
  price,
  category,
  brand,
  images,
  availability,
  sku
}: ProductMetadataProps & { sku: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    category,
    image: images,
    sku,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'CLP',
      availability: availability 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CL'
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '12'
    }
  }
}

// ===========================================
// BREADCRUMB STRUCTURED DATA
// ===========================================

export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

// ===========================================
// SITEMAP CONFIGURATION
// ===========================================

export const sitemapConfig = {
  baseUrl: SITE_URL,
  changeFrequency: {
    home: 'daily' as const,
    products: 'weekly' as const,
    categories: 'weekly' as const,
    static: 'monthly' as const
  },
  priority: {
    home: 1.0,
    categories: 0.8,
    products: 0.7,
    static: 0.5
  }
}

// ===========================================
// ROBOTS.TXT CONFIGURATION
// ===========================================

export const robotsConfig = {
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin', '/api', '/_next', '/carrito', '/checkout']
  },
  sitemap: `${SITE_URL}/sitemap.xml`,
  host: SITE_URL
}