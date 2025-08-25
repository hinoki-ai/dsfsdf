"use client"

import { useEffect } from "react"

interface PerformanceMetrics {
  FCP?: number
  LCP?: number
  FID?: number
  CLS?: number
  TTFB?: number
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Web Vitals monitoring
    const observeWebVitals = () => {
      const metrics: PerformanceMetrics = {}

      // First Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                metrics.FCP = entry.startTime
                console.log(`FCP: ${entry.startTime.toFixed(2)}ms`)
              }
            }
          })
          observer.observe({ type: 'paint', buffered: true })

          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            metrics.LCP = lastEntry.startTime
            console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`)
          })
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

          // Cumulative Layout Shift
          let clsValue = 0
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value
              }
            }
            metrics.CLS = clsValue
            console.log(`CLS: ${clsValue.toFixed(4)}`)
          })
          clsObserver.observe({ type: 'layout-shift', buffered: true })

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              metrics.FID = (entry as any).processingStart - entry.startTime
              console.log(`FID: ${((entry as any).processingStart - entry.startTime).toFixed(2)}ms`)
            }
          })
          fidObserver.observe({ type: 'first-input', buffered: true })

          // Time to First Byte
          if ('navigation' in performance) {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            metrics.TTFB = navigation.responseStart - navigation.requestStart
            console.log(`TTFB: ${metrics.TTFB.toFixed(2)}ms`)
          }

          // Send metrics to analytics after page is fully loaded
          window.addEventListener('beforeunload', () => {
            if (navigator.sendBeacon && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
              navigator.sendBeacon(
                process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
                JSON.stringify({
                  type: 'web-vitals',
                  url: window.location.href,
                  metrics,
                  timestamp: Date.now(),
                  userAgent: navigator.userAgent
                })
              )
            }
          })

        } catch (error) {
          console.warn('Performance monitoring failed:', error)
        }
      }
    }

    // Start monitoring after a short delay
    const timer = setTimeout(observeWebVitals, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  // Component doesn't render anything
  return null
}

// Resource hints component for performance optimization
export function ResourceHints() {
  return (
    <>
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//clerk.aramac.dev" />
      <link rel="dns-prefetch" href="//convex.cloud" />
      
      {/* Preconnect for critical resources */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Prefetch critical assets */}
      <link rel="prefetch" href="/images/logo.png" />
      <link rel="prefetch" href="/images/hero-background.jpg" />
    </>
  )
}