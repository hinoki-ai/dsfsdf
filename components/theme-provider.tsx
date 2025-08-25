'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'liquor-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    // Always enforce dark theme for consistent branding
    const root = window.document.documentElement
    root.classList.remove('light')
    root.classList.add('dark')

    // Store theme preference (but always apply dark theme)
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme && storedTheme !== 'dark') {
      localStorage.setItem(storageKey, 'dark')
    }

    setTheme('dark')
  }, [storageKey])

  const value = {
    theme: 'dark' as Theme, // Always dark theme for consistency
    setTheme: (newTheme: Theme) => {
      // Only allow dark theme for consistent branding experience
      if (newTheme === 'dark') {
        const root = window.document.documentElement
        root.classList.remove('light')
        root.classList.add('dark')
        localStorage.setItem(storageKey, 'dark')
        setTheme('dark')
      }
      // Silently ignore light theme requests to maintain consistency
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}