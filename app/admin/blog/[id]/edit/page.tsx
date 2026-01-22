'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { INITIAL_BLOG_POSTS } from '@/lib/blog-data'
import { BlogPost } from '@/lib/types/blog'

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const post = INITIAL_BLOG_POSTS.find(p => p.id === params.id)
  
  const [formData, setFormData] = useState<Partial<BlogPost>>(post || {
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'cleaning-tips',
    image: '',
    featured: false,
    readTime: 5,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    setTimeout(() => {
      alert('Blog post updated successfully!')
      setIsSubmitting(false)
      router.push('/admin/blog')
    }, 1500)
  }

  const slug = generateSlug(formData.title || 'untitled')

  if (!post) {
    return (
      <div className="min-h-screen pt-20 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600 font-medium mb-4">Post not found</p>
          <Link href="/admin/blog" className="text-primary hover:text-pink-600 font-bold">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/admin/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-pink-600 font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Blog
          </Link>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Edit Blog Post</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title */}
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
              <label className="block font-black text-slate-900 mb-3 uppercase tracking-widest text-sm">Post Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-primary outline-none transition-colors text-lg font-bold"
              />
              <p className="text-xs text-slate-500 mt-2">Slug: {slug}</p>
            </div>

            {/* Excerpt */}
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
              <label className="block font-black text-slate-900 mb-3 uppercase tracking-widest text-sm">Excerpt *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the post (shown in listings)"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-primary outline-none transition-colors resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">{formData.excerpt?.length || 0}/300 characters</p>
            </div>

            {/* Content */}
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
              <label className="block font-black text-slate-900 mb-3 uppercase tracking-widest text-sm">Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Full blog post content. Supports markdown formatting."
                required
                rows={15}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-primary outline-none transition-colors resize-none font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-2">{formData.content?.length || 0} characters</p>
            </div>

            {/* Category & Read Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
                <label className="block font-black text-slate-900 mb-3 uppercase tracking-widest text-sm">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-primary outline-none transition-colors font-medium"
                >
                  <option value="cleaning-tips">Cleaning Tips</option>
                  <option value="industry-news">Industry News</option>
                  <option value="customer-stories">Customer Stories</option>
                  <option value="how-to">How-To Guides</option>
                  <option value="seasonal">Seasonal</option>
                </select>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
                <label className="block font-black text-slate-900 mb-3 uppercase tracking-widest text-sm">Read Time (minutes)</label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Author & Featured */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
                <label className="block font-black text-slate-900 mb-3 uppercase tracking-widest text-sm">Author Name *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-6 w-6 accent-primary"
                  />
                  <span className="font-black text-slate-900 uppercase tracking-widest text-sm">Featured Post</span>
                </label>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
              <label className="block font-black text-slate-900 mb-3 uppercase tracking-widest text-sm">Featured Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-primary outline-none transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary px-8 py-5 rounded-2xl font-black text-white hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Save className="h-5 w-5" /> {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </motion.form>

          {/* Preview Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full mb-4 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors uppercase tracking-widest"
            >
              <Eye className="h-5 w-5" /> {showPreview ? 'Hide' : 'Show'} Preview
            </button>

            {showPreview && (
              <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden sticky top-24">
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      formData.category === 'cleaning-tips' ? 'bg-blue-100 text-blue-700' :
                      formData.category === 'industry-news' ? 'bg-purple-100 text-purple-700' :
                      formData.category === 'customer-stories' ? 'bg-green-100 text-green-700' :
                      formData.category === 'how-to' ? 'bg-orange-100 text-orange-700' :
                      'bg-pink-100 text-pink-700'
                    }`}>
                      {formData.category}
                    </span>
                  </div>
                  <h3 className="font-black text-lg text-slate-900 mb-2 line-clamp-2">{formData.title || 'Post Title'}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">{formData.excerpt}</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>By {formData.author || 'Author Name'}</p>
                    <p>{formData.readTime} min read</p>
                    {formData.featured && <p className="text-yellow-600 font-bold">⭐ Featured</p>}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
