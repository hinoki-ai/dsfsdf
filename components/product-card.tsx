"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Wine, Beer, FlaskConical, Martini, Heart, Star, Truck, Award } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images: Array<{
    url: string
    alt: string
  }>
  alcoholData?: {
    abv: number
    volume: number
    volumeUnit: string
    origin?: string
  }
  ageRequirement: {
    minimumAge: number
    requiresVerification: boolean
  }
  inventory: {
    quantity: number
    lowStockThreshold: number
  }
  isActive: boolean
  isFeatured: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  isAgeVerified?: boolean
}

const getAlcoholIcon = (abv: number) => {
  if (abv < 5) return <Beer className="h-4 w-4" />
  if (abv < 15) return <Wine className="h-4 w-4" />
  return <FlaskConical className="h-4 w-4" />
}

const getAlcoholCategoryColor = (abv: number) => {
  if (abv < 5) return "bg-alcohol-low-bg text-alcohol-low-text border-alcohol-low-border"
  if (abv < 15) return "bg-alcohol-medium-bg text-alcohol-medium-text border-alcohol-medium-border"
  return "bg-alcohol-high-bg text-alcohol-high-text border-alcohol-high-border"
}

export function ProductCard({ product, onAddToCart, isAgeVerified = false }: ProductCardProps) {
  const { alcoholData } = product
  const isLowStock = product.inventory.quantity <= product.inventory.lowStockThreshold
  const isOutOfStock = product.inventory.quantity <= 0
  const isChilean = alcoholData?.origin?.toLowerCase().includes('chile')

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-premium mobile-card">
      <div className="relative aspect-square overflow-hidden">
        {/* Premium Background with Wine.com inspired effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20" />
        <Image
          src={product.images[0]?.url || "/placeholder-product.jpg"}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover transition-transform group-hover:scale-110 duration-500 bottle-glow"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Premium Badges - Inspired by Vivino and Majestic Wine */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <Badge className="crowdfunding-badge shadow-lg">
              <Award className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {isChilean && (
            <Badge className="chilean-style glass-effect text-red-400 border-red-400/30">
              🇨🇱 Chileno
            </Badge>
          )}
        </div>

        {/* Alcohol Badge - Enhanced */}
        {alcoholData && (
          <div className="absolute top-3 right-3">
            <Badge className={`${getAlcoholCategoryColor(alcoholData.abv)} shadow-lg border`}>
              {getAlcoholIcon(alcoholData.abv)}
              {alcoholData.abv}%
            </Badge>
          </div>
        )}

        {/* Stock Status - Drizly inspired */}
        {isLowStock && !isOutOfStock && (
          <Badge variant="destructive" className="absolute bottom-3 left-3 shadow-lg">
            🔥 ¡Últimas unidades!
          </Badge>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 glass-wine flex items-center justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2 shadow-lg">
              Agotado
            </Badge>
          </div>
        )}

        {/* Quick Actions - Wine.com style */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" className="w-8 h-8 glass-effect shadow-lg text-foreground/70 hover:text-red-400 hover:bg-red-400/10">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Product Title with Wine.com typography */}
          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-amber-500 transition-colors duration-300 text-shadow">
            {product.name}
          </h3>

          {/* Description with Chilean market focus */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Enhanced Product Details - Total Wine inspired */}
          {alcoholData && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{alcoholData.volume}{alcoholData.volumeUnit}</span>
                </span>
                {alcoholData.origin && (
                  <span className="flex items-center gap-1">
                    <span>•</span>
                    <span className="font-medium">{alcoholData.origin}</span>
                  </span>
                )}
              </div>
              {/* Age requirement badge */}
              {product.ageRequirement.minimumAge > 18 && (
                <Badge variant="outline" className="text-xs chilean-style">
                  +{product.ageRequirement.minimumAge}
                </Badge>
              )}
            </div>
          )}

          {/* Social Features - Vivino inspired */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 social-rating text-xs px-2 py-1">
                <Star className="w-3 h-3" />
                4.5 (128)
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <Truck className="w-3 h-3" />
                <span className="text-xs click-collect">Envío gratis</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-2">
            {/* Premium Pricing - Majestic Wine style */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-500">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <Badge variant="destructive" className="text-xs shadow-lg">
                {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Enhanced CTA Button - Drizly mobile-first approach */}
          <Button
            onClick={() => onAddToCart(product._id)}
            disabled={isOutOfStock || (!isAgeVerified && product.ageRequirement.requiresVerification)}
            className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:scale-105 touch-optimized"
          >
            {isOutOfStock ? "Agotado" : "Agregar"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}