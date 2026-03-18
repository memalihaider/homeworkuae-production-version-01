import type { Metadata } from 'next'

const SITE_URL = 'https://www.homeworkuae.com'

function toTitleCase(input: string): string {
  return input
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function slugToServiceName(slug: string): string {
  const readable = normalizeSlug(slug).replace(/-/g, ' ')
  return toTitleCase(readable)
}

function buildKeywords(serviceName: string): string[] {
  const lower = serviceName.toLowerCase()

  return Array.from(
    new Set([
      'premium cleaning company in Dubai',
      'maid services Dubai',
      'deep cleaning services in Dubai',
      `${serviceName} Dubai`,
      `${serviceName} UAE`,
      `${lower} service`,
      `${lower} services`,
      `${lower} company Dubai`,
      `professional ${lower} in Dubai`,
      `best ${lower} in Dubai`,
      `${lower} near me Dubai`,
      `affordable ${lower} Dubai`,
      `book ${lower} online Dubai`,
      'cleaning services Dubai',
      'deep cleaning services Dubai',
      'home cleaning Dubai',
      'commercial cleaning Dubai',
    ])
  )
}

export function buildServiceMetadata(slug: string): Metadata {
  const safeSlug = normalizeSlug(slug)
  const serviceName = slugToServiceName(safeSlug)
  const canonicalPath = `/services/${safeSlug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  const title = `${serviceName} in Dubai | Homework UAE`
  const description = `Book premium ${serviceName.toLowerCase()} in Dubai with Homework UAE. Trusted for maid services, deep cleaning services, and high-quality residential and commercial cleaning.`

  return {
    title,
    description,
    keywords: buildKeywords(serviceName),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Homework UAE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function buildServiceStructuredData(slug: string) {
  const safeSlug = normalizeSlug(slug)
  const serviceName = slugToServiceName(safeSlug)
  const canonicalPath = `/services/${safeSlug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: 'Homework UAE',
        url: SITE_URL,
        image: `${SITE_URL}/logo.png`,
        areaServed: ['Dubai', 'Abu Dhabi', 'UAE'],
        telephone: '+971-55-419-9272',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AE',
          addressRegion: 'Dubai',
        },
      },
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: serviceName,
        serviceType: serviceName,
        provider: {
          '@type': 'LocalBusiness',
          '@id': `${SITE_URL}/#localbusiness`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'United Arab Emirates',
        },
        url: canonicalUrl,
        category: 'Cleaning Service',
        description: `Premium ${serviceName.toLowerCase()} in Dubai for homes and businesses, delivered by a trusted cleaning company known for maid and deep cleaning services.`,
      },
    ],
  }
}
