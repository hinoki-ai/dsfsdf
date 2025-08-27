'use client'

import Script from 'next/script'
import { 
  generateOrganizationJsonLd, 
  generateWebsiteJsonLd, 
  generateProductJsonLd,
  generateBreadcrumbJsonLd 
} from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

// ===========================================
// STRUCTURED DATA COMPONENTS
// ===========================================

interface SEOHeadProps {
  locale?: Locale
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function SEOHead({ locale = 'es', breadcrumbs }: SEOHeadProps) {
  const organizationJsonLd = generateOrganizationJsonLd()
  const websiteJsonLd = generateWebsiteJsonLd(locale)
  const breadcrumbJsonLd = breadcrumbs ? generateBreadcrumbJsonLd(breadcrumbs) : null

  return (
    <>
      {/* Organization Schema */}
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      
      {/* Website Schema */}
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />
      
      {/* Breadcrumb Schema */}
      {breadcrumbJsonLd && (
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
      )}
    </>
  )
}

// ===========================================
// PRODUCT SEO COMPONENT
// ===========================================

interface ProductSEOProps {
  product: {
    name: string
    description: string
    price: number
    category: string
    brand: string
    images: string[]
    availability: boolean
    sku: string
  }
  locale?: Locale
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function ProductSEO({ product, locale = 'es', breadcrumbs }: ProductSEOProps) {
  const productJsonLd = generateProductJsonLd({ ...product, locale })
  const breadcrumbJsonLd = breadcrumbs ? generateBreadcrumbJsonLd(breadcrumbs) : null

  return (
    <>
      {/* Product Schema */}
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      
      {/* Breadcrumb Schema */}
      {breadcrumbJsonLd && (
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
      )}
    </>
  )
}

// ===========================================
// LOCAL BUSINESS SCHEMA (FOR STORE PAGES)
// ===========================================

export function LocalBusinessSEO() {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://liquor.aramac.dev/#business',
    name: 'ΛRΛMΛC Liquor Store',
    image: 'https://liquor.aramac.dev/images/store-front.jpg',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
      addressRegion: 'Región Metropolitana',
      addressLocality: 'Santiago',
      postalCode: '7500000'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -33.4489,
      longitude: -70.6693
    },
    telephone: '+56 9 1234 5678',
    email: 'contacto@liquor.aramac.dev',
    url: 'https://liquor.aramac.dev',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '23:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '21:00'
      }
    ],
    acceptsReservations: false,
    servesCuisine: 'Beverages',
    paymentAccepted: 'Credit Card, Debit Card, Cash',
    currenciesAccepted: 'CLP'
  }

  return (
    <Script
      id="local-business-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessJsonLd),
      }}
    />
  )
}

// ===========================================
// FAQ SCHEMA COMPONENT
// ===========================================

interface FAQSEOProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQSEO({ faqs }: FAQSEOProps) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqJsonLd),
      }}
    />
  )
}

// ===========================================
// REVIEW SCHEMA COMPONENT
// ===========================================

interface ReviewSEOProps {
  reviews: Array<{
    author: string
    rating: number
    reviewText: string
    datePublished: string
  }>
  averageRating: number
  reviewCount: number
}

export function ReviewSEO({ reviews, averageRating, reviewCount }: ReviewSEOProps) {
  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product', // This would be embedded within a product
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewText,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      }
    }))
  }

  return (
    <Script
      id="review-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reviewJsonLd),
      }}
    />
  )
}

// ===========================================
// SEARCH BOX SCHEMA
// ===========================================

export function SearchBoxSEO() {
  const searchBoxJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://liquor.aramac.dev',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://liquor.aramac.dev/buscar?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <Script
      id="search-box-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(searchBoxJsonLd),
      }}
    />
  )
}