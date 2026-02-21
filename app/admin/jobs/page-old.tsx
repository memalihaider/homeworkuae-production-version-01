'use client'

import { useState, useCallback, useMemo, Suspense } from 'react'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  User,
  Briefcase,
  DollarSign,
  Camera,
  Play
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Import client data from quotations
import { getQuotations } from '@/lib/quotations-data'

interface NewJob {
  title: string;
  client: string;
  clientId: number | null;
  priority: string;
  scheduledDate: string;
  location: string;
  teamRequired: number;
  budget: number;
  description: string;
  riskLevel: string;
  scheduledTime: string;
  endTime: string;
  slaDeadline: string;
  estimatedDuration: string;
  requiredSkills: string[];
  permits: string[];
  tags: string[];
  specialInstructions: string;
  recurring: boolean;
}

function JobBoardContent() {
  const searchParams = useSearchParams()
  const clientIdFilter = searchParams?.get('clientId')
  
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      title: 'Office Deep Cleaning - Downtown Tower',
      client: 'Downtown Business Tower',
      clientId: 1,
      status: 'Scheduled',
      priority: 'High',
      scheduledDate: '2025-01-20',
      location: 'Downtown, Dubai',
      teamRequired: 4,
      budget: 5000,
      description: 'Complete office floor deep cleaning with window and cubicle sanitization'
    },
    {
      id: 2,
      title: 'Medical Facility Sanitization',
      client: 'Emirates Medical Center',
      clientId: 2,
      status: 'Pending',
      priority: 'Critical',
      scheduledDate: null,
      location: 'Al Baraha, Dubai',
      teamRequired: 6,
      budget: 8500,
      description: 'Complete sanitization of medical facility including operating rooms'
    },
    {
      id: 3,
      title: 'Carpet Cleaning & Maintenance',
      client: 'Hotel Al Manara',
      clientId: 3,
      status: 'In Progress',
      priority: 'Medium',
      scheduledDate: '2025-01-18',
      location: 'Al Manara, Dubai',
      teamRequired: 3,
      budget: 3500,
      description: 'Deep carpet cleaning for hotel lobby and guest rooms'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showNewJob, setShowNewJob] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showClientList, setShowClientList] = useState(false)
  const [showExecution, setShowExecution] = useState(false)
  const [selectedJobForExecution, setSelectedJobForExecution] = useState<any>(null)

  // Get unique clients from quotations data
  const availableClients = useMemo(() => {
    const quotations = getQuotations()
    const clientMap = new Map()
    
    quotations.forEach(quote => {
      if (quote.client && !clientMap.has(quote.client.id)) {
        clientMap.set(quote.client.id, quote.client)
      }
    })
    
    return Array.from(clientMap.values())
  }, [])

  const [jobTemplates] = useState([
    {
      id: 1,
      name: 'Office Deep Cleaning',
      description: 'Complete office cleaning including desks, floors, and common areas',
      category: 'Office',
      data: {
        priority: 'High',
        riskLevel: 'Low',
        teamRequired: 3,
        estimatedDuration: '4 hours',
        budget: 1500,
        requiredSkills: ['General Cleaning', 'Floor Care']
      }
    },
    {
      id: 2,
      name: 'Medical Facility Sanitization',
      description: 'Specialized cleaning for healthcare facilities with sanitization protocols',
      category: 'Medical',
      data: {
        priority: 'Critical',
        riskLevel: 'High',
        teamRequired: 5,
        estimatedDuration: '6 hours',
        budget: 3000,
        requiredSkills: ['Medical Cleaning', 'Sanitization']
      }
    },
    {
      id: 3,
      name: 'Carpet Cleaning',
      description: 'Deep carpet cleaning and maintenance service',
      category: 'Specialized',
      data: {
        priority: 'Medium',
        riskLevel: 'Low',
        teamRequired: 2,
        estimatedDuration: '3 hours',
        budget: 800,
        requiredSkills: ['Carpet Cleaning']
      }
    }
  ])

  // New job form state
  const [newJob, setNewJob] = useState<NewJob>({
    title: '',
    client: '',
    clientId: null,
    priority: 'Medium',
    scheduledDate: '',
    location: '',
    teamRequired: 1,
    budget: 0,
    description: '',
    riskLevel: 'Low',
    scheduledTime: '',
    endTime: '',
    slaDeadline: '',
    estimatedDuration: '',
    requiredSkills: [],
    permits: [],
    tags: [],
    specialInstructions: '',
    recurring: false
  })

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [jobs, searchTerm, statusFilter, priorityFilter])

  // SLA Breach prediction
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-700'
      case 'High':
        return 'bg-orange-100 text-orange-700'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700'
      case 'Scheduled':
        return 'bg-purple-100 text-purple-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const applyTemplate = (template: any) => {
    // Apply template logic
    setShowTemplates(false)
  }

  const handleClientSelect = (client: any) => {
    setNewJob(prev => ({ ...prev, client: client.name, clientId: client.id }))
    setShowClientList(false)
  }

  const handleClientClick = () => {
    setShowClientList(true)
  }
  
  const handleAddJob = useCallback(() => {
    setNewJob({
      title: '',
      client: '',
      clientId: null,
      priority: 'Medium',
      scheduledDate: '',
      location: '',
      teamRequired: 1,
      budget: 0,
      description: '',
      riskLevel: 'Low',
      scheduledTime: '',
      endTime: '',
      slaDeadline: '',
      estimatedDuration: '',
      requiredSkills: [],
      permits: [],
      tags: [],
      specialInstructions: '',
      recurring: false
    })
    setShowNewJob(true)
  }, [])

  const handleSaveJob = useCallback(() => {
    if (!newJob.title || !newJob.client || !newJob.location) {
      alert('Please fill in all required fields')
      return
    }

    const job = {
      id: Math.max(...jobs.map(j => j.id)) + 1,
      ...newJob,
      status: 'Pending'
    }

    setJobs([...jobs, job])
    setShowNewJob(false)
    alert('Job created successfully!')
  }, [newJob, jobs])

  const updateJobStatus = useCallback((jobId: number, newStatus: string) => {
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, status: newStatus, lastUpdated: new Date().toISOString() } : job
    ))
  }, [jobs])

  const handleOnSiteExecution = useCallback((job: any) => {
    setSelectedJobForExecution(job)
    setShowExecution(true)
  }, [])

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">Manage and track cleaning jobs</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddJob}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Job
          </button>
        </div>
      </div>

      {/* Search & Filters with Bulk Operations */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, client, location, skills, or tags..."
              className="w-full pl-10 pr-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            return (
              <div key={job.id} className="bg-card border rounded-lg p-4 hover:border-pink-600 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  {/* Job Content */}
                  <div className="flex-1">
                    <Link href={`/admin/jobs/${job.id}`}>
                      <div className="cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-sm">{job.title}</h3>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPriorityColor(job.priority)}`}>
                                {job.priority}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground hover:text-blue-600 hover:underline">
                              {job.client}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Unscheduled'}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3 w-3" />
                            Team: {job.teamRequired}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            AED {job.budget.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${getPriorityColor(job.priority)}`}>
                              {job.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {job.status === 'Pending' ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  updateJobStatus(job.id, 'Scheduled')
                                }}
                                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Schedule
                              </button>
                            ) : job.status === 'Scheduled' ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    updateJobStatus(job.id, 'In Progress')
                                  }}
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                  Start
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleOnSiteExecution(job)
                                  }}
                                  className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center gap-1"
                                >
                                  <Play className="h-3 w-3" />
                                  Execute
                                </button>
                              </>
                            ) : job.status === 'In Progress' ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    updateJobStatus(job.id, 'Completed')
                                  }}
                                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleOnSiteExecution(job)
                                  }}
                                  className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center gap-1"
                                >
                                  <Camera className="h-3 w-3" />
                                  On Site
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-sm">Try adjusting your filters or create a new job</p>
          </div>
        )}
      </div>

      {/* Job Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Job Templates</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <button
                        onClick={() => applyTemplate(template)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Use Template
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong>Priority:</strong> {template.data.priority}</div>
                      <div><strong>Risk:</strong> {template.data.riskLevel}</div>
                      <div><strong>Team Size:</strong> {template.data.teamRequired}</div>
                      <div><strong>Duration:</strong> {template.data.estimatedDuration}</div>
                      <div><strong>Budget:</strong> AED {template.data.budget.toLocaleString()}</div>
                      <div><strong>Skills:</strong> {template.data.requiredSkills.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Job Modal */}
      {showNewJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Job</h2>
                <button
                  onClick={() => setShowNewJob(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="Enter job title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Choose Client *</label>
                      <div className="flex gap-2">
                        <select
                          value={newJob.client}
                          onChange={(e) => setNewJob({...newJob, client: e.target.value})}
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        >
                          <option value="">Select a client</option>
                          {availableClients.map((client) => (
                            <option key={client.id} value={client.name}>
                              {client.name} - {client.company} ({client.tier})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleClientClick}
                          className="px-3 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200 text-gray-600 text-sm"
                          title="Browse all clients"
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newJob.description}
                      onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      rows={3}
                      placeholder="Job description and requirements"
                    />
                  </div>
                </div>

                {/* Scheduling & Priority */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Scheduling & Priority</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        value={newJob.priority}
                        onChange={(e) => setNewJob({...newJob, priority: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Risk Level</label>
                      <select
                        value={newJob.riskLevel}
                        onChange={(e) => setNewJob({...newJob, riskLevel: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                      <input
                        type="date"
                        value={newJob.scheduledDate}
                        onChange={(e) => setNewJob({...newJob, scheduledDate: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newJob.scheduledTime}
                        onChange={(e) => setNewJob({...newJob, scheduledTime: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        value={newJob.endTime}
                        onChange={(e) => setNewJob({...newJob, endTime: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">SLA Deadline</label>
                      <input
                        type="date"
                        value={newJob.slaDeadline}
                        onChange={(e) => setNewJob({...newJob, slaDeadline: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Duration</label>
                      <input
                        type="text"
                        value={newJob.estimatedDuration}
                        onChange={(e) => setNewJob({...newJob, estimatedDuration: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="e.g., 8 hours"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Resources */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Location & Resources</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Location *</label>
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Required</label>
                      <input
                        type="number"
                        value={newJob.teamRequired}
                        onChange={(e) => setNewJob({...newJob, teamRequired: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Required Skills</label>
                    <input
                      type="text"
                      value={newJob.requiredSkills.join(', ')}
                      onChange={(e) => setNewJob({...newJob, requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      placeholder="e.g., Floor Cleaning, Window Cleaning, Safety Certification"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Permits Required</label>
                    <input
                      type="text"
                      value={newJob.permits.join(', ')}
                      onChange={(e) => setNewJob({...newJob, permits: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      placeholder="e.g., Building Access Pass, Biohazard Permit"
                    />
                  </div>
                </div>

                {/* Budget & Additional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Budget & Additional</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget (AED)</label>
                      <input
                        type="number"
                        value={newJob.budget}
                        onChange={(e) => setNewJob({...newJob, budget: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags</label>
                      <input
                        type="text"
                        value={newJob.tags.join(', ')}
                        onChange={(e) => setNewJob({...newJob, tags: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="e.g., office, deep-cleaning, urgent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Special Instructions</label>
                    <textarea
                      value={newJob.specialInstructions}
                      onChange={(e) => setNewJob({...newJob, specialInstructions: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      rows={2}
                      placeholder="Any special instructions or notes"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newJob.recurring}
                        onChange={(e) => setNewJob({...newJob, recurring: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Recurring Job</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewJob(false)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveJob}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client List Modal */}
      {showClientList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Select Client</h2>
                <button
                  onClick={() => setShowClientList(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {availableClients.length > 0 ? (
                  availableClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-gray-400" />
                            <h3 className="font-medium text-gray-900">{client.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              client.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                              client.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                              client.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {client.tier}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{client.company}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>📧 {client.email}</span>
                            <span>📱 {client.phone}</span>
                            <span>📍 {client.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No clients available</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowClientList(false)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* On Site Job Execution Modal */}
      {showExecution && selectedJobForExecution && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-linear-to-r from-orange-50 to-red-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-300">
                  <Play className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">On Site Job Execution</h2>
                  <p className="text-sm text-gray-600">{selectedJobForExecution.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowExecution(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Client:</span>
                    <span className="ml-2 font-medium">{selectedJobForExecution.client}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium">{selectedJobForExecution.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Team Size:</span>
                    <span className="ml-2 font-medium">{selectedJobForExecution.teamRequired} members</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedJobForExecution.status)}`}>
                      {selectedJobForExecution.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Execution Checklist */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Execution Checklist</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Team arrived on site</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Equipment setup completed</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Safety protocols reviewed</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Client briefing completed</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Work area secured</span>
                  </label>
                </div>
              </div>

              {/* Image Documentation */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Image Documentation</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Placeholder for images */}
                  <div className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Before Work</p>
                    </div>
                  </div>
                  <div className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">In Progress</p>
                    </div>
                  </div>
                  <div className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">After Work</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Progress Notes */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Progress Notes</h3>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  rows={4}
                  placeholder="Add notes about the job execution progress..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowExecution(false)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle execution completion
                    setShowExecution(false)
                    alert('Execution logged successfully!')
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Log Execution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobBoard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <JobBoardContent />
    </Suspense>
  )
}