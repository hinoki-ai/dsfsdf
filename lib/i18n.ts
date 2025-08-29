import React, { createContext, useContext, useState, useEffect } from 'react'

// Locales supported by the liquor platform
export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

// Type for nested translation objects
type TranslationValue = string | string[] | { [key: string]: TranslationValue }

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

// Divine Parsing Oracle - Complete Liquor Store EN/ES translations
const translations = {
  en: {
    // Navigation & Global
    nav: {
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
      logout: 'Logout',
      languageToggle: 'Toggle language',
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

    // Cart & Checkout
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptySubtitle: 'Add some products to get started',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      addMore: 'Add More Items',
    },

    // Age Verification
    ageVerification: {
      title: 'Age Verification Required',
      subtitle: 'You must be 18+ to purchase alcoholic beverages',
      description: 'Please verify your age to continue shopping',
      verify: 'Verify Age',
      verified: 'Age Verified',
      failed: 'Verification Failed',
      legalNotice: 'By law 19.925, alcohol sales are restricted to adults 18+'
    },

    // Admin Panel
    admin: {
      title: 'Admin Panel',
      dashboard: 'Dashboard',
      products: 'Products',
      inventory: 'Inventory',
      orders: 'Orders',
      categories: 'Categories',
      customers: 'Customers',
      analytics: 'Analytics',
      settings: 'Settings'
    },

    // Common UI Elements
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try Again',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      viewAll: 'View All',
      learnMore: 'Learn More',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      viewDetails: 'View Details',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort by',
      price: 'Price',
      category: 'Category',
      brand: 'Brand',
      availability: 'Availability',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      onSale: 'On Sale',
      new: 'New',
      featured: 'Featured',
      bestseller: 'Bestseller',
      menu: 'Menu',
    },

    // Footer
    footer: {
      description: 'Your trusted online store for liquors and alcoholic beverages in Chile.',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      customerService: 'Customer Service',
      aboutUs: 'About Us',
      contact: 'Contact',
      shipping: 'Shipping Info',
      returns: 'Returns',
      warranty: 'Warranty',
      faq: 'FAQ',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      agePolicy: 'Age Policy',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Enter your email',
      copyright: 'All rights reserved.',
      designedBy: 'Designed by ΛRΛMΛC'
    },

    // SEO & Meta
    meta: {
      title: 'Licorería ARAMAC | Premium Liquor Store Chile',
      description: 'Premium alcoholic beverages with secure delivery. Age verification and compliance with Chilean Law 19.925.',
      keywords: 'licoreria, alcohol, wine, beer, spirits, chile, delivery, premium, aramac',
    },
  },

  es: {
    // Navigation & Global
    nav: {
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
      logout: 'Cerrar Sesión',
      languageToggle: 'Cambiar idioma',
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
      subtitle: 'Descubre nuestra amplia selección de bebidas alcohólicas',
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

    // Cart & Checkout
    cart: {
      title: 'Carrito de Compras',
      empty: 'Tu carrito está vacío',
      emptySubtitle: 'Agregá algunos productos para comenzar',
      continueShopping: 'Seguir Comprando',
      subtotal: 'Subtotal',
      delivery: 'Entrega',
      tax: 'Impuestos',
      total: 'Total',
      checkout: 'Proceder al Pago',
      remove: 'Eliminar',
      quantity: 'Cantidad',
      addMore: 'Agregar Más Artículos',
    },

    // Age Verification
    ageVerification: {
      title: 'Verificación de Edad Obligatoria',
      subtitle: 'Debes tener 18+ para comprar bebidas alcohólicas',
      description: 'Por favor verifica tu edad para continuar comprando',
      verify: 'Verificar Edad',
      verified: 'Edad Verificada',
      failed: 'Verificación Fallida',
      legalNotice: 'Por ley 19.925, la venta de alcohol está restringida a mayores de 18 años'
    },

    // Admin Panel
    admin: {
      title: 'Panel de Administración',
      dashboard: 'Panel',
      products: 'Productos',
      inventory: 'Inventario',
      orders: 'Pedidos',
      categories: 'Categorías',
      customers: 'Clientes',
      analytics: 'Análisis',
      settings: 'Configuración'
    },

    // Common UI Elements
    common: {
      loading: 'Cargando...',
      error: 'Algo salió mal',
      retry: 'Intentar de Nuevo',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      close: 'Cerrar',
      next: 'Siguiente',
      previous: 'Anterior',
      viewAll: 'Ver Todo',
      learnMore: 'Saber Más',
      addToCart: 'Agregar al Carrito',
      buyNow: 'Comprar Ahora',
      viewDetails: 'Ver Detalles',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar por',
      price: 'Precio',
      category: 'Categoría',
      brand: 'Marca',
      availability: 'Disponibilidad',
      inStock: 'En Stock',
      outOfStock: 'Sin Stock',
      onSale: 'En Oferta',
      new: 'Nuevo',
      featured: 'Destacado',
      bestseller: 'Más Vendido',
      menu: 'Menú',
    },

    // Footer
    footer: {
      description: 'Tu tienda online de confianza para licores y bebidas alcohólicas en Chile.',
      quickLinks: 'Enlaces Rápidos',
      categories: 'Categorías',
      customerService: 'Servicio al Cliente',
      aboutUs: 'Sobre Nosotros',
      contact: 'Contacto',
      shipping: 'Información de Entrega',
      returns: 'Devoluciones',
      warranty: 'Garantía',
      faq: 'Preguntas Frecuentes',
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      agePolicy: 'Política de Edad',
      followUs: 'Síguenos',
      newsletter: 'Newsletter',
      subscribe: 'Suscribirse',
      emailPlaceholder: 'Ingresa tu email',
      copyright: 'Todos los derechos reservados.',
      designedBy: 'Diseñado por ΛRΛMΛC'
    },

    // SEO & Meta
    meta: {
      title: 'Licorería ARAMAC | Licorería Premium Chile',
      description: 'Bebidas alcohólicas premium con entrega segura. Verificación de edad y cumplimiento con Ley 19.925.',
      keywords: 'licoreria, alcohol, vino, cerveza, licores, chile, entrega, premium, aramac',
    },
  },
} satisfies Record<Locale, { [key: string]: TranslationValue }>

