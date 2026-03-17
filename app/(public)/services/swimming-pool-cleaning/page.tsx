import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('swimming-pool-cleaning')

export default function SwimmingPoolCleaning() {
  return (
    <>
      <ServiceStructuredData slug="swimming-pool-cleaning" />
      <ServicePageTemplate slug="swimming-pool-cleaning" />
    </>
  )
}
