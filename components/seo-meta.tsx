import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  locale?: 'es' | 'en'
  type?: 'website' | 'article'
  price?: number
  availability?: 'in_stock' | 'out_of_stock'
  brand?: string
  category?: string
}

const defaultMeta = {
  title: 'Licorería ARAMAC - Vinos, Cervezas y Destilados Premium en Chile',
  description: 'Tu licorería de confianza en Chile. Amplia selección de vinos, cervezas, destilados y pisco. Entrega a domicilio con verificación de edad. Cumplimiento estricto de la Ley 19.925.',
  keywords: [
    'licorería chile',
    'vinos chile',
    'cerveza chile', 
    'pisco chile',
    'destilados',
    'whisky chile',
    'licores premium',
    'entrega domicilio',
    'venta alcohol chile',
    'licorería online'
  ],
  image: '/images/og-image.jpg',
  url: 'https://liquor.aramac.dev'
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  locale = 'es',
  type = 'website',
  price,
  availability,
  brand,
  category
}: SEOProps = {}): Metadata {
  const finalTitle = title ? `${title} | ARAMAC` : defaultMeta.title
  const finalDescription = description || defaultMeta.description
  const finalKeywords = [...defaultMeta.keywords, ...keywords]
  const finalImage = image || defaultMeta.image
  const finalUrl = url || defaultMeta.url

  const metadata: Metadata = {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords.join(', '),
    
    // Open Graph
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: finalUrl,
      siteName: 'Licorería ARAMAC',
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        }
      ],
      locale: locale === 'es' ? 'es_CL' : 'en_US',
      type: type,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
      creator: '@AramacLiquor',
      site: '@AramacLiquor'
    },

    // Additional meta tags
    other: {
      // Age verification and legal compliance
      'age-verification': '18+',
      'legal-notice': 'Prohibida su venta a menores de 18 años',
      'compliance': 'Ley 19.925 Chile',
      
      // Geographic targeting
      'geo.region': 'CL',
      'geo.country': 'Chile',
      'geo.placename': 'Chile',
      
      // Business info
      'business:contact_data:street_address': 'Av. Providencia 123',
      'business:contact_data:locality': 'Santiago',
      'business:contact_data:region': 'Región Metropolitana',
      'business:contact_data:postal_code': '7500000',
      'business:contact_data:country_name': 'Chile',
      
      // Mobile optimization
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      
      // Performance hints
      'dns-prefetch-control': 'on',
      'preconnect': 'https://fonts.gstatic.com',
    }
  }

  // Product-specific metadata  
  if (price) {
    const productMeta: Record<string, string> = {
      'product:price:amount': price.toString(),
      'product:price:currency': 'CLP',
      'product:availability': availability || 'in_stock',
      'product:condition': 'new',
      'product:age_group': 'adult',
    }

    if (brand) {
      productMeta['product:brand'] = brand
    }

    if (category) {
      productMeta['product:category'] = category
    }

    metadata.other = {
      ...metadata.other,
      ...productMeta
    }
  }

  return metadata
}

// Structured data for rich snippets
export function generateStructuredData(props: SEOProps & {
  businessName?: string
  address?: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
  }
  phone?: string
  email?: string
}) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Organization
      {
        '@type': 'Organization',
        '@id': `${props.url || defaultMeta.url}#organization`,
        name: props.businessName || 'Licorería ARAMAC',
        url: props.url || defaultMeta.url,
        logo: {
          '@type': 'ImageObject',
          url: `${props.url || defaultMeta.url}/images/logo.png`,
          width: 200,
          height: 60
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: props.phone || '+56-2-1234-5678',
          contactType: 'customer service',
          email: props.email || 'info@aramac.dev',
          areaServed: 'CL',
          availableLanguage: ['Spanish', 'English']
        },
        address: props.address ? {
          '@type': 'PostalAddress',
          streetAddress: props.address.street,
          addressLocality: props.address.city,
          addressRegion: props.address.region,
          postalCode: props.address.postalCode,
          addressCountry: props.address.country
        } : undefined,
        sameAs: [
          'https://www.facebook.com/AramacLiquor',
          'https://www.instagram.com/AramacLiquor',
          'https://twitter.com/AramacLiquor'
        ]
      },
      
      // Website
      {
        '@type': 'WebSite',
        '@id': `${props.url || defaultMeta.url}#website`,
        url: props.url || defaultMeta.url,
        name: props.businessName || 'Licorería ARAMAC',
        description: props.description || defaultMeta.description,
        publisher: {
          '@id': `${props.url || defaultMeta.url}#organization`
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${props.url || defaultMeta.url}/productos?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        inLanguage: props.locale === 'es' ? 'es-CL' : 'en-US'
      }
    ]
  }

  // Add product-specific structured data
  if (props.title && props.price) {
    const productData: any = {
      '@type': 'Product',
      '@id': `${props.url}#product`,
      name: props.title,
      description: props.description,
      offers: {
        '@type': 'Offer',
        price: props.price,
        priceCurrency: 'CLP',
        availability: `https://schema.org/${props.availability === 'out_of_stock' ? 'OutOfStock' : 'InStock'}`,
        seller: {
          '@id': `${props.url || defaultMeta.url}#organization`
        },
        validFrom: new Date().toISOString(),
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '128',
        bestRating: '5',
        worstRating: '1'
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'Adult',
        suggestedMinAge: '18'
      }
    }

    if (props.image) {
      productData.image = props.image
    }

    if (props.brand) {
      productData.brand = {
        '@type': 'Brand',
        name: props.brand
      }
    }

    if (props.category) {
      productData.category = props.category
    }

    baseStructuredData['@graph'].push(productData)
  }

  return JSON.stringify(baseStructuredData, null, 2)
}