import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Divine Parsing Oracle - Advanced i18n Middleware
const divineParsingOracle = {
  // Primary language detection with environment-driven configuration
  detectLanguage: (request: NextRequest): string => {
    const acceptLanguage = request.headers.get('accept-language') || ''
    const pathname = request.nextUrl.pathname

    // Check for explicit language in URL
    if (pathname.startsWith('/es') || pathname.startsWith('/en')) {
      return pathname.startsWith('/es') ? 'es' : 'en'
    }

    // Simple language detection from Accept-Language header
    // Default to Spanish (es) for Chilean market
    if (acceptLanguage.includes('es') || acceptLanguage.includes('es-CL')) {
      return 'es'
    }
    
    if (acceptLanguage.includes('en')) {
      return 'en'
    }

    // Default to Spanish for Chilean market
    return 'es'
  },

  // Advanced locale routing with SEO optimization
  createLocalizedResponse: (request: NextRequest, locale: string): NextResponse => {
    const pathname = request.nextUrl.pathname

    // Skip API routes, static files, and already localized paths
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.') ||
      pathname.startsWith(`/${locale}`)
    ) {
      return NextResponse.next()
    }

    // Redirect to localized path for root
    if (pathname === '/') {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }

    // Add locale to path
    const localizedPath = `/${locale}${pathname}`
    return NextResponse.redirect(new URL(localizedPath, request.url))
  }
}

export default function middleware(req: NextRequest) {
  // Apply divine parsing oracle for i18n
  const detectedLanguage = divineParsingOracle.detectLanguage(req)

  // Handle locale routing
  const localeResponse = divineParsingOracle.createLocalizedResponse(req, detectedLanguage)
  if (localeResponse.status !== 200) {
    return localeResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    // Include API routes for Clerk
    '/(api|trpc)(.*)'
  ],
}