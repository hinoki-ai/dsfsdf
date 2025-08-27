import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ClerkProvider } from '@clerk/nextjs'

// Mock Clerk for testing
const mockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="mock-clerk-provider">
      {children}
    </div>
  )
}

// Test wrapper component
const TestWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  )
}

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestWrapper, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: 'user_test123',
  emailAddress: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  ...overrides,
})

export const createMockProduct = (overrides = {}) => ({
  id: 'product_123',
  name: 'Test Whisky',
  description: 'A premium test whisky for testing purposes',
  price: 50000,
  category: 'Whisky',
  brand: 'Test Brand',
  images: ['https://example.com/whisky.jpg'],
  availability: true,
  sku: 'TEST-WHISKY-001',
  stock: 10,
  ...overrides,
})

export const createMockOrder = (overrides = {}) => ({
  id: 'order_456',
  userId: 'user_test123',
  items: [createMockProduct()],
  total: 50000,
  status: 'pending' as const,
  createdAt: new Date().toISOString(),
  ...overrides,
})

// Test data generators
export const generateTestProducts = (count: number = 5) => {
  return Array.from({ length: count }, (_, i) => createMockProduct({
    id: `product_${i + 1}`,
    name: `Test Product ${i + 1}`,
    price: (i + 1) * 10000,
    sku: `TEST-PROD-00${i + 1}`,
  }))
}

// Mock localStorage helpers
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    get store() {
      return { ...store }
    },
  }
}

// Mock fetch responses
export const mockFetchResponse = (data: any, ok = true, status = 200) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
  })
}

// Age verification test helpers
export const getAdultBirthDate = (yearsOld = 25) => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - yearsOld)
  return date.toISOString().split('T')[0]
}

export const getUnderageBirthDate = (yearsOld = 17) => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - yearsOld)
  return date.toISOString().split('T')[0]
}

// Chilean region test data
export const createMockRegion = (overrides = {}) => ({
  code: 'RM',
  name: 'Metropolitana',
  deliveryAllowed: true,
  restrictions: [],
  ...overrides,
})

// Wait for async operations
export const waitFor = (condition: () => boolean, timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = () => {
      if (condition()) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Condition not met within ${timeout}ms`))
      } else {
        setTimeout(check, 100)
      }
    }
    
    check()
  })
}

// Form testing helpers
export const fillForm = async (form: HTMLFormElement, data: Record<string, string>) => {
  const { fireEvent } = await import('@testing-library/react')
  
  Object.entries(data).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (input) {
      fireEvent.change(input, { target: { value } })
    }
  })
}

// Error boundary test helper
export const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error for error boundary')
  }
  return <div>No error</div>
}

// Performance testing helpers
export const mockPerformanceObserver = () => {
  const callbacks: Array<(entries: any[]) => void> = []
  
  return {
    PerformanceObserver: jest.fn().mockImplementation((callback) => {
      callbacks.push(callback)
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      }
    }),
    triggerObserver: (entries: any[]) => {
      callbacks.forEach(callback => callback(entries))
    },
  }
}

// Analytics testing helpers
export const mockAnalytics = () => ({
  trackPageView: jest.fn(),
  trackEvent: jest.fn(),
  trackPurchase: jest.fn(),
  trackAddToCart: jest.fn(),
  trackRemoveFromCart: jest.fn(),
  trackBeginCheckout: jest.fn(),
  trackAgeVerification: jest.fn(),
  trackEngagement: jest.fn(),
})

// SEO testing helpers
export const mockNextSEO = () => ({
  generateBaseMetadata: jest.fn(),
  generateProductMetadata: jest.fn(),
  generateCategoryMetadata: jest.fn(),
})

// Internationalization testing helpers
export const mockI18n = (locale = 'es') => ({
  t: jest.fn((key: string, fallback?: string) => fallback || key),
  locale,
  changeLanguage: jest.fn(),
  getResourceBundle: jest.fn(),
})

// Accessibility testing helpers
export const checkA11y = async (container: HTMLElement) => {
  const { axe } = await import('jest-axe')
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Network testing helpers
export const mockNetworkFailure = () => {
  return Promise.reject(new Error('Network error'))
}

export const mockNetworkSuccess = (data: any) => {
  return mockFetchResponse(data, true, 200)
}

// Time travel for testing
export const mockDate = (date: string | Date) => {
  const mockDate = new Date(date)
  const originalDate = Date
  
  global.Date = jest.fn(() => mockDate) as any
  global.Date.now = jest.fn(() => mockDate.getTime())
  global.Date.UTC = originalDate.UTC
  global.Date.parse = originalDate.parse
  global.Date.prototype = originalDate.prototype
  
  return () => {
    global.Date = originalDate
  }
}

export default {
  render: customRender,
  createMockUser,
  createMockProduct,
  createMockOrder,
  generateTestProducts,
  mockLocalStorage,
  mockFetchResponse,
  getAdultBirthDate,
  getUnderageBirthDate,
  createMockRegion,
  waitFor,
  fillForm,
  ThrowError,
  mockPerformanceObserver,
  mockAnalytics,
  mockNextSEO,
  mockI18n,
  checkA11y,
  mockNetworkFailure,
  mockNetworkSuccess,
  mockDate,
}