import { buildServiceStructuredData } from '@/lib/service-seo'

type ServiceStructuredDataProps = {
  slug: string
}

export default function ServiceStructuredData({ slug }: ServiceStructuredDataProps) {
  const jsonLd = buildServiceStructuredData(slug)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}
