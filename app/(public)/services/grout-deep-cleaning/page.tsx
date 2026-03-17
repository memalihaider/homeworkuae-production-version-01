import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('grout-deep-cleaning')

export default function GroutDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="grout-deep-cleaning" />
      <ServicePageTemplate slug="grout-deep-cleaning" />
    </>
  )
}
