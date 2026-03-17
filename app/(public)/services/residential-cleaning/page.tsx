import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('residential-cleaning')

export default function ResidentialCleaning() {
  return (
    <>
      <ServiceStructuredData slug="residential-cleaning" />
      <ServicePageTemplate slug="residential-cleaning" />
    </>
  )
}
