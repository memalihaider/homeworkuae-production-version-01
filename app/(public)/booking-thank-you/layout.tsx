import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Booking Confirmed | Homework UAE',
  description:
    'Your booking request has been received by Homework UAE. We will confirm details with you shortly.',
  alternates: {
    canonical: '/booking-thank-you',
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

export default function BookingThankYouLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}