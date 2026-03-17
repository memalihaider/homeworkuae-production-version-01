import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('floor-deep-cleaning')

export default function FloorDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="floor-deep-cleaning" />
      <ServicePageTemplate slug="floor-deep-cleaning" />
    </>
  )
}
