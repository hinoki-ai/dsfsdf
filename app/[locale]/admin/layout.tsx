"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { CheckCircle, TrendingUp } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { userId, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Mock admin check - replace with actual role verification
  const isAdmin = true // This should check user roles from database

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, isAdmin, router])

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn || !isAdmin) {
    return null // Will redirect
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <SidebarInset>
        {/* Modern Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-border/40 bg-background/95 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1 text-foreground/70 hover:text-amber-400" />
          
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground/90">
                Panel de Administración - Licorería ARAMAC
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* System Status */}
              <Badge 
                className="bg-green-500/10 text-green-400 border-green-400/20 hover:bg-green-500/20"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Sistema Activo
              </Badge>

              {/* Performance Badge */}
              <Badge 
                className="bg-blue-500/10 text-blue-400 border-blue-400/20 hover:bg-blue-500/20"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Performance OK
              </Badge>

              {/* Admin Indicator */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  Administrador
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-6">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min border border-border/40 glass-effect p-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}