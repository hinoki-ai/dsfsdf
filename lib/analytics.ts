// Analytics and Monitoring Library for Liquor Store
// Comprehensive tracking, metrics, and performance monitoring

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// ===========================================
// GOOGLE ANALYTICS INTEGRATION
// ===========================================

export class GoogleAnalytics {
  private static instance: GoogleAnalytics
  private isInitialized = false
  private trackingId: string | null = null

  static getInstance(): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics()
    }
    return GoogleAnalytics.instance
  }

  initialize(trackingId: string) {
    if (this.isInitialized || typeof window === 'undefined') return

    this.trackingId = trackingId
    
    // Load Google Analytics
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    script.async = true
    document.head.appendChild(script)

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }

    window.gtag('js', new Date())
    window.gtag('config', trackingId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    })

    this.isInitialized = true
  }

  // Page view tracking
  trackPageView(path: string, title?: string) {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('config', this.trackingId, {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href
    })
  }

  // E-commerce events
  trackPurchase(transactionId: string, items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>, value: number, currency = 'CLP') {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items
    })
  }

  trackAddToCart(item: {
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }, currency = 'CLP') {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'add_to_cart', {
      currency: currency,
      value: item.price * item.quantity,
      items: [item]
    })
  }

  trackRemoveFromCart(item: {
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }, currency = 'CLP') {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'remove_from_cart', {
      currency: currency,
      value: item.price * item.quantity,
      items: [item]
    })
  }

  trackBeginCheckout(items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>, value: number, currency = 'CLP') {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'begin_checkout', {
      currency: currency,
      value: value,
      items: items
    })
  }

  // Age verification compliance tracking
  trackAgeVerification(success: boolean, method: 'birthdate' | 'id_document' | 'declined') {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'age_verification', {
      event_category: 'Compliance',
      event_label: method,
      value: success ? 1 : 0,
      custom_map: {
        verification_method: method,
        success: success,
        law_compliance: 'Law_19925_Chile'
      }
    })
  }

  // Custom events
  trackEvent(eventName: string, parameters: { [key: string]: any }) {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', eventName, parameters)
  }

  // User engagement
  trackEngagement(engagementTime: number) {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'user_engagement', {
      engagement_time_msec: engagementTime
    })
  }
}

// ===========================================
// PERFORMANCE MONITORING
// ===========================================

export class PerformanceTracker {
  private static instance: PerformanceTracker
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker()
    }
    return PerformanceTracker.instance
  }

  // Track Core Web Vitals
  trackWebVitals() {
    if (typeof window === 'undefined') return

    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number }
      
      this.recordMetric('LCP', lastEntry.startTime)
      GoogleAnalytics.getInstance().trackEvent('web_vital', {
        event_category: 'Performance',
        event_label: 'LCP',
        value: Math.round(lastEntry.startTime),
        non_interaction: true
      })
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Track First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as (PerformanceEntry & { processingStart: number; startTime: number })[]
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime
        this.recordMetric('FID', fid)
        GoogleAnalytics.getInstance().trackEvent('web_vital', {
          event_category: 'Performance',
          event_label: 'FID',
          value: Math.round(fid),
          non_interaction: true
        })
      })
    }).observe({ entryTypes: ['first-input'] })

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      this.recordMetric('CLS', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })

    // Report CLS when page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        GoogleAnalytics.getInstance().trackEvent('web_vital', {
          event_category: 'Performance',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
          non_interaction: true
        })
      }
    })
  }

  // Track custom performance metrics
  startTiming(name: string) {
    if (typeof window === 'undefined') return
    performance.mark(`${name}_start`)
  }

  endTiming(name: string) {
    if (typeof window === 'undefined') return
    
    performance.mark(`${name}_end`)
    performance.measure(name, `${name}_start`, `${name}_end`)
    
    const entries = performance.getEntriesByName(name)
    const latest = entries[entries.length - 1]
    
    if (latest) {
      this.recordMetric(name, latest.duration)
      
      // Track significant performance events
      GoogleAnalytics.getInstance().trackEvent('performance_timing', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(latest.duration),
        non_interaction: true
      })
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const metrics = this.metrics.get(name)!
    metrics.push(value)
    
    // Keep only last 100 entries
    if (metrics.length > 100) {
      metrics.shift()
    }
  }

  getMetricStats(name: string) {
    const metrics = this.metrics.get(name)
    if (!metrics || metrics.length === 0) return null

    const sorted = [...metrics].sort((a, b) => a - b)
    const count = sorted.length
    const sum = sorted.reduce((a, b) => a + b, 0)

    return {
      count,
      avg: sum / count,
      min: sorted[0],
      max: sorted[count - 1],
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)]
    }
  }
}

