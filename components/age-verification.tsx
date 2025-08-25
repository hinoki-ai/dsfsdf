"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { calculateAge, isOldEnough } from "@/lib/utils"
import { divineTranslationOracle, defaultLocale } from "@/lib/i18n"
import {
  AlertCircle,
  CheckCircle,
  Shield,
  Calendar,
  Clock,
  Globe,
  AlertTriangle
} from "lucide-react"

interface AgeVerificationProps {
  onVerified: (dateOfBirth: Date) => void
  onRejected: () => void
  minimumAge?: number
}

export function AgeVerification({
  onVerified,
  onRejected,
  minimumAge = 18
}: AgeVerificationProps) {
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    if (!dateOfBirth) {
      setError("Por favor ingresa tu fecha de nacimiento")
      return
    }

    const birthDate = new Date(dateOfBirth)
    if (isNaN(birthDate.getTime())) {
      setError("Fecha de nacimiento inválida")
      return
    }

    setIsVerifying(true)
    setError("")

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const age = calculateAge(birthDate)

    if (isOldEnough(birthDate, minimumAge)) {
      onVerified(birthDate)
    } else {
      setError(`Debes tener al menos ${minimumAge} años para comprar productos alcoholicos. Tu edad actual: ${age} años.`)
      onRejected()
    }

    setIsVerifying(false)
  }

  // Get translations using divine parsing oracle
  const t = (key: string, fallback?: string) =>
    divineTranslationOracle.getTranslation(defaultLocale, key, fallback)

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
                <span>{t('ageVerification.legalNotice', 'Esta verificación es requerida por la ley chilena para la venta de bebidas alcoholicas.')}</span>
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