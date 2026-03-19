import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HomePageClient, HomePageLoadingFallback } from './HomePageClient'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export const dynamic = 'force-static'
export const revalidate = 3600

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageLoadingFallback />}>
      <HomePageClient sectionedFeeds={true} />
    </Suspense>
  )
}
