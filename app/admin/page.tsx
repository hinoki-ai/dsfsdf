"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wine,
  BarChart3,
  AlertCircle,
  Shield,
  Warehouse
} from "lucide-react"

export default function AdminDashboard() {
  // Mock data - replace with real data from Convex
  const stats = [
    {
      title: "Ventas del Mes",
      value: "$2,450,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs mes anterior"
    },
    {
      title: "Pedidos Activos",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      description: "pendientes de entrega"
    },
    {
      title: "Productos en Stock",
      value: "1,247",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      description: "unidades disponibles"
    },
    {
      title: "Clientes Activos",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      description: "con compras recientes"
    }
  ]

  const recentOrders = [
    {
      id: "#001234",
      customer: "María González",
      product: "Vino Cabernet Sauvignon",
      amount: "$15,990",
      status: "pending",
      time: "2 min ago"
    },
    {
      id: "#001235",
      customer: "Juan Pérez",
      product: "Whisky Escocés + Vodka",
      amount: "$89,990",
      status: "processing",
      time: "15 min ago"
    },
    {
      id: "#001236",
      customer: "Ana López",
      product: "Cerveza Artesanal (x6)",
      amount: "$17,940",
      status: "shipped",
      time: "1 hour ago"
    }
  ]

  const lowStockAlerts = [
    {
      product: "Ron Havana Club 7 Años",
      currentStock: 3,
      minThreshold: 5,
      status: "critical"
    },
    {
      product: "Vino Concha y Toro",
      currentStock: 8,
      minThreshold: 10,
      status: "warning"
    },
    {
      product: "Whisky Glenfiddich 18",
      currentStock: 2,
      minThreshold: 3,
      status: "critical"
    }
  ]

  const regulatoryAlerts = [
    {
      type: "age_verification",
      message: "5 pedidos requieren verificación de edad adicional",
      severity: "medium",
      time: "30 min ago"
    },
    {
      type: "delivery_restriction",
      message: "1 pedido con restricción regional detectada",
      severity: "high",
      time: "1 hour ago"
    },
    {
      type: "quantity_limit",
      message: "Sistema de límites de cantidad funcionando correctamente",
      severity: "low",
      time: "2 hours ago"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-status-warning-bg text-status-warning-text border-status-warning-border"
      case "processing": return "bg-status-required-bg text-status-required-text border-status-required-border"
      case "shipped": return "bg-status-allowed-bg text-status-allowed-text border-status-allowed-border"
      case "critical": return "bg-status-restricted-bg text-status-restricted-text border-status-restricted-border"
      case "warning": return "bg-status-warning-bg text-status-warning-text border-status-warning-border"
      case "high": return "bg-status-restricted-bg text-status-restricted-text border-status-restricted-border"
      case "medium": return "bg-status-warning-bg text-status-warning-text border-status-warning-border"
      case "low": return "bg-status-allowed-bg text-status-allowed-text border-status-allowed-border"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />
      case "processing": return <BarChart3 className="w-4 h-4" />
      case "shipped": return <CheckCircle className="w-4 h-4" />
      case "critical": return <AlertTriangle className="w-4 h-4" />
      case "warning": return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Gestiona tu tienda de licores y bebidas alcoholicas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-status-allowed-bg text-status-allowed-text border-status-allowed-border">
            <Shield className="w-3 h-3 mr-1" />
            Sistema Seguro
          </Badge>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Reportes
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                  <div className={`flex items-center mt-2 ${
                    stat.trend === "up" ? "text-status-allowed-text" : "text-status-restricted-text"
                  }`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Pedidos Recientes
            </CardTitle>
            <CardDescription>
              Últimos pedidos realizados en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {order.customer} • {order.product}
                    </p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.amount}</p>
                    <Button variant="ghost" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Alertas de Inventario
            </CardTitle>
            <CardDescription>
              Productos con stock bajo que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Wine className="w-4 h-4 text-amber-600" />
                      <span className="font-medium">{alert.product}</span>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status === "critical" ? "Crítico" : "Bajo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Stock actual: {alert.currentStock} • Mínimo: {alert.minThreshold}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Reponer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Compliance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Alertas de Cumplimiento Normativo
          </CardTitle>
          <CardDescription>
            Monitoreo automático de regulaciones chilenas para venta de alcohol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regulatoryAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${
                      alert.severity === "high" ? "text-red-600" :
                      alert.severity === "medium" ? "text-yellow-600" :
                      "text-green-600"
                    }`} />
                    <span className="font-medium">{alert.message}</span>
                    <Badge className={getStatusColor(alert.severity)}>
                      {alert.severity === "high" ? "Alta" :
                       alert.severity === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {alert.time}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Revisar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Funciones más utilizadas para gestión diaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col" variant="outline">
              <Package className="w-6 h-6 mb-2" />
              Agregar Producto
            </Button>
            <Button className="h-20 flex-col" variant="outline">
              <Warehouse className="w-6 h-6 mb-2" />
              Gestionar Inventario
            </Button>
            <Button className="h-20 flex-col" variant="outline">
              <ShoppingCart className="w-6 h-6 mb-2" />
              Ver Pedidos
            </Button>
            <Button className="h-20 flex-col" variant="outline">
              <BarChart3 className="w-6 h-6 mb-2" />
              Ver Reportes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}