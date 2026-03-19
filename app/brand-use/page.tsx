import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand & Fair Use',
  description: 'Policy for use of third-party logos, trademarks, and brand images on PerksCrowd.',
  alternates: {
    canonical: '/brand-use',
  },
}

export default function BrandUsePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
        Brand & Fair Use Policy
      </h1>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        Last updated: March 15, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Allowed Use</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Use only what is necessary to identify the store, service, or promotion.</li>
            <li>Use official logos from brand-provided sources when possible.</li>
            <li>Keep logos accurate and do not edit in a way that changes brand meaning.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Not Allowed</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Implying sponsorship, endorsement, or partnership without written permission.</li>
            <li>Uploading logos or images you do not have rights to use.</li>
            <li>Using copyrighted promotional graphics outside the source deal context.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Best-Practice Guidance</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Prefer plain text brand names when logo rights are unclear.</li>
            <li>Link directly to the official deal page as attribution context.</li>
            <li>Remove or replace assets quickly if a rights holder objects.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Rights Holder Contact</h2>
          <p className="mt-2">
            Rights holders can request updates or removal of brand assets by contacting PerksCrowd with the listing URL and
            proof of ownership.
          </p>
        </section>
      </div>
    </main>
  )
}

