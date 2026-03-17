import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('grease-trap-cleaning')

export default function GreaseTrapCleaning() {
  return (
    <>
      <ServiceStructuredData slug="grease-trap-cleaning" />
      <ServicePageTemplate slug="grease-trap-cleaning" />
    </>
  )
}
