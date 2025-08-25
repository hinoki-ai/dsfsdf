import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Divine Parsing Oracle - Advanced i18n Middleware
const divineParsingOracle = {
  // Primary language detection with Chilean Spanish preference
  detectLanguage: (request: NextRequest): string => {
    const acceptLanguage = request.headers.get('accept-language') || ''
    const userAgent = request.headers.get('user-agent') || ''
    const pathname = request.nextUrl.pathname

    // Check for explicit language in URL
    if (pathname.startsWith('/es') || pathname.startsWith('/en')) {
      return pathname.startsWith('/es') ? 'es' : 'en'
    }

    // Chilean IP detection (simplified for demo)
    const forwarded = request.headers.get('x-forwarded-for') || ''
    const isChileanIP = forwarded.includes('190.196.') || forwarded.includes('200.29.')

    // Chilean Spanish as default for Chilean users
    if (isChileanIP || acceptLanguage.includes('es-CL')) {
      return 'es'
    }

    // Browser language detection with Spanish preference
    if (acceptLanguage.includes('es')) {
      return 'es'
    }

    return 'en'
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