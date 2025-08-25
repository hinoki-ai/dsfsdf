"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Wine,
  Beer,
  FlaskConical,
  MapPin,
  DollarSign,
  Star
} from "lucide-react"

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void
  categories: Array<{
    _id: string
    name: string
    slug: string
    alcoholCategory?: string
  }>
  className?: string
}

export function ProductFilters({ onFiltersChange, categories, className }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])
  const [abvRange, setAbvRange] = useState([0, 60])
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Chilean origins - based on research
  const chileanOrigins = [
    "Maipo Valley", "Colchagua Valley", "Casablanca Valley",
    "Maule Valley", "Central Valley", "Rapel Valley",
    "Elqui Valley", "Limarí Valley", "Aconcagua Valley"
  ]

  // International origins - based on research
  const internationalOrigins = [
    "France", "Italy", "Spain", "United States", "Argentina",
    "Australia", "New Zealand", "Germany", "Portugal", "South Africa"
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId)

    setSelectedCategories(newSelected)
    updateFilters({ categories: newSelected })
  }

  const handleOriginChange = (origin: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedOrigins, origin]
      : selectedOrigins.filter(o => o !== origin)

    setSelectedOrigins(newSelected)
    updateFilters({ origins: newSelected })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    updateFilters({ priceRange: value })
  }

  const handleAbvChange = (value: number[]) => {
    setAbvRange(value)
    updateFilters({ abvRange: value })
  }

  const updateFilters = (newFilters: any) => {
    const filters = {
      search: searchQuery,
      categories: selectedCategories,
      priceRange,
      origins: selectedOrigins,
      abvRange,
      sortBy,
      sortOrder,
      ...newFilters
    }
    onFiltersChange(filters)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setPriceRange([0, 500000])
    setSelectedOrigins([])
    setAbvRange([0, 60])
    setSortBy("name")
    setSortOrder("asc")
    onFiltersChange({})
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedOrigins.length +
    (priceRange[0] > 0 || priceRange[1] < 500000 ? 1 : 0) +
    (abvRange[0] > 0 || abvRange[1] < 60 ? 1 : 0)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar - Wine.com inspired */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar vinos, cervezas, licores..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            updateFilters({ search: e.target.value })
          }}
          className="w-full pl-10 pr-4 py-3 glass-wine rounded-2xl border border-white/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 text-lg"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="glass-wine border-white/20 flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="social-rating ml-1">
              {activeFiltersCount}
            </Badge>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Desktop Filters Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Filtros</h2>
          {activeFiltersCount > 0 && (
            <Badge className="social-rating">
              {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar todos
          </Button>
        )}
      </div>

      {/* Filters Content */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Categories - Total Wine inspired */}
        <Card className="glass-wine border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wine className="w-5 h-5 text-amber-500" />
              Categorías
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <label key={category._id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category._id)}
                  onChange={(e) => handleCategoryChange(category._id, e.target.checked)}
                  className="w-4 h-4 text-amber-500 border-white/20 rounded focus:ring-amber-500/20"
                />
                <span className="text-sm group-hover:text-amber-500 transition-colors">
                  {category.name}
                </span>
                {category.alcoholCategory && (
                  <Badge variant="outline" className="text-xs">
                    {category.alcoholCategory}
                  </Badge>
                )}
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Price Range - Majestic Wine inspired */}
        <Card className="glass-wine border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Rango de Precio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={500000}
              min={0}
              step={5000}
              className="w-full"
            />
            <div className="flex gap-2">
              {[0, 25000, 50000, 100000, 200000, 500000].map((price) => (
                <Button
                  key={price}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePriceChange([0, price])}
                  className="text-xs glass-wine border-white/20"
                >
                  ${price === 500000 ? '500k+' : (price / 1000) + 'k'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Origins - Wine.com inspired */}
        <Card className="glass-wine border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Origen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-amber-600">🇨🇱 Chile</h4>
              {chileanOrigins.map((origin) => (
                <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedOrigins.includes(origin)}
                    onChange={(e) => handleOriginChange(origin, e.target.checked)}
                    className="w-4 h-4 text-amber-500 border-white/20 rounded focus:ring-amber-500/20"
                  />
                  <span className="text-sm group-hover:text-amber-500 transition-colors">
                    {origin}
                  </span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-blue-600">🌍 Internacional</h4>
              {internationalOrigins.map((origin) => (
                <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedOrigins.includes(origin)}
                    onChange={(e) => handleOriginChange(origin, e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-white/20 rounded focus:ring-blue-500/20"
                  />
                  <span className="text-sm group-hover:text-blue-500 transition-colors">
                    {origin}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ABV Range - Vivino inspired */}
        <Card className="glass-wine border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-500" />
              Graduación Alcohólica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>{abvRange[0]}%</span>
              <span>{abvRange[1]}%</span>
            </div>
            <Slider
              value={abvRange}
              onValueChange={handleAbvChange}
              max={60}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Bajo', range: [0, 5] },
                { label: 'Medio', range: [5, 15] },
                { label: 'Alto', range: [15, 30] },
                { label: 'Premium', range: [30, 60] }
              ].map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAbvChange(option.range)}
                  className="text-xs glass-wine border-white/20"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sort Options - Drizly inspired */}
        <Card className="glass-wine border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Ordenar por
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'name', label: 'Nombre' },
              { value: 'price', label: 'Precio' },
              { value: 'rating', label: 'Calificación' },
              { value: 'newest', label: 'Más reciente' },
              { value: 'popular', label: 'Más popular' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    updateFilters({ sortBy: e.target.value })
                  }}
                  className="w-4 h-4 text-amber-500 border-white/20 focus:ring-amber-500/20"
                />
                <span className="text-sm group-hover:text-amber-500 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}