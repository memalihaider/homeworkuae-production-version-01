import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Homework UAE',
  description:
    'Read the Homework UAE privacy policy to understand how personal information is collected, used, and protected.',
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
