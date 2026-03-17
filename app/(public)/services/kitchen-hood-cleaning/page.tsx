import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('kitchen-hood-cleaning')

export default function KitchenHoodCleaning() {
  return (
    <>
      <ServiceStructuredData slug="kitchen-hood-cleaning" />
      <ServicePageTemplate slug="kitchen-hood-cleaning" />
    </>
  )
}
