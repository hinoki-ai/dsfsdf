import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Launch browser for setup
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Wait for the application to be ready
    await page.goto(config.webServer?.url || 'http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    console.log('✅ Application is ready for E2E testing')

    // You could perform additional setup here like:
    // - Creating test users
    // - Seeding test data
    // - Setting up authentication states
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await context.close()
    await browser.close()
  }
}

export default globalSetup