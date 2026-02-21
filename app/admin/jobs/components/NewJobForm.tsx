// /app/admin/jobs/components/NewJobForm.tsx
'use client'

import React, { useState } from 'react'
import { 
  X, 
  Save, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Tag,
  Shield,
  Briefcase,
  Plus,
  Trash2
} from 'lucide-react'

interface NewJobFormProps {
  onClose: () => void
  onSave: (jobData: any) => void
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES = ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH']
const TEAM_ROLES = ['Team Lead', 'Floor Specialist', 'Window Specialist', 'Safety Officer', 'Supervisor']

export default function NewJobForm({ onClose, onSave }: NewJobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    clientId: '',
    location: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    riskLevel: 'LOW',
    scheduledDate: '',
    scheduledTime: '08:00',
    endTime: '16:00',
    estimatedDuration: '8 hours',
    teamRequired: 2,
    budget: 0,
    description: '',
    specialInstructions: '',
    requiredSkills: [] as string[],
    permits: [] as string[],
    tags: [] as string[],
    slaDeadline: '',
    recurringJob: false,
    recurringFrequency: 'WEEKLY',
    clientNotes: '',
    safetyNotes: '',
    estimatedExpenses: 0,
    materials: [] as string[],
    weather: '',
    trafficAlert: '',
    services: [] as { name: string; quantity: number; unitPrice: number; total: number }[]
  })

  const [skillInput, setSkillInput] = useState('')
  const [permitInput, setPermitInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [materialInput, setMaterialInput] = useState('')
  const [serviceInput, setServiceInput] = useState({ name: '', quantity: 1, unitPrice: 0 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput)) {
      setFormData(prev => ({ ...prev, requiredSkills: [...prev.requiredSkills, skillInput] }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, requiredSkills: prev.requiredSkills.filter(s => s !== skill) }))
  }

  const addPermit = () => {
    if (permitInput.trim() && !formData.permits.includes(permitInput)) {
      setFormData(prev => ({ ...prev, permits: [...prev.permits, permitInput] }))
      setPermitInput('')
    }
  }

  const removePermit = (permit: string) => {
    setFormData(prev => ({ ...prev, permits: prev.permits.filter(p => p !== permit) }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const addMaterial = () => {
    if (materialInput.trim() && !formData.materials.includes(materialInput)) {
      setFormData(prev => ({ ...prev, materials: [...prev.materials, materialInput] }))
      setMaterialInput('')
    }
  }

  const removeMaterial = (material: string) => {
    setFormData(prev => ({ ...prev, materials: prev.materials.filter(m => m !== material) }))
  }

  const addService = () => {
    if (serviceInput.name.trim() && serviceInput.quantity > 0 && serviceInput.unitPrice > 0) {
      const total = serviceInput.quantity * serviceInput.unitPrice
      setFormData(prev => ({ 
        ...prev, 
        services: [...prev.services, { ...serviceInput, total }] 
      }))
      setServiceInput({ name: '', quantity: 1, unitPrice: 0 })
    }
  }

  const removeService = (index: number) => {
    setFormData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const totalServiceValue = formData.services.reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-end">
      <div className="w-full md:w-[600px] h-screen md:h-[95vh] bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tighter">Create New Job</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Basic Information</h3>
            
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Executive Office Deep Clean"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Client Name *</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="e.g., Downtown Business Tower"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Downtown, Dubai"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Job scope and details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Status & Priority</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Risk Level</label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                >
                  {RISK_LEVELS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Recurring</label>
                <select
                  name="recurringFrequency"
                  value={formData.recurringFrequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                >
                  <option value="ONCE">Once</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="BIWEEKLY">Bi-Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Scheduling
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Scheduled Date</label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">SLA Deadline</label>
                <input
                  type="date"
                  name="slaDeadline"
                  value={formData.slaDeadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Start Time</label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Estimated Duration</label>
              <input
                type="text"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="e.g., 8 hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>
          </div>

          {/* Resources & Budget */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Resources & Budget
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Budget (AED)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Est. Expenses (AED)</label>
                <input
                  type="number"
                  name="estimatedExpenses"
                  value={formData.estimatedExpenses}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Team Size Required</label>
                <input
                  type="number"
                  name="teamRequired"
                  value={formData.teamRequired}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Services & Line Items
            </h3>
            
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                placeholder="Service name"
                value={serviceInput.name}
                onChange={(e) => setServiceInput({ ...serviceInput, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={serviceInput.quantity}
                  onChange={(e) => setServiceInput({ ...serviceInput, quantity: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={serviceInput.unitPrice}
                  onChange={(e) => setServiceInput({ ...serviceInput, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                />
                <button
                  onClick={addService}
                  className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            {formData.services.length > 0 && (
              <div className="space-y-2">
                {formData.services.map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm">
                      <p className="font-bold">{service.name}</p>
                      <p className="text-xs text-gray-600">{service.quantity} x AED {service.unitPrice} = AED {service.total}</p>
                    </div>
                    <button
                      onClick={() => removeService(i)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="p-3 bg-black text-white rounded-lg">
                  <p className="text-sm font-bold">Total Service Value: AED {totalServiceValue}</p>
                </div>
              </div>
            )}
          </div>

          {/* Required Skills */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Required Skills
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
              <button
                onClick={addSkill}
                className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {formData.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.requiredSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-bold flex items-center gap-2 border border-blue-300">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Permits */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Required Permits</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={permitInput}
                onChange={(e) => setPermitInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPermit()}
                placeholder="Add a permit"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
              <button
                onClick={addPermit}
                className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {formData.permits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.permits.map((permit) => (
                  <span key={permit} className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-xs font-bold flex items-center gap-2 border border-green-300">
                    {permit}
                    <button
                      onClick={() => removePermit(permit)}
                      className="hover:text-green-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <Tag className="h-4 w-4" /> Tags
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-bold flex items-center gap-2 border border-purple-300">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-purple-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Special Instructions */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Notes & Instructions</h3>
            
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Client Notes</label>
              <textarea
                name="clientNotes"
                value={formData.clientNotes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Safety Notes</label>
              <textarea
                name="safetyNotes"
                value={formData.safetyNotes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Special Instructions</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Create Job
          </button>
        </div>
      </div>
    </div>
  )
}
