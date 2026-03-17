import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('water-tank-cleaning')

export default function WaterTankCleaning() {
  return (
    <>
      <ServiceStructuredData slug="water-tank-cleaning" />
      <ServicePageTemplate slug="water-tank-cleaning" />
    </>
  )
}
