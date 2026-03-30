import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return buildServiceMetadata(params.slug)
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  return (
    <>
      <ServiceStructuredData slug={slug} />
      <ServicePageTemplate slug={slug} />
    </>
  )
}
