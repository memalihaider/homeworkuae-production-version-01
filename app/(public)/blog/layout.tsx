import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Cleaning Blog & Expert Tips | Homework UAE',
  description:
    'Discover practical cleaning guides, maintenance tips, and hygiene insights for homes and offices in Dubai.',
  alternates: {
    canonical: '/blog',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
