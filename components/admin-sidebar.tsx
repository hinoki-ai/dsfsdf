"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Wine,
  Shield,
  CheckCircle,
  FileText,
  HelpCircle,
  Search,
  Bell,
  TrendingUp
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Liquor store navigation data
const liquorNavigation = {
  main: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Productos",
      url: "/admin/productos",
      icon: Wine,
      badge: null,
    },
    {
      title: "Inventario",
      url: "/admin/inventario",
      icon: Warehouse,
      badge: "bajo",
    },
    {
      title: "Pedidos",
      url: "/admin/pedidos",
      icon: ShoppingCart,
      badge: "3",
    },
    {
      title: "Clientes",
      url: "/admin/usuarios",
      icon: Users,
      badge: null,
    },
    {
      title: "Reportes",
      url: "/admin/reportes",
      icon: BarChart3,
      badge: null,
    },
  ],
  compliance: [
    {
      title: "Verificación Edad",
      url: "/admin/age-verification",
      icon: Shield,
      badge: null,
    },
    {
      title: "Cumplimiento Legal",
      url: "/admin/compliance",
      icon: FileText,
      badge: null,
    },
    {
      title: "Alertas Sistema",
      url: "/admin/alerts",
      icon: Bell,
      badge: "2",
    },
  ],
  tools: [
    {
      title: "Configuración",
      url: "/admin/configuracion",
      icon: Settings,
      badge: null,
    },
    {
      title: "Búsqueda",
      url: "/admin/search",
      icon: Search,
      badge: null,
    },
    {
      title: "Ayuda",
      url: "/admin/help",
      icon: HelpCircle,
      badge: null,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/40" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-amber-400/10 hover:text-amber-400"
            >
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black">
                  <Wine className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-amber-400">
                    ARAMAC Liquor
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Panel de Administración
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-400/80">
            Gestión Principal
          </SidebarGroupLabel>
          <SidebarMenu>
            {liquorNavigation.main.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  className="hover:bg-amber-400/10 hover:text-amber-400 data-[active=true]:bg-amber-400/20 data-[active=true]:text-amber-400"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="bg-amber-400/20 text-amber-300 text-xs px-1.5 py-0.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-red-400/80">
            Cumplimiento Legal
          </SidebarGroupLabel>
          <SidebarMenu>
            {liquorNavigation.compliance.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  className="hover:bg-red-400/10 hover:text-red-400 data-[active=true]:bg-red-400/20 data-[active=true]:text-red-400"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="bg-red-500/20 text-red-300 text-xs px-1.5 py-0.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-muted-foreground">
            Herramientas
          </SidebarGroupLabel>
          <SidebarMenu>
            {liquorNavigation.tools.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  className="hover:bg-muted/50 hover:text-foreground/80"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1.5 py-0.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-2 p-2">
              {/* Compliance Status */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle className="size-3 text-green-400" />
                  <span className="text-green-400">Sistema Operativo</span>
                </div>
              </div>
              
              {/* Performance Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="size-3 text-blue-400" />
                  <span className="text-muted-foreground">Performance OK</span>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}