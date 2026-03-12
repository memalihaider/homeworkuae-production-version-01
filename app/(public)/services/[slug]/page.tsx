import ServicePageTemplate from '@/components/ServicePageTemplate'

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ServicePageTemplate slug={slug} />
}
