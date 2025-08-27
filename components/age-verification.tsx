'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { divineTranslationOracle, defaultLocale, type Locale } from "@/lib/i18n"
import {
  AlertCircle,
  CheckCircle,
  Shield,
  Calendar,
  Clock,
  Globe,
  AlertTriangle,
  X
} from "lucide-react"

// ===========================================
// CHILEAN COMPLIANCE TYPES & CONSTANTS
// ===========================================

interface AgeVerificationData {
  birthDate?: string
  verificationMethod: 'birthdate' | 'id_document' | 'declined'
  ipAddress?: string
  userAgent?: string
  timestamp: number
  sessionId: string
}

interface ChileanRegion {
  code: string
  name: string
  deliveryAllowed: boolean
  restrictions?: string[]
}

const CHILEAN_REGIONS: ChileanRegion[] = [
  { code: 'XV', name: 'Arica y Parinacota', deliveryAllowed: true },
  { code: 'I', name: 'Tarapacá', deliveryAllowed: true },
  { code: 'II', name: 'Antofagasta', deliveryAllowed: true },
  { code: 'III', name: 'Atacama', deliveryAllowed: true },
  { code: 'IV', name: 'Coquimbo', deliveryAllowed: true },
  { code: 'V', name: 'Valparaíso', deliveryAllowed: true },
  { code: 'RM', name: 'Metropolitana', deliveryAllowed: true },
  { code: 'VI', name: 'O\'Higgins', deliveryAllowed: true },
  { code: 'VII', name: 'Maule', deliveryAllowed: true },
  { code: 'XVI', name: 'Ñuble', deliveryAllowed: true },
  { code: 'VIII', name: 'Biobío', deliveryAllowed: true },
  { code: 'IX', name: 'Araucanía', deliveryAllowed: true },
  { code: 'XIV', name: 'Los Ríos', deliveryAllowed: true },
  { code: 'X', name: 'Los Lagos', deliveryAllowed: true },
  { code: 'XI', name: 'Aysén', deliveryAllowed: false, restrictions: ['Remote area delivery restrictions'] },
  { code: 'XII', name: 'Magallanes', deliveryAllowed: false, restrictions: ['Remote area delivery restrictions'] }
]

const MINIMUM_AGE = 18
const STORAGE_KEY = 'liquor_age_verification'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Age verification utilities
const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

const isOldEnough = (birthDate: Date, minimumAge: number = MINIMUM_AGE): boolean => {
  return calculateAge(birthDate) >= minimumAge
}

// ===========================================
// ENHANCED AGE VERIFICATION COMPONENT
// ===========================================

interface AgeVerificationProps {
  onVerified: (dateOfBirth: Date) => void
  onRejected: () => void
  minimumAge?: number
  locale?: Locale
  showRegionalInfo?: boolean
  strictMode?: boolean
}

