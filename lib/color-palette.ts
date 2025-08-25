/**
 * Centralized Color Palette Configuration
 * Single source of truth for all colors in the application
 * Ensures consistency, accessibility, and maintainability
 */

// Base brand colors inspired by premium spirits
export const BRAND_COLORS = {
  // Amber - Inspired by aged whiskey and fine wines
  amber: {
    50: '#FFFBF0',
    100: '#FFF7E0',
    200: '#FFEFC1',
    300: '#FFE7A3',
    400: '#FFDD85',
    500: '#FFD567',
    600: '#E6BF5A',
    700: '#CCAA4D',
    800: '#B39640',
    900: '#998233',
  },
  // Burgundy - Inspired by fine red wines and aged ports
  burgundy: {
    50: '#FCF2F5',
    100: '#F9E6EB',
    200: '#F3CCD7',
    300: '#EDB3C3',
    400: '#E799AF',
    500: '#E1809B',
    600: '#CA6C8B',
    700: '#B3577B',
    800: '#9C426B',
    900: '#852D5B',
  },
} as const

// Semantic color tokens for consistent usage across components
export const SEMANTIC_COLORS = {
  // Alcohol strength categories
  alcohol: {
    low: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    medium: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    high: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200',
    },
  },
  // Status indicators for regulatory compliance
  status: {
    allowed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: 'text-green-600',
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
    },
    required: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: 'text-blue-600',
    },
    restricted: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: 'text-red-600',
    },
  },
  // Product availability
  availability: {
    inStock: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
    },
    lowStock: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
    },
    outOfStock: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
    },
    featured: {
      bg: 'bg-amber-500',
      text: 'text-white',
      border: 'border-amber-600',
    },
  },
  // Age verification badges
  age: {
    verified: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
    },
    unverified: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    required: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
  },
} as const

// Glass morphism effects configuration
export const GLASS_EFFECTS = {
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.125)',
    backdrop: 'blur(16px) saturate(180%)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    backdrop: 'blur(20px) saturate(200%)',
  },
  strong: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.3)',
    backdrop: 'blur(24px) saturate(220%)',
  },
} as const

// Gradient combinations for premium feel
export const GRADIENTS = {
  primary: 'from-amber-500 via-red-500 to-burgundy-500',
  secondary: 'from-amber-400 to-red-400',
  accent: 'from-burgundy-400 to-purple-500',
  background: 'from-background via-background/95 to-background/90',
  glass: 'from-white/5 via-transparent to-white/5',
} as const

// Color utility functions
export const getAlcoholColorClasses = (abv: number) => {
  if (abv < 5) return SEMANTIC_COLORS.alcohol.low
  if (abv < 15) return SEMANTIC_COLORS.alcohol.medium
  return SEMANTIC_COLORS.alcohol.high
}

export const getStatusColorClasses = (status: keyof typeof SEMANTIC_COLORS.status) => {
  return SEMANTIC_COLORS.status[status]
}

export const getAvailabilityColorClasses = (status: keyof typeof SEMANTIC_COLORS.availability) => {
  return SEMANTIC_COLORS.availability[status]
}

export const getAgeVerificationColorClasses = (status: keyof typeof SEMANTIC_COLORS.age) => {
  return SEMANTIC_COLORS.age[status]
}

// Accessibility helpers
export const CONTRAST_REQUIREMENTS = {
  normal: 4.5,
  large: 3.0,
} as const

export type AlcoholStrength = 'low' | 'medium' | 'high'
export type StatusType = keyof typeof SEMANTIC_COLORS.status
export type AvailabilityType = keyof typeof SEMANTIC_COLORS.availability
export type AgeVerificationType = keyof typeof SEMANTIC_COLORS.age