// i18n Context
interface I18nContextType {
  locale: Locale
  t: (key: string, options?: { defaultValue?: string }) => string
  changeLocale: (newLocale: Locale) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Provider component that manages locale state
export function I18nProviderClient({ children, locale: initialLocale }: { children: React.ReactNode, locale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  // Update locale when initialLocale changes (for SSR/hydration)
  useEffect(() => {
    setLocale(initialLocale)
  }, [initialLocale])

  const t = (key: string, options?: { defaultValue?: string }): string => {
    const keys = key.split('.')
    let value: TranslationValue = translations[locale]

    for (const k of keys) {
      value = (value as { [key: string]: TranslationValue })?.[k]
    }

    // Always return a string for React components
    if (typeof value === 'string') {
      return value
    }
    return options?.defaultValue || key
  }

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    // Set cookie for persistence
    document.cookie = `aramac-liquor-locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`
  }

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use current locale
export function useCurrentLocale(): Locale {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useCurrentLocale must be used within I18nProviderClient')
  }
  return context.locale
}

// Hook to get translation function
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProviderClient')
  }
  return context.t
}

// Hook to change locale
export function useChangeLocale() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useChangeLocale must be used within I18nProviderClient')
  }
  return context.changeLocale
}

// Scoped i18n (same as useI18n for now)
export const useScopedI18n = useI18n

// Get direction for locale (for RTL support if needed)
export function getDirection(_locale: Locale): 'ltr' | 'rtl' {
  return 'ltr' // All supported locales are LTR
}

// Format currency based on locale
export function formatCurrency(amount: number, locale: Locale): string {
  if (locale === 'es') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Format date based on locale
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}