// ===========================================
// ERROR TRACKING
// ===========================================

export class ErrorTracker {
  private static instance: ErrorTracker

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  initialize() {
    if (typeof window === 'undefined') return

    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack
      })
    })
  }

  trackError(error: {
    type: string
    message: string
    filename?: string
    lineno?: number
    colno?: number
    stack?: string
    userId?: string
  }) {
    console.error('Error tracked:', error)

    // Send to Google Analytics
    GoogleAnalytics.getInstance().trackEvent('exception', {
      description: `${error.type}: ${error.message}`,
      fatal: false,
      custom_map: {
        error_type: error.type,
        filename: error.filename,
        line: error.lineno,
        column: error.colno
      }
    })

    // In production, also send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(error)
    }
  }

  private async sendToErrorService(error: any) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...error,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (err) {
      console.error('Failed to send error to service:', err)
    }
  }
}

// ===========================================
// BUSINESS METRICS
// ===========================================

export class BusinessMetrics {
  private static instance: BusinessMetrics

  static getInstance(): BusinessMetrics {
    if (!BusinessMetrics.instance) {
      BusinessMetrics.instance = new BusinessMetrics()
    }
    return BusinessMetrics.instance
  }

  // Track age verification compliance
  trackAgeVerificationAttempt(success: boolean, method: string, region?: string) {
    GoogleAnalytics.getInstance().trackEvent('age_verification_attempt', {
      event_category: 'Compliance',
      event_label: method,
      value: success ? 1 : 0,
      custom_map: {
        success: success,
        method: method,
        region: region,
        compliance_law: 'Chilean_Law_19925'
      }
    })
  }

  // Track product interactions
  trackProductView(productId: string, productName: string, category: string, price: number) {
    GoogleAnalytics.getInstance().trackEvent('view_item', {
      currency: 'CLP',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
        quantity: 1
      }]
    })
  }

  // Track search behavior
  trackSearch(searchTerm: string, resultsCount: number) {
    GoogleAnalytics.getInstance().trackEvent('search', {
      search_term: searchTerm,
      event_category: 'Search',
      event_label: searchTerm,
      value: resultsCount
    })
  }

  // Track conversion funnel
  trackFunnelStep(step: 'view_products' | 'add_to_cart' | 'begin_checkout' | 'purchase', value?: number) {
    GoogleAnalytics.getInstance().trackEvent('conversion_funnel', {
      event_category: 'Conversion',
      event_label: step,
      value: value || 1
    })
  }

  // Track Chilean specific metrics
  trackRegionalDelivery(region: string, allowed: boolean) {
    GoogleAnalytics.getInstance().trackEvent('regional_delivery_check', {
      event_category: 'Delivery',
      event_label: region,
      value: allowed ? 1 : 0,
      custom_map: {
        region: region,
        delivery_allowed: allowed,
        country: 'Chile'
      }
    })
  }
}

// ===========================================
// INITIALIZATION FUNCTIONS
// ===========================================

export function initializeAnalytics() {
  if (typeof window === 'undefined') return

  const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID
  if (trackingId) {
    GoogleAnalytics.getInstance().initialize(trackingId)
  }

  PerformanceTracker.getInstance().trackWebVitals()
  ErrorTracker.getInstance().initialize()
}

// Export singleton instances
export const analytics = GoogleAnalytics.getInstance()
export const performanceTracker = PerformanceTracker.getInstance()
export const errors = ErrorTracker.getInstance()
export const business = BusinessMetrics.getInstance()

// Convenience function for tracking page views
export function trackPageView(path: string, title?: string) {
  analytics.trackPageView(path, title)
}

// Convenience function for tracking custom events
export function trackEvent(eventName: string, parameters: { [key: string]: any }) {
  analytics.trackEvent(eventName, parameters)
}