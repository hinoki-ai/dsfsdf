// Divine Parsing Oracle - Advanced i18n System
// Orchestrates intelligent language detection and translation management

// Get supported locales from environment or use defaults
const supportedLocalesEnv = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES
export const locales = supportedLocalesEnv
  ? supportedLocalesEnv.split(',').map((l: string) => l.trim()) as const
  : ['en', 'es'] as const

export type Locale = typeof locales[number]

// Get default locale from environment or use Chilean Spanish
export const defaultLocale: Locale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || 'es'

// Divine Language Detection Oracle
export const divineLanguageOracle = {
  // Intelligent locale detection based on user context
  detectLocale: (acceptLanguage: string, userAgent: string, ip?: string): Locale => {
    // Check if language detection is enabled
    const enableDetection = process.env.NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION !== 'false'

    if (!enableDetection) {
      return defaultLocale
    }

    // Get Chilean IP ranges from environment
    const chileanIPRanges = process.env.NEXT_PUBLIC_CHILEAN_IP_RANGES
      ? process.env.NEXT_PUBLIC_CHILEAN_IP_RANGES.split(',').map((range: string) => range.trim())
      : ['190.196.', '200.29.', '191.112.', '200.75.']

    // Chilean IP detection with configurable ranges
    const isChileanIP = ip && chileanIPRanges.some(range => ip.includes(range))

    // Chilean Spanish takes precedence for Chilean users
    if (isChileanIP || acceptLanguage.includes('es-CL')) {
      return 'es'
    }

    // Spanish language preference
    if (acceptLanguage.includes('es')) {
      return 'es'
    }

    // Default to configured default locale for international users
    return defaultLocale
  },

  // SEO-optimized locale paths
  getLocalizedPath: (path: string, locale: Locale): string => {
    if (path === '/') return `/${locale}`
    return `/${locale}${path}`
  },

  // Smart translation key generation
  generateTranslationKey: (namespace: string, key: string): string => {
    return `${namespace}.${key}`
  }
}

