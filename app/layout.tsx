import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProviderWrapper } from '@/components/clerk-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Licorería ARAMAC',
  description: 'Tu tienda online de licores y bebidas alcoholicas en Chile',
  keywords: ['licoreria', 'alcohol', 'vinos', 'cervezas', 'bebidas', 'chile'],
  authors: [{ name: 'ARAMAC' }],
  creator: 'ARAMAC',
  publisher: 'ARAMAC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://liquor.aramac.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Licorería ARAMAC',
    description: 'Tu tienda online de licores y bebidas alcoholicas en Chile',
    url: 'https://liquor.aramac.dev',
    siteName: 'Licorería ARAMAC',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Licorería ARAMAC',
    description: 'Tu tienda online de licores y bebidas alcoholicas en Chile',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClerkProviderWrapper>
          {children}
        </ClerkProviderWrapper>
      </body>
    </html>
  )
}