import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Careers at Homework UAE | Join Our Team',
  description:
    'Explore current job openings and career opportunities at Homework UAE in Dubai.',
  alternates: {
    canonical: '/careers',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CareersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
