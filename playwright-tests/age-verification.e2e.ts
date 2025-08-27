import { test, expect } from '@playwright/test'

test.describe('Age Verification Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state
    await page.evaluate(() => localStorage.clear())
  })

  test('should display age verification modal on page load', async ({ page }) => {
    await page.goto('/es')
    
    // Should show age verification modal
    await expect(page.locator('[data-testid="age-verification-modal"]').or(page.getByText('Verificación de Edad'))).toBeVisible()
    
    // Should have required form elements
    await expect(page.getByLabel('Fecha de Nacimiento')).toBeVisible()
    await expect(page.getByRole('button', { name: /verificar edad/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /cancelar/i })).toBeVisible()
  })

  test('should show error for empty birth date', async ({ page }) => {
    await page.goto('/es')
    
    // Click verify without entering birth date
    await page.getByRole('button', { name: /verificar edad/i }).click()
    
    // Should show error message
    await expect(page.getByText('Por favor ingresa tu fecha de nacimiento')).toBeVisible()
  })

  test('should reject underage users', async ({ page }) => {
    await page.goto('/es')
    
    // Enter birth date for 17-year-old
    const underageDate = new Date()
    underageDate.setFullYear(underageDate.getFullYear() - 17)
    const dateString = underageDate.toISOString().split('T')[0]
    
    await page.getByLabel('Fecha de Nacimiento').fill(dateString)
    await page.getByRole('button', { name: /verificar edad/i }).click()
    
    // Should show age error
    await expect(page.getByText(/Debes tener al menos 18 años/)).toBeVisible()
  })

  test('should accept adult users and hide modal', async ({ page }) => {
    await page.goto('/es')
    
    // Enter birth date for 25-year-old
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]
    
    await page.getByLabel('Fecha de Nacimiento').fill(dateString)
    await page.getByRole('button', { name: /verificar edad/i }).click()
    
    // Modal should disappear
    await expect(page.getByText('Verificación de Edad')).not.toBeVisible({ timeout: 5000 })
    
    // Should be able to see main page content
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should remember verification in localStorage', async ({ page }) => {
    await page.goto('/es')
    
    // Complete age verification
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]
    
    await page.getByLabel('Fecha de Nacimiento').fill(dateString)
    await page.getByRole('button', { name: /verificar edad/i }).click()
    
    // Wait for modal to disappear
    await expect(page.getByText('Verificación de Edad')).not.toBeVisible({ timeout: 5000 })
    
    // Reload page
    await page.reload()
    
    // Age verification modal should not appear
    await expect(page.getByText('Verificación de Edad')).not.toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should handle cancel button correctly', async ({ page }) => {
    await page.goto('/es')
    
    // Click cancel button
    await page.getByRole('button', { name: /cancelar/i }).click()
    
    // Should redirect away or show rejection message
    // This depends on your implementation - adjust accordingly
    await expect(page.url()).not.toContain('/productos')
  })

  test('should show loading state during verification', async ({ page }) => {
    await page.goto('/es')
    
    // Enter valid birth date
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]
    
    await page.getByLabel('Fecha de Nacimiento').fill(dateString)
    
    // Click verify and immediately check for loading state
    await page.getByRole('button', { name: /verificar edad/i }).click()
    
    // Should show loading indicator (spinner or "Verificando..." text)
    await expect(page.getByText('Verificando...')).toBeVisible()
  })

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/es')
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Fecha de Nacimiento')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /verificar edad/i })).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /cancelar/i })).toBeFocused()
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/es')
    
    // Age verification should still be visible and functional
    await expect(page.getByText('Verificación de Edad')).toBeVisible()
    
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]
    
    await page.getByLabel('Fecha de Nacimiento').fill(dateString)
    await page.getByRole('button', { name: /verificar edad/i }).click()
    
    await expect(page.getByText('Verificación de Edad')).not.toBeVisible({ timeout: 5000 })
  })

  test('should handle network failures gracefully', async ({ page }) => {
    // Simulate network failure for API calls
    await page.route('**/api/compliance/age-verification', (route) => {
      route.abort('failed')
    })
    
    await page.goto('/es')
    
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]
    
    await page.getByLabel('Fecha de Nacimiento').fill(dateString)
    await page.getByRole('button', { name: /verificar edad/i }).click()
    
    // Should still work even if API call fails
    await expect(page.getByText('Verificación de Edad')).not.toBeVisible({ timeout: 5000 })
  })
})

test.describe('Age Verification - Different Languages', () => {
  test('should work in English', async ({ page }) => {
    await page.goto('/en')
    
    // Should show age verification in English
    await expect(page.getByText('Age Verification')).toBeVisible()
    await expect(page.getByLabel(/birth date/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /verify age/i })).toBeVisible()
  })

  test('should maintain language after age verification', async ({ page }) => {
    await page.goto('/en')
    
    // Complete age verification in English
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]
    
    await page.getByLabel(/birth date/i).fill(dateString)
    await page.getByRole('button', { name: /verify age/i }).click()
    
    await expect(page.getByText('Age Verification')).not.toBeVisible({ timeout: 5000 })
    
    // Should remain on English version of the site
    expect(page.url()).toContain('/en')
  })
})