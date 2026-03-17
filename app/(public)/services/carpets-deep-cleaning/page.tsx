import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('carpets-deep-cleaning')

export default function CarpetsDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="carpets-deep-cleaning" />
      <ServicePageTemplate slug="carpets-deep-cleaning" />
    </>
  )
}
