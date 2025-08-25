"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = "md", 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-amber-500",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className={cn(
          "text-muted-foreground animate-pulse",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="group overflow-hidden transition-all duration-300 glass-effect rounded-lg">
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/30 animate-pulse" />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded w-24" />
            <div className="h-4 bg-muted animate-pulse rounded w-16" />
          </div>
          <div className="h-10 bg-muted animate-pulse rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export function PageLoading({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4 text-lg">{message}</p>
      </div>
    </div>
  )
}