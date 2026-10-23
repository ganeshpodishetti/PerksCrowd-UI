import { DeferredFooter } from '@/shared/components/layout/Footer/DeferredFooter'
import { API_BASE_URL } from '@/shared/config/env'
import { AppProviders } from '@/shared/providers/AppProviders'
import { RootClientInitializer } from './RootClientInitializer'
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://perkscrowd.com'
const absoluteSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
const brandName = 'PerksCrowd'
const defaultTitle = `${brandName} - Exclusive Student Deals & Discounts`
const defaultDescription =
  'Discover exclusive student deals and discounts from top brands and local favorites. Save more with PerksCrowd.'

const getPreconnectOrigins = (): string[] => {
  const origins = new Set<string>()
  const apiUrl = API_BASE_URL

  if (apiUrl) {
    try {
      const parsedApiUrl = new URL(apiUrl)
      if (parsedApiUrl.protocol === 'http:' || parsedApiUrl.protocol === 'https:') {
        const siteOrigin = new URL(absoluteSiteUrl).origin
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
  metadataBase: new URL(absoluteSiteUrl),
  alternates: {
    canonical: '/',
  },
  title: {
    default: defaultTitle,
    template: `%s | ${brandName}`,
  },
  description: defaultDescription,
  keywords: [
    'student discounts',
    'deals',
    'offers',
    'university perks',
    'student savings',
    'perkscrowd',
  ],
  applicationName: brandName,
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/perkscrowd-logo-dark.svg',
        type: 'image/svg+xml',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/perkscrowd-logo-light.svg',
        type: 'image/svg+xml',
      },
      {
        media: '(prefers-color-scheme: light)',
        url: '/perkscrowd-favicon-light.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/perkscrowd-favicon-dark.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
    shortcut: ['/perkscrowd-favicon-light.png'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    url: absoluteSiteUrl,
    siteName: brandName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: `${brandName} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/icon-512.png'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: brandName,
      url: absoluteSiteUrl,
      logo: `${absoluteSiteUrl}/icon-512.png`,
    },
    {
      '@type': 'WebSite',
      name: brandName,
      url: absoluteSiteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${absoluteSiteUrl}/deals?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

// Escape characters that could terminate the script tag early. JSON.stringify
// alone does not make embedded values safe for an HTML script context.
const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

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
          outfit.className + ' bg-background dark:bg-background min-h-screen safe-area-shell'
        }
        suppressHydrationWarning
      >
        <script
          id="theme-init"
          // Applies the stored/system theme before first paint to avoid a light flash.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);if(!t&&d){localStorage.setItem('theme','dark')}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          // Structured data helps search engines understand the brand and on-site search.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
        <RootClientInitializer />
        <AppProviders>{children}</AppProviders>
        <DeferredFooter />
      </body>
    </html>
  )
}
