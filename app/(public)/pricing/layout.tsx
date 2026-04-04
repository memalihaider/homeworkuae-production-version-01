import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Pricing for Cleaning Services in Dubai | Homework UAE',
  description:
    'Explore transparent pricing for premium home, office, and deep cleaning services in Dubai.',
  alternates: {
    canonical: '/pricing',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}