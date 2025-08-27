'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Report to analytics and error tracking
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ errors }) => {
        errors.trackError({
          type: 'react_error_boundary',
          message: error.message,
          stack: error.stack,
          filename: errorInfo.componentStack?.split('\n')[1]?.trim()
        })
      })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect border-red-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-xl text-red-400">Error Inesperado</CardTitle>
          <CardDescription className="text-gray-300">
            Algo salió mal mientras cargábamos la página
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-300 font-mono">
              {error.message || 'Error desconocido'}
            </p>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer mb-2">Detalles técnicos</summary>
              <pre className="whitespace-pre-wrap text-xs bg-gray-900/50 p-2 rounded">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-3">
          <Button 
            onClick={retry}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar Nuevamente
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Specialized error boundaries for different sections
export function ProductErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <Card className="p-6 text-center glass-effect border-amber-500/20">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-400 mb-2">
            Error al cargar productos
          </h3>
          <p className="text-gray-300 mb-4">
            No pudimos cargar la información del producto
          </p>
          <Button onClick={retry} className="bg-amber-600 hover:bg-amber-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recargar
          </Button>
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export function CheckoutErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <Card className="p-6 text-center glass-effect border-red-500/20">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Error en el proceso de compra
          </h3>
          <p className="text-gray-300 mb-4">
            Hubo un problema durante el checkout
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={retry} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
            <Button 
              onClick={() => window.location.href = '/carrito'}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Volver al Carrito
            </Button>
          </div>
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}