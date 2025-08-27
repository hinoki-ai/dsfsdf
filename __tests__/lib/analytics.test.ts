import { GoogleAnalytics, PerformanceTracker, ErrorTracker, BusinessMetrics } from '@/lib/analytics'

// Mock window and global objects
const mockWindow = {
  gtag: jest.fn(),
  dataLayer: [],
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  location: { href: 'https://test.com' },
  document: { title: 'Test Page' },
  navigator: { userAgent: 'Test Agent' },
}

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
})

Object.defineProperty(global, 'document', {
  value: {
    createElement: jest.fn(() => ({
      src: '',
      async: false,
    })),
    head: {
      appendChild: jest.fn(),
    },
    title: 'Test Page',
    addEventListener: jest.fn(),
    visibilityState: 'visible',
  },
  writable: true,
})

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => 1000),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => [{ duration: 100 }]),
  },
  writable: true,
})

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}))

describe('GoogleAnalytics', () => {
  let analytics: GoogleAnalytics

  beforeEach(() => {
    analytics = GoogleAnalytics.getInstance()
    jest.clearAllMocks()
  })

  it('should be a singleton', () => {
    const analytics2 = GoogleAnalytics.getInstance()
    expect(analytics).toBe(analytics2)
  })

  it('should initialize with tracking ID', () => {
    const trackingId = 'GA_TEST_123'
    analytics.initialize(trackingId)

    expect(document.createElement).toHaveBeenCalledWith('script')
    expect(mockWindow.gtag).toHaveBeenCalledWith('js', expect.any(Date))
    expect(mockWindow.gtag).toHaveBeenCalledWith('config', trackingId, expect.any(Object))
  })

  it('should not initialize twice', () => {
    const trackingId = 'GA_TEST_123'
    analytics.initialize(trackingId)
    analytics.initialize(trackingId)

    // Should only create one script tag
    expect(document.createElement).toHaveBeenCalledTimes(1)
  })

  it('should track page views', () => {
    analytics.initialize('GA_TEST_123')
    analytics.trackPageView('/test-page', 'Test Page')

    expect(mockWindow.gtag).toHaveBeenCalledWith('config', 'GA_TEST_123', {
      page_path: '/test-page',
      page_title: 'Test Page',
      page_location: 'https://test.com',
    })
  })

  it('should track purchase events', () => {
    analytics.initialize('GA_TEST_123')
    
    const items = [{
      item_id: 'whisky-123',
      item_name: 'Premium Whisky',
      category: 'Whisky',
      quantity: 1,
      price: 50000,
    }]

    analytics.trackPurchase('order-123', items, 50000, 'CLP')

    expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'purchase', {
      transaction_id: 'order-123',
      value: 50000,
      currency: 'CLP',
      items,
    })
  })

  it('should track add to cart events', () => {
    analytics.initialize('GA_TEST_123')
    
    const item = {
      item_id: 'vodka-456',
      item_name: 'Premium Vodka',
      category: 'Vodka',
      quantity: 2,
      price: 30000,
    }

    analytics.trackAddToCart(item)

    expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'add_to_cart', {
      currency: 'CLP',
      value: 60000, // price * quantity
      items: [item],
    })
  })

  it('should track age verification', () => {
    analytics.initialize('GA_TEST_123')
    
    analytics.trackAgeVerification(true, 'birthdate')

    expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'age_verification', {
      event_category: 'Compliance',
      event_label: 'birthdate',
      value: 1,
      custom_map: {
        verification_method: 'birthdate',
        success: true,
        law_compliance: 'Law_19925_Chile',
      },
    })
  })

  it('should track custom events', () => {
    analytics.initialize('GA_TEST_123')
    
    analytics.trackEvent('custom_event', { custom_parameter: 'test_value' })

    expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'custom_event', {
      custom_parameter: 'test_value',
    })
  })
})

describe('PerformanceTracker', () => {
  let tracker: PerformanceTracker

  beforeEach(() => {
    tracker = PerformanceTracker.getInstance()
    jest.clearAllMocks()
  })

  it('should be a singleton', () => {
    const tracker2 = PerformanceTracker.getInstance()
    expect(tracker).toBe(tracker2)
  })

  it('should start and end timing measurements', () => {
    tracker.startTiming('test_operation')
    expect(performance.mark).toHaveBeenCalledWith('test_operation_start')

    tracker.endTiming('test_operation')
    expect(performance.mark).toHaveBeenCalledWith('test_operation_end')
    expect(performance.measure).toHaveBeenCalledWith('test_operation', 'test_operation_start', 'test_operation_end')
  })

  it('should record custom metrics', () => {
    tracker.recordMetric('custom_metric', 150)
    
    const stats = tracker.getMetricStats('custom_metric')
    expect(stats).toEqual({
      count: 1,
      avg: 150,
      min: 150,
      max: 150,
      p50: 150,
      p95: 150,
    })
  })

  it('should calculate statistics correctly', () => {
    // Add multiple metrics
    tracker.recordMetric('test_metric', 100)
    tracker.recordMetric('test_metric', 200)
    tracker.recordMetric('test_metric', 300)
    tracker.recordMetric('test_metric', 400)
    tracker.recordMetric('test_metric', 500)

    const stats = tracker.getMetricStats('test_metric')
    expect(stats).toEqual({
      count: 5,
      avg: 300,
      min: 100,
      max: 500,
      p50: 300,
      p95: 500,
    })
  })

  it('should limit metric storage to 100 entries', () => {
    // Add 150 metrics
    for (let i = 1; i <= 150; i++) {
      tracker.recordMetric('large_metric', i)
    }

    const stats = tracker.getMetricStats('large_metric')
    expect(stats?.count).toBe(100)
    expect(stats?.min).toBe(51) // Should have discarded first 50 entries
  })

  it('should return null for unknown metrics', () => {
    const stats = tracker.getMetricStats('unknown_metric')
    expect(stats).toBeNull()
  })
})

