import { MetadataRoute } from 'next'
import { sitemapConfig } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const { baseUrl, changeFrequency, priority } = sitemapConfig

  return [
    // Home pages
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.home,
      priority: priority.home,
      alternates: {
        languages: {
          es: `${baseUrl}/es`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.home,
      priority: priority.home,
      alternates: {
        languages: {
          es: `${baseUrl}/es`,
          en: `${baseUrl}/en`,
        },
      },
    },

    // Product category pages
    {
      url: `${baseUrl}/es/productos`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.categories,
      priority: priority.categories,
      alternates: {
        languages: {
          es: `${baseUrl}/es/productos`,
          en: `${baseUrl}/en/productos`,
        },
      },
    },
    {
      url: `${baseUrl}/en/productos`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.categories,
      priority: priority.categories,
      alternates: {
        languages: {
          es: `${baseUrl}/es/productos`,
          en: `${baseUrl}/en/productos`,
        },
      },
    },

    // Static pages
    {
      url: `${baseUrl}/es/politicas-privacidad`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.static,
      priority: priority.static,
      alternates: {
        languages: {
          es: `${baseUrl}/es/politicas-privacidad`,
          en: `${baseUrl}/en/privacy-policy`,
        },
      },
    },
    {
      url: `${baseUrl}/en/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.static,
      priority: priority.static,
      alternates: {
        languages: {
          es: `${baseUrl}/es/politicas-privacidad`,
          en: `${baseUrl}/en/privacy-policy`,
        },
      },
    },
    {
      url: `${baseUrl}/es/terminos-condiciones`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.static,
      priority: priority.static,
      alternates: {
        languages: {
          es: `${baseUrl}/es/terminos-condiciones`,
          en: `${baseUrl}/en/terms-conditions`,
        },
      },
    },
    {
      url: `${baseUrl}/en/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.static,
      priority: priority.static,
      alternates: {
        languages: {
          es: `${baseUrl}/es/terminos-condiciones`,
          en: `${baseUrl}/en/terms-conditions`,
        },
      },
    },

    // Shopping pages
    {
      url: `${baseUrl}/es/carrito`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.static,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/carrito`,
      lastModified: new Date(),
      changeFrequency: changeFrequency.static,
      priority: 0.3,
    },
    
    // TODO: Add dynamic product URLs
    // This would typically be generated from your product database
    // Example:
    // ...await getProductUrls(),
    
    // TODO: Add dynamic category URLs
    // Example:
    // ...await getCategoryUrls(),
  ]
}

// Helper functions for dynamic content (to be implemented with Convex)
/*
async function getProductUrls() {
  // Fetch products from Convex
  const products = await getAllProducts()
  
  return products.flatMap((product) => [
    {
      url: `${sitemapConfig.baseUrl}/es/productos/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: sitemapConfig.changeFrequency.products,
      priority: sitemapConfig.priority.products,
      alternates: {
        languages: {
          es: `${sitemapConfig.baseUrl}/es/productos/${product.slug}`,
          en: `${sitemapConfig.baseUrl}/en/productos/${product.slug}`,
        },
      },
    },
    {
      url: `${sitemapConfig.baseUrl}/en/productos/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: sitemapConfig.changeFrequency.products,
      priority: sitemapConfig.priority.products,
      alternates: {
        languages: {
          es: `${sitemapConfig.baseUrl}/es/productos/${product.slug}`,
          en: `${sitemapConfig.baseUrl}/en/productos/${product.slug}`,
        },
      },
    },
  ])
}

async function getCategoryUrls() {
  // Fetch categories from Convex
  const categories = await getAllCategories()
  
  return categories.flatMap((category) => [
    {
      url: `${sitemapConfig.baseUrl}/es/productos/categoria/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency.categories,
      priority: sitemapConfig.priority.categories,
      alternates: {
        languages: {
          es: `${sitemapConfig.baseUrl}/es/productos/categoria/${category.slug}`,
          en: `${sitemapConfig.baseUrl}/en/productos/category/${category.slug}`,
        },
      },
    },
    {
      url: `${sitemapConfig.baseUrl}/en/productos/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency.categories,
      priority: sitemapConfig.priority.categories,
      alternates: {
        languages: {
          es: `${sitemapConfig.baseUrl}/es/productos/categoria/${category.slug}`,
          en: `${sitemapConfig.baseUrl}/en/productos/category/${category.slug}`,
        },
      },
    },
  ])
}
*/