// Performance Optimization Library for Liquor Store
// Comprehensive caching, monitoring, and optimization utilities

import { NextResponse, type NextRequest } from 'next/server'

// ===========================================
// CACHING STRATEGIES
// ===========================================

/**
 * Cache configuration for different content types
 */
export const CACHE_STRATEGIES = {
  // Static assets - cache for 1 year
  STATIC_ASSETS: {
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400, // 24 hours
    cacheControl: 'public, max-age=31536000, immutable',
  },
  
  // Product data - cache for 1 hour, revalidate in background
  PRODUCT_DATA: {
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 300, // 5 minutes
    cacheControl: 'public, max-age=3600, stale-while-revalidate=300',
  },
  
  // User-specific data - cache for 5 minutes
  USER_DATA: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60, // 1 minute
    cacheControl: 'private, max-age=300, stale-while-revalidate=60',
  },
  
  // API responses - cache for 15 minutes
  API_RESPONSES: {
    maxAge: 900, // 15 minutes
    staleWhileRevalidate: 300, // 5 minutes
    cacheControl: 'public, max-age=900, stale-while-revalidate=300',
  },
  
  // Search results - cache for 30 minutes
  SEARCH_RESULTS: {
    maxAge: 1800, // 30 minutes
    staleWhileRevalidate: 600, // 10 minutes
    cacheControl: 'public, max-age=1800, stale-while-revalidate=600',
  }
} as const

/**
 * Apply cache headers to response based on content type
 */
export function applyCacheHeaders(
  response: NextResponse,
  strategy: keyof typeof CACHE_STRATEGIES = 'API_RESPONSES'
): NextResponse {
  const config = CACHE_STRATEGIES[strategy]
  
  response.headers.set('Cache-Control', config.cacheControl)
  response.headers.set('X-Cache-Strategy', strategy)
  
  return response
}

/**
 * Create a cache key for storing/retrieving cached data
 */
export function createCacheKey(prefix: string, ...params: string[]): string {
  const key = `liquor:${prefix}:${params.join(':')}`
  return key.toLowerCase().replace(/[^a-z0-9:_-]/g, '_')
}

// ===========================================
// PERFORMANCE MONITORING
// ===========================================

/**
 * Performance metrics collection
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, PerformanceEntry[]> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  /**
   * Start timing a specific operation
   */
  startTiming(name: string): void {
    if (typeof window !== 'undefined' && performance?.mark) {
      performance.mark(`${name}_start`)
    }
  }
  
  /**
   * End timing and record the duration
   */
  endTiming(name: string): number {
    if (typeof window !== 'undefined' && performance?.mark && performance?.measure) {
      performance.mark(`${name}_end`)
      performance.measure(name, `${name}_start`, `${name}_end`)
      
      const entries = performance.getEntriesByName(name)
      const latest = entries[entries.length - 1]
      
      if (latest) {
        const duration = latest.duration
        this.recordMetric(name, duration)
        return duration
      }
    }
    return 0
  }
  
  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number, type: 'duration' | 'count' | 'size' = 'duration'): void {
    const entry = {
      name,
      value,
      type,
      timestamp: Date.now(),
      entryType: 'measure',
      startTime: performance?.now() || Date.now(),
      duration: type === 'duration' ? value : 0,
      toJSON: () => ({ name, value, type })
    } as PerformanceEntry & { value: number; type: string }
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const entries = this.metrics.get(name)!
    entries.push(entry)
    
    // Keep only last 100 entries
    if (entries.length > 100) {
      entries.shift()
    }
  }
  
  /**
   * Get performance statistics for a metric
   */
  getStats(name: string): {
    count: number
    avg: number
    min: number
    max: number
    p95: number
  } | null {
    const entries = this.metrics.get(name)
    if (!entries || entries.length === 0) return null
    
    const values = entries.map(e => (e as any).value || e.duration)
    const sorted = values.sort((a, b) => a - b)
    const count = values.length
    const sum = values.reduce((a, b) => a + b, 0)
    
    return {
      count,
      avg: sum / count,
      min: sorted[0],
      max: sorted[count - 1],
      p95: sorted[Math.floor(count * 0.95)] || sorted[count - 1]
    }
  }
  
  /**
   * Report Core Web Vitals
   */
  reportWebVitals(metric: {
    name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB'
    value: number
    delta: number
    id: string
  }): void {
    this.recordMetric(`webvital_${metric.name.toLowerCase()}`, metric.value)
    
    // Send to analytics if configured
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vital', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_id: metric.id }
      })
    }
  }
}

