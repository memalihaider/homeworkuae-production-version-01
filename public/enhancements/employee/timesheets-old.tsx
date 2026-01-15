'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Clock,
  Calendar,
  Plus,
  Check,
  X,
  Search,
  Download,
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react'

interface TimesheetEntry {
  id: string
  date: string
  day: string
  hoursWorked: number
  jobId: string
  jobTitle: string
  notes: string
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
  overtimeHours: number
}

interface TimesheetWeek {
  week: string
  totalHours: number
  totalOvertime: number
  status: 'Draft' | 'Submitted' | 'Approved'
  entries: TimesheetEntry[]
}

export default function Timesheets() {
  const [timesheetWeeks, setTimesheetWeeks] = useState<TimesheetWeek[]>([
    {
      week: 'Dec 16 - Dec 22, 2025',
      totalHours: 40,
      totalOvertime: 4,
      status: 'Submitted',
      entries: [
        { id: '1', date: 'Dec 16', day: 'Monday', hoursWorked: 8, jobId: 'J001', jobTitle: 'Deep Cleaning - Villa', notes: 'Completed ahead of schedule', status: 'Submitted', overtimeHours: 1 },
        { id: '2', date: 'Dec 17', day: 'Tuesday', hoursWorked: 9, jobId: 'J002', jobTitle: 'Regular Maintenance', notes: 'Extra hour for final touch-ups', status: 'Submitted', overtimeHours: 1 },
        { id: '3', date: 'Dec 18', day: 'Wednesday', hoursWorked: 8, jobId: 'J001', jobTitle: 'Deep Cleaning - Villa', notes: 'Continued work', status: 'Submitted', overtimeHours: 0 },
        { id: '4', date: 'Dec 19', day: 'Thursday', hoursWorked: 8, jobId: 'J003', jobTitle: 'Carpet Cleaning', notes: 'Standard hours', status: 'Submitted', overtimeHours: 0 },
        { id: '5', date: 'Dec 20', day: 'Friday', hoursWorked: 8, jobId: 'J003', jobTitle: 'Carpet Cleaning', notes: 'Completed on time', status: 'Submitted', overtimeHours: 2 },
      ]
    },
    {
      week: 'Dec 9 - Dec 15, 2025',
      totalHours: 40,
      totalOvertime: 2,
      status: 'Approved',
      entries: [
        { id: '6', date: 'Dec 9', day: 'Monday', hoursWorked: 8, jobId: 'J001', jobTitle: 'Deep Cleaning - Villa', notes: 'Started new project', status: 'Approved', overtimeHours: 0 },
        { id: '7', date: 'Dec 10', day: 'Tuesday', hoursWorked: 8, jobId: 'J002', jobTitle: 'Regular Maintenance', notes: '', status: 'Approved', overtimeHours: 1 },
        { id: '8', date: 'Dec 11', day: 'Wednesday', hoursWorked: 8, jobId: 'J001', jobTitle: 'Deep Cleaning - Villa', notes: 'On schedule', status: 'Approved', overtimeHours: 0 },
        { id: '9', date: 'Dec 12', day: 'Thursday', hoursWorked: 8, jobId: 'J003', jobTitle: 'Carpet Cleaning', notes: '', status: 'Approved', overtimeHours: 0 },
        { id: '10', date: 'Dec 13', day: 'Friday', hoursWorked: 8, jobId: 'J003', jobTitle: 'Carpet Cleaning', notes: 'Completed early', status: 'Approved', overtimeHours: 1 },
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'submitted' | 'approved'>('all')
  const [selectedWeek, setSelectedWeek] = useState<TimesheetWeek | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEntry, setNewEntry] = useState({ date: '', hoursWorked: 0, jobId: '', notes: '' })

  // Handler Functions
  const handleSubmitTimesheet = useCallback((week: string) => {
    if (confirm('Submit this timesheet for approval?')) {
      alert(`Timesheet for ${week} submitted successfully!`)
    }
  }, [])

  const handleAddEntry = useCallback(() => {
    if (!newEntry.date || !newEntry.hoursWorked || !newEntry.jobId) {
      alert('Please fill in all required fields')
      return
    }
    alert('Timesheet entry added successfully!')
    setNewEntry({ date: '', hoursWorked: 0, jobId: '', notes: '' })
    setShowAddModal(false)
  }, [newEntry])

  const handleDeleteEntry = useCallback((entryId: string) => {
    if (confirm('Delete this entry?')) {
      alert('Entry deleted successfully!')
    }
  }, [])

  const handleEditEntry = useCallback((entry: TimesheetEntry) => {
    alert(`Editing entry: ${entry.date}`)
  }, [])

  const handleViewDetails = useCallback((week: TimesheetWeek) => {
    setSelectedWeek(week)
    setShowDetailsModal(true)
  }, [])

  const handleDownloadTimesheet = useCallback((week: string) => {
    alert(`Downloading timesheet for ${week}...`)
  }, [])

  // Filtering
  const filteredWeeks = useMemo(() => {
    return timesheetWeeks.filter(w => {
      const matchesSearch = w.week.includes(searchTerm)
      const matchesStatus = filterStatus === 'all' || w.status.toLowerCase() === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [timesheetWeeks, searchTerm, filterStatus])

  // Statistics
  const stats = useMemo(() => {
    const allEntries = timesheetWeeks.flatMap(w => w.entries)
    return {
      totalHours: allEntries.reduce((sum, e) => sum + e.hoursWorked, 0),
      totalOvertime: allEntries.reduce((sum, e) => sum + e.overtimeHours, 0),
      averageHours: Math.round(allEntries.reduce((sum, e) => sum + e.hoursWorked, 0) / (timesheetWeeks.length || 1)),
      submitted: timesheetWeeks.filter(w => w.status === 'Submitted').length,
      approved: timesheetWeeks.filter(w => w.status === 'Approved').length,
    }
  }, [timesheetWeeks])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30'
      case 'Submitted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
      case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30'
      default: return 'bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Approved': return <Check className="h-4 w-4 text-green-600" />
      case 'Submitted': return <Clock className="h-4 w-4 text-blue-600" />
      case 'Rejected': return <X className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Timesheets</h1>
          <p className="text-muted-foreground mt-1">Track your work hours and overtime</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
          <p className="text-3xl font-black">{stats.totalHours}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-muted-foreground">Overtime Hours</p>
          </div>
          <p className="text-3xl font-black text-yellow-600">{stats.totalOvertime}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg per Week</p>
          <p className="text-3xl font-black">{stats.averageHours}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Submitted</p>
          <p className="text-3xl font-black text-blue-600">{stats.submitted}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-3xl font-black text-green-600">{stats.approved}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <input
          type="text"
          placeholder="Search timesheets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg bg-background"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border rounded-lg text-sm font-bold bg-background"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Timesheets List */}
      <div className="space-y-3">
        {filteredWeeks.length > 0 ? (
          filteredWeeks.map((week, idx) => (
            <div
              key={idx}
              className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
                <div>
                  <p className="text-sm text-muted-foreground font-bold">Week of</p>
                  <h3 className="text-lg font-bold">{week.week}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{week.totalHours} hours</p>
                    <p className="text-sm text-yellow-600 font-bold">{week.totalOvertime} overtime</p>
                  </div>
                  <span className={`px-4 py-2 text-xs font-bold rounded-full flex items-center gap-2 ${getStatusColor(week.status)}`}>
                    {getStatusIcon(week.status)}
                    {week.status}
                  </span>
                </div>
              </div>

              {/* Entries */}
              <div className="p-5 space-y-2">
                {week.entries.slice(0, 3).map(entry => (
                  <div key={entry.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                    <div>
                      <p className="font-bold">{entry.date} ({entry.day})</p>
                      <p className="text-xs text-muted-foreground">{entry.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{entry.hoursWorked}h</p>
                      {entry.overtimeHours > 0 && <p className="text-xs text-yellow-600">+{entry.overtimeHours}h OT</p>}
                    </div>
                  </div>
                ))}
                {week.entries.length > 3 && (
                  <p className="text-xs text-muted-foreground pt-2">+{week.entries.length - 3} more entries...</p>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-muted/50 flex gap-2">
                <button
                  onClick={() => handleViewDetails(week)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold text-sm"
                >
                  View Details
                </button>
                {week.status === 'Draft' && (
                  <button
                    onClick={() => handleSubmitTimesheet(week.week)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm"
                  >
                    Submit
                  </button>
                )}
                <button
                  onClick={() => handleDownloadTimesheet(week.week)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted font-bold text-sm flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border rounded-lg p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No timesheets found</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedWeek && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Timesheet - {selectedWeek.week}</h3>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground font-bold">Total Hours</p>
                <p className="text-2xl font-black">{selectedWeek.totalHours}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">Overtime</p>
                <p className="text-2xl font-black text-yellow-600">{selectedWeek.totalOvertime}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">Status</p>
                <span className={`px-2 py-1 text-xs font-bold rounded inline-flex gap-1 mt-1 ${getStatusColor(selectedWeek.status)}`}>
                  {getStatusIcon(selectedWeek.status)}
                  {selectedWeek.status}
                </span>
              </div>
            </div>

            {/* Detailed Entries */}
            <div className="space-y-2 mb-6">
              {selectedWeek.entries.map(entry => (
                <div key={entry.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{entry.date} ({entry.day})</p>
                      <p className="text-sm text-muted-foreground">{entry.jobTitle}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{entry.hoursWorked} hours {entry.overtimeHours > 0 && `+ ${entry.overtimeHours}h OT`}</span>
                    <span className="text-muted-foreground">{entry.notes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold"
              >
                Close
              </button>
              {selectedWeek.status === 'Draft' && (
                <button
                  onClick={() => handleSubmitTimesheet(selectedWeek.week)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Submit for Approval
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Timesheet Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Hours Worked</label>
                <input
                  type="number"
                  value={newEntry.hoursWorked}
                  onChange={(e) => setNewEntry({...newEntry, hoursWorked: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Job</label>
                <select
                  value={newEntry.jobId}
                  onChange={(e) => setNewEntry({...newEntry, jobId: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select a job...</option>
                  <option value="J001">Deep Cleaning - Villa</option>
                  <option value="J002">Regular Maintenance</option>
                  <option value="J003">Carpet Cleaning</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Notes (Optional)</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  className="w-full p-2 border rounded-lg h-20"
                  placeholder="Add any notes..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
