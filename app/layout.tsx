import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import { getLocale } from '@/lib/i18n-server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Licorería ARAMAC',
  description: 'Premium liquor store in Chile',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the user's locale preference
  const locale = await getLocale()

  // Redirect to the appropriate locale
  redirect(`/${locale}`)
}