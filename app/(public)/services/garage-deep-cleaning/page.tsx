import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('garage-deep-cleaning')

export default function GarageDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="garage-deep-cleaning" />
      <ServicePageTemplate slug="garage-deep-cleaning" />
    </>
  )
}
