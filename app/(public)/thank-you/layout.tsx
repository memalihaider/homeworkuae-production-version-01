import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Thank You | Homework UAE',
  description:
    'Thank you for contacting Homework UAE. Our team will get back to you shortly.',
  alternates: {
    canonical: '/thank-you',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ThankYouLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
