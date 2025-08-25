import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProviderWrapper } from '@/components/clerk-provider'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { PerformanceMonitor, ResourceHints } from '@/components/performance-monitor'
import { generateSEOMetadata } from '@/components/seo-meta'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateSEOMetadata({
  title: 'Licorería ARAMAC - Vinos, Cervezas y Destilados Premium en Chile',
  description: 'Tu licorería de confianza en Chile. Amplia selección de vinos, cervezas, destilados y pisco. Entrega a domicilio con verificación de edad. Cumplimiento estricto de la Ley 19.925.',
  keywords: ['licorería chile', 'vinos chile', 'cerveza chile', 'pisco chile', 'destilados', 'whisky chile', 'licores premium', 'entrega domicilio', 'venta alcohol chile', 'licorería online'],
  locale: 'es',
  type: 'website'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <ResourceHints />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#d97706" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ClerkProviderWrapper>
            <ConvexClientProvider>
              {children}
              <PerformanceMonitor />
            </ConvexClientProvider>
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}