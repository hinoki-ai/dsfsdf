'use client'

// Monitoring Initialization for Liquor Store
// Sets up analytics, performance tracking, and error monitoring

import { initializeAnalytics } from '@/lib/analytics'

/**
 * Initialize all monitoring systems
 * Call this in your root layout or main app component
 */
export function initializeMonitoring() {
  if (typeof window === 'undefined') return

  // Initialize analytics and tracking
  initializeAnalytics()

  // Initialize performance optimizations
  initializePerformance()

  // Log successful initialization
  console.log('✅ Monitoring systems initialized')
}

/**
 * Initialize performance optimizations
 */
function initializePerformance() {
  // Enable performance observer for long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.duration > 50) { // Log tasks longer than 50ms
            import('@/lib/analytics').then(({ performanceTracker }) => {
              performanceTracker.recordMetric('long_task', entry.duration)
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['longtask'] })
    } catch (error) {
      console.warn('Long task monitoring not available:', error)
    }
  }

  // Memory monitoring (if available)
  if ('memory' in performance) {
    setInterval(() => {
      const memory = (performance as any).memory
      if (memory) {
        import('@/lib/analytics').then(({ performanceTracker }) => {
          performanceTracker.recordMetric('memory_used', memory.usedJSHeapSize)
          performanceTracker.recordMetric('memory_total', memory.totalJSHeapSize)
          performanceTracker.recordMetric('memory_limit', memory.jsHeapSizeLimit)
        })
      }
    }, 30000) // Check every 30 seconds
  }
}

/**
 * Track page performance for SPA navigation
 */
export function trackPagePerformance(path: string) {
  if (typeof window === 'undefined') return

  import('@/lib/analytics').then(({ performanceTracker, analytics }) => {
    // Track page view
    analytics.trackPageView(path)
    
    // Start timing for page load
    performanceTracker.startTiming(`page_${path}`)
    
    // End timing when page is fully loaded
    if (document.readyState === 'complete') {
      performanceTracker.endTiming(`page_${path}`)
    } else {
      window.addEventListener('load', () => {
        performanceTracker.endTiming(`page_${path}`)
      })
    }
  })
}

/**
 * Track user engagement
 */
export function trackEngagement() {
  if (typeof window === 'undefined') return

  let startTime = Date.now()
  let isActive = true

  const trackEngagementTime = () => {
    if (isActive) {
      const engagementTime = Date.now() - startTime
      import('@/lib/analytics').then(({ analytics }) => {
        analytics.trackEngagement(engagementTime)
      })
    }
    startTime = Date.now()
  }

  // Track engagement on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      isActive = false
      trackEngagementTime()
    } else {
      isActive = true
      startTime = Date.now()
    }
  })

  // Track engagement before page unload
  window.addEventListener('beforeunload', trackEngagementTime)

  // Track engagement every 30 seconds
  setInterval(() => {
    if (isActive) {
      trackEngagementTime()
    }
  }, 30000)
}