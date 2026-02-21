import { Testimonial } from './types/testimonials'

// In-memory storage (replace with database in production)
let testimonials: Testimonial[] = []

export const initializeTestimonialData = (initialTestimonials: Testimonial[]) => {
  testimonials = [...initialTestimonials]
}

export const getAllTestimonials = (): Testimonial[] => {
  return testimonials
}

export const getFeaturedTestimonials = (): Testimonial[] => {
  return testimonials.filter(t => t.featured)
}

export const getTestimonialById = (id: string): Testimonial | undefined => {
  return testimonials.find(t => t.id === id)
}

export const createTestimonial = (testimonial: Omit<Testimonial, 'id'>): Testimonial => {
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: Date.now().toString(),
  }
  testimonials.push(newTestimonial)
  return newTestimonial
}

export const updateTestimonial = (id: string, updates: Partial<Testimonial>): Testimonial | undefined => {
  const index = testimonials.findIndex(t => t.id === id)
  if (index === -1) return undefined
  
  testimonials[index] = { ...testimonials[index], ...updates }
  return testimonials[index]
}

export const deleteTestimonial = (id: string): boolean => {
  const index = testimonials.findIndex(t => t.id === id)
  if (index === -1) return false
  
  testimonials.splice(index, 1)
  return true
}

export const getTestimonialCount = (): number => {
  return testimonials.length
}

export const rateTestimonial = (id: string, rating: number): Testimonial | undefined => {
  const testimonial = testimonials.find(t => t.id === id)
  if (testimonial) {
    testimonial.rating = Math.min(5, Math.max(1, rating))
  }
  return testimonial
}
