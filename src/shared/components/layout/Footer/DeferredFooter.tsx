'use client'

import dynamic from 'next/dynamic'

const Footer = dynamic(
  () => import('@/shared/components/layout/Footer/Footer').then((mod) => mod.Footer),
  {
    ssr: false,
  }
)

export function DeferredFooter() {
  return <Footer />
}

