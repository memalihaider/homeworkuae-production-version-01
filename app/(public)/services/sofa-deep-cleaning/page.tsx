import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('sofa-deep-cleaning')

export default function SofaDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="sofa-deep-cleaning" />
      <ServicePageTemplate slug="sofa-deep-cleaning" />
    </>
  )
}
