"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AgeVerification, AgeVerifiedBadge } from "@/components/age-verification"
import { formatPrice } from "@/lib/utils"
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle } from "lucide-react"

interface CartItem {
  productId: string
  quantity: number
  price: number
  ageVerified: boolean
}

interface Product {
  _id: string
  name: string
  images: Array<{ url: string; alt: string }>
  ageRequirement: {
    minimumAge: number
    requiresVerification: boolean
  }
  inventory: {
    quantity: number
  }
}

interface Cart {
  _id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  ageVerification: {
    isVerified: boolean
    restrictions: {
      hasRestrictedItems: boolean
      requiresAdditionalVerification: boolean
    }
  }
}

export default function CartPage() {
  const { userId, isSignedIn } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [showAgeVerification, setShowAgeVerification] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    // Simulate loading cart data
    const mockCart: Cart = {
      _id: "cart_123",
      items: [
        {
          productId: "product_1",
          quantity: 2,
          price: 15000,
          ageVerified: false,
        },
        {
          productId: "product_2",
          quantity: 1,
          price: 25000,
          ageVerified: false,
        },
      ],
      subtotal: 55000,
      tax: 10450,
      total: 65450,
      ageVerification: {
        isVerified: false,
        restrictions: {
          hasRestrictedItems: true,
          requiresAdditionalVerification: true,
        },
      },
    }

    const mockProducts: Record<string, Product> = {
      product_1: {
        _id: "product_1",
        name: "Vino Tinto Cabernet Sauvignon",
        images: [{ url: "/placeholder-wine.jpg", alt: "Vino Tinto" }],
        ageRequirement: {
          minimumAge: 18,
          requiresVerification: true,
        },
        inventory: {
          quantity: 50,
        },
      },
      product_2: {
        _id: "product_2",
        name: "Whisky Escocés Single Malt",
        images: [{ url: "/placeholder-whisky.jpg", alt: "Whisky" }],
        ageRequirement: {
          minimumAge: 18,
          requiresVerification: true,
        },
        inventory: {
          quantity: 25,
        },
      },
    }

    setCart(mockCart)
    setProducts(mockProducts)
    setLoading(false)
  }, [])

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (!cart) return

    // Mock update - replace with actual API call
    const updatedItems = cart.items.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ).filter(item => item.quantity > 0)

    const subtotal = updatedItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )
    const tax = subtotal * 0.19
    const total = subtotal + tax

    setCart({
      ...cart,
      items: updatedItems,
      subtotal,
      tax,
      total,
    })
  }

  const handleRemoveItem = async (productId: string) => {
    if (!cart) return

    const updatedItems = cart.items.filter(item => item.productId !== productId)
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )
    const tax = subtotal * 0.19
    const total = subtotal + tax

    setCart({
      ...cart,
      items: updatedItems,
      subtotal,
      tax,
      total,
    })
  }

  const handleAgeVerification = (dateOfBirth: Date) => {
    setAgeVerified(true)
    setShowAgeVerification(false)
    if (cart) {
      setCart({
        ...cart,
        ageVerification: {
          ...cart.ageVerification,
          isVerified: true,
        },
      })
    }
  }

  const handleCheckout = () => {
    if (cart?.ageVerification.restrictions.requiresAdditionalVerification && !cart.ageVerification.isVerified) {
      setShowAgeVerification(true)
      return
    }

    // Proceed to checkout
    console.log("Proceeding to checkout...")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando carrito...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Agrega algunos productos para comenzar tu compra
            </p>
            <Button asChild>
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Carrito de Compras
            </h1>
            {cart.ageVerification.isVerified && (
              <AgeVerifiedBadge />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const product = products[item.productId]
                if (!product) return null

                return (
                  <Card key={item.productId} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.images[0]?.url || "/placeholder-product.jpg"}
                            alt={product.images[0]?.alt || product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatPrice(item.price)} c/u
                          </p>
                          {product.ageRequirement.minimumAge > 18 && (
                            <div className="flex items-center gap-1 text-sm text-amber-600 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              Requiere verificación de edad (+{product.ageRequirement.minimumAge})
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= product.inventory.quantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (19%)</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>

                  {cart.ageVerification.restrictions.requiresAdditionalVerification && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            Verificación de Edad Requerida
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                            Algunos productos requieren verificación de edad para continuar.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={!cart.ageVerification.isVerified && cart.ageVerification.restrictions.requiresAdditionalVerification}
                  >
                    {cart.ageVerification.restrictions.requiresAdditionalVerification && !cart.ageVerification.isVerified
                      ? "Verificar Edad para Continuar"
                      : "Proceder al Pago"
                    }
                  </Button>

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Al continuar, aceptas nuestros términos y condiciones.
                    <br />
                    La venta de alcohol está regulada por la ley chilena.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Age Verification Modal */}
      {showAgeVerification && (
        <AgeVerification
          onVerified={handleAgeVerification}
          onRejected={() => setShowAgeVerification(false)}
          minimumAge={18}
        />
      )}
    </div>
  )
}