// ===========================================
// IMAGE OPTIMIZATION
// ===========================================

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  private static readonly CLOUDINARY_BASE = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`
    : null
  
  /**
   * Generate optimized image URL
   */
  static getOptimizedUrl(
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
      crop?: 'fill' | 'fit' | 'scale' | 'crop'
    } = {}
  ): string {
    const {
      width,
      height,
      quality = 80,
      format = 'auto',
      crop = 'fill'
    } = options
    
    // If Cloudinary is configured, use it
    if (this.CLOUDINARY_BASE && !src.startsWith('http')) {
      const transformations = []
      
      if (width || height) {
        transformations.push(`c_${crop}`)
        if (width) transformations.push(`w_${width}`)
        if (height) transformations.push(`h_${height}`)
      }
      
      transformations.push(`q_${quality}`)
      transformations.push(`f_${format}`)
      
      return `${this.CLOUDINARY_BASE}/image/upload/${transformations.join(',')}/v1/${src}`
    }
    
    // Fallback to Next.js image optimization
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    if (quality !== 80) params.set('q', quality.toString())
    
    const queryString = params.toString()
    return queryString ? `${src}?${queryString}` : src
  }
  
  /**
   * Generate responsive image sources
   */
  static getResponsiveSources(src: string, baseWidth: number) {
    const breakpoints = [480, 768, 1024, 1280, 1920]
    
    return breakpoints.map(width => ({
      srcSet: this.getOptimizedUrl(src, { width, quality: 80 }),
      media: `(max-width: ${width}px)`
    }))
  }
}

// ===========================================
// BUNDLE OPTIMIZATION
// ===========================================

/**
 * Dynamic import utilities for code splitting
 */
export class BundleOptimizer {
  private static loadedChunks = new Set<string>()
  
  /**
   * Lazy load a component with loading fallback
   */
  static async lazyLoad<T>(
    importFn: () => Promise<{ default: T }>,
    chunkName: string
  ): Promise<T> {
    if (this.loadedChunks.has(chunkName)) {
      const result = await importFn()
      return result.default
    }
    
    const perfMonitor = PerformanceMonitor.getInstance()
    perfMonitor.startTiming(`chunk_load_${chunkName}`)
    
    try {
      const result = await importFn()
      this.loadedChunks.add(chunkName)
      perfMonitor.endTiming(`chunk_load_${chunkName}`)
      return result.default
    } catch (error) {
      perfMonitor.recordMetric(`chunk_error_${chunkName}`, 1, 'count')
      throw error
    }
  }
  
  /**
   * Preload critical chunks
   */
  static preloadChunks(chunkNames: string[]): void {
    if (typeof window === 'undefined') return
    
    chunkNames.forEach(chunk => {
      const link = document.createElement('link')
      link.rel = 'modulepreload'
      link.href = `/_next/static/chunks/${chunk}.js`
      document.head.appendChild(link)
    })
  }
}

// ===========================================
// CLIENT-SIDE CACHING
// ===========================================

/**
 * Client-side cache implementation
 */
export class ClientCache {
  private static instance: ClientCache
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  static getInstance(): ClientCache {
    if (!ClientCache.instance) {
      ClientCache.instance = new ClientCache()
    }
    return ClientCache.instance
  }
  
  /**
   * Get cached data if still valid
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  /**
   * Set data in cache with TTL
   */
  set<T>(key: string, data: T, ttlMs: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }
  
  /**
   * Clear expired cache entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
  
  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }
}

// ===========================================
// PERFORMANCE HOOKS
// ===========================================

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance()
  
  return {
    startTiming: monitor.startTiming.bind(monitor),
    endTiming: monitor.endTiming.bind(monitor),
    recordMetric: monitor.recordMetric.bind(monitor),
    getStats: monitor.getStats.bind(monitor)
  }
}

/**
 * React hook for client-side caching
 */
export function useClientCache() {
  const cache = ClientCache.getInstance()
  
  return {
    get: cache.get.bind(cache),
    set: cache.set.bind(cache),
    clear: cache.clear.bind(cache)
  }
}

// ===========================================
// AUTOMATIC PERFORMANCE SETUP
// ===========================================

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return
  
  const monitor = PerformanceMonitor.getInstance()
  
  // Performance monitoring will be handled by analytics.ts
  // No additional web-vitals import needed
  
  // Cleanup cache every 5 minutes
  const cache = ClientCache.getInstance()
  setInterval(() => cache.cleanup(), 300000)
  
  // Report performance stats every minute
  setInterval(() => {
    const stats = monitor.getStats('page_load')
    if (stats && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_stats', {
        event_category: 'Performance',
        value: Math.round(stats.avg),
        custom_map: {
          p95: Math.round(stats.p95),
          count: stats.count
        }
      })
    }
  }, 60000)
}

// Export singleton instances for direct use
export const perfMonitor = PerformanceMonitor.getInstance()
export const clientCache = ClientCache.getInstance()