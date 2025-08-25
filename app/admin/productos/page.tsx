"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Wine,
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  sku: string
  price: number
  inventory: {
    quantity: number
    lowStockThreshold: number
  }
  alcoholData: {
    abv: number
  }
  ageRequirement: {
    minimumAge: number
    requiresVerification: boolean
  }
  isActive: boolean
  isFeatured: boolean
  images: Array<{ url: string; alt: string }>
  createdAt: number
  updatedAt: number
}

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock data - replace with real data from Convex
  const products: Product[] = [
    {
      _id: "1",
      name: "Concha y Toro Cabernet Sauvignon",
      sku: "CYT-CS-001",
      price: 15990,
      inventory: {
        quantity: 150,
        lowStockThreshold: 10
      },
      alcoholData: {
        abv: 13.5
      },
      ageRequirement: {
        minimumAge: 18,
        requiresVerification: true
      },
      isActive: true,
      isFeatured: true,
      images: [{ url: "/placeholder-wine.jpg", alt: "Concha y Toro Cabernet" }],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000
    },
    {
      _id: "2",
      name: "Havana Club 7 Años",
      sku: "HC-7-001",
      price: 34990,
      inventory: {
        quantity: 3,
        lowStockThreshold: 5
      },
      alcoholData: {
        abv: 40
      },
      ageRequirement: {
        minimumAge: 18,
        requiresVerification: true
      },
      isActive: true,
      isFeatured: false,
      images: [{ url: "/placeholder-rum.jpg", alt: "Havana Club 7 Años" }],
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 7200000
    },
    {
      _id: "3",
      name: "Kunstmann Torobayo Pale Ale",
      sku: "KU-TO-PA-001",
      price: 4990,
      inventory: {
        quantity: 200,
        lowStockThreshold: 15
      },
      alcoholData: {
        abv: 5.2
      },
      ageRequirement: {
        minimumAge: 18,
        requiresVerification: false
      },
      isActive: true,
      isFeatured: true,
      images: [{ url: "/placeholder-beer.jpg", alt: "Kunstmann Torobayo" }],
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 10800000
    }
  ]

  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "wine", label: "Vinos" },
    { value: "beer", label: "Cervezas" },
    { value: "spirits", label: "Licores" },
    { value: "non_alcoholic", label: "Sin Alcohol" }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" ||
                           product.alcoholData.abv > 20 ? selectedCategory === "spirits" :
                           product.alcoholData.abv > 10 ? selectedCategory === "wine" :
                           product.alcoholData.abv > 3 ? selectedCategory === "beer" :
                           selectedCategory === "non_alcoholic"
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (product: Product) => {
    const { quantity, lowStockThreshold } = product.inventory
    if (quantity === 0) return { status: "out", color: "bg-red-100 text-red-800" }
    if (quantity <= lowStockThreshold) return { status: "low", color: "bg-yellow-100 text-yellow-800" }
    return { status: "good", color: "bg-green-100 text-green-800" }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Administra el catálogo de productos de la licorería
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Complete la información del nuevo producto para agregarlo al catálogo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Nombre del Producto</Label>
                  <Input id="productName" placeholder="Ej: Vino Cabernet Sauvignon" />
                </div>
                <div>
                  <Label htmlFor="productSKU">SKU</Label>
                  <Input id="productSKU" placeholder="Ej: VIN-CS-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productPrice">Precio (CLP)</Label>
                  <Input id="productPrice" type="number" placeholder="15000" />
                </div>
                <div>
                  <Label htmlFor="productABV">Graduación Alcohol (%)</Label>
                  <Input id="productABV" type="number" step="0.1" placeholder="13.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productStock">Stock Inicial</Label>
                  <Input id="productStock" type="number" placeholder="100" />
                </div>
                <div>
                  <Label htmlFor="productMinAge">Edad Mínima</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar edad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18">18 años</SelectItem>
                      <SelectItem value="21">21 años</SelectItem>
                      <SelectItem value="0">Sin restricción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Crear Producto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Productos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="category">Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Catálogo de Productos ({filteredProducts.length})
          </CardTitle>
          <CardDescription>
            Lista completa de productos disponibles en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Modificación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product)
                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.images[0]?.url || "/placeholder-product.jpg"}
                            alt={product.images[0]?.alt || product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.alcoholData.abv}% ABV</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell className="font-medium">
                      ${product.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          stockStatus.color
                        }`}>
                          {stockStatus.status === "out" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {stockStatus.status === "low" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {stockStatus.status === "good" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {product.inventory.quantity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {product.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        {product.isFeatured && (
                          <Badge className="bg-blue-100 text-blue-800">Destacado</Badge>
                        )}
                        {product.ageRequirement.minimumAge > 18 && (
                          <Badge className="bg-amber-100 text-amber-800">
                            +{product.ageRequirement.minimumAge}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(product.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Wine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Intenta ajustar los filtros de búsqueda o agrega nuevos productos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Masivas</CardTitle>
          <CardDescription>
            Aplicar cambios a múltiples productos seleccionados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Activar Seleccionados
            </Button>
            <Button variant="outline" size="sm">
              Desactivar Seleccionados
            </Button>
            <Button variant="outline" size="sm">
              Marcar como Destacados
            </Button>
            <Button variant="outline" size="sm">
              Actualizar Precios
            </Button>
            <Button variant="outline" size="sm">
              Ajustar Inventario
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              Eliminar Seleccionados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}