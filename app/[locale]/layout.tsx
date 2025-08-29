import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ClerkProviderWrapper } from '@/components/clerk-provider'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { PerformanceMonitor, ResourceHints } from '@/components/performance-monitor'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { generateSEOMetadata } from '@/components/seo-meta'
import { locales, type Locale } from '@/lib/i18n'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }))
}

// Dynamic metadata based on locale
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const currentLocale = locale as Locale
  const isSpanish = currentLocale === 'es'

  const metadataBase = new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://liquor.aramac.dev')

  return {
    ...generateSEOMetadata({
      title: isSpanish
        ? 'Licorería ARAMAC - Vinos, Cervezas y Destilados Premium en Chile'
        : 'Licorería ARAMAC - Premium Wines, Beers and Spirits in Chile',
      description: isSpanish
        ? 'Tu licorería de confianza en Chile. Amplia selección de vinos, cervezas, destilados y pisco. Entrega a domicilio con verificación de edad. Cumplimiento estricto de la Ley 19.925.'
        : 'Your trusted liquor store in Chile. Wide selection of wines, beers, spirits and pisco. Home delivery with age verification. Strict compliance with Law 19.925.',
      keywords: isSpanish
        ? ['licorería chile', 'vinos chile', 'cerveza chile', 'pisco chile', 'destilados', 'whisky chile', 'licores premium', 'entrega domicilio', 'venta alcohol chile', 'licorería online']
        : ['liquor store chile', 'wines chile', 'beer chile', 'pisco chile', 'spirits', 'whisky chile', 'premium liquor', 'home delivery', 'alcohol sales chile', 'online liquor store'],
      locale: currentLocale,
      type: 'website'
    }),
    metadataBase,
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const currentLocale = locale as Locale

  return (
    <html lang={currentLocale} dir="ltr" className="dark">
      <head>
        <ResourceHints />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#d97706" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <I18nProvider locale={currentLocale}>
          <ThemeProvider>
            <ClerkProviderWrapper>
              <ConvexClientProvider>
                {children}
                <PerformanceMonitor />
              </ConvexClientProvider>
            </ClerkProviderWrapper>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}