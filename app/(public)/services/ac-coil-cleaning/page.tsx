import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('ac-coil-cleaning')

export default function ACCoilCleaning() {
  return (
    <>
      <ServiceStructuredData slug="ac-coil-cleaning" />
      <ServicePageTemplate slug="ac-coil-cleaning" />
    </>
  )
}
