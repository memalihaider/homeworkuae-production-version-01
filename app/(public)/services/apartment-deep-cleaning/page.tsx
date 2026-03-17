import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('apartment-deep-cleaning')

export default function ApartmentDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="apartment-deep-cleaning" />
      <ServicePageTemplate slug="apartment-deep-cleaning" />
    </>
  )
}
