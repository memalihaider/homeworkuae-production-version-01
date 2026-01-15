'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Phone,
  MessageSquare,
  Search,
  Filter,
  X,
  Star,
  ChevronRight
} from 'lucide-react'

interface Assignment {
  id: string
  title: string
  client: string
  location: string
  description: string
  status: 'Assigned' | 'In Progress' | 'Completed' | 'On Hold'
  priority: 'Low' | 'Normal' | 'High' | 'Critical'
  dueDate: string
  assignedDate: string
  compensation: number
  estimatedHours: number
  actualHours?: number
  rating?: number
  contactPerson?: string
  phone?: string
  notes?: string
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'A001',
      title: 'Deep Cleaning - Palm Jumeirah Villa',
      client: 'Ahmed Al-Mansoori',
      location: 'Palm Jumeirah, Dubai',
      description: 'Complete villa deep cleaning including all rooms, carpets, and windows',
      status: 'In Progress',
      priority: 'High',
      dueDate: 'Dec 22, 2025',
      assignedDate: 'Dec 18, 2025',
      compensation: 300,
      estimatedHours: 8,
      actualHours: 4,
      contactPerson: 'Ahmed Al-Mansoori',
      phone: '+971 50 123 4567'
    },
    {
      id: 'A002',
      title: 'Regular Maintenance - Downtown Dubai',
      client: 'Fatima Khan',
      location: 'Downtown Dubai',
      description: 'Monthly maintenance cleaning service',
      status: 'Assigned',
      priority: 'Normal',
      dueDate: 'Dec 29, 2025',
      assignedDate: 'Dec 19, 2025',
      compensation: 200,
      estimatedHours: 4,
      contactPerson: 'Fatima Khan',
      phone: '+971 50 987 6543'
    },
    {
      id: 'A003',
      title: 'Carpet Cleaning - JBR Apartment',
      client: 'Mohammed Said',
      location: 'JBR, Dubai',
      description: 'Professional carpet cleaning and stain treatment',
      status: 'Completed',
      priority: 'Normal',
      dueDate: 'Dec 20, 2025',
      assignedDate: 'Dec 15, 2025',
      compensation: 250,
      estimatedHours: 6,
      actualHours: 5.5,
      rating: 5.0,
      contactPerson: 'Mohammed Said',
      phone: '+971 50 456 7890'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'in-progress' | 'completed' | 'on-hold'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'normal' | 'high' | 'critical'>('all')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Handler Functions
  const handleStartAssignment = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId && a.status === 'Assigned'
        ? { ...a, status: 'In Progress' }
        : a
    ))
    alert('Assignment started! You can now track your hours.')
  }, [])

  const handleCompleteAssignment = useCallback((assignmentId: string) => {
    if (confirm('Mark this assignment as completed?')) {
      setAssignments(prev => prev.map(a =>
        a.id === assignmentId
          ? { ...a, status: 'Completed' }
          : a
      ))
      alert('Assignment completed! Great work!')
      setShowDetailsModal(false)
    }
  }, [])

  const handlePauseAssignment = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId
        ? { ...a, status: 'On Hold' }
        : a
    ))
    alert('Assignment paused. Contact your manager for assistance.')
  }, [])

  const handleContactClient = useCallback((assignmentId: string, clientName: string) => {
    alert(`Initiating contact with ${clientName}...`)
  }, [])

  const handleViewDetails = useCallback((assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setShowDetailsModal(true)
  }, [])

  const handleLogHours = useCallback((assignmentId: string, hours: number) => {
    alert(`Logged ${hours} hours for assignment ${assignmentId}`)
  }, [])

  // Filtering and Search
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           a.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           a.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || a.status.toLowerCase().replace(' ', '-') === filterStatus
      const matchesPriority = filterPriority === 'all' || a.priority.toLowerCase() === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [assignments, searchTerm, filterStatus, filterPriority])

  // Statistics
  const stats = useMemo(() => ({
    total: assignments.length,
    assigned: assignments.filter(a => a.status === 'Assigned').length,
    inProgress: assignments.filter(a => a.status === 'In Progress').length,
    completed: assignments.filter(a => a.status === 'Completed').length,
    onHold: assignments.filter(a => a.status === 'On Hold').length,
    totalEarned: assignments.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.compensation, 0)
  }), [assignments])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Assigned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
      case 'In Progress': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30'
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      case 'On Hold': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
      default: return 'bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30'
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
      case 'Normal': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      default: return 'bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Assigned': return <AlertCircle className="h-4 w-4 text-blue-600" />
      case 'In Progress': return <Clock className="h-4 w-4 text-purple-600" />
      case 'Completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'On Hold': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Job Assignments</h1>
        <p className="text-muted-foreground mt-1">Track and manage your assigned work</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-3xl font-black">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-muted-foreground">Assigned</p>
          </div>
          <p className="text-3xl font-black text-blue-600">{stats.assigned}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-600" />
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <p className="text-3xl font-black text-purple-600">{stats.inProgress}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <p className="text-3xl font-black text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-muted-foreground">On Hold</p>
          </div>
          <p className="text-3xl font-black text-yellow-600">{stats.onHold}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <p className="text-sm text-muted-foreground">Earned</p>
          </div>
          <p className="text-2xl font-black text-green-600">AED {stats.totalEarned}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, client, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm font-bold bg-background"
          >
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm font-bold bg-background"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-card border rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getPriorityColor(assignment.priority)}`}>
                    {assignment.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{assignment.client}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{assignment.location}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{assignment.dueDate}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-blue-600">
                  <DollarSign className="h-4 w-4" />
                  <span>AED {assignment.compensation}</span>
                </div>
              </div>

              {/* Progress bar if in progress */}
              {assignment.status === 'In Progress' && assignment.actualHours && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{Math.round((assignment.actualHours / assignment.estimatedHours) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(assignment.actualHours / assignment.estimatedHours) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleViewDetails(assignment)}
                  className="px-3 py-2 border rounded-lg hover:bg-muted text-sm font-bold flex items-center gap-1"
                >
                  View Details <ChevronRight className="h-3 w-3" />
                </button>
                {assignment.status === 'Assigned' && (
                  <button
                    onClick={() => handleStartAssignment(assignment.id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold"
                  >
                    Start
                  </button>
                )}
                {assignment.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleCompleteAssignment(assignment.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handlePauseAssignment(assignment.id)}
                      className="px-3 py-2 border rounded-lg hover:bg-muted text-sm font-bold"
                    >
                      Pause
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border rounded-lg p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No assignments found</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{selectedAssignment.title}</h3>
              <p className="text-muted-foreground mt-2">{selectedAssignment.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedAssignment.status)}`}>
                  {getStatusIcon(selectedAssignment.status)}
                  {selectedAssignment.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Priority</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedAssignment.priority)}`}>
                  {selectedAssignment.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Due Date</p>
                <p className="font-bold">{selectedAssignment.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Compensation</p>
                <p className="font-bold text-blue-600">AED {selectedAssignment.compensation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Estimated Hours</p>
                <p className="font-bold">{selectedAssignment.estimatedHours} hours</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Actual Hours</p>
                <p className="font-bold">{selectedAssignment.actualHours || 0} hours</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Client</p>
                <p className="font-bold">{selectedAssignment.client}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Location</p>
                <p className="font-bold">{selectedAssignment.location}</p>
              </div>
              {selectedAssignment.rating && (
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Client Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <p className="font-bold">{selectedAssignment.rating}/5</p>
                  </div>
                </div>
              )}
            </div>

            {/* Client Contact */}
            {selectedAssignment.contactPerson && (
              <div className="mb-6 p-4 border rounded-lg">
                <p className="font-bold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client Information
                </p>
                <div className="space-y-2 text-sm">
                  <p>Name: <span className="font-bold">{selectedAssignment.contactPerson}</span></p>
                  <p>Phone: <span className="font-bold">{selectedAssignment.phone}</span></p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t flex-wrap">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold"
              >
                Close
              </button>
              {selectedAssignment.status === 'Assigned' && (
                <button
                  onClick={() => handleStartAssignment(selectedAssignment.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Start Assignment
                </button>
              )}
              {selectedAssignment.status === 'In Progress' && (
                <button
                  onClick={() => handleCompleteAssignment(selectedAssignment.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => handleContactClient(selectedAssignment.id, selectedAssignment.client)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
