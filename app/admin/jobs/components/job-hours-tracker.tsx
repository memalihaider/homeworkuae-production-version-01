'use client'

import { useState } from 'react'
import {
  Clock,
  Plus,
  X,
  Edit2,
  Trash2,
  Save,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  BarChart3
} from 'lucide-react'

interface HoursEntry {
  id: number
  employeeId: number
  employeeName: string
  date: string
  hoursWorked: number
  notes: string
}

interface JobHours {
  jobId: number
  jobTitle: string
  estimatedHours: number
  actualHours: number
  variance: number
  estimatedCost: number
  actualCost: number
  entries: HoursEntry[]
  status: string
}

export function JobHoursTracker() {
  const [jobHours, setJobHours] = useState<JobHours[]>([
    {
      jobId: 1,
      jobTitle: 'Residential House Cleaning',
      estimatedHours: 40,
      actualHours: 38,
      variance: -2,
      estimatedCost: 2000,
      actualCost: 1900,
      status: 'Completed',
      entries: [
        { id: 1, employeeId: 1, employeeName: 'John Smith', date: '2025-01-05', hoursWorked: 8, notes: 'Morning shift' },
        { id: 2, employeeId: 2, employeeName: 'Sarah Johnson', date: '2025-01-05', hoursWorked: 8, notes: 'Afternoon shift' },
        { id: 3, employeeId: 1, employeeName: 'John Smith', date: '2025-01-06', hoursWorked: 8, notes: 'Morning shift' },
        { id: 4, employeeId: 3, employeeName: 'Ahmed Hassan', date: '2025-01-06', hoursWorked: 6, notes: 'Coordination' },
      ]
    },
    {
      jobId: 2,
      jobTitle: 'Commercial Office Cleaning',
      estimatedHours: 60,
      actualHours: 56,
      variance: -4,
      estimatedCost: 3000,
      actualCost: 2800,
      status: 'Completed',
      entries: [
        { id: 5, employeeId: 2, employeeName: 'Sarah Johnson', date: '2025-01-07', hoursWorked: 8, notes: 'Office section A' },
        { id: 6, employeeId: 4, employeeName: 'Maria Garcia', date: '2025-01-07', hoursWorked: 8, notes: 'Office section B' },
      ]
    },
    {
      jobId: 3,
      jobTitle: 'Building Maintenance',
      estimatedHours: 80,
      actualHours: 92,
      variance: 12,
      estimatedCost: 4000,
      actualCost: 4600,
      status: 'In Progress',
      entries: [
        { id: 7, employeeId: 3, employeeName: 'Ahmed Hassan', date: '2025-01-08', hoursWorked: 8, notes: 'HVAC maintenance' },
        { id: 8, employeeId: 5, employeeName: 'Michael Chen', date: '2025-01-08', hoursWorked: 8, notes: 'Plumbing work' },
      ]
    }
  ])

  const [selectedJob, setSelectedJob] = useState<JobHours | null>(null)
  const [showAddHours, setShowAddHours] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HoursEntry | null>(null)
  const [newEntry, setNewEntry] = useState({
    employeeId: '',
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    hoursWorked: 0,
    notes: ''
  })

  const employees = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Ahmed Hassan' },
    { id: 4, name: 'Maria Garcia' },
    { id: 5, name: 'Michael Chen' },
  ]

  const handleAddEntry = () => {
    if (selectedJob && newEntry.employeeId && newEntry.hoursWorked > 0) {
      const updatedJobs = jobHours.map(job => {
        if (job.jobId === selectedJob.jobId) {
          const newEntryObj: HoursEntry = {
            id: Math.max(...job.entries.map(e => e.id), 0) + 1,
            employeeId: parseInt(newEntry.employeeId),
            employeeName: newEntry.employeeName,
            date: newEntry.date,
            hoursWorked: newEntry.hoursWorked,
            notes: newEntry.notes
          }
          const updatedEntries = [...job.entries, newEntryObj]
          const totalActualHours = updatedEntries.reduce((sum, e) => sum + e.hoursWorked, 0)
          return {
            ...job,
            entries: updatedEntries,
            actualHours: totalActualHours,
            variance: totalActualHours - job.estimatedHours,
            actualCost: totalActualHours * 50 // Assuming $50 per hour
          }
        }
        return job
      })
      setJobHours(updatedJobs)
      setSelectedJob(updatedJobs.find(j => j.jobId === selectedJob.jobId) || null)
      setNewEntry({
        employeeId: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        hoursWorked: 0,
        notes: ''
      })
      setShowAddHours(false)
    }
  }

  const handleDeleteEntry = (entryId: number) => {
    if (selectedJob) {
      const updatedJobs = jobHours.map(job => {
        if (job.jobId === selectedJob.jobId) {
          const updatedEntries = job.entries.filter(e => e.id !== entryId)
          const totalActualHours = updatedEntries.reduce((sum, e) => sum + e.hoursWorked, 0)
          return {
            ...job,
            entries: updatedEntries,
            actualHours: totalActualHours,
            variance: totalActualHours - job.estimatedHours,
            actualCost: totalActualHours * 50
          }
        }
        return job
      })
      setJobHours(updatedJobs)
      setSelectedJob(updatedJobs.find(j => j.jobId === selectedJob.jobId) || null)
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance < 0) return 'text-green-600 bg-green-50'
    if (variance === 0) return 'text-blue-600 bg-blue-50'
    return 'text-red-600 bg-red-50'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance < 0) return <TrendingDown className="w-4 h-4" />
    if (variance === 0) return <BarChart3 className="w-4 h-4" />
    return <TrendingUp className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" />
          Job Hours Tracking
        </h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {jobHours.slice(0, 4).map((job) => (
          <div
            key={job.jobId}
            onClick={() => setSelectedJob(job)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedJob?.jobId === job.jobId
                ? 'bg-indigo-50 border-indigo-400 shadow-md'
                : 'bg-white border-gray-300 hover:border-indigo-300'
            }`}
          >
            <p className="text-xs font-bold text-gray-700 uppercase mb-2">{job.jobTitle}</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-bold text-gray-900">{job.actualHours}</span>
              <span className="text-xs text-gray-600">/ {job.estimatedHours}h</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${getVarianceColor(job.variance)}`}>
              {getVarianceIcon(job.variance)}
              {Math.abs(job.variance)}h {job.variance < 0 ? 'under' : job.variance > 0 ? 'over' : 'on track'}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Job Details */}
      {selectedJob && (
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-300 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{selectedJob.jobTitle}</h4>
              <p className="text-sm text-gray-600">Status: <span className="font-bold">{selectedJob.status}</span></p>
            </div>
            <button
              onClick={() => setSelectedJob(null)}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Hours Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-300">
              <p className="text-xs font-bold text-gray-700 mb-1">Estimated Hours</p>
              <p className="text-2xl font-bold text-indigo-600">{selectedJob.estimatedHours}h</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-300">
              <p className="text-xs font-bold text-gray-700 mb-1">Actual Hours</p>
              <p className="text-2xl font-bold text-gray-900">{selectedJob.actualHours}h</p>
            </div>
            <div className={`rounded-xl p-4 border ${
              selectedJob.variance < 0 ? 'bg-green-50 border-green-300' : selectedJob.variance === 0 ? 'bg-blue-50 border-blue-300' : 'bg-red-50 border-red-300'
            }`}>
              <p className="text-xs font-bold text-gray-700 mb-1">Variance</p>
              <p className={`text-2xl font-bold ${
                selectedJob.variance < 0 ? 'text-green-600' : selectedJob.variance === 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {selectedJob.variance > 0 ? '+' : ''}{selectedJob.variance}h
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-300">
              <p className="text-xs font-bold text-gray-700 mb-1">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{selectedJob.entries.length}</p>
            </div>
          </div>

          {/* Add Hours Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddHours(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Hours
            </button>
          </div>

          {/* Hours Entries */}
          <div className="space-y-3">
            <h5 className="font-bold text-gray-900">Hours Logged</h5>
            {selectedJob.entries.length === 0 ? (
              <p className="text-sm text-gray-600 text-center py-4">No hours logged yet</p>
            ) : (
              selectedJob.entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl p-4 border border-gray-300 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{entry.employeeName}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span>{entry.date}</span>
                      <span className="font-bold text-indigo-600">{entry.hoursWorked}h</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Hours Modal */}
      {showAddHours && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Log Hours</h3>
              <button
                onClick={() => setShowAddHours(false)}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Employee</label>
                <select
                  value={newEntry.employeeId}
                  onChange={(e) => {
                    const employee = employees.find(emp => emp.id.toString() === e.target.value)
                    setNewEntry({
                      ...newEntry,
                      employeeId: e.target.value,
                      employeeName: employee?.name || ''
                    })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hours Worked</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={newEntry.hoursWorked}
                  onChange={(e) => setNewEntry({...newEntry, hoursWorked: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="Optional notes..."
                  className="w-full h-20 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setShowAddHours(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Log Hours
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
