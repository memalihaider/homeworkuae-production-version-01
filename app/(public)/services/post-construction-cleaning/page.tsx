import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('post-construction-cleaning')

export default function PostConstructionCleaning() {
  return (
    <>
      <ServiceStructuredData slug="post-construction-cleaning" />
      <ServicePageTemplate slug="post-construction-cleaning" />
    </>
  )
}
