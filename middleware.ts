import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

// Protected routes configuration - simplified based on working projects
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/carrito(.*)',
  '/checkout(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url)
  const pathname = url.pathname

  // PERFORMANCE: Early return for static assets and public routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/api/health') ||
    pathname === '/' ||
    pathname.startsWith('/productos') ||
    pathname.startsWith('/es/') ||
    pathname.startsWith('/en/')
  ) {
    return
  }

  // DEVELOPMENT MODE: Handle authentication gracefully
  // Based on Parking project pattern - comment out for development
  try {
    if (isProtectedRoute(req)) {
      // Only protect routes if Clerk is properly configured
      if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
          process.env.CLERK_SECRET_KEY &&
          process.env.CLERK_SECRET_KEY !== 'sk_test_placeholder') {
        await auth.protect()
      }
      // If Clerk not configured, just log and continue
      else {
        console.warn('Clerk not configured, skipping authentication for:', pathname)
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    // Continue without authentication rather than failing
  }

  // LOGGING: Minimal logging for production
  console.warn(`Middleware processed: ${pathname}`)
})

export const config = {
  matcher: [
    // PATTERN: Exclude Next.js internals and static files
    // Based on working Minimarket project pattern
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // PATTERN: Always match API routes
    '/(api|trpc)(.*)',
  ],
}