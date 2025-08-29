"use client"

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey || 
      publishableKey === 'pk_test_placeholder' || 
      publishableKey === 'pk_test_51234567890abcdef1234567890abcdef1234567890' ||
      publishableKey.length < 10) {
    // For development builds without Clerk configuration or with placeholder keys
    console.log('Clerk not configured or using placeholder keys, skipping authentication')
    return <>{children}</>
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#f59e0b', // Amber primary for premium liquor feel
          colorSuccess: '#10b981', // Emerald for success states
          colorWarning: '#f59e0b', // Amber for warnings
          colorDanger: '#ef4444',  // Red for dangers/errors
          colorTextOnPrimaryBackground: '#000000', // Black text on amber
          colorInputBackground: 'rgba(255, 255, 255, 0.05)',
          colorInputText: '#f3f4f6',
          borderRadius: '0.75rem', // Consistent with Tailwind radius
          spacingUnit: '1rem',
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
          },
        },
        elements: {
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'none',
            boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px 0 rgba(245, 158, 11, 0.35)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          card: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.125)',
            borderRadius: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
          },
          headerTitle: {
            color: '#f59e0b',
            fontSize: '1.5rem',
            fontWeight: '700',
          },
          headerSubtitle: {
            color: '#9ca3af',
            fontSize: '0.875rem',
            fontWeight: '400',
          },
          socialButtonsBlockButton: {
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '0.75rem',
            color: '#f3f4f6',
            fontSize: '0.875rem',
            fontWeight: '500',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.12)',
              transform: 'translateY(-1px)',
            },
          },
          dividerLine: {
            background: 'rgba(255, 255, 255, 0.15)',
            height: '1px',
          },
          dividerText: {
            color: '#9ca3af',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase',
          },
          formFieldInput: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '0.5rem',
            color: '#f3f4f6',
            fontSize: '0.875rem',
            '&:focus': {
              borderColor: '#f59e0b',
              boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.1)',
            },
            '&::placeholder': {
              color: '#6b7280',
            },
          },
          formFieldLabel: {
            color: '#d1d5db',
            fontSize: '0.875rem',
            fontWeight: '500',
          },
          identityPreviewText: {
            color: '#9ca3af',
            fontSize: '0.875rem',
          },
          identityPreviewEditButton: {
            color: '#f59e0b',
            fontSize: '0.75rem',
            fontWeight: '600',
            '&:hover': {
              color: '#d97706',
            },
          },
          footerActionText: {
            color: '#9ca3af',
            fontSize: '0.875rem',
          },
          footerActionLink: {
            color: '#f59e0b',
            fontSize: '0.875rem',
            fontWeight: '600',
            textDecoration: 'none',
            '&:hover': {
              color: '#d97706',
              textDecoration: 'underline',
            },
          },
          alert: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.5rem',
            color: '#fca5a5',
            fontSize: '0.875rem',
          },
        },
        layout: {
          logoPlacement: 'inside',
          showOptionalFields: false,
          socialButtonsVariant: 'blockButton',
          socialButtonsPlacement: 'top',
        },
      }}
      afterSignInUrl="/admin"
      afterSignUpUrl="/admin"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  )
}