'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Briefcase,
  DollarSign,
  User,
  Bell,
  ChevronRight,
  Plus,
  Download,
  MessageSquare,
  BarChart3
} from 'lucide-react'

interface Assignment {
  id: string
  title: string
  description: string
  status: 'Assigned' | 'In Progress' | 'Completed' | 'On Hold'
  priority: 'Low' | 'Normal' | 'High' | 'Critical'
  dueDate: string
  assignedDate: string
  client: string
  location: string
  compensation: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'assignment' | 'payment' | 'alert' | 'achievement'
  date: string
  read: boolean
}

export default function EmployeeDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'A001',
      title: 'Deep Cleaning - Palm Jumeirah Villa',
      description: 'Complete villa deep cleaning including all rooms',
      status: 'In Progress',
      priority: 'High',
      dueDate: 'Dec 22, 2025',
      assignedDate: 'Dec 18, 2025',
      client: 'Ahmed Al-Mansoori',
      location: 'Palm Jumeirah, Dubai',
      compensation: 300
    },
    {
      id: 'A002',
      title: 'Regular Maintenance - Downtown Dubai',
      description: 'Monthly maintenance service',
      status: 'Assigned',
      priority: 'Normal',
      dueDate: 'Dec 29, 2025',
      assignedDate: 'Dec 19, 2025',
      client: 'Fatima Khan',
      location: 'Downtown Dubai',
      compensation: 200
    },
    {
      id: 'A003',
      title: 'Carpet Cleaning - JBR Apartment',
      description: 'Professional carpet cleaning and treatment',
      status: 'Completed',
      priority: 'Normal',
      dueDate: 'Dec 20, 2025',
      assignedDate: 'Dec 15, 2025',
      client: 'Mohammed Said',
      location: 'JBR, Dubai',
      compensation: 250
    }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'N1', title: 'New Assignment', message: 'You have been assigned: Deep Cleaning - Palm Jumeirah Villa', type: 'assignment', date: 'Today', read: false },
    { id: 'N2', title: 'Payment Processed', message: 'Your payment of AED 800 has been processed', type: 'payment', date: 'Yesterday', read: true },
    { id: 'N3', title: 'Performance Award', message: 'You achieved 5-star rating on last 5 services!', type: 'achievement', date: '2 days ago', read: true }
  ])

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'in-progress' | 'completed'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'normal' | 'high' | 'critical'>('all')

  // Handler Functions
  const handleAcceptAssignment = useCallback((assignmentId: string) => {
    if (confirm('Do you want to accept this assignment?')) {
      alert(`Assignment ${assignmentId} accepted! You can now start working on it.`)
    }
  }, [])

  const handleStartAssignment = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId && a.status === 'Assigned'
        ? { ...a, status: 'In Progress' }
        : a
    ))
    alert('Assignment marked as started')
  }, [])

  const handleCompleteAssignment = useCallback((assignmentId: string) => {
    if (confirm('Are you sure this assignment is complete?')) {
      setAssignments(prev => prev.map(a =>
        a.id === assignmentId
          ? { ...a, status: 'Completed' }
          : a
      ))
      alert('Assignment marked as completed! Great work!')
      setShowDetailsModal(false)
    }
  }, [])

  const handleViewDetails = useCallback((assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setShowDetailsModal(true)
  }, [])

  const handleContactManager = useCallback((assignmentId: string) => {
    alert(`Contacting manager about assignment ${assignmentId}...`)
  }, [])

  const handleMarkNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }, [])

  const handleDownloadPayslip = useCallback(() => {
    alert('Downloading payslip for December 2025...')
  }, [])

  // Filtering and Search
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           a.client.toLowerCase().includes(searchTerm.toLowerCase())
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
    totalEarned: assignments.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.compensation, 0),
    thisMonth: 2500
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
      default: return null
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Welcome back, Ahmad! 👋</h1>
          <p className="text-muted-foreground mt-2">Here are your job assignments and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 relative border rounded-xl hover:bg-muted transition-colors">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-muted-foreground">Total Assignments</p>
          </div>
          <p className="text-3xl font-black">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <p className="text-3xl font-black text-yellow-600">{stats.inProgress}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <p className="text-3xl font-black text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
          <p className="text-3xl font-black text-purple-600">AED {stats.thisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments List - Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter and Search */}
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <input
              type="text"
              placeholder="Search assignments by title or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background"
            />
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
                  onClick={() => handleViewDetails(assignment)}
                  className="bg-card border rounded-lg p-5 hover:shadow-lg cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-bold">CLIENT</p>
                      <p className="font-bold">{assignment.client}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold">LOCATION</p>
                      <p className="font-bold text-xs">{assignment.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold">DUE DATE</p>
                      <p className="font-bold">{assignment.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold">COMPENSATION</p>
                      <p className="font-bold text-blue-600">AED {assignment.compensation}</p>
                    </div>
                  </div>

                  {assignment.status === 'Assigned' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartAssignment(assignment.id)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm"
                    >
                      Start Assignment
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-card border rounded-lg p-8 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No assignments found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Notifications & Performance */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
              <h3 className="font-bold">Notifications ({unreadCount})</h3>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkNotificationRead(notif.id)}
                  className={`p-3 border-l-4 cursor-pointer ${
                    notif.type === 'assignment' ? 'bg-blue-50 border-blue-600 dark:bg-blue-950/30' :
                    notif.type === 'payment' ? 'bg-green-50 border-green-600 dark:bg-green-950/30' :
                    notif.type === 'achievement' ? 'bg-yellow-50 border-yellow-600 dark:bg-yellow-950/30' :
                    'bg-gray-50 border-gray-600'
                  } ${notif.read ? 'opacity-60' : ''}`}
                >
                  <p className="font-bold text-sm">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Performance
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Average Rating</span>
                <span className="font-bold text-green-600">4.9/5.0 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate</span>
                <span className="font-bold text-green-600">98%</span>
              </div>
              <div className="flex justify-between">
                <span>On-Time Delivery</span>
                <span className="font-bold text-green-600">100%</span>
              </div>
              <button 
                onClick={handleDownloadPayslip}
                className="w-full mt-3 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Payslip
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border rounded-lg p-4 space-y-2">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <button className="w-full p-2 border rounded-lg hover:bg-muted text-left text-sm font-bold">
              📞 Contact Manager
            </button>
            <button className="w-full p-2 border rounded-lg hover:bg-muted text-left text-sm font-bold">
              💬 Message Support
            </button>
            <button className="w-full p-2 border rounded-lg hover:bg-muted text-left text-sm font-bold">
              📋 View Timesheets
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{selectedAssignment.title}</h3>
              <p className="text-muted-foreground mt-1">{selectedAssignment.description}</p>
            </div>

            {/* Assignment Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mt-1 ${getStatusColor(selectedAssignment.status)}`}>
                  {getStatusIcon(selectedAssignment.status)}
                  {selectedAssignment.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Priority</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mt-1 ${getPriorityColor(selectedAssignment.priority)}`}>
                  {selectedAssignment.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Due Date</p>
                <p className="font-bold mt-1">{selectedAssignment.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Compensation</p>
                <p className="font-bold text-blue-600 mt-1">AED {selectedAssignment.compensation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Client</p>
                <p className="font-bold mt-1">{selectedAssignment.client}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Location</p>
                <p className="font-bold text-sm mt-1">{selectedAssignment.location}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
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
                  Start
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
                onClick={() => handleContactManager(selectedAssignment.id)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
