import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  try {
    // Perform cleanup operations
    console.log('🧹 Cleaning up after E2E tests...')
    
    // You could perform cleanup here like:
    // - Cleaning test data
    // - Resetting database state
    // - Closing external services
    
    console.log('✅ Global teardown completed')
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
  }
}

export default globalTeardown