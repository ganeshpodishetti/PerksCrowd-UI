import Navigation from '@/shared/components/layout/Navigation/Navigation'
import type { Metadata } from 'next'
import StoresPage from './StoresPage'


export const metadata: Metadata = {
  title: 'Brands - StudentPerks',
  description: 'Browse deals by brand',
}

export default function Stores() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-background dark:bg-background">
          <StoresPage />
        </div>
      </main>
    </div>
  )
}
