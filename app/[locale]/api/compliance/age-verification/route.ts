import { NextRequest, NextResponse } from 'next/server'

interface AgeVerificationData {
  birthDate?: string
  verificationMethod: 'birthdate' | 'id_document' | 'declined'
  ipAddress?: string
  userAgent?: string
  timestamp: number
  sessionId: string
  success: boolean
}

export async function POST(request: NextRequest) {
  try {
    const data: AgeVerificationData = await request.json()
    
    // Log to console for now (in production, log to database)
    console.log('Age Verification Attempt:', {
      method: data.verificationMethod,
      success: data.success,
      timestamp: new Date(data.timestamp).toISOString(),
      sessionId: data.sessionId,
      ip: data.ipAddress
    })
    
    // In production, store in PostgreSQL compliance table
    // await storeComplianceData(data)
    
    return NextResponse.json({ 
      success: true, 
      logged: true,
      compliance: 'Law 19.925 - Age Verification Required'
    })
    
  } catch (error) {
    console.error('Age verification logging error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to log verification' 
    }, { status: 500 })
  }
}