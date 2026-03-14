import { Suspense } from 'react'
import { HomePageClient, HomePageLoadingFallback } from './HomePageClient'

// Force prerendering of the home document so it can be served from cache/CDN.
export const dynamic = 'force-static'
export const revalidate = 3600

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageLoadingFallback />}>
      <HomePageClient />
    </Suspense>
  )
}