export function AgeVerification({
  onVerified,
  onRejected,
  minimumAge = MINIMUM_AGE,
  locale = defaultLocale,
  showRegionalInfo = true,
  strictMode = true
}: AgeVerificationProps) {
  const [step, setStep] = useState<'welcome' | 'verify' | 'regional'>('welcome')
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // Check existing verification on mount
  useEffect(() => {
    checkExistingVerification()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkExistingVerification = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: AgeVerificationData = JSON.parse(stored)
        const now = Date.now()
        
        // Check if verification is still valid (24 hours)
        if (now - data.timestamp < SESSION_DURATION && data.birthDate) {
          const birthDate = new Date(data.birthDate)
          if (isOldEnough(birthDate, minimumAge)) {
            onVerified(birthDate)
            return
          }
        }
        
        // Clean expired verification
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Error checking age verification:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const handleVerify = async () => {
    if (!dateOfBirth) {
      setError(t('ageVerification.errors.birthdateRequired', 'Por favor ingresa tu fecha de nacimiento'))
      return
    }

    const birthDate = new Date(dateOfBirth)
    if (isNaN(birthDate.getTime())) {
      setError(t('ageVerification.errors.invalidDate', 'Fecha de nacimiento inválida'))
      return
    }

    setIsVerifying(true)
    setError("")

    // Simulate verification delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    const age = calculateAge(birthDate)

    if (!isOldEnough(birthDate, minimumAge)) {
      setAttempts(prev => prev + 1)
      setError(
        t('ageVerification.errors.underAge', 
          `Debes tener al menos ${minimumAge} años para comprar productos alcohólicos. Tu edad actual: ${age} años.`
        )
      )
      
      // Log failed verification attempt (for compliance)
      await logVerificationAttempt({
        birthDate: dateOfBirth,
        verificationMethod: 'birthdate',
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: generateSessionId()
      }, false)

      if (attempts >= 2 || strictMode) {
        setTimeout(() => {
          onRejected()
        }, 2000)
      }
      
      setIsVerifying(false)
      return
    }

    // Successful verification
    const verificationData: AgeVerificationData = {
      birthDate: dateOfBirth,
      verificationMethod: 'birthdate',
      ipAddress: await getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: generateSessionId()
    }

    // Store verification (privacy-focused - will auto-expire)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verificationData))
    
    // Log successful verification (for compliance)
    await logVerificationAttempt(verificationData, true)

    if (showRegionalInfo && !selectedRegion) {
      setStep('regional')
    } else {
      onVerified(birthDate)
    }

    setIsVerifying(false)
  }

  const handleRegionalSelection = () => {
    if (!selectedRegion) {
      setError(t('ageVerification.errors.regionRequired', 'Selecciona tu región'))
      return
    }

    const region = CHILEAN_REGIONS.find(r => r.code === selectedRegion)
    if (region && !region.deliveryAllowed) {
      setError(t('ageVerification.errors.regionRestricted', 'Tu región tiene restricciones de entrega'))
      return
    }

    if (dateOfBirth) {
      onVerified(new Date(dateOfBirth))
    }
  }

  const handleDecline = async () => {
    // Log declined verification (for compliance)
    await logVerificationAttempt({
      verificationMethod: 'declined',
      ipAddress: await getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: generateSessionId()
    }, false)

    onRejected()
  }

  // Utility functions
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('/api/client-ip')
      const data = await response.json()
      return data.ip || 'unknown'
    } catch {
      return 'unknown'
    }
  }

  const generateSessionId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  const logVerificationAttempt = async (data: AgeVerificationData, success: boolean) => {
    try {
      await fetch('/api/compliance/age-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, success })
      })
    } catch (error) {
      console.error('Failed to log verification attempt:', error)
    }
  }

  // Get translations using divine parsing oracle
  const t = (key: string, fallback?: string) =>
    divineTranslationOracle.getTranslation(locale, key, fallback)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md glass-effect border-white/20 shadow-premium">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-2xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-shadow">
            {t('ageVerification.title', 'Verificación de Edad')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('ageVerification.description', 'Para comprar productos alcoholicos, debes tener al menos')} {minimumAge} {t('ageVerification.descriptionSuffix', 'años según la ley chilena.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Premium Info Cards */}
          <div className="grid grid-cols-1 gap-3">
            <div className="glass-effect rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{t('ageVerification.legal.title', 'Cumplimiento Legal')}</div>
                  <div className="text-xs text-muted-foreground">{t('ageVerification.legal.description', 'Ley 19.925 de Bebidas Alcohólicas')}</div>
                </div>
              </div>
            </div>
            <div className="glass-effect rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{t('ageVerification.privacy.title', 'Privacidad Protegida')}</div>
                  <div className="text-xs text-muted-foreground">{t('ageVerification.privacy.description', 'Tus datos se eliminan automáticamente')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('ageVerification.birthDate', 'Fecha de Nacimiento')}
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`glass-effect border-white/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all ${
                  error ? "border-status-restricted-border bg-status-restricted-bg" : ""
                }`}
                placeholder={t('ageVerification.birthDatePlaceholder', 'Selecciona tu fecha de nacimiento')}
              />
            </div>

            {error && (
              <div className="glass-effect rounded-lg p-4 border border-status-restricted-border bg-status-restricted-bg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-status-restricted-text flex-shrink-0" />
                  <div className="text-status-restricted-text text-sm">{error}</div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                className="flex-1 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
              >
                {isVerifying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('ageVerification.verifying', 'Verificando...')}
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {t('ageVerification.verify', 'Verificar Edad')}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onRejected}
                disabled={isVerifying}
                className="glass-effect border-white/20 hover:bg-white/10 px-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                {t('ageVerification.cancel', 'Cancelar')}
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                <span>{t('ageVerification.legalNotice', 'Esta verificación es requerida por la ley chilena para la venta de bebidas alcohólicas.')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-3 h-3" />
                <span>{t('ageVerification.privacyNotice', 'Tus datos están protegidos y se procesan de forma segura.')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AgeVerifiedBadgeProps {
  className?: string
}

export function AgeVerifiedBadge({ className }: AgeVerifiedBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1 text-sm text-green-600 ${className}`}>
      <CheckCircle className="h-4 w-4" />
      Edad Verificada
    </div>
  )
}