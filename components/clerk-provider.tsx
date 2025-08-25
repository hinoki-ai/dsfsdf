"use client"

import { ClerkProvider } from '@clerk/nextjs'

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    // For development builds without Clerk configuration
    return <>{children}</>
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#dc2626', // Red theme for liquor store
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}