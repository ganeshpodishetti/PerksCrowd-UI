import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HomePageClient, HomePageLoadingFallback } from '../HomePageClient'

export const metadata: Metadata = {
  title: 'Deals - PerksCrowd',
  description: 'Browse the latest student deals and discounts.',
  alternates: {
    canonical: '/deals',
  },
}

export const dynamic = 'force-static'
export const revalidate = 3600

export default function DealsPage() {
  return (
    <Suspense fallback={<HomePageLoadingFallback />}>
      <HomePageClient />
    </Suspense>
  )
}


