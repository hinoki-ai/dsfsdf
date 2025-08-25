"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AgeVerifiedBadge } from "@/components/age-verification"
import { RegulatoryCompliance } from "@/components/regulatory-compliance"
import { formatPrice } from "@/lib/utils"
import { CreditCard, Truck, MapPin, User, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react"

interface CartItem {
  productId: string
  quantity: number
  price: number
}

interface Cart {
  _id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  ageVerification: {
    isVerified: boolean
  }
}

export default function CheckoutPage() {
  const { userId, isSignedIn } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [isCompliant, setIsCompliant] = useState(false)

  // Mock cart data - replace with real data from Convex
  const mockCart: Cart = {
    _id: "cart_123",
    items: [
      {
        productId: "1",
        quantity: 2,
        price: 15990
      },
      {
        productId: "2",
        quantity: 1,
        price: 34990
      }
    ],
    subtotal: 50970,
    tax: 9684,
    total: 60654,
    ageVerification: {
      isVerified: true
    }
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleRegulatoryCheck = (compliant: boolean) => {
    setIsCompliant(compliant)
  }

  const handlePlaceOrder = async () => {
    if (!isCompliant) {
      alert("No se puede procesar el pedido debido a restricciones regulatorias.")
      return
    }

    setLoading(true)
    // Mock order placement
    setTimeout(() => {
      alert("¡Pedido realizado exitosamente!")
      setLoading(false)
    }, 2000)
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Carrito Vacío</h1>
            <p className="text-gray-600 mb-6">Agregue productos antes de proceder al checkout</p>
            <Button>
              Ver Productos
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cart.items.length} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Checkout
            </h1>
            {cart.ageVerification.isVerified && <AgeVerifiedBadge />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Customer Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información del Cliente
                    </CardTitle>
                    <CardDescription>
                      Complete su información personal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" placeholder="Juan Pérez" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="juan@example.com" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="+56 9 1234 5678" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Dirección de Envío
                      </CardTitle>
                      <CardDescription>
                        Complete la dirección de entrega
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="street">Dirección</Label>
                        <Input id="street" placeholder="Calle Principal 123" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Ciudad</Label>
                          <Input id="city" placeholder="Santiago" />
                        </div>
                        <div>
                          <Label htmlFor="region">Región</Label>
                          <Input id="region" placeholder="Metropolitana" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Regulatory Compliance */}
                  <RegulatoryCompliance
                    shippingAddress={{
                      street: "Calle Principal 123",
                      city: "Santiago",
                      region: "Metropolitana",
                      postalCode: "7500000"
                    }}
                    cartItems={cart.items}
                    products={{}}
                    onComplianceCheck={handleRegulatoryCheck}
                  />
                </>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Método de Pago
                    </CardTitle>
                    <CardDescription>
                      Seleccione su método de pago preferido
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" id="card" name="payment" defaultChecked />
                        <Label htmlFor="card">Tarjeta de Crédito/Débito</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" id="transfer" name="payment" />
                        <Label htmlFor="transfer">Transferencia Bancaria</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" id="cash" name="payment" />
                        <Label htmlFor="cash">Efectivo contra entrega</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Revisar Pedido</CardTitle>
                    <CardDescription>
                      Confirme los detalles antes de completar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {cart.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>Producto {index + 1} x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatPrice(cart.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                  Anterior
                </Button>
                <Button
                  onClick={step === 4 ? handlePlaceOrder : handleNext}
                  disabled={step === 4 && (!isCompliant && !cart.ageVerification.isVerified)}
                >
                  {step === 4 ? (loading ? "Procesando..." : "Realizar Pedido") : "Siguiente"}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (19%)</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>{formatPrice(2500)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(cart.total + 2500)}</span>
                    </div>
                  </div>

                  {!cart.ageVerification.isVerified && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Se requiere verificación de edad
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}