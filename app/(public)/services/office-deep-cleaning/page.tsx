import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('office-deep-cleaning')

export default function OfficeDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="office-deep-cleaning" />
      <ServicePageTemplate slug="office-deep-cleaning" />
    </>
  )
}
