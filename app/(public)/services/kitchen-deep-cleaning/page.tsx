import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('kitchen-deep-cleaning')

export default function KitchenDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="kitchen-deep-cleaning" />
      <ServicePageTemplate slug="kitchen-deep-cleaning" />
    </>
  )
}