// Translation messages with divine parsing optimization
export const messages = {
  en: {
    // Navigation
    navigation: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      promotions: 'Promotions',
      about: 'About Us',
      contact: 'Contact',
      cart: 'Cart',
      wishlist: 'Wishlist',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    },

    // Hero Section
    hero: {
      title: 'Licorería ARAMAC',
      subtitle: 'Your trusted online liquor store in Chile',
      description: 'We offer a wide selection with secure delivery and compliance with all Chilean regulations.',
      exploreProducts: 'Explore Products',
      viewPromotions: 'View Promotions',
      ageVerification: 'Age Verification Required'
    },

    // Categories
    categories: {
      title: 'Our Categories',
      subtitle: 'Discover our wide selection of alcoholic beverages',
      wine: {
        name: 'Wines',
        description: 'Premium selection of red, white and rosé wines'
      },
      beer: {
        name: 'Beers',
        description: 'Craft and commercial beers from around the world'
      },
      spirits: {
        name: 'Spirits',
        description: 'Fine rum, whisky, vodka, gin and other distillates'
      },
      cocktails: {
        name: 'Cocktails',
        description: 'Aperitifs, digestives and prepared cocktails'
      }
    },

    // Features
    features: {
      title: 'Why choose us?',
      securePurchase: {
        title: 'Secure Purchase',
        description: 'Mandatory age verification and strict compliance with Chilean legislation'
      },
      reliableDelivery: {
        title: 'Reliable Delivery',
        description: 'Secure delivery service with real-time tracking'
      },
      premiumProducts: {
        title: 'Premium Products',
        description: 'Wide selection of high-quality products and top brands'
      }
    },

    // Stats
    stats: {
      products: '1000+ Products',
      clients: '5000+ Clients',
      satisfaction: '98% Satisfaction',
      support: '24/7 Support'
    },

    // Footer
    footer: {
      description: 'Your trusted online store for liquors and alcoholic beverages in Chile.',
      categories: 'Categories',
      services: 'Services',
      shipping: 'Shipping',
      returns: 'Returns',
      support: 'Support',
      faq: 'FAQ',
      legal: 'Legal',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      agePolicy: 'Age Policy',
      contact: 'Contact',
      rights: 'All rights reserved.'
    }
  },

  es: {
    // Navigation
    navigation: {
      home: 'Inicio',
      products: 'Productos',
      categories: 'Categorías',
      promotions: 'Promociones',
      about: 'Sobre Nosotros',
      contact: 'Contacto',
      cart: 'Carrito',
      wishlist: 'Lista de Deseos',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión'
    },

    // Hero Section
    hero: {
      title: 'Licorería ARAMAC',
      subtitle: 'Tu tienda online de licores de confianza en Chile',
      description: 'Ofrecemos una amplia selección con entrega segura y cumplimiento de todas las normativas chilenas.',
      exploreProducts: 'Explorar Productos',
      viewPromotions: 'Ver Promociones',
      ageVerification: 'Verificación de Edad Obligatoria'
    },

    // Categories
    categories: {
      title: 'Nuestras Categorías',
      subtitle: 'Descubre nuestra amplia selección de bebidas alcoholicas',
      wine: {
        name: 'Vinos',
        description: 'Selección premium de vinos tintos, blancos y rosados'
      },
      beer: {
        name: 'Cervezas',
        description: 'Cervezas artesanales y comerciales de todo el mundo'
      },
      spirits: {
        name: 'Licores',
        description: 'Ron, whisky, vodka, gin y otros destilados finos'
      },
      cocktails: {
        name: 'Cócteles',
        description: 'Aperitivos, digestivos y cócteles preparados'
      }
    },

    // Features
    features: {
      title: '¿Por qué elegirnos?',
      securePurchase: {
        title: 'Compra Segura',
        description: 'Verificación de edad obligatoria y cumplimiento estricto de la legislación chilena'
      },
      reliableDelivery: {
        title: 'Entrega Confiable',
        description: 'Servicio de entrega seguro con seguimiento en tiempo real'
      },
      premiumProducts: {
        title: 'Productos Premium',
        description: 'Amplia selección de productos de alta calidad y las mejores marcas'
      }
    },

    // Stats
    stats: {
      products: '1000+ Productos',
      clients: '5000+ Clientes',
      satisfaction: '98% Satisfacción',
      support: '24/7 Soporte'
    },

    // Footer
    footer: {
      description: 'Tu tienda online de confianza para licores y bebidas alcoholicas en Chile.',
      categories: 'Categorías',
      services: 'Servicios',
      shipping: 'Envíos',
      returns: 'Devoluciones',
      support: 'Soporte',
      faq: 'Preguntas Frecuentes',
      legal: 'Legal',
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      agePolicy: 'Política de Edad',
      contact: 'Contacto',
      rights: 'Todos los derechos reservados.'
    }
  }
} as const

// Divine Translation Oracle - Intelligent translation management
export const divineTranslationOracle = {
  // Get translation with fallback
  getTranslation: (locale: Locale, key: string, fallback: string = key): string => {
    const keys = key.split('.')
    let translation: any = messages[locale]

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k]
      } else {
        // Fallback to English or provided fallback
        if (locale !== 'en') {
          return divineTranslationOracle.getTranslation('en', key, fallback)
        }
        return fallback
      }
    }

    return typeof translation === 'string' ? translation : fallback
  },

  // Get all translations for a namespace
  getNamespaceTranslations: (locale: Locale, namespace: string) => {
    const keys = namespace.split('.')
    let translation: any = messages[locale]

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k]
      } else {
        return {}
      }
    }

    return translation || {}
  }
}

// Hook for using translations
export const useTranslation = (locale: Locale) => ({
  t: (key: string, fallback?: string) => divineTranslationOracle.getTranslation(locale, key, fallback),
  tNamespace: (namespace: string) => divineTranslationOracle.getNamespaceTranslations(locale, namespace)
})