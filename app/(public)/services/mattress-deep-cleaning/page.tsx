import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('mattress-deep-cleaning')

export default function MattressDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="mattress-deep-cleaning" />
      <ServicePageTemplate slug="mattress-deep-cleaning" />
    </>
  )
}
