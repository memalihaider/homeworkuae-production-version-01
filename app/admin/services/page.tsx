'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  Wind,
  Shield,
  Lightbulb,
  Hammer,
  X,
  Check,
  Image as ImageIcon,
  CheckCircle2,
  Grid3x3,
  List,
  AlertCircle
} from 'lucide-react'

interface ServiceWithImage extends Record<string, any> {
  id: string
  name: string
  description: string
  category: string
  basePrice: number
  duration: number
  icon: any
  isActive: boolean
  image?: string
}

import { MOCK_SERVICES } from '@/lib/bookings-services-data'

const categoryIcons = {
  cleaning: Sparkles,
  maintenance: Wind,
  inspection: Shield,
  consultation: Lightbulb,
  specialized: Hammer
}

const categoryColors = {
  cleaning: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-green-100 text-green-700',
  inspection: 'bg-purple-100 text-purple-700',
  consultation: 'bg-amber-100 text-amber-700',
  specialized: 'bg-pink-100 text-pink-700'
}

const categoryBgColors = {
  cleaning: 'bg-blue-50',
  maintenance: 'bg-green-50',
  inspection: 'bg-purple-50',
  consultation: 'bg-amber-50',
  specialized: 'bg-pink-50'
}

export default function AdminServices() {
  const [services, setServices] = useState<ServiceWithImage[]>(MOCK_SERVICES.map(s => ({ ...s, image: undefined })))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedService, setSelectedService] = useState<ServiceWithImage | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<ServiceWithImage | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newService, setNewService] = useState<Partial<ServiceWithImage>>({
    name: '',
    description: '',
    category: 'cleaning',
    basePrice: 0,
    duration: 1,
    isActive: true
  })

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [services, searchTerm, selectedCategory])

  const handleToggleActive = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id))
    setShowDeleteConfirm(null)
  }

  const handleViewDetails = (service: ServiceWithImage) => {
    setSelectedService(service)
    setShowDetailsModal(true)
  }

  const handleEditService = (service: ServiceWithImage) => {
    setEditingService({ ...service })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editingService) {
      setServices(services.map(s =>
        s.id === editingService.id ? editingService : s
      ))
      setShowEditModal(false)
      setEditingService(null)
    }
  }

  const handleAddService = () => {
    if (newService.name && newService.description) {
      const service: ServiceWithImage = {
        id: Date.now().toString(),
        name: newService.name || '',
        description: newService.description || '',
        category: newService.category || 'cleaning',
        basePrice: newService.basePrice || 0,
        duration: newService.duration || 1,
        icon: categoryIcons[newService.category as keyof typeof categoryIcons],
        isActive: newService.isActive !== false,
        image: newService.image
      }
      setServices([...services, service])
      setShowAddModal(false)
      setNewService({
        name: '',
        description: '',
        category: 'cleaning',
        basePrice: 0,
        duration: 1,
        isActive: true
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNewService?: boolean) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        if (isNewService) {
          setNewService({ ...newService, image: imageData })
        } else if (editingService) {
          setEditingService({ ...editingService, image: imageData })
        }
        setUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const categories = ['all', 'cleaning', 'maintenance', 'inspection', 'consultation', 'specialized']
  const categoryLabels = {
    all: 'All Services',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    inspection: 'Inspection',
    consultation: 'Consultation',
    specialized: 'Specialized'
  }

  const activeCount = services.filter(s => s.isActive).length
  const totalCount = services.length

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Services Management
            </h1>
            <p className="text-muted-foreground mt-2">Manage and organize your service catalog</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40"
          >
            <Plus className="h-5 w-5" />
            Add Service
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Services', value: totalCount, icon: Sparkles, color: 'from-blue-500 to-blue-600' },
            { label: 'Active', value: activeCount, icon: CheckCircle2, color: 'from-green-500 to-green-600' },
            { label: 'Inactive', value: totalCount - activeCount, icon: EyeOff, color: 'from-red-500 to-red-600' },
            { label: 'Avg Price', value: `AED ${Math.round(services.reduce((sum, s) => sum + s.basePrice, 0) / (totalCount || 1))}`, icon: Building2, color: 'from-amber-500 to-amber-600' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black mt-2 text-foreground">{stat.value}</p>
                  </div>
                  <div className={`h-14 w-14 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat as keyof typeof categoryLabels]}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Services Content */}
        {viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map(service => {
                const CategoryIcon = categoryIcons[service.category as keyof typeof categoryIcons]
                const bgColor = categoryBgColors[service.category as keyof typeof categoryBgColors]
                const badgeColor = categoryColors[service.category as keyof typeof categoryColors]
                
                return (
                  <div
                    key={service.id}
                    className={`${bgColor} rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-200 flex flex-col`}
                  >
                    {/* Image */}
                    <div className="aspect-video bg-linear-to-br from-slate-300 to-slate-400 relative overflow-hidden">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon className="h-12 w-12 text-slate-500" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${badgeColor}`}>
                          <CategoryIcon className="h-3 w-3" />
                          {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-black text-lg mb-2 line-clamp-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{service.description}</p>

                      {/* Price & Duration */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">Price</p>
                          <p className="text-2xl font-black text-foreground">AED {service.basePrice}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground uppercase font-bold">Duration</p>
                          <p className="text-xl font-black text-foreground">{service.duration}h</p>
                        </div>
                      </div>

                      {/* Status */}
                      {service.isActive ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold mb-4">
                          <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
                          Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold mb-4">
                          <div className="h-2 w-2 rounded-full bg-red-600"></div>
                          Inactive
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(service)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditService(service)}
                          className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-bold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(service.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-16 text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-bold text-muted-foreground">No services found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>
        ) : (
          // Table View
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            {filteredServices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredServices.map(service => {
                      const CategoryIcon = categoryIcons[service.category as keyof typeof categoryIcons]
                      return (
                        <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {service.image ? (
                                <img src={service.image} alt={service.name} className="h-12 w-12 rounded-lg object-cover" />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-slate-200 flex items-center justify-center">
                                  <CategoryIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-foreground">{service.name}</p>
                                <p className="text-xs text-muted-foreground">{service.description.substring(0, 40)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold ${categoryColors[service.category as keyof typeof categoryColors]}`}>
                              <CategoryIcon className="h-3.5 w-3.5" />
                              {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold">AED {service.basePrice}</td>
                          <td className="px-6 py-4 font-bold">{service.duration}h</td>
                          <td className="px-6 py-4 text-center">
                            {service.isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100/50 text-green-700 rounded-lg text-xs font-bold">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100/50 text-red-700 rounded-lg text-xs font-bold">
                                <X className="h-3.5 w-3.5" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewDetails(service)}
                                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleActive(service.id)}
                                className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                              >
                                {service.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleEditService(service)}
                                className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(service.id)}
                                className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-bold text-muted-foreground">No services found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-black">Add New Service</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewService({ name: '', description: '', category: 'cleaning', basePrice: 0, duration: 1, isActive: true })
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-3">Service Image</label>
                <div className="relative">
                  {newService.image ? (
                    <div className="relative">
                      <img src={newService.image} alt="Service" className="w-full h-64 object-cover rounded-xl" />
                      <button
                        onClick={() => setNewService({ ...newService, image: undefined })}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors block">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-bold">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Service Name *</label>
                  <input
                    type="text"
                    value={newService.name || ''}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="e.g., Deep Cleaning"
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Base Price (AED) *</label>
                  <input
                    type="number"
                    value={newService.basePrice || 0}
                    onChange={(e) => setNewService({ ...newService, basePrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Duration (hours) *</label>
                  <input
                    type="number"
                    value={newService.duration || 1}
                    onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Category *</label>
                  <select
                    value={newService.category || 'cleaning'}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inspection">Inspection</option>
                    <option value="consultation">Consultation</option>
                    <option value="specialized">Specialized</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Description *</label>
                <textarea
                  value={newService.description || ''}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the service in detail..."
                  className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newService.isActive !== false}
                  onChange={(e) => setNewService({ ...newService, isActive: e.target.checked })}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <label className="text-sm font-bold">Active Service</label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setNewService({ name: '', description: '', category: 'cleaning', basePrice: 0, duration: 1, isActive: true })
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddService}
                  disabled={!newService.name || !newService.description}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-black">Edit Service</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingService(null)
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-3">Service Image</label>
                <div className="relative">
                  {editingService.image ? (
                    <div className="relative">
                      <img src={editingService.image} alt="Service" className="w-full h-64 object-cover rounded-xl" />
                      <button
                        onClick={() => setEditingService({ ...editingService, image: undefined })}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors block">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-bold">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Service Name</label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Base Price (AED)</label>
                  <input
                    type="number"
                    value={editingService.basePrice}
                    onChange={(e) => setEditingService({ ...editingService, basePrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    value={editingService.duration}
                    onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inspection">Inspection</option>
                    <option value="consultation">Consultation</option>
                    <option value="specialized">Specialized</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingService.isActive}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <label className="text-sm font-bold">Active Service</label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingService(null)
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-2xl font-black">{selectedService.name}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedService.image && (
                <img src={selectedService.image} alt={selectedService.name} className="w-full h-64 object-cover rounded-xl" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Price</p>
                  <p className="text-xl font-black">AED {selectedService.basePrice}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Duration</p>
                  <p className="text-xl font-black">{selectedService.duration}h</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Description</p>
                <p className="text-sm leading-relaxed">{selectedService.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-black">Delete Service?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteService(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
