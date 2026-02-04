'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Layout, 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2,
  Globe,
  Clock,
  CheckCircle2,
  X,
  User
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'

// Blog Post Type
type BlogPost = {
  id: string;
  title: string;
  name: string;
  description: string;
  content: string;
  readTime: number;
  imageURL: string;
  featured: boolean;
  tags: string[];
  createdAt: any;
  author?: string;
  status?: string;
  date?: string;
  category?: string;
}

export default function CMS() {
  const [activeTab, setActiveTab] = useState('pages')
  const [showModal, setShowModal] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    content: '',
    readTime: 5,
    featured: false,
    tags: '',
    imageURL: ''
  })

  // Fetch blog posts from Firebase
  const fetchBlogPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blog-post'))
      const posts: BlogPost[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        posts.push({
          id: doc.id,
          title: data.title || '',
          name: data.name || 'Admin',
          description: data.description || '',
          content: data.content || '',
          readTime: data.readTime || 5,
          imageURL: data.imageURL || '',
          featured: data.featured || false,
          tags: data.tags || [],
          createdAt: data.createdAt,
          author: data.name || 'Admin',
          status: 'Published',
          date: data.createdAt?.toDate?.().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }) || 'Dec 20, 2025',
          category: data.tags?.[0] || 'Tips'
        })
      })
      
      setBlogPosts(posts.sort((a, b) => 
        new Date(b.createdAt?.toDate?.() || 0).getTime() - 
        new Date(a.createdAt?.toDate?.() || 0).getTime()
      ))
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      alert('Error fetching blog posts!')
    }
  }

  // Fetch posts on component mount
  useEffect(() => {
    if (activeTab === 'blog') {
      fetchBlogPosts()
    }
  }, [activeTab])

  // Open modal
  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      // Edit mode
      setEditingPost(post)
      setFormData({
        title: post.title,
        name: post.name || '',
        description: post.description,
        content: post.content,
        readTime: post.readTime,
        featured: post.featured,
        tags: post.tags.join(', '),
        imageURL: post.imageURL
      })
    } else {
      // Create mode
      setEditingPost(null)
      setFormData({
        title: '',
        name: '',
        description: '',
        content: '',
        readTime: 5,
        featured: false,
        tags: '',
        imageURL: ''
      })
    }
    setShowModal(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPost(null)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Save/Update blog post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      alert('Title and Content are required!')
      return
    }

    try {
      // Convert tags to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')

      const blogData = {
        title: formData.title,
        name: formData.name,
        description: formData.description,
        content: formData.content,
        readTime: parseInt(formData.readTime.toString()) || 5,
        imageURL: formData.imageURL,
        featured: formData.featured,
        tags: tagsArray,
        createdAt: editingPost ? editingPost.createdAt : new Date(),
        updatedAt: new Date()
      }

      if (editingPost) {
        // Update existing post
        const postRef = doc(db, 'blog-post', editingPost.id)
        await updateDoc(postRef, blogData)
        alert('Blog post updated successfully!')
      } else {
        // Create new post
        await addDoc(collection(db, 'blog-post'), blogData)
        alert('Blog post created successfully!')
      }

      // Refresh blog posts
      await fetchBlogPosts()
      handleCloseModal()
      
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Error saving blog post!')
    }
  }

  // Delete blog post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await deleteDoc(doc(db, 'blog-post', postId))
      alert('Blog post deleted successfully!')
      await fetchBlogPosts()
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Error deleting blog post!')
    }
  }

  const pages = [
    { id: 1, title: 'Home', slug: '/', status: 'Published', lastModified: 'Dec 20, 2025', views: '12.4k' },
    { id: 2, title: 'About Us', slug: '/about', status: 'Published', lastModified: 'Dec 18, 2025', views: '3.2k' },
    { id: 3, title: 'Services', slug: '/services', status: 'Published', lastModified: 'Dec 19, 2025', views: '8.1k' },
    { id: 4, title: 'Pricing', slug: '/pricing', status: 'Draft', lastModified: 'Dec 21, 2025', views: '0' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Manage your website pages, blog posts, and media assets.</p>
        </div>
        
        {/* Create Button - Only shows on blog tab */}
        {activeTab === 'blog' && (
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            Create New Post
          </button>
        )}
        {activeTab === 'pages' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            Create New Page
          </button>
        )}
        {activeTab === 'media' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            Upload New Asset
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-fit">
        {[
          { id: 'pages', label: 'Pages', icon: Layout },
          { id: 'blog', label: 'Blog Posts', icon: FileText },
          { id: 'media', label: 'Media Library', icon: ImageIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            className="w-full pl-10 pr-4 py-2 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border rounded-xl text-sm font-medium hover:bg-accent">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        {/* Pages Tab (Unchanged) */}
        {activeTab === 'pages' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Page Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Views</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Modified</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Globe className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-bold">{page.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{page.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        page.status === 'Published' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{page.views}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{page.lastModified}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg text-blue-600">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Blog Posts Tab - COMPLETELY FUNCTIONAL */}
        {activeTab === 'blog' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="group relative p-4 rounded-2xl border bg-muted/30 hover:bg-card hover:shadow-md transition-all">
                  {/* Action Buttons - Top Right */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => handleOpenModal(post)}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded">
                      {post.tags[0] || 'General'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      post.status === 'Published' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="mb-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-600">Featured</span>
                    </div>
                  )}

                  <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Read Time */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime} min read</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-muted text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer - Updated with Name Field */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        <User className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {post.name || 'Admin'}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Author
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {blogPosts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground mb-6">Create your first blog post to get started!</p>
                <button 
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Post
                </button>
              </div>
            )}
          </div>
        )}

        {/* Media Library Tab (Unchanged) */}
        {activeTab === 'media' && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer transition-colors">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Upload</span>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="group relative aspect-square rounded-2xl border overflow-hidden bg-muted/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/20" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL - Create/Edit Blog Post */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in all the required fields below
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Author Name Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your name (e.g., John Doe)"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This name will be displayed as the author of this post
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                  placeholder="Enter short description"
                  rows={3}
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Blog Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
                  placeholder="Write your full blog content here..."
                  rows={6}
                  required
                />
              </div>

              {/* Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read Time */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="5"
                    min="1"
                  />
                </div>

                {/* Featured */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        featured: e.target.checked 
                      }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Featured Post
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Featured posts will be highlighted on your blog
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter tags separated by commas (e.g., cleaning, tips, eco-friendly)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tags help in organizing and searching your posts
                </p>
              </div>

              {/* Image URL (Direct Input) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-card border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the direct URL of your blog image
                </p>
                
                {/* Image Preview */}
                {formData.imageURL && (
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-2">Image Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img 
                        src={formData.imageURL} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 border rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}