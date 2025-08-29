import { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  // Bypass all authentication - Clerk not configured
  console.log('Bypass middleware - authentication disabled')
  return
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}