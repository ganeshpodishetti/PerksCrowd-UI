import Navigation from '@/shared/components/layout/Navigation/Navigation'
import type { Metadata } from 'next'
import CategoriesPage from './CategoriesPage'


export const metadata: Metadata = {
  title: 'Categories - PerksCrowd',
  description: 'Browse deals by category',
  alternates: {
    canonical: '/categories',
  },
}

export default function Categories() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-background dark:bg-background">
          <CategoriesPage />
        </div>
      </main>
    </div>
  )
}
