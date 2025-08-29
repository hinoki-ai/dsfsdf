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
  AlertTriangle,
  CheckCircle,
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw
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
    reservedQuantity: number
  }
  images: Array<{ url: string; alt: string }>
  isActive: boolean
}

interface InventoryLog {
  _id: string
  productId: string
  type: "stock_in" | "stock_out" | "adjustment" | "reserved" | "released"
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason?: string
  createdAt: number
}

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Mock data - replace with real data from Convex
  const products: Product[] = [
    {
      _id: "1",
      name: "Concha y Toro Cabernet Sauvignon",
      sku: "CYT-CS-001",
      price: 15990,
      inventory: {
        quantity: 150,
        lowStockThreshold: 10,
        reservedQuantity: 5
      },
      images: [{ url: "/placeholder-wine.jpg", alt: "Concha y Toro Cabernet" }],
      isActive: true
    },
    {
      _id: "2",
      name: "Havana Club 7 Años",
      sku: "HC-7-001",
      price: 34990,
      inventory: {
        quantity: 3,
        lowStockThreshold: 5,
        reservedQuantity: 0
      },
      images: [{ url: "/placeholder-rum.jpg", alt: "Havana Club 7 Años" }],
      isActive: true
    },
    {
      _id: "3",
      name: "Kunstmann Torobayo Pale Ale",
      sku: "KU-TO-PA-001",
      price: 4990,
      inventory: {
        quantity: 200,
        lowStockThreshold: 15,
        reservedQuantity: 12
      },
      images: [{ url: "/placeholder-beer.jpg", alt: "Kunstmann Torobayo" }],
      isActive: true
    },
    {
      _id: "4",
      name: "Glenfiddich 18 Year Old",
      sku: "GF-18-001",
      price: 189990,
      inventory: {
        quantity: 2,
        lowStockThreshold: 3,
        reservedQuantity: 1
      },
      images: [{ url: "/placeholder-whisky.jpg", alt: "Glenfiddich 18" }],
      isActive: true
    }
  ]

  const inventoryLogs: InventoryLog[] = [
    {
      _id: "log1",
      productId: "1",
      type: "stock_in",
      quantity: 50,
      previousQuantity: 100,
      newQuantity: 150,
      reason: "Reabastecimiento semanal",
      createdAt: Date.now() - 86400000
    },
    {
      _id: "log2",
      productId: "2",
      type: "stock_out",
      quantity: 2,
      previousQuantity: 5,
      newQuantity: 3,
      reason: "Venta online",
      createdAt: Date.now() - 3600000
    },
    {
      _id: "log3",
      productId: "3",
      type: "reserved",
      quantity: 12,
      previousQuantity: 200,
      newQuantity: 188,
      reason: "Pedido pendiente",
      createdAt: Date.now() - 1800000
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "all" ||
                         (selectedFilter === "low_stock" && product.inventory.quantity <= product.inventory.lowStockThreshold) ||
                         (selectedFilter === "out_of_stock" && product.inventory.quantity === 0) ||
                         (selectedFilter === "overstock" && product.inventory.quantity > 100)

    return matchesSearch && matchesFilter
  })

  const getStockStatus = (product: Product) => {
    const available = product.inventory.quantity - product.inventory.reservedQuantity
    const threshold = product.inventory.lowStockThreshold

    if (product.inventory.quantity === 0) {
      return { status: "Sin Stock", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    }
    if (available <= threshold) {
      return { status: "Stock Bajo", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
    }
    if (product.inventory.quantity > 100) {
      return { status: "Sobre-stock", color: "bg-blue-100 text-blue-800", icon: TrendingUp }
    }
    return { status: "Normal", color: "bg-green-100 text-green-800", icon: CheckCircle }
  }

  const getTotalInventoryValue = () => {
    return products.reduce((total, product) => {
      return total + (product.price * product.inventory.quantity)
    }, 0)
  }

  const getLowStockCount = () => {
    return products.filter(product =>
      product.inventory.quantity <= product.inventory.lowStockThreshold &&
      product.inventory.quantity > 0
    ).length
  }

  const getOutOfStockCount = () => {
    return products.filter(product => product.inventory.quantity === 0).length
  }

  const handleAdjustStock = (product: Product, adjustment: number, reason: string) => {
    console.log(`Adjusting stock for ${product.name}: ${adjustment > 0 ? '+' : ''}${adjustment} (${reason})`)
    setIsAdjustDialogOpen(false)
    setSelectedProduct(null)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Inventario
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Controla el stock y movimiento de productos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Valor Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(getTotalInventoryValue())}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Stock Bajo
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {getLowStockCount()}
                </p>
                <p className="text-xs text-gray-500">productos</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Sin Stock
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {getOutOfStockCount()}
                </p>
                <p className="text-xs text-gray-500">productos</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Productos Totales
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {products.length}
                </p>
                <p className="text-xs text-gray-500">activos</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
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
              <Label htmlFor="filter">Filtrar por Estado</Label>
              <select
                id="filter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Productos</option>
                <option value="low_stock">Stock Bajo</option>
                <option value="out_of_stock">Sin Stock</option>
                <option value="overstock">Sobre-stock</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Control de Inventario ({filteredProducts.length})
          </CardTitle>
          <CardDescription>
            Gestión detallada del stock y movimientos de productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Reservado</TableHead>
                <TableHead>Disponible</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor Estimado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product)
                const available = product.inventory.quantity - product.inventory.reservedQuantity
                const estimatedValue = product.price * product.inventory.quantity

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
                          <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell className="font-medium">{product.inventory.quantity}</TableCell>
                    <TableCell>{product.inventory.reservedQuantity}</TableCell>
                    <TableCell className="font-medium">{available}</TableCell>
                    <TableCell>
                      <Badge className={stockStatus.color}>
                        <stockStatus.icon className="w-3 h-3 mr-1" />
                        {stockStatus.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(estimatedValue)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog open={isAdjustDialogOpen && selectedProduct?._id === product._id} onOpenChange={setIsAdjustDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ajustar Inventario</DialogTitle>
                              <DialogDescription>
                                Modificar el stock de {product.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span>Stock Actual:</span>
                                <span className="font-medium">{product.inventory.quantity}</span>
                              </div>
                              <div>
                                <Label htmlFor="adjustment">Ajuste de Cantidad</Label>
                                <Input
                                  id="adjustment"
                                  type="number"
                                  placeholder="Ej: +50 o -10"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="reason">Motivo</Label>
                                <Input
                                  id="reason"
                                  placeholder="Ej: Reabastecimiento, Ajuste, etc."
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button onClick={() => handleAdjustStock(product, 0, "")}>
                                  Aplicar Ajuste
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>
            Registro de todos los movimientos de inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryLogs.map((log) => {
              const product = products.find(p => p._id === log.productId)
              return (
                <div key={log._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      log.type === "stock_in" ? "bg-green-100" :
                      log.type === "stock_out" ? "bg-red-100" :
                      "bg-blue-100"
                    }`}>
                      {log.type === "stock_in" ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                       log.type === "stock_out" ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                       <Package className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{product?.name}</p>
                      <p className="text-sm text-gray-600">
                        {log.type === "stock_in" ? "Entrada" :
                         log.type === "stock_out" ? "Salida" :
                         log.type === "adjustment" ? "Ajuste" :
                         log.type === "reserved" ? "Reservado" : "Liberado"}
                        {log.reason && ` - ${log.reason}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      log.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {log.quantity > 0 ? "+" : ""}{log.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}