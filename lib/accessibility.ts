/**
 * Accessibility Utilities for Color Contrast Validation
 * Ensures all color combinations meet WCAG 2.1 guidelines
 */

// WCAG 2.1 contrast ratio requirements
export const CONTRAST_REQUIREMENTS = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
} as const

// Color definitions with their approximate luminance values
export const COLOR_LUMINANCE = {
  // Status colors
  status: {
    allowed: { bg: 0.95, text: 0.25 }, // green-100 / green-800
    warning: { bg: 0.95, text: 0.45 }, // yellow-100 / yellow-800
    required: { bg: 0.95, text: 0.25 }, // blue-100 / blue-800
    restricted: { bg: 0.95, text: 0.25 }, // red-100 / red-800
  },
  // Alcohol categories
  alcohol: {
    low: { bg: 0.95, text: 0.25 }, // amber-100 / amber-800
    medium: { bg: 0.95, text: 0.25 }, // red-100 / red-800
    high: { bg: 0.95, text: 0.25 }, // purple-100 / purple-800
  },
} as const

/**
 * Calculate the contrast ratio between two colors
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @returns Contrast ratio (1-21)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // Convert hex to RGB
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 1

  // Calculate relative luminance
  const l1 = calculateRelativeLuminance(rgb1)
  const l2 = calculateRelativeLuminance(rgb2)

  // Return contrast ratio
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Calculate relative luminance according to WCAG guidelines
 */
function calculateRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb

  // Convert to linear RGB
  const toLinear = (val: number) => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  }

  const rLinear = toLinear(r)
  const gLinear = toLinear(g)
  const bLinear = toLinear(b)

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

/**
 * Validate if a color combination meets WCAG guidelines
 */
export function validateContrast(
  background: string,
  foreground: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(background, foreground)
  const requirement = CONTRAST_REQUIREMENTS[level][isLargeText ? 'large' : 'normal']
  return ratio >= requirement
}

/**
 * Get accessibility status for a color combination
 */
export function getAccessibilityStatus(
  background: string,
  foreground: string,
  isLargeText: boolean = false
): 'pass' | 'fail' | 'conditional' {
  const aaRatio = calculateContrastRatio(background, foreground)
  const aaaRatio = calculateContrastRatio(background, foreground)

  const aaRequirement = CONTRAST_REQUIREMENTS.AA[isLargeText ? 'large' : 'normal']
  const aaaRequirement = CONTRAST_REQUIREMENTS.AAA[isLargeText ? 'large' : 'normal']

  if (aaaRatio >= aaaRequirement) return 'pass'
  if (aaRatio >= aaRequirement) return 'conditional'
  return 'fail'
}

/**
 * Generate accessibility report for all semantic color combinations
 */
export function generateAccessibilityReport(): Array<{
  combination: string
  contrastRatio: number
  aaCompliance: boolean
  aaaCompliance: boolean
  recommendation: string
}> {
  const combinations = [
    { name: 'Status Allowed', bg: '#f0fdf4', fg: '#166534' }, // green-100 / green-800
    { name: 'Status Warning', bg: '#fffbeb', fg: '#92400e' }, // yellow-100 / yellow-800
    { name: 'Status Required', bg: '#eff6ff', fg: '#1e40af' }, // blue-100 / blue-800
    { name: 'Status Restricted', bg: '#fef2f2', fg: '#991b1b' }, // red-100 / red-800
    { name: 'Alcohol Low', bg: '#fffbeb', fg: '#92400e' }, // amber-100 / amber-800
    { name: 'Alcohol Medium', bg: '#fef2f2', fg: '#991b1b' }, // red-100 / red-800
    { name: 'Alcohol High', bg: '#faf5ff', fg: '#6b21a8' }, // purple-100 / purple-800
  ]

  return combinations.map(({ name, bg, fg }) => {
    const contrastRatio = calculateContrastRatio(bg, fg)
    const aaCompliance = contrastRatio >= CONTRAST_REQUIREMENTS.AA.normal
    const aaaCompliance = contrastRatio >= CONTRAST_REQUIREMENTS.AAA.normal

    let recommendation = ''
    if (!aaCompliance) {
      recommendation = 'Increase contrast - this combination fails WCAG AA standards'
    } else if (!aaaCompliance) {
      recommendation = 'Consider increasing contrast for better accessibility (WCAG AAA)'
    } else {
      recommendation = 'Excellent contrast ratio - meets WCAG AAA standards'
    }

    return {
      combination: name,
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      aaCompliance,
      aaaCompliance,
      recommendation
    }
  })
}

/**
 * Validate semantic color combinations defined in our system
 */
export function validateSemanticColors(): {
  allPass: boolean
  issues: Array<{
    combination: string
    issue: string
    suggestion: string
  }>
} {
  const report = generateAccessibilityReport()
  const issues = report
    .filter(item => !item.aaCompliance)
    .map(item => ({
      combination: item.combination,
      issue: `Contrast ratio ${item.contrastRatio}:1 is below WCAG AA requirement`,
      suggestion: 'Consider using darker text or lighter background colors'
    }))

  return {
    allPass: issues.length === 0,
    issues
  }
}