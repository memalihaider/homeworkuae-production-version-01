import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('window-cleaning')

export default function WindowCleaning() {
  return (
    <>
      <ServiceStructuredData slug="window-cleaning" />
      <ServicePageTemplate slug="window-cleaning" />
    </>
  )
}
