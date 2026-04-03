import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/ServicePageTemplate'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'

const baseMetadata = buildServiceMetadata('kitchen-deep-cleaning')

export const metadata: Metadata = {
  ...baseMetadata,
  title: '#1 Kitchen Cleaning Service in Dubai | Homework UAE',
  description:
    'Homework UAE delivers expert kitchen deep cleaning in Dubai for homes and businesses. We remove grease, grime, and bacteria from cabinets, appliances, tiles, and floors using eco-friendly products and certified professionals.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: '#1 Kitchen Cleaning Service in Dubai | Homework UAE',
    description:
      'Homework UAE delivers expert kitchen deep cleaning in Dubai for homes and businesses. We remove grease, grime, and bacteria from cabinets, appliances, tiles, and floors using eco-friendly products and certified professionals.',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: '#1 Kitchen Cleaning Service in Dubai | Homework UAE',
    description:
      'Homework UAE delivers expert kitchen deep cleaning in Dubai for homes and businesses. We remove grease, grime, and bacteria from cabinets, appliances, tiles, and floors using eco-friendly products and certified professionals.',
  },
}

export default function KitchenDeepCleaning() {
  return (
    <>
      <ServiceStructuredData slug="kitchen-deep-cleaning" />
      <ServicePageTemplate slug="kitchen-deep-cleaning" />
    </>
  )
}
