import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('move-in-out-cleaning')

export default function MoveInOutCleaning() {
  return (
    <>
      <ServiceStructuredData slug="move-in-out-cleaning" />
      <ServicePageTemplate slug="move-in-out-cleaning" />
    </>
  )
}
