import nextDynamic from 'next/dynamic'

const Navigation = nextDynamic(() => import('@/shared/components/layout/Navigation/Navigation'), {
  ssr: true,
})

export const revalidate = 3600

export default function HomePage() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow bg-background dark:bg-background" />
    </div>
  )
}
