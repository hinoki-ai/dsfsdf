'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { type Locale, translations, type TranslationValue } from '@/lib/i18n'

// i18n Context
interface I18nContextType {
  locale: Locale
  t: (key: string, options?: { defaultValue?: string }) => string
  changeLocale: (newLocale: Locale) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Provider component that manages locale state
export function I18nProviderClient({ children, locale: initialLocale }: { children: React.ReactNode, locale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  // Update locale when initialLocale changes (for SSR/hydration)
  useEffect(() => {
    setLocale(initialLocale)
  }, [initialLocale])

  const t = (key: string, options?: { defaultValue?: string }): string => {
    const keys = key.split('.')
    let value: TranslationValue = translations[locale]

    for (const k of keys) {
      value = (value as { [key: string]: TranslationValue })?.[k]
    }

    // Always return a string for React components
    if (typeof value === 'string') {
      return value
    }
    return options?.defaultValue || key
  }

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    // Set cookie for persistence
    document.cookie = `aramac-liquor-locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`
  }

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

interface I18nProviderProps {
  locale: Locale
  children: React.ReactNode
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  )
}

// Hook to use current locale
export function useCurrentLocale(): Locale {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useCurrentLocale must be used within I18nProviderClient')
  }
  return context.locale
}

// Hook to get translation function
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProviderClient')
  }
  return context.t
}

// Hook to change locale
export function useChangeLocale() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useChangeLocale must be used within I18nProviderClient')
  }
  return context.changeLocale
}