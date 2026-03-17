import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('facade-cleaning')

export default function FacadeCleaning() {
  return (
    <>
      <ServiceStructuredData slug="facade-cleaning" />
      <ServicePageTemplate slug="facade-cleaning" />
    </>
  )
}
