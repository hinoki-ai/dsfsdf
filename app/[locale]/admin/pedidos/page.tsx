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
  ShoppingCart,
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Filter
} from "lucide-react"

interface Order {
  _id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    street: string
    city: string
    region: string
    postalCode: string
  }
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  total: number
  shippingCost: number
  ageVerification: {
    isVerified: boolean
    verifiedAt?: number
  }
  regulatoryCompliance: {
    isCompliant: boolean
    restrictions: string[]
  }
  createdAt: number
  updatedAt: number
}

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)

  // Mock data - replace with real data from Convex
  const orders: Order[] = [
    {
      _id: "1",
      orderNumber: "ARAMAC-001234",
      customer: {
        name: "María González",
        email: "maria.gonzalez@email.com",
        phone: "+56 9 1234 5678"
      },
      items: [
        {
          productId: "1",
          name: "Concha y Toro Cabernet Sauvignon",
          quantity: 2,
          price: 15990
        },
        {
          productId: "3",
          name: "Kunstmann Torobayo Pale Ale",
          quantity: 1,
          price: 4990
        }
      ],
      shippingAddress: {
        street: "Av. Providencia 123",
        city: "Santiago",
        region: "Metropolitana",
        postalCode: "7500000"
      },
      status: "pending",
      paymentStatus: "paid",
      total: 36970,
      shippingCost: 2500,
      ageVerification: {
        isVerified: true,
        verifiedAt: Date.now() - 3600000
      },
      regulatoryCompliance: {
        isCompliant: true,
        restrictions: []
      },
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 1800000
    },
    {
      _id: "2",
      orderNumber: "ARAMAC-001235",
      customer: {
        name: "Juan Pérez",
        email: "juan.perez@email.com",
        phone: "+56 9 8765 4321"
      },
      items: [
        {
          productId: "2",
          name: "Havana Club 7 Años",
          quantity: 1,
          price: 34990
        }
      ],
      shippingAddress: {
        street: "Calle Los Leones 456",
        city: "Santiago",
        region: "Metropolitana",
        postalCode: "7510000"
      },
      status: "processing",
      paymentStatus: "paid",
      total: 37490,
      shippingCost: 2500,
      ageVerification: {
        isVerified: true,
        verifiedAt: Date.now() - 7200000
      },
      regulatoryCompliance: {
        isCompliant: true,
        restrictions: []
      },
      createdAt: Date.now() - 7200000,
      updatedAt: Date.now() - 3600000
    },
    {
      _id: "3",
      orderNumber: "ARAMAC-001236",
      customer: {
        name: "Ana López",
        email: "ana.lopez@email.com",
        phone: "+56 9 5555 1234"
      },
      items: [
        {
          productId: "3",
          name: "Kunstmann Torobayo Pale Ale",
          quantity: 6,
          price: 4990
        }
      ],
      shippingAddress: {
        street: "Av. Apoquindo 789",
        city: "Las Condes",
        region: "Metropolitana",
        postalCode: "7550000"
      },
      status: "shipped",
      paymentStatus: "paid",
      total: 32440,
      shippingCost: 5000,
      ageVerification: {
        isVerified: true,
        verifiedAt: Date.now() - 86400000
      },
      regulatoryCompliance: {
        isCompliant: true,
        restrictions: []
      },
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 43200000
    }
  ]

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "confirmed": return "bg-blue-100 text-blue-800"
      case "processing": return "bg-purple-100 text-purple-800"
      case "shipped": return "bg-indigo-100 text-indigo-800"
      case "delivered": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />
      case "confirmed": return <CheckCircle className="w-4 h-4" />
      case "processing": return <Package className="w-4 h-4" />
      case "shipped": return <Truck className="w-4 h-4" />
      case "delivered": return <CheckCircle className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
    }
  }

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "paid": return "bg-green-100 text-green-800"
      case "refunded": return "bg-blue-100 text-blue-800"
      case "failed": return "bg-red-100 text-red-800"
    }
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

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
    }
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Administra todos los pedidos de la plataforma
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros Avanzados
          </Button>
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Pedidos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Procesando
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.processing}
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Enviados
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.shipped}
                </p>
              </div>
              <Truck className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Entregados
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.delivered}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Ingresos Totales
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Pedidos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por número de pedido, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status">Estado del Pedido</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Pedidos ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Lista completa de pedidos realizados en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Verificación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order._id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                      <p className="text-sm text-gray-500">{order.customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} unidades
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                      <p className="text-sm text-gray-500">+{formatCurrency(order.shippingCost)} envío</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      <span className="capitalize">{order.paymentStatus}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.ageVerification.isVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificada
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={isOrderDialogOpen && selectedOrder?._id === order._id} onOpenChange={setIsOrderDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Pedido {order.orderNumber}</DialogTitle>
                            <DialogDescription>
                              Información completa del pedido realizado por {order.customer.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Información del Cliente
                                </h3>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Nombre:</strong> {order.customer.name}</p>
                                  <p><strong>Email:</strong> {order.customer.email}</p>
                                  <p><strong>Teléfono:</strong> {order.customer.phone}</p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Dirección de Envío
                                </h3>
                                <div className="space-y-1 text-sm">
                                  <p>{order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                                  <p>{order.shippingAddress.postalCode}</p>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h3 className="font-semibold mb-2">Productos</h3>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Subtotal:</span>
                                <span>{formatCurrency(order.total - order.shippingCost)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Envío:</span>
                                <span>{formatCurrency(order.shippingCost)}</span>
                              </div>
                              <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                                <span>Total:</span>
                                <span>{formatCurrency(order.total)}</span>
                              </div>
                            </div>

                            {/* Compliance Info */}
                            {!order.regulatoryCompliance.isCompliant && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded">
                                <h3 className="font-semibold text-red-800 mb-2">Restricciones Regulatorias</h3>
                                <ul className="text-sm text-red-700 list-disc list-inside">
                                  {order.regulatoryCompliance.restrictions.map((restriction, index) => (
                                    <li key={index}>{restriction}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-4 border-t">
                              <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                                Cerrar
                              </Button>
                              <Button>
                                Actualizar Estado
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Status Update Dropdown */}
                      <Select onValueChange={(value) => handleUpdateOrderStatus(order._id, value as Order["status"])}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Cambiar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmar</SelectItem>
                          <SelectItem value="processing">Procesar</SelectItem>
                          <SelectItem value="shipped">Enviar</SelectItem>
                          <SelectItem value="delivered">Entregar</SelectItem>
                          <SelectItem value="cancelled">Cancelar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}