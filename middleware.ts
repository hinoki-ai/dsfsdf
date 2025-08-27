import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported locales configuration
const SUPPORTED_LOCALES = ['es', 'en'] as const
const DEFAULT_LOCALE = 'es'

// Protected routes configuration
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/dashboard(.*)',
  '/myaccount(.*)',
  '/checkout(.*)',
  '/carrito(.*)',
  '/orders(.*)',
  '/:locale/admin(.*)',
  '/:locale/dashboard(.*)',
  '/:locale/myaccount(.*)',
  '/:locale/checkout(.*)',
  '/:locale/carrito(.*)',
  '/:locale/orders(.*)'
])

// Safe language detection with error handling
function detectLanguage(request: NextRequest): string {
  try {
    const pathname = request.nextUrl.pathname
    const acceptLanguage = request.headers.get('accept-language') || ''

    // Check for explicit language in URL first
    for (const locale of SUPPORTED_LOCALES) {
      if (pathname.startsWith(`/${locale}`)) {
        return locale
      }
    }

    // Simple browser language detection
    if (acceptLanguage.includes('es') || acceptLanguage.includes('es-CL')) {
      return 'es'
    }
    
    if (acceptLanguage.includes('en')) {
      return 'en'
    }

    // Default to Chilean Spanish
    return DEFAULT_LOCALE
  } catch (error) {
    console.error('Language detection error:', error)
    return DEFAULT_LOCALE
  }
}

// Safe locale routing with loop prevention
function createLocalizedResponse(request: NextRequest, locale: string): NextResponse {
  try {
    const pathname = request.nextUrl.pathname
    const url = request.nextUrl.clone()

    // Skip routes that should not be localized
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/robots.txt') ||
      pathname.startsWith('/sitemap.xml') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // If already localized with correct locale, continue
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return NextResponse.next()
    }

    // If localized with different locale, continue (let it be handled by the page)
    for (const supportedLocale of SUPPORTED_LOCALES) {
      if (pathname.startsWith(`/${supportedLocale}/`) || pathname === `/${supportedLocale}`) {
        return NextResponse.next()
      }
    }

    // Handle root path
    if (pathname === '/') {
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }

    // Handle legacy redirects BEFORE adding locale
    const legacyRedirects: Record<string, string> = {
      '/products': '/productos',
      '/contact': '/contacto'
    }

    // Check for legacy redirects
    for (const [oldPath, newPath] of Object.entries(legacyRedirects)) {
      if (pathname.startsWith(oldPath)) {
        const remainingPath = pathname.replace(oldPath, '')
        url.pathname = `/${locale}${newPath}${remainingPath}`
        return NextResponse.redirect(url)
      }
    }

    // Add locale prefix to path
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)

  } catch (error) {
    console.error('Locale routing error:', error)
    return NextResponse.next()
  }
}

export default clerkMiddleware(async (auth, request) => {
  try {
    // Handle i18n routing first
    const detectedLanguage = detectLanguage(request)
    const localeResponse = createLocalizedResponse(request, detectedLanguage)
    
    // If we need to redirect for localization, do it now
    if (localeResponse.status !== 200) {
      return localeResponse
    }

    // Apply authentication to protected routes
    if (isProtectedRoute(request)) {
      await auth.protect()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Return a minimal response to prevent 500 errors
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Match all paths except static files and specifically excluded routes
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}