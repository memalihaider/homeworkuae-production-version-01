import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

const baseMetadata = buildServiceMetadata('maid-cleaning-service')

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Maid Cleaning Service in Dubai | Homework UAE',
  description:
    'Book a professional maid cleaning service in Dubai with Homework UAE. Trained maids, flexible schedules, and reliable home cleaning for apartments and villas.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Maid Cleaning Service in Dubai | Homework UAE',
    description:
      'Book a professional maid cleaning service in Dubai with Homework UAE. Trained maids, flexible schedules, and reliable home cleaning for apartments and villas.',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Maid Cleaning Service in Dubai | Homework UAE',
    description:
      'Book a professional maid cleaning service in Dubai with Homework UAE. Trained maids, flexible schedules, and reliable home cleaning for apartments and villas.',
  },
}

export default function MaidCleaningService() {
  return (
    <>
      <ServiceStructuredData slug="maid-cleaning-service" />
      <ServicePageTemplate slug="maid-cleaning-service" />
    </>
  )
}
