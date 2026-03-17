import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

export const metadata: Metadata = buildServiceMetadata('restaurant-cleaning')

export default function RestaurantCleaning() {
  return (
    <>
      <ServiceStructuredData slug="restaurant-cleaning" />
      <ServicePageTemplate slug="restaurant-cleaning" />
    </>
  )
}
