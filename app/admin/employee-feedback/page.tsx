'use client'

import { useState } from 'react'
import {
  Plus,
  X,
  Search,
  Filter,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Send,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function EmployeeFeedbackAndComplaints() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'complaints'>('feedback')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Feedback State
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Smith',
      employeeRole: 'Supervisor',
      submittedBy: 'Admin User',
      submissionDate: '2025-01-08',
      rating: 5,
      category: 'Performance',
      title: 'Excellent Job Leadership',
      content: 'John has shown outstanding leadership qualities and consistently exceeds expectations.',
      status: 'Active',
      tags: ['Leadership', 'Performance', 'Professional']
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Sarah Johnson',
      employeeRole: 'Cleaner',
      submittedBy: 'Manager',
      submissionDate: '2025-01-07',
      rating: 4.5,
      category: 'Quality of Work',
      title: 'High Quality Work Standards',
      content: 'Sarah maintains consistently high quality work standards and is very reliable.',
      status: 'Active',
      tags: ['Quality', 'Reliability', 'Consistency']
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: 'Ahmed Hassan',
      employeeRole: 'Team Lead',
      submittedBy: 'Admin User',
      submissionDate: '2025-01-05',
      rating: 4,
      category: 'Development',
      title: 'Training & Development Needed',
      content: 'Ahmed would benefit from additional training in new cleaning techniques.',
      status: 'Pending Action',
      tags: ['Training', 'Development', 'Skills']
    }
  ])

  // Complaints State
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Smith',
      employeeRole: 'Supervisor',
      filedBy: 'Employee',
      submissionDate: '2025-01-08',
      category: 'Workplace Safety',
      priority: 'High',
      title: 'Safety Equipment Issue',
      description: 'Safety harness equipment needs maintenance and replacement.',
      status: 'Open',
      assignedTo: 'HR Manager',
      resolution: '',
      attachments: []
    },
    {
      id: 2,
      employeeId: 5,
      employeeName: 'Maria Garcia',
      employeeRole: 'Cleaner',
      filedBy: 'Employee',
      submissionDate: '2025-01-07',
      category: 'Work Schedule',
      priority: 'Medium',
      title: 'Schedule Conflict',
      description: 'Conflict with assigned shift times causing personal hardship.',
      status: 'In Progress',
      assignedTo: 'Supervisor',
      resolution: 'Reviewing schedule alternatives with employee.',
      attachments: []
    },
    {
      id: 3,
      employeeId: 2,
      employeeName: 'Sarah Johnson',
      employeeRole: 'Cleaner',
      filedBy: 'Supervisor',
      submissionDate: '2025-01-06',
      category: 'Performance',
      priority: 'Low',
      title: 'Attendance Issue',
      description: 'Minor attendance inconsistency noted last month.',
      status: 'Resolved',
      assignedTo: 'HR Manager',
      resolution: 'Matter discussed with employee. Improvement noted.',
      attachments: []
    }
  ])

  // Form States
  const [feedbackForm, setFeedbackForm] = useState({
    employeeId: '',
    rating: 5,
    category: 'Performance',
    title: '',
    content: '',
    tags: ''
  })

  const [complaintForm, setComplaintForm] = useState({
    employeeId: '',
    category: 'Workplace Safety',
    priority: 'Medium',
    title: '',
    description: '',
    filedBy: 'Employee'
  })

  // Employees list for dropdown
  const employees = [
    { id: 1, name: 'John Smith', role: 'Supervisor' },
    { id: 2, name: 'Sarah Johnson', role: 'Cleaner' },
    { id: 3, name: 'Ahmed Hassan', role: 'Team Lead' },
    { id: 4, name: 'Maria Garcia', role: 'Cleaner' },
    { id: 5, name: 'Michael Chen', role: 'Supervisor' }
  ]

  // Handlers
  const handleAddFeedback = () => {
    if (feedbackForm.employeeId && feedbackForm.title && feedbackForm.content) {
      const employee = employees.find(e => e.id.toString() === feedbackForm.employeeId)
      const newFeedback = {
        id: Math.max(...feedbacks.map(f => f.id), 0) + 1,
        employeeId: parseInt(feedbackForm.employeeId),
        employeeName: employee?.name || '',
        employeeRole: employee?.role || '',
        submittedBy: 'Current Admin',
        submissionDate: new Date().toISOString().split('T')[0],
        rating: feedbackForm.rating,
        category: feedbackForm.category,
        title: feedbackForm.title,
        content: feedbackForm.content,
        status: 'Active',
        tags: feedbackForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }
      setFeedbacks([...feedbacks, newFeedback])
      setFeedbackForm({
        employeeId: '',
        rating: 5,
        category: 'Performance',
        title: '',
        content: '',
        tags: ''
      })
      setShowAddModal(false)
    }
  }

  const handleAddComplaint = () => {
    if (complaintForm.employeeId && complaintForm.title && complaintForm.description) {
      const employee = employees.find(e => e.id.toString() === complaintForm.employeeId)
      const newComplaint = {
        id: Math.max(...complaints.map(c => c.id), 0) + 1,
        employeeId: parseInt(complaintForm.employeeId),
        employeeName: employee?.name || '',
        employeeRole: employee?.role || '',
        filedBy: complaintForm.filedBy,
        submissionDate: new Date().toISOString().split('T')[0],
        category: complaintForm.category,
        priority: complaintForm.priority,
        title: complaintForm.title,
        description: complaintForm.description,
        status: 'Open',
        assignedTo: 'Unassigned',
        resolution: '',
        attachments: []
      }
      setComplaints([...complaints, newComplaint])
      setComplaintForm({
        employeeId: '',
        category: 'Workplace Safety',
        priority: 'Medium',
        title: '',
        description: '',
        filedBy: 'Employee'
      })
      setShowAddModal(false)
    }
  }

  const handleDeleteFeedback = (id: number) => {
    setFeedbacks(feedbacks.filter(f => f.id !== id))
  }

  const handleDeleteComplaint = (id: number) => {
    setComplaints(complaints.filter(c => c.id !== id))
  }

  // Filter functions
  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesSearch = f.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-blue-600'
    if (rating >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Pending Action': return 'bg-yellow-100 text-yellow-800'
      case 'Open': return 'bg-red-100 text-red-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Feedback & Complaints</h1>
            <p className="text-sm text-gray-600 mt-1">Manage employee feedback and handle complaints</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-700 uppercase">Total Feedbacks</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{feedbacks.length}</div>
          <div className="text-xs text-blue-600 mt-2">{feedbacks.filter(f => f.status === 'Active').length} Active</div>
        </div>

        <div className="bg-linear-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-xs font-bold text-red-700 uppercase">Total Complaints</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{complaints.length}</div>
          <div className="text-xs text-red-600 mt-2">{complaints.filter(c => c.status === 'Open').length} Open</div>
        </div>

        <div className="bg-linear-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-xs font-bold text-yellow-700 uppercase">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{complaints.filter(c => c.status === 'In Progress').length}</div>
          <div className="text-xs text-yellow-600 mt-2">Complaints</div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-bold text-green-700 uppercase">Resolved</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{complaints.filter(c => c.status === 'Resolved').length}</div>
          <div className="text-xs text-green-600 mt-2">Complaints</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-white border border-gray-300 rounded-2xl w-fit">
        {[
          { id: 'feedback', label: 'Employee Feedback', icon: Star },
          { id: 'complaints', label: 'Complaints', icon: AlertCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any)
              setFilterStatus('all')
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="all">All Status</option>
          {activeTab === 'feedback' ? (
            <>
              <option value="Active">Active</option>
              <option value="Pending Action">Pending Action</option>
            </>
          ) : (
            <>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </>
          )}
        </select>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === 'feedback' ? 'Feedback' : 'Complaint'}
        </button>
      </div>

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No feedbacks found</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white border border-gray-300 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {feedback.employeeName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{feedback.employeeName}</h3>
                        <p className="text-xs text-gray-600">{feedback.employeeRole}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(feedback.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`font-bold text-sm ${getRatingColor(feedback.rating)}`}>
                      {feedback.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">{feedback.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{feedback.content}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                      {feedback.category}
                    </span>
                  </div>
                  {feedback.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {feedback.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {feedback.submissionDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(feedback)
                        setShowViewModal(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No complaints found</p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white border border-gray-300 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold">
                        {complaint.employeeName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{complaint.employeeName}</h3>
                        <p className="text-xs text-gray-600">{complaint.employeeRole}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority} Priority
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">{complaint.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                      {complaint.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      Filed by {complaint.filedBy}
                    </span>
                  </div>

                  {complaint.status !== 'Open' && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-700 mb-1">Resolution:</p>
                      <p className="text-sm text-gray-600">{complaint.resolution}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {complaint.submissionDate}
                    </div>
                    <div>Assigned to: <span className="font-bold">{complaint.assignedTo}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(complaint)
                        setShowViewModal(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComplaint(complaint.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Feedback/Complaint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Add {activeTab === 'feedback' ? 'Employee Feedback' : 'Complaint'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Employee</label>
                <select
                  value={activeTab === 'feedback' ? feedbackForm.employeeId : complaintForm.employeeId}
                  onChange={(e) => {
                    if (activeTab === 'feedback') {
                      setFeedbackForm({...feedbackForm, employeeId: e.target.value})
                    } else {
                      setComplaintForm({...complaintForm, employeeId: e.target.value})
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'feedback' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.5"
                        value={feedbackForm.rating}
                        onChange={(e) => setFeedbackForm({...feedbackForm, rating: parseFloat(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={feedbackForm.category}
                        onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Performance">Performance</option>
                        <option value="Quality of Work">Quality of Work</option>
                        <option value="Development">Development</option>
                        <option value="Behavior">Behavior</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={feedbackForm.title}
                      onChange={(e) => setFeedbackForm({...feedbackForm, title: e.target.value})}
                      placeholder="Feedback title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Feedback</label>
                    <textarea
                      value={feedbackForm.content}
                      onChange={(e) => setFeedbackForm({...feedbackForm, content: e.target.value})}
                      placeholder="Provide detailed feedback..."
                      className="w-full h-24 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={feedbackForm.tags}
                      onChange={(e) => setFeedbackForm({...feedbackForm, tags: e.target.value})}
                      placeholder="e.g., Leadership, Performance, Professional"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={complaintForm.category}
                        onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Workplace Safety">Workplace Safety</option>
                        <option value="Work Schedule">Work Schedule</option>
                        <option value="Performance">Performance</option>
                        <option value="Management">Management</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                      <select
                        value={complaintForm.priority}
                        onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Filed By</label>
                    <select
                      value={complaintForm.filedBy}
                      onChange={(e) => setComplaintForm({...complaintForm, filedBy: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Complaint Title</label>
                    <input
                      type="text"
                      value={complaintForm.title}
                      onChange={(e) => setComplaintForm({...complaintForm, title: e.target.value})}
                      placeholder="Brief complaint title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                      placeholder="Provide detailed complaint description..."
                      className="w-full h-24 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={activeTab === 'feedback' ? handleAddFeedback : handleAddComplaint}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  {activeTab === 'feedback' ? 'Add Feedback' : 'Add Complaint'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
