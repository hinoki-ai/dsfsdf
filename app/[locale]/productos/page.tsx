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
  Search,
  Filter,
  Grid,
  List,
  ChevronDown
} from "lucide-react"

// Premium Product Card Component
const ProductCard = ({ product }: { product: { id: number; name: string; slug: string; description: string; shortDescription?: string; price: number; compareAtPrice?: number; alcoholData: { abv: number }; images: { url: string; alt: string }[] } }) => {
  return (
    <Card className="group hover:shadow-premium transition-all duration-300 glass-effect border-white/10 hover:border-white/20 backdrop-blur-sm animate-fade-in-up">
      <CardHeader className="p-4">
        <div className="aspect-square bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Wine className="w-12 h-12 text-amber-500" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-amber-500 transition-colors">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {product.shortDescription || product.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-amber-500">
              ${product.price.toLocaleString()}
            </div>
            {product.compareAtPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ${product.compareAtPrice.toLocaleString()}
              </div>
            )}
          </div>
          <Badge variant="secondary" className="glass-effect">
            {product.alcoholData?.abv}% ABV
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar
          </Button>
          <Button size="icon" variant="outline" className="glass-effect border-white/20 hover:bg-white/10">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Premium Products Page with Mobile-First Design
export default function ProductsPage() {
  // Get translations using divine parsing oracle
  const t = (key: string, fallback?: string) =>
    divineTranslationOracle.getTranslation(defaultLocale, key, fallback)

  // Mock products data for now - will be replaced with real data from Convex
  const products = [
    {
      id: 1,
      name: "Concha y Toro Cabernet Sauvignon",
      slug: "concha-y-toro-cabernet-sauvignon",
      description: "Vino tinto premium de la reconocida bodega chilena Concha y Toro.",
      shortDescription: "Cabernet Sauvignon premium de Concha y Toro",
      price: 15990,
      compareAtPrice: 18990,
      alcoholData: { abv: 13.5 },
      images: [{ url: "/products/concha-cabernet.jpg", alt: "Concha y Toro Cabernet Sauvignon" }]
    },
    {
      id: 2,
      name: "Santa Rita Medalla Real Chardonnay",
      slug: "santa-rita-medalla-real-chardonnay",
      description: "Chardonnay premium de Santa Rita con notas elegantes.",
      shortDescription: "Chardonnay premium de Santa Rita",
      price: 12990,
      compareAtPrice: 14990,
      alcoholData: { abv: 12.8 },
      images: [{ url: "/products/santa-rita-chardonnay.jpg", alt: "Santa Rita Medalla Real Chardonnay" }]
    },
    {
      id: 3,
      name: "Kunstmann Torobayo Pale Ale",
      slug: "kunstmann-torobayo-pale-ale",
      description: "Cerveza artesanal chilena con sabores únicos.",
      shortDescription: "Pale Ale artesanal chilena premium",
      price: 4990,
      compareAtPrice: 5990,
      alcoholData: { abv: 5.2 },
      images: [{ url: "/products/kunstmann-torobayo.jpg", alt: "Kunstmann Torobayo Pale Ale" }]
    },
    {
      id: 4,
      name: "Glenfiddich 18 Year Old",
      slug: "glenfiddich-18-year-old",
      description: "Whisky escocés single malt premium de 18 años.",
      shortDescription: "Single malt escocés 18 años",
      price: 189990,
      compareAtPrice: 199990,
      alcoholData: { abv: 43 },
      images: [{ url: "/products/glenfiddich-18.jpg", alt: "Glenfiddich 18 Year Old" }]
    },
    {
      id: 5,
      name: "Havana Club 7 Años",
      slug: "havana-club-7-anos",
      description: "Ron cubano premium añejado 7 años.",
      shortDescription: "Ron cubano premium 7 años",
      price: 34990,
      compareAtPrice: 39990,
      alcoholData: { abv: 40 },
      images: [{ url: "/products/havana-club-7.jpg", alt: "Havana Club 7 Años" }]
    }
  ]

  return (
    <div className="min-h-screen bg-background mobile-first">
      <Header />

      {/* Premium Header Section */}
      <section className="relative bg-gradient-to-br from-background via-background/95 to-background/90 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Badge className="mb-4 glass-effect rounded-full px-6 py-2 border border-white/10">
                <Wine className="w-4 h-4 mr-2 text-amber-500" />
                <span className="font-medium">Nuestra Colección Premium</span>
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-shadow">
                Productos <span className="bg-gradient-to-r from-amber-500 via-red-500 to-burgundy-500 bg-clip-text text-transparent">Exclusivos</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubre nuestra selección curada de las mejores bebidas alcohólicas de Chile y el mundo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Filters and Search Bar */}
      <section className="py-8 bg-background/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-3 glass-effect rounded-full border border-white/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center gap-3">
              <Button variant="outline" className="glass-effect border-white/20 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              <div className="flex rounded-lg glass-effect border border-white/20 p-1">
                <Button size="sm" variant="ghost" className="data-[state=on]:bg-amber-500 data-[state=on]:text-white rounded-md">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="data-[state=on]:bg-amber-500 data-[state=on]:text-white rounded-md">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[
              { name: "Todos", active: true },
              { name: "Vinos", active: false },
              { name: "Cervezas", active: false },
              { name: "Licores", active: false },
              { name: "Sin Alcohol", active: false }
            ].map((category) => (
              <Button
                key={category.name}
                variant={category.active ? "default" : "outline"}
                size="sm"
                className={`rounded-full whitespace-nowrap ${
                  category.active
                    ? "bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white"
                    : "glass-effect border-white/20 hover:bg-white/10"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Productos Destacados</h2>
              <Badge variant="secondary" className="glass-effect">
                {products.length} productos
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Ordenar por:</span>
              <Button variant="ghost" size="sm" className="text-foreground hover:text-amber-500">
                Precio
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white px-8 py-4 rounded-full"
            >
              Cargar Más Productos
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-burgundy-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-effect rounded-3xl p-8 lg:p-12 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-shadow">
                Mantente Actualizado
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Recibe las últimas ofertas y nuevos productos directamente en tu correo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 glass-effect rounded-full border border-white/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                />
                <Button className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white px-8 py-3 rounded-full">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}