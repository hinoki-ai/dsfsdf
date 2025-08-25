import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { divineTranslationOracle, defaultLocale } from "@/lib/i18n"
import {
  Wine,
  Star,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  Award,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

// Premium Product Detail Page with Mobile-First Design
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Get translations using divine parsing oracle
  const t = (key: string, fallback?: string) =>
    divineTranslationOracle.getTranslation(defaultLocale, key, fallback)

  // Mock product data - will be replaced with real data from Convex
  const product = {
    id: 1,
    name: "Concha y Toro Cabernet Sauvignon",
    slug: "concha-y-toro-cabernet-sauvignon",
    description: `Vino tinto premium de la reconocida bodega chilena Concha y Toro. Notas de cassis, chocolate y roble tostado. Perfecto para acompañar carnes rojas.

    Este Cabernet Sauvignon proviene de los mejores viñedos de Chile, específicamente de la zona del Valle del Maipo, donde las condiciones climáticas únicas permiten obtener uvas de excepcional calidad.

    Notas de cata:
    • Color: Rojo rubí intenso con destellos púrpura
    • Aroma: Frutas rojas maduras, cassis, notas de chocolate y vainilla
    • Sabor: Taninos suaves pero firmes, buena acidez, final persistente
    • Maridaje: Carnes rojas a la parrilla, pastas con salsa de tomate, quesos curados`,
    shortDescription: "Cabernet Sauvignon premium de Concha y Toro",
    price: 15990,
    compareAtPrice: 18990,
    alcoholData: {
      abv: 13.5,
      volume: 750,
      volumeUnit: "ml",
      origin: "Chile",
      grapeVariety: ["Cabernet Sauvignon"],
      tasteProfile: {
        sweetness: 2,
        acidity: 4,
        bitterness: 3,
        body: 4,
        finish: 4
      }
    },
    ageRequirement: {
      minimumAge: 18,
      requiresVerification: true
    },
    regulatoryInfo: {
      warnings: ["Contiene sulfitos", "Consumir con moderación"],
      certifications: ["D.O. Maipo Valley"]
    },
    images: [
      { url: "/products/concha-cabernet.jpg", alt: "Concha y Toro Cabernet Sauvignon bottle" }
    ],
    tags: ["vino", "tinto", "chile", "premium", "cabernet", "concha-y-toro"],
    isFeatured: true,
    isActive: true
  }

  return (
    <div className="min-h-screen bg-background mobile-first">
      <Header />

      {/* Breadcrumb */}
      <section className="py-4 bg-background/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/productos" className="hover:text-foreground transition-colors">Productos</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Hero Section */}
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20 rounded-2xl flex items-center justify-center shadow-premium">
                <Wine className="w-32 h-32 text-amber-500" />
              </div>
              {/* Image Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wine className="w-8 h-8 text-amber-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-shadow">{product.name}</h1>
                    <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
                  </div>
                  <Button size="icon" variant="outline" className="glass-effect border-white/20 hover:bg-white/10">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="glass-effect border border-amber-500/20 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20">
                    <Award className="w-3 h-3 mr-1" />
                    Producto Premium
                  </Badge>
                  <Badge className="glass-effect border border-green-500/20 bg-green-500/10 text-green-700 hover:bg-green-500/20">
                    <Shield className="w-3 h-3 mr-1" />
                    Verificación de Edad
                  </Badge>
                  <Badge variant="secondary" className="glass-effect">
                    {product.alcoholData.abv}% ABV
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-amber-500">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.compareAtPrice && (
                  <Badge variant="destructive" className="text-xs">
                    Ahorra ${(product.compareAtPrice - product.price).toLocaleString()}
                  </Badge>
                )}
              </div>

              {/* Alcohol Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-effect rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-muted-foreground">Graduación</div>
                  <div className="text-lg font-semibold">{product.alcoholData.abv}% ABV</div>
                </div>
                <div className="glass-effect rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-muted-foreground">Volumen</div>
                  <div className="text-lg font-semibold">{product.alcoholData.volume} {product.alcoholData.volumeUnit}</div>
                </div>
                <div className="glass-effect rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-muted-foreground">Origen</div>
                  <div className="text-lg font-semibold">{product.alcoholData.origin}</div>
                </div>
                <div className="glass-effect rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-muted-foreground">Varietal</div>
                  <div className="text-lg font-semibold">{product.alcoholData.grapeVariety?.join(', ')}</div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Cantidad:</span>
                  <div className="flex items-center glass-effect rounded-lg border border-white/20">
                    <Button size="icon" variant="ghost" className="rounded-none">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-12 text-center">1</span>
                    <Button size="icon" variant="ghost" className="rounded-none">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white py-6 text-lg font-semibold rounded-full">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al Carrito
                  </Button>
                  <Button size="icon" variant="outline" className="glass-effect border-white/20 hover:bg-white/10 p-6">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Age Verification Notice */}
              <div className="glass-effect rounded-lg p-4 border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="font-medium text-amber-700 dark:text-amber-400">Verificación de Edad Requerida</div>
                    <div className="text-sm text-muted-foreground">
                      Este producto requiere verificación de edad. Debes tener al menos {product.ageRequirement.minimumAge} años para adquirirlo.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-16 bg-gradient-to-b from-background/50 to-background/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 p-1 glass-effect rounded-lg border border-white/10">
              {["Descripción", "Características", "Maridaje", "Certificaciones"].map((tab, index) => (
                <Button
                  key={tab}
                  variant={index === 0 ? "default" : "ghost"}
                  className={`flex-1 rounded-md ${
                    index === 0
                      ? "bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white"
                      : "glass-effect hover:bg-white/10"
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="glass-effect rounded-2xl p-6 lg:p-8 backdrop-blur-sm border border-white/10">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h3 className="text-2xl font-bold mb-4">Descripción del Producto</h3>
                <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {product.description}
                </div>

                <h4 className="text-xl font-semibold mt-8 mb-4">Información Nutricional</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Calorías", value: "125 kcal" },
                    { label: "Carbohidratos", value: "4g" },
                    { label: "Proteínas", value: "0.2g" },
                    { label: "Grasas", value: "0g" }
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 glass-effect rounded-lg border border-white/10">
                      <div className="text-lg font-semibold text-amber-500">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-shadow">Productos Relacionados</h2>
            <p className="text-muted-foreground">Descubre más opciones premium</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group hover:shadow-premium transition-all duration-300 glass-effect border-white/10 hover:border-white/20 backdrop-blur-sm">
                <CardHeader className="p-4">
                  <div className="aspect-square bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20 rounded-lg mb-4 flex items-center justify-center">
                    <Wine className="w-8 h-8 text-amber-500" />
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">Producto Relacionado {i}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-bold text-amber-500 mb-4">$12,990</div>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white">
                    Ver Producto
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-burgundy-500/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Truck, title: "Envío Gratis", desc: "En compras sobre $50.000" },
              { icon: Shield, title: "Compra Segura", desc: "Verificación de edad" },
              { icon: Award, title: "Certificado", desc: "Productos premium" },
              { icon: Star, title: "Calidad", desc: "Las mejores marcas" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-full flex items-center justify-center mb-3">
                  <item.icon className="w-6 h-6 text-amber-500" />
                </div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}