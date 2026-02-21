// /app/admin/jobs/components/JobEditSidebar.tsx
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
  Briefcase
} from 'lucide-react'

interface JobEditSidebarProps {
  jobId: string
  onClose: () => void
  onSave: (jobData: any) => void
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES = ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH']

export default function JobEditSidebar({ jobId, onClose, onSave }: JobEditSidebarProps) {
  const [formData, setFormData] = useState({
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    location: 'Downtown, Dubai',
    status: 'SCHEDULED',
    priority: 'HIGH',
    riskLevel: 'MEDIUM',
    scheduledDate: '2025-01-20',
    scheduledTime: '08:00',
    endTime: '16:00',
    estimatedDuration: '8 hours',
    teamRequired: 4,
    budget: 5000,
    description: 'Complete office floor deep cleaning with window and cubicle sanitization',
    specialInstructions: 'Building manager is Ahmed. Access from rear entrance. Equipment storage in basement.',
    requiredSkills: ['Floor Cleaning', 'Window Cleaning', 'Safety Certification', 'Team Lead'],
    permits: ['Building Access Pass', 'Commercial Permit'],
    tags: ['Commercial', 'Urgent'],
    slaDeadline: '2025-01-20',
    recurringJob: false,
    recurringFrequency: 'WEEKLY',
    clientNotes: 'Building access from rear entrance only',
    safetyNotes: 'Ensure safety equipment is available on site',
    estimatedExpenses: 2000,
    materials: ['Cleaning supplies', 'Safety equipment', 'Specialized tools'],
    weather: 'Clear, 28°C',
    trafficAlert: '15 minutes delay possible'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white border-l border-gray-200 shadow-xl overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-tighter">Edit Job #{jobId}</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Basic Information</h3>
          
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Client Name</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
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

        {/* Special Instructions & Notes */}
        <div className="space-y-4 pb-6 border-b border-gray-200">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Special Instructions
          </h3>
          
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

        {/* Environment & External Factors */}
        <div className="space-y-4 pb-6 border-b border-gray-200">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">External Factors</h3>
          
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Weather Conditions</label>
            <input
              type="text"
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Traffic Alert</label>
            <input
              type="text"
              name="trafficAlert"
              value={formData.trafficAlert}
              onChange={handleChange}
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
          Save Changes
        </button>
      </div>
    </div>
  )
}
