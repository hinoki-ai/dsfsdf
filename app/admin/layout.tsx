"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Wine,
  Shield,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { userId, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock admin check - replace with actual role verification
  const isAdmin = true // This should check user roles from database

  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, isAdmin, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn || !isAdmin) {
    return null // Will redirect
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/productos", icon: Package },
    { name: "Inventario", href: "/admin/inventario", icon: Warehouse },
    { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users },
    { name: "Reportes", href: "/admin/reportes", icon: BarChart3 },
    { name: "Configuración", href: "/admin/configuracion", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-effect border-r border-border/40 shadow-premium transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <Wine className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-amber-400">ARAMAC Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground/70 hover:text-amber-400 hover:bg-amber-400/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-sm font-medium text-foreground/80 rounded-lg hover:bg-amber-400/10 hover:text-amber-400 transition-all duration-200 hover:scale-105"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Regulatory Compliance Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-foreground/90">
              Cumplimiento Normativo
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-400" />
            <span className="text-xs text-muted-foreground">
              Sistema Operativo
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-background/95 backdrop-blur-sm shadow-sm border-b border-border/40">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground/70 hover:text-amber-400 hover:bg-amber-400/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/10 text-green-400 border-green-400/20 hover:bg-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Sistema Activo
              </Badge>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  Administrador
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}