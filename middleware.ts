import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Divine Parsing Oracle - Advanced i18n Middleware
const divineParsingOracle = {
  // Primary language detection with environment-driven configuration
  detectLanguage: (request: NextRequest): string => {
    const acceptLanguage = request.headers.get('accept-language') || ''
    const userAgent = request.headers.get('user-agent') || ''
    const pathname = request.nextUrl.pathname

    // Check for explicit language in URL
    if (pathname.startsWith('/es') || pathname.startsWith('/en')) {
      return pathname.startsWith('/es') ? 'es' : 'en'
    }

    // Get client IP for geolocation-based detection
    const forwarded = request.headers.get('x-forwarded-for') || ''
    const realIP = request.headers.get('x-real-ip') || ''
    const clientIP = forwarded.split(',')[0]?.trim() || realIP || '127.0.0.1'

    // Use the enhanced Divine Language Oracle for intelligent detection
    // Import the function dynamically to avoid circular dependencies
    const { divineLanguageOracle } = require('./lib/i18n')

    return divineLanguageOracle.detectLocale(acceptLanguage, userAgent, clientIP)
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

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/myaccount(.*)',
  '/checkout(.*)',
  '/cart(.*)',
  '/orders(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Apply divine parsing oracle for i18n
  const detectedLanguage = divineParsingOracle.detectLanguage(req)

  // Handle locale routing
  const localeResponse = divineParsingOracle.createLocalizedResponse(req, detectedLanguage)
  if (localeResponse.status !== 200) {
    return localeResponse
  }

  // Apply Clerk middleware for protected routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    // Include API routes for Clerk
    '/(api|trpc)(.*)'
  ],
}