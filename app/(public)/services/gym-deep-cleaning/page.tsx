import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('gym-deep-cleaning')

export default function GymDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="gym-deep-cleaning" />
      <ServicePageTemplate slug="gym-deep-cleaning" />
    </>
  )
}
