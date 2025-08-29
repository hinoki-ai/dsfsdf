"use client"

import Link from "next/link"
import { useAuth, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/providers/i18n-provider"
import {
  ShoppingCart,
  User,
  Menu,
  Wine,
  Search,
  Heart
} from "lucide-react"

interface HeaderProps {
  cartItemCount?: number
  wishlistCount?: number
}

export function Header({ cartItemCount = 0, wishlistCount = 0 }: HeaderProps) {
  const { isSignedIn } = useAuth()
  const t = useI18n()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Wine className="h-8 w-8 text-red-600" />
          <span className="text-xl font-bold text-red-600">Licorería ARAMAC</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/productos"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('nav.products')}
          </Link>
          <Link
            href="/categorias"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('nav.categories')}
          </Link>
          <Link
            href="/promociones"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('nav.promotions')}
          </Link>
          <Link
            href="/nosotros"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('nav.about')}
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('nav.contact')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">{t('nav.search')}</span>
          </Button>

          {/* Wishlist */}
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {wishlistCount}
                </Badge>
              )}
              <span className="sr-only">{t('nav.wishlist')}</span>
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/carrito">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">{t('nav.cart')}</span>
            </Button>
          </Link>

          {/* User Account */}
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t('common.menu', { defaultValue: 'Menu' })}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}