# PerksCrowd

**Get Exclusive Student Deals from Top Brands**

PerksCrowd connects students with real discounts and exclusive offers. Browse deals, save money, and earn rewards—all in one place.

## What We Do

- 🎓 **Curated Deals** – Verified discounts from brands students actually use
- 🏪 **Browse by Store** – Find deals from your favorite retailers
- 🎯 **University-Specific** – Deals tailored to your school
- 💰 **Save Money** – One-click promo codes and direct links
- 📱 **Fast & Easy** – Discover deals in seconds

## For Students

Join thousands of students saving with PerksCrowd. No hidden fees. No spam.

## For Brands & Partners

Reach engaged student audiences with targeted offers. Get analytics on engagement and conversions.

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build + Cloudflare worker bundle
npm test             # Run tests
npm run lint         # Check code quality
```

## Deploying to Cloudflare

`npm run build` runs `next build`, then the `postbuild` hook bundles the worker to `.open-next/worker.js`.

In Cloudflare Workers Builds, set the build command to `npm run build` and the deploy command to `npx wrangler preview` for preview deployments or `npx wrangler deploy` for production.

## Tech

Built with Next.js, TypeScript, React Query, and Tailwind CSS for blazing-fast performance and beautiful UI.

---

Made with ❤️ for students. [Visit PerksCrowd](https://perkscrowd.com)


