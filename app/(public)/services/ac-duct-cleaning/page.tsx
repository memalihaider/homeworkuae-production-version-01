import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('ac-duct-cleaning')

export default function ACDuctCleaning() {
  return (
    <>
      <ServiceStructuredData slug="ac-duct-cleaning" />
      <ServicePageTemplate slug="ac-duct-cleaning" />
    </>
  )
}
