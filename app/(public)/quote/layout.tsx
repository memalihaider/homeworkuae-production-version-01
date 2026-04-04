import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Get a Free Cleaning Quote | Homework UAE',
  description:
    'Request a fast and transparent cleaning quote for residential and commercial services in Dubai.',
  alternates: {
    canonical: '/quote',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function QuoteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
