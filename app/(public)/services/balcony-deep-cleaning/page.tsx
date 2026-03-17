import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('balcony-deep-cleaning')

export default function BalconyDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="balcony-deep-cleaning" />
      <ServicePageTemplate slug="balcony-deep-cleaning" />
    </>
  )
}
