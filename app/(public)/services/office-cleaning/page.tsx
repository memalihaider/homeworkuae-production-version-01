import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('office-cleaning')

export default function OfficeCleaning() {
  return (
    <>
      <ServiceStructuredData slug="office-cleaning" />
      <ServicePageTemplate slug="office-cleaning" />
    </>
  )
}
