import type { NextRequest } from 'next/server'

// Simple bypass middleware when Clerk is not configured
export default function bypassMiddleware(request: NextRequest) {
  console.log('Using bypass middleware - Clerk disabled')
  return
}