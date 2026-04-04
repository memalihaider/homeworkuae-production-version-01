import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Customer Testimonials | Homework UAE',
  description:
    'Read verified reviews and testimonials from homeowners and businesses using Homework UAE cleaning services.',
  alternates: {
    canonical: '/testimonials',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TestimonialsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
