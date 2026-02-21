import { BlogPost } from './types/blog'

// In-memory storage (replace with database in production)
let blogPosts: BlogPost[] = []

export const initializeBlogData = (initialPosts: BlogPost[]) => {
  blogPosts = [...initialPosts]
}

export const getAllBlogPosts = (): BlogPost[] => {
  return blogPosts
}

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug)
}

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id)
}

export const createBlogPost = (post: Omit<BlogPost, 'id'>): BlogPost => {
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
  }
  blogPosts.push(newPost)
  return newPost
}

export const updateBlogPost = (id: string, updates: Partial<BlogPost>): BlogPost | undefined => {
  const index = blogPosts.findIndex(p => p.id === id)
  if (index === -1) return undefined
  
  blogPosts[index] = { ...blogPosts[index], ...updates }
  return blogPosts[index]
}

export const deleteBlogPost = (id: string): boolean => {
  const index = blogPosts.findIndex(p => p.id === id)
  if (index === -1) return false
  
  blogPosts.splice(index, 1)
  return true
}

export const searchBlogPosts = (query: string): BlogPost[] => {
  const lowerQuery = query.toLowerCase()
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery)
  )
}

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category)
}

export const getFeaturedBlogPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured).slice(0, 5)
}
