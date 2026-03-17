import { DeferredFooter } from '@/shared/components/layout/Footer/DeferredFooter'
import { API_BASE_URL } from '@/shared/config/env'
import { AppProviders } from '@/shared/providers/AppProviders'
import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import { preconnect, prefetchDNS } from 'react-dom'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const getPreconnectOrigins = (): string[] => {
  const origins = new Set<string>()
  const apiUrl = API_BASE_URL

  if (apiUrl) {
    try {
      const parsedApiUrl = new URL(apiUrl)
      if (parsedApiUrl.protocol === 'http:' || parsedApiUrl.protocol === 'https:') {
        const siteOrigin = new URL(siteUrl).origin
        if (parsedApiUrl.origin !== siteOrigin) {
          origins.add(parsedApiUrl.origin)
        }
      }
    } catch {
      // Ignore invalid API URLs; no preconnect hint is emitted.
    }
  }

  return Array.from(origins)
}

const preconnectOrigins = getPreconnectOrigins()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'StudentPerks - Exclusive Student Deals & Discounts',
    template: '%s | StudentPerks',
  },
  description:
    'Discover exclusive deals and discounts for students. Save money on your favorite brands and services.',
  keywords: [
    'student discounts',
    'deals',
    'offers',
    'university perks',
    'student savings',
  ],
  applicationName: 'StudentPerks',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/studentperks-logo-dark.svg',
        type: 'image/svg+xml',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/studentperks-logo-light.svg',
        type: 'image/svg+xml',
      },
      {
        media: '(prefers-color-scheme: light)',
        url: '/studentperks-favicon-light.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/studentperks-favicon-dark.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
    shortcut: ['/studentperks-favicon-light.png'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'StudentPerks',
    title: 'StudentPerks - Exclusive Student Deals & Discounts',
    description:
      'Discover exclusive deals and discounts for students. Save money on your favorite brands and services.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'StudentPerks logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'StudentPerks - Exclusive Student Deals & Discounts',
    description:
      'Discover exclusive deals and discounts for students. Save money on your favorite brands and services.',
    images: ['/icon-512.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  for (const origin of preconnectOrigins) {
    preconnect(origin, { crossOrigin: '' })
    prefetchDNS(origin)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          outfit.className + ' bg-background dark:bg-background min-h-screen'
        }
        suppressHydrationWarning
        style={{
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          minHeight: '100vh',
          WebkitOverflowScrolling: 'touch',
          WebkitTapHighlightColor: 'transparent',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <AppProviders>{children}</AppProviders>
        <DeferredFooter />
      </body>
    </html>
  )
}
