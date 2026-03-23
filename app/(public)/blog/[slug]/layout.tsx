import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { INITIAL_BLOG_POSTS } from '@/lib/blog-data'

const SITE_URL = 'https://www.homeworkuae.com'

type BlogSlugLayoutProps = {
  children: ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogSlugLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const canonicalUrl = `${SITE_URL}/blog/${slug}`

  const post = INITIAL_BLOG_POSTS.find((item) => item.slug === slug)

  if (!post) {
    return {
      title: 'Blog Article | Homework UAE',
      description:
        'Read professional cleaning advice and expert guides from Homework UAE.',
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: 'Blog Article | Homework UAE',
        description:
          'Read professional cleaning advice and expert guides from Homework UAE.',
        url: canonicalUrl,
        type: 'article',
        siteName: 'Homework UAE',
      },
    }
  }

  return {
    title: `${post.title} | Homework UAE`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Homework UAE',
      images: post.image
        ? [
            {
              url: post.image,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  }
}

export default function BlogSlugLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
