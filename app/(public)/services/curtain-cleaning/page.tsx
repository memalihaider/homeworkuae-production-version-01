import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

const baseMetadata = buildServiceMetadata('curtain-cleaning')

export const metadata: Metadata = {
  ...baseMetadata,
  title: '#1 Curtain Cleaning Service in Dubai | Homework UAE',
  description:
    'Homework UAE provides professional curtain cleaning in Dubai for homes and offices. Remove dust, stains, and odors with fabric-safe steam cleaning and fast drying.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: '#1 Curtain Cleaning Service in Dubai | Homework UAE',
    description:
      'Homework UAE provides professional curtain cleaning in Dubai for homes and offices. Remove dust, stains, and odors with fabric-safe steam cleaning and fast drying.',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: '#1 Curtain Cleaning Service in Dubai | Homework UAE',
    description:
      'Homework UAE provides professional curtain cleaning in Dubai for homes and offices. Remove dust, stains, and odors with fabric-safe steam cleaning and fast drying.',
  },
}

export default function CurtainCleaning() {
  return (
    <>
      <ServiceStructuredData slug="curtain-cleaning" />
      <ServicePageTemplate slug="curtain-cleaning" />
    </>
  )
}
