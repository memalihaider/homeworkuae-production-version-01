'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Save,
  User,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface ClosureItem {
  id: string
  category: 'documentation' | 'equipment' | 'client' | 'financial' | 'quality'
  item: string
  completed: boolean
  notes?: string
}

export default function JobClosure() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    startDate: '2025-01-20',
    endDate: '2025-01-20',
    totalHours: 24,
    teamSize: 4
  }

  const [closureItems, setClosureItems] = useState<ClosureItem[]>([
    { id: '1', category: 'documentation', item: 'Job completion report submitted', completed: true },
    { id: '2', category: 'documentation', item: 'Client sign-off obtained', completed: false },
    { id: '3', category: 'equipment', item: 'All equipment returned to storage', completed: true },
    { id: '4', category: 'equipment', item: 'Equipment inventory verified', completed: true },
    { id: '5', category: 'client', item: 'Client satisfaction survey sent', completed: false },
    { id: '6', category: 'client', item: 'Follow-up appointment scheduled', completed: false },
    { id: '7', category: 'financial', item: 'Final invoice generated', completed: true },
    { id: '8', category: 'financial', item: 'Payment terms confirmed', completed: false },
    { id: '9', category: 'quality', item: 'Quality inspection completed', completed: true },
    { id: '10', category: 'quality', item: 'Performance metrics recorded', completed: true }
  ])

  const [finalNotes, setFinalNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleItem = useCallback((id: string) => {
    setClosureItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }, [])

  const updateNotes = useCallback((id: string, notes: string) => {
    setClosureItems(prev => prev.map(item =>
      item.id === id ? { ...item, notes } : item
    ))
  }, [])

  const completedCount = closureItems.filter(item => item.completed).length
  const totalCount = closureItems.length
  const isComplete = completedCount === totalCount

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    alert('Job closure completed successfully!')
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="w-4 h-4" />
      case 'equipment': return <CheckCircle className="w-4 h-4" />
      case 'client': return <User className="w-4 h-4" />
      case 'financial': return <DollarSign className="w-4 h-4" />
      case 'quality': return <AlertCircle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/admin/jobs/${jobId}`} className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Closure</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-gray-900">{completedCount}/{totalCount} Complete</div>
          <button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Close Job'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {['documentation', 'equipment', 'client', 'financial', 'quality'].map(category => {
            const categoryItems = closureItems.filter(item => item.category === category)
            return (
              <div key={category} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{category}</h3>
                </div>
                <div className="space-y-3">
                  {categoryItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(item.id)}
                        className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.item}</div>
                        {item.completed && (
                          <textarea
                            value={item.notes || ''}
                            onChange={(e) => updateNotes(item.id, e.target.value)}
                            placeholder="Add notes..."
                            className="mt-2 w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={2}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Duration</div>
                  <div className="text-sm text-gray-600">{job.startDate} - {job.endDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Total Hours</div>
                  <div className="text-sm text-gray-600">{job.totalHours} hours</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Team Size</div>
                  <div className="text-sm text-gray-600">{job.teamSize} members</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Final Notes</h3>
            <textarea
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              placeholder="Add any final notes or observations..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
            />
          </div>

          {!isComplete && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                <div className="text-sm font-medium">Complete all items to close the job</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}