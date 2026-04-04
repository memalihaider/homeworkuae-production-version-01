import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Book Cleaning Service in Dubai | Homework UAE',
  description:
    'Book professional cleaning services in Dubai with Homework UAE. Quick scheduling and trusted service teams.',
  alternates: {
    canonical: '/book-service',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BookServiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
