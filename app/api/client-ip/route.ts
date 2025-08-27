import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get client IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfIP = request.headers.get('cf-connecting-ip')
    
    let clientIP = 'unknown'
    
    if (forwarded) {
      clientIP = forwarded.split(',')[0].trim()
    } else if (realIP) {
      clientIP = realIP
    } else if (cfIP) {
      clientIP = cfIP
    }
    
    return NextResponse.json({ 
      ip: clientIP,
      headers: {
        'x-forwarded-for': forwarded,
        'x-real-ip': realIP,
        'cf-connecting-ip': cfIP
      }
    })
    
  } catch (error) {
    console.error('IP detection error:', error)
    return NextResponse.json({ 
      ip: 'unknown',
      error: 'Failed to detect IP'
    }, { status: 500 })
  }
}