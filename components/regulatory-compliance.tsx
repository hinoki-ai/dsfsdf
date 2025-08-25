"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface DeliveryRestriction {
  type: "region" | "time" | "quantity" | "age" | "signature"
  title: string
  description: string
  status: "allowed" | "restricted" | "warning" | "required"
  details?: string
}

interface Product {
  _id: string
  name: string
  alcoholData?: {
    abv: number
  }
  regulatoryInfo?: {
    restrictions?: {
      maxQuantity?: number
      restrictedRegions?: string[]
    }
  }
}

interface CartItem {
  productId: string
  quantity: number
}

interface RegulatoryComplianceProps {
  shippingAddress: {
    street: string
    city: string
    region: string
    postalCode: string
  }
  cartItems: CartItem[]
  products: Record<string, Product>
  deliveryTime?: string
  onComplianceCheck: (isCompliant: boolean, restrictions: DeliveryRestriction[]) => void
}

export function RegulatoryCompliance({
  shippingAddress,
  cartItems,
  products,
  deliveryTime,
  onComplianceCheck,
}: RegulatoryComplianceProps) {
  const [restrictions, setRestrictions] = useState<DeliveryRestriction[]>([])
  const [isChecking, setIsChecking] = useState(true)

  // Chilean alcohol delivery regulations
  const RESTRICTED_REGIONS = useMemo(() => [
    "Región de Magallanes y la Antártica Chilena",
    "Región de Aysén del General Carlos Ibáñez del Campo",
    "Región de Arica y Parinacota",
    "Región de Tarapacá",
  ], [])

  const HIGH_RISK_HOURS = useMemo(() => [22, 23, 0, 1, 2, 3, 4, 5, 6], []) // Late night/early morning

  const checkCompliance = useCallback(() => {
    setIsChecking(true)
    const newRestrictions: DeliveryRestriction[] = []

    // 1. Check regional restrictions
    if (RESTRICTED_REGIONS.includes(shippingAddress.region)) {
      newRestrictions.push({
        type: "region",
        title: "Región Restringida",
        description: "La entrega de alcohol está restringida en esta región",
        status: "restricted",
        details: "Según la ley chilena, no se permite la entrega de bebidas alcoholicas en esta zona."
      })
    }

    // 2. Check delivery time restrictions
    if (deliveryTime) {
      const hour = parseInt(deliveryTime.split(":")[0])
      if (HIGH_RISK_HOURS.includes(hour)) {
        newRestrictions.push({
          type: "time",
          title: "Horario de Entrega Restringido",
          description: "Entrega programada en horario nocturno",
          status: "warning",
          details: "Se recomienda programar la entrega en horario diurno para mayor seguridad."
        })
      }
    }

    // 3. Check quantity limits
    let totalQuantity = 0
    let hasHighABV = false
    let quantityExceeded = false

    cartItems.forEach(item => {
      const product = products[item.productId]
      if (product) {
        totalQuantity += item.quantity

        // Check individual product limits
        if (product.regulatoryInfo?.restrictions?.maxQuantity &&
            item.quantity > product.regulatoryInfo.restrictions.maxQuantity) {
          quantityExceeded = true
          newRestrictions.push({
            type: "quantity",
            title: "Límite de Cantidad Excedido",
            description: `${product.name}: máximo ${product.regulatoryInfo.restrictions.maxQuantity} unidades`,
            status: "restricted",
            details: "Este producto tiene restricciones de cantidad por regulación sanitaria."
          })
        }

        // Check for high ABV products
        if (product.alcoholData && product.alcoholData.abv > 25) {
          hasHighABV = true
        }
      }
    })

    // General quantity limits
    if (totalQuantity > 12) {
      newRestrictions.push({
        type: "quantity",
        title: "Límite Total de Productos",
        description: "Máximo 12 productos alcoholicos por pedido",
        status: "restricted",
        details: "Esta limitación está establecida por la legislación chilena para venta responsable."
      })
    }

    // 4. Age verification requirement
    if (hasHighABV || totalQuantity > 6) {
      newRestrictions.push({
        type: "age",
        title: "Verificación de Edad Requerida",
        description: "Se requiere verificación adicional de edad",
        status: "required",
        details: "Para productos de alta graduación o pedidos grandes, se requiere verificación de edad."
      })
    }

    // 5. Adult signature requirement
    if (hasHighABV || quantityExceeded) {
      newRestrictions.push({
        type: "signature",
        title: "Firma de Adulto Requerida",
        description: "La entrega requiere firma de persona mayor de edad",
        status: "required",
        details: "Por ley chilena, productos de alta graduación requieren confirmación de recepción por adulto."
      })
    }

    // 6. Check if delivery is allowed
    const isAllowed = !newRestrictions.some(r => r.status === "restricted")

    setRestrictions(newRestrictions)
    onComplianceCheck(isAllowed, newRestrictions)
    setIsChecking(false)
  }, [shippingAddress, cartItems, deliveryTime, products, onComplianceCheck, HIGH_RISK_HOURS, RESTRICTED_REGIONS])

  useEffect(() => {
    checkCompliance()
  }, [checkCompliance])

  const getStatusColor = (status: DeliveryRestriction["status"]) => {
    switch (status) {
      case "allowed":
        return "bg-status-allowed-bg text-status-allowed-text border-status-allowed-border"
      case "warning":
        return "bg-status-warning-bg text-status-warning-text border-status-warning-border"
      case "required":
        return "bg-status-required-bg text-status-required-text border-status-required-border"
      case "restricted":
        return "bg-status-restricted-bg text-status-restricted-text border-status-restricted-border"
    }
  }

  const getStatusIcon = (status: DeliveryRestriction["status"]) => {
    switch (status) {
      case "allowed":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "required":
        return <Clock className="w-4 h-4" />
      case "restricted":
        return <XCircle className="w-4 h-4" />
    }
  }

  if (isChecking) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mr-3"></div>
            <span>Verificando cumplimiento normativo...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasRestrictions = restrictions.length > 0
  const hasBlockingRestrictions = restrictions.some(r => r.status === "restricted")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Cumplimiento Normativo Chileno
        </CardTitle>
        <CardDescription>
          Verificación automática de regulaciones para venta de alcohol en Chile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compliance Status */}
        <div className="flex items-center gap-2">
          {hasBlockingRestrictions ? (
            <Badge className="bg-status-restricted-bg text-status-restricted-text border-status-restricted-border">
              <XCircle className="w-3 h-3 mr-1" />
              No Cumple con Regulaciones
            </Badge>
          ) : (
            <Badge className="bg-status-allowed-bg text-status-allowed-text border-status-allowed-border">
              <CheckCircle className="w-3 h-3 mr-1" />
              Cumple con Regulaciones
            </Badge>
          )}
        </div>

        {/* Restrictions List */}
        {hasRestrictions && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Restricciones Aplicables:</h4>
            {restrictions.map((restriction, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1 rounded-full ${getStatusColor(restriction.status)}`}>
                    {getStatusIcon(restriction.status)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{restriction.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{restriction.description}</p>
                    {restriction.details && (
                      <p className="text-xs text-gray-500 mt-2">{restriction.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legal Notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Ley 19.925:</strong> La venta de bebidas alcoholicas está regulada por la legislación chilena.
            Todas las entregas cumplen con los requisitos de verificación de edad y restricciones regionales.
          </AlertDescription>
        </Alert>

        {/* Delivery Information */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Información de Entrega</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.region}</span>
            </div>
            {deliveryTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Horario programado: {deliveryTime}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}