describe('ErrorTracker', () => {
  let tracker: ErrorTracker

  beforeEach(() => {
    tracker = ErrorTracker.getInstance()
    jest.clearAllMocks()
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be a singleton', () => {
    const tracker2 = ErrorTracker.getInstance()
    expect(tracker).toBe(tracker2)
  })

  it('should track errors', () => {
    const error = {
      type: 'javascript_error',
      message: 'Test error',
      filename: 'test.js',
      lineno: 10,
      colno: 5,
      stack: 'Error stack trace',
    }

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    tracker.trackError(error)

    expect(consoleSpy).toHaveBeenCalledWith('Error tracked:', error)
    consoleSpy.mockRestore()
  })

  it('should send errors to API in production', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const error = {
      type: 'test_error',
      message: 'Production error',
    }

    tracker.trackError(error)

    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(fetch).toHaveBeenCalledWith('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"message":"Production error"'),
    })

    process.env.NODE_ENV = originalEnv
  })
})

describe('BusinessMetrics', () => {
  let metrics: BusinessMetrics

  beforeEach(() => {
    metrics = BusinessMetrics.getInstance()
    jest.clearAllMocks()
  })

  it('should be a singleton', () => {
    const metrics2 = BusinessMetrics.getInstance()
    expect(metrics).toBe(metrics2)
  })

  it('should track age verification attempts', () => {
    const analyticsSpy = jest.spyOn(GoogleAnalytics.getInstance(), 'trackEvent')
    GoogleAnalytics.getInstance().initialize('GA_TEST_123')

    metrics.trackAgeVerificationAttempt(true, 'birthdate', 'RM')

    expect(analyticsSpy).toHaveBeenCalledWith('age_verification_attempt', {
      event_category: 'Compliance',
      event_label: 'birthdate',
      value: 1,
      custom_map: {
        success: true,
        method: 'birthdate',
        region: 'RM',
        compliance_law: 'Chilean_Law_19925',
      },
    })
  })

  it('should track product views', () => {
    const analyticsSpy = jest.spyOn(GoogleAnalytics.getInstance(), 'trackEvent')
    GoogleAnalytics.getInstance().initialize('GA_TEST_123')

    metrics.trackProductView('whisky-123', 'Premium Whisky', 'Whisky', 75000)

    expect(analyticsSpy).toHaveBeenCalledWith('view_item', {
      currency: 'CLP',
      value: 75000,
      items: [{
        item_id: 'whisky-123',
        item_name: 'Premium Whisky',
        item_category: 'Whisky',
        price: 75000,
        quantity: 1,
      }],
    })
  })

  it('should track search behavior', () => {
    const analyticsSpy = jest.spyOn(GoogleAnalytics.getInstance(), 'trackEvent')
    GoogleAnalytics.getInstance().initialize('GA_TEST_123')

    metrics.trackSearch('whisky premium', 15)

    expect(analyticsSpy).toHaveBeenCalledWith('search', {
      search_term: 'whisky premium',
      event_category: 'Search',
      event_label: 'whisky premium',
      value: 15,
    })
  })

  it('should track conversion funnel', () => {
    const analyticsSpy = jest.spyOn(GoogleAnalytics.getInstance(), 'trackEvent')
    GoogleAnalytics.getInstance().initialize('GA_TEST_123')

    metrics.trackFunnelStep('add_to_cart', 1)

    expect(analyticsSpy).toHaveBeenCalledWith('conversion_funnel', {
      event_category: 'Conversion',
      event_label: 'add_to_cart',
      value: 1,
    })
  })

  it('should track regional delivery checks', () => {
    const analyticsSpy = jest.spyOn(GoogleAnalytics.getInstance(), 'trackEvent')
    GoogleAnalytics.getInstance().initialize('GA_TEST_123')

    metrics.trackRegionalDelivery('XI', false)

    expect(analyticsSpy).toHaveBeenCalledWith('regional_delivery_check', {
      event_category: 'Delivery',
      event_label: 'XI',
      value: 0,
      custom_map: {
        region: 'XI',
        delivery_allowed: false,
        country: 'Chile',
      },
    })
  })
})