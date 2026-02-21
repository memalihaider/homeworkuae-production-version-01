'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Award,
  MapPin,
  Zap,
  Filter,
  Activity,
  ShieldCheck,
  Star,
  ChevronRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  UserCheck,
  FileText,
  ClipboardList,
  Settings,
  Eye,
  Edit3,
  Trash2,
  X,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react'

interface WonLead {
  id: number
  name: string
  company: string
  value: number
  priority: 'High' | 'Medium' | 'Low'
  wonDate: string
  serviceType?: string
  surveyRequired?: boolean
  assigned?: boolean
}

interface Assignment {
  id: number
  leadId: number
  title: string
  client: string
  serviceType: string
  priority: 'High' | 'Medium' | 'Low'
  estimatedValue: number
  requiredSkills: string[]
  teamSize: number
  estimatedDuration: number
  deadline: string
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed'
  assignedTeam?: string[]
  surveyStatus?: 'Not Started' | 'In Progress' | 'Completed'
  createdDate: string
}

export default function TeamAssignment() {
  // Won leads from pipeline that need assignment
  const [wonLeads, setWonLeads] = useState<WonLead[]>([
    {
      id: 1,
      name: 'Ahmed Al-Mansouri',
      company: 'Dubai Properties LLC',
      value: 75000,
      priority: 'High',
      wonDate: '2025-12-20',
      serviceType: 'Office Cleaning',
      surveyRequired: true,
      assigned: false
    },
    {
      id: 2,
      name: 'Fatima Al-Noor',
      company: 'Al Noor Logistics',
      value: 45000,
      priority: 'Medium',
      wonDate: '2025-12-22',
      serviceType: 'Warehouse Sanitization',
      surveyRequired: true,
      assigned: false
    },
    {
      id: 3,
      name: 'Mohammed Hassan',
      company: 'Hassan Group',
      value: 180000,
      priority: 'High',
      wonDate: '2025-12-25',
      serviceType: 'Medical Facility Cleaning',
      surveyRequired: true,
      assigned: false
    }
  ])

  // Assignments created from won leads
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      leadId: 1,
      title: 'Office Deep Cleaning - Dubai Properties',
      client: 'Dubai Properties LLC',
      serviceType: 'Office Cleaning',
      priority: 'High',
      estimatedValue: 75000,
      requiredSkills: ['Floor Cleaning', 'Window Cleaning', 'Safety Certification'],
      teamSize: 4,
      estimatedDuration: 8,
      deadline: '2025-12-28',
      status: 'Pending',
      surveyStatus: 'Not Started',
      createdDate: '2025-12-20'
    }
  ])

  const [teamMembers] = useState<any[]>([
    {
      id: 1,
      name: 'Ahmed Hassan',
      skills: ['Floor Cleaning', 'Window Cleaning', 'Safety Certification', 'Team Lead'],
      availability: ['2025-12-20', '2025-12-21', '2025-12-28'],
      hoursAvailable: 8,
      capacity: 8,
      certifications: ['Safety', 'First Aid'],
      experience: '5 years',
      rating: 4.8,
      assigned: 1,
      status: 'Available'
    },
    {
      id: 2,
      name: 'Fatima Al-Mazrouei',
      skills: ['Floor Cleaning', 'Window Cleaning', 'Quality Control'],
      availability: ['2025-12-20', '2025-12-28'],
      hoursAvailable: 6,
      capacity: 8,
      certifications: ['Quality Control'],
      experience: '3 years',
      rating: 4.9,
      assigned: 1,
      status: 'Available'
    },
    {
      id: 3,
      name: 'Dr. Mohammed Al-Zahra',
      skills: ['Medical Sanitization', 'Biohazard Handling', 'Certification'],
      availability: ['2025-12-21', '2025-12-22', '2025-12-28'],
      hoursAvailable: 8,
      capacity: 8,
      certifications: ['Medical Biohazard', 'CDC Certified'],
      experience: '8 years',
      rating: 4.9,
      assigned: 0,
      status: 'Available'
    },
    {
      id: 4,
      name: 'Ali Hassan',
      skills: ['Carpet Cleaning', 'Stain Removal', 'Floor Waxing'],
      availability: ['2025-12-18', '2025-12-19', '2025-12-28'],
      hoursAvailable: 4,
      capacity: 8,
      certifications: [],
      experience: '2 years',
      rating: 4.5,
      assigned: 1,
      status: 'Available'
    },
    {
      id: 5,
      name: 'Zainab Al-Noor',
      skills: ['Biohazard Handling', 'Medical Sanitization'],
      availability: ['2025-12-21', '2025-12-22', '2025-12-28'],
      hoursAvailable: 8,
      capacity: 8,
      certifications: ['Medical Biohazard'],
      experience: '6 years',
      rating: 4.7,
      assigned: 0,
      status: 'Available'
    }
  ])

  const [activeTab, setActiveTab] = useState<'leads' | 'assignments'>('leads')
  const [selectedLead, setSelectedLead] = useState<WonLead | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showCreateAssignment, setShowCreateAssignment] = useState(false)
  const [showAssignTeam, setShowAssignTeam] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>([])

  // New assignment form data
  const [newAssignment, setNewAssignment] = useState({
    serviceType: '',
    teamSize: 2,
    estimatedDuration: 4,
    deadline: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    notes: ''
  })

  // Simulate receiving won leads from pipeline
  useEffect(() => {
    // Check for new won leads from localStorage (simulated data sharing)
    const storedWonLeads = JSON.parse(localStorage.getItem('wonLeadsForAssignment') || '[]')
    if (storedWonLeads.length > 0) {
      const newWonLeads = storedWonLeads.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        company: lead.company,
        value: lead.value,
        priority: lead.priority as 'High' | 'Medium' | 'Low',
        wonDate: lead.wonDate,
        serviceType: lead.serviceType,
        surveyRequired: lead.surveyRequired,
        assigned: false
      }))

      // Merge with existing won leads, avoiding duplicates
      setWonLeads(prev => {
        const existingIds = prev.map((l: WonLead) => l.id)
        const uniqueNewLeads = newWonLeads.filter((l: WonLead) => !existingIds.includes(l.id))
        return [...prev, ...uniqueNewLeads]
      })

      // Clear the stored data after loading
      localStorage.removeItem('wonLeadsForAssignment')
    }

    // Set up periodic check for new won leads (every 30 seconds)
    const interval = setInterval(() => {
      const newStoredLeads = JSON.parse(localStorage.getItem('wonLeadsForAssignment') || '[]')
      if (newStoredLeads.length > 0) {
        const newWonLeads = newStoredLeads.map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          company: lead.company,
          value: lead.value,
          priority: lead.priority as 'High' | 'Medium' | 'Low',
          wonDate: lead.wonDate,
          serviceType: lead.serviceType,
          surveyRequired: lead.surveyRequired,
          assigned: false
        }))

        setWonLeads(prev => {
          const existingIds = prev.map((l: WonLead) => l.id)
          const uniqueNewLeads = newWonLeads.filter((l: WonLead) => !existingIds.includes(l.id))
          return [...prev, ...uniqueNewLeads]
        })

        localStorage.removeItem('wonLeadsForAssignment')
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const createAssignmentFromLead = useCallback((lead: WonLead) => {
    const newAssignmentData: Assignment = {
      id: Math.max(...assignments.map(a => a.id), 0) + 1,
      leadId: lead.id,
      title: `${lead.serviceType} - ${lead.company}`,
      client: lead.company,
      serviceType: lead.serviceType || 'General Cleaning',
      priority: lead.priority,
      estimatedValue: lead.value,
      requiredSkills: getRequiredSkillsForService(lead.serviceType || 'General Cleaning'),
      teamSize: getRecommendedTeamSize(lead.serviceType || 'General Cleaning'),
      estimatedDuration: getEstimatedDuration(lead.serviceType || 'General Cleaning'),
      deadline: calculateDeadline(lead.wonDate),
      status: 'Pending',
      surveyStatus: 'Not Started',
      createdDate: new Date().toISOString().split('T')[0]
    }

    setAssignments(prev => [...prev, newAssignmentData])
    setWonLeads(prev => prev.map(l =>
      l.id === lead.id ? { ...l, assigned: true } : l
    ))
    setShowCreateAssignment(false)
    setSelectedLead(null)
  }, [assignments])

  const getRequiredSkillsForService = (serviceType: string): string[] => {
    const skillMap: { [key: string]: string[] } = {
      'Office Cleaning': ['Floor Cleaning', 'Window Cleaning', 'Safety Certification'],
      'Medical Facility Cleaning': ['Medical Sanitization', 'Biohazard Handling', 'Certification'],
      'Warehouse Sanitization': ['Industrial Cleaning', 'Safety Certification', 'Equipment Handling'],
      'General Cleaning': ['Floor Cleaning', 'Basic Cleaning', 'Safety Certification']
    }
    return skillMap[serviceType] || skillMap['General Cleaning']
  }

  const getRecommendedTeamSize = (serviceType: string): number => {
    const sizeMap: { [key: string]: number } = {
      'Office Cleaning': 3,
      'Medical Facility Cleaning': 5,
      'Warehouse Sanitization': 4,
      'General Cleaning': 2
    }
    return sizeMap[serviceType] || 2
  }

  const getEstimatedDuration = (serviceType: string): number => {
    const durationMap: { [key: string]: number } = {
      'Office Cleaning': 6,
      'Medical Facility Cleaning': 12,
      'Warehouse Sanitization': 8,
      'General Cleaning': 4
    }
    return durationMap[serviceType] || 4
  }

  const calculateDeadline = (wonDate: string): string => {
    const date = new Date(wonDate)
    date.setDate(date.getDate() + 7) // 1 week deadline
    return date.toISOString().split('T')[0]
  }

  const suggestTeamMembers = useCallback((assignment: Assignment) => {
    return teamMembers
      .filter(member => {
        const hasAllSkills = assignment.requiredSkills.every((skill: string) =>
          member.skills.includes(skill)
        )
        const isAvailable = member.availability.includes(assignment.deadline)
        return hasAllSkills && isAvailable && member.hoursAvailable > 0
      })
      .sort((a, b) => b.rating - a.rating)
  }, [teamMembers])

  const handleAssignTeam = useCallback(() => {
    if (!selectedAssignment) return

    const assignedNames = selectedTeamMembers
      .map(id => teamMembers.find(m => m.id === id)?.name)
      .filter(Boolean) as string[]

    setAssignments(prev => prev.map(a =>
      a.id === selectedAssignment.id
        ? { ...a, assignedTeam: assignedNames, status: 'Assigned' }
        : a
    ))

    setShowAssignTeam(false)
    setSelectedAssignment(null)
    setSelectedTeamMembers([])
  }, [selectedAssignment, selectedTeamMembers, teamMembers])

  const updateAssignmentStatus = useCallback((assignmentId: number, newStatus: Assignment['status']) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, status: newStatus } : a
    ))
  }, [])

  const updateSurveyStatus = useCallback((assignmentId: number, surveyStatus: Assignment['surveyStatus']) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, surveyStatus } : a
    ))
  }, [])

  const filteredWonLeads = useMemo(() => {
    return wonLeads.filter(lead =>
      !lead.assigned && (
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      )
    )
  }, [wonLeads, searchTerm])

  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment =>
      filterStatus === 'All' || assignment.status === filterStatus
    ).filter(assignment =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.client.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [assignments, filterStatus, searchTerm])

  const stats = useMemo(() => {
    const totalValue = assignments.reduce((sum, a) => sum + a.estimatedValue, 0)
    const pendingAssignments = assignments.filter(a => a.status === 'Pending').length
    const activeAssignments = assignments.filter(a => a.status === 'Assigned' || a.status === 'In Progress').length
    const completedSurveys = assignments.filter(a => a.surveyStatus === 'Completed').length

    return { totalValue, pendingAssignments, activeAssignments, completedSurveys }
  }, [assignments])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Assignment</h1>
            <p className="text-gray-600 mt-1">Convert won leads into scheduled service assignments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {wonLeads.filter(l => !l.assigned).length} Pending Leads
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {assignments.filter(a => a.status === 'Assigned').length} Active Assignments
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-gray-900">AED {stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-xl font-bold text-gray-900">{stats.pendingAssignments}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-xl font-bold text-gray-900">{stats.activeAssignments}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Surveys Completed</p>
                <p className="text-xl font-bold text-gray-900">{stats.completedSurveys}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'leads'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Won Leads ({wonLeads.filter(l => !l.assigned).length})
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'assignments'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assignments ({assignments.length})
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'leads' ? "Search leads..." : "Search assignments..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {activeTab === 'assignments' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
        </div>

        {/* Content */}
        {activeTab === 'leads' ? (
          /* Won Leads Section */
          <div className="space-y-4">
            {filteredWonLeads.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All leads assigned!</h3>
                <p className="text-gray-600">New won leads will appear here automatically.</p>
              </div>
            ) : (
              filteredWonLeads.map(lead => (
                <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-700">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">AED {lead.value.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Won {lead.wonDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.priority === 'High' ? 'bg-red-100 text-red-800' :
                        lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.priority}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedLead(lead)
                          setShowCreateAssignment(true)
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Create Assignment
                      </button>
                    </div>
                  </div>
                  {lead.serviceType && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Service: {lead.serviceType}</span>
                        {lead.surveyRequired && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Survey Required
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Assignments Section */
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-600">Create assignments from won leads to get started.</p>
              </div>
            ) : (
              filteredAssignments.map(assignment => (
                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        assignment.status === 'Completed' ? 'bg-green-100' :
                        assignment.status === 'In Progress' ? 'bg-blue-100' :
                        assignment.status === 'Assigned' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {assignment.status === 'Completed' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                         assignment.status === 'In Progress' ? <PlayCircle className="h-5 w-5 text-blue-600" /> :
                         assignment.status === 'Assigned' ? <UserCheck className="h-5 w-5 text-yellow-600" /> :
                         <Clock className="h-5 w-5 text-gray-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">AED {assignment.estimatedValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Due {assignment.deadline}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        assignment.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {assignment.status}
                      </span>
                      <div className="flex gap-2">
                        {!assignment.assignedTeam && (
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment)
                              setShowAssignTeam(true)
                              const suggested = suggestTeamMembers(assignment)
                              setSelectedTeamMembers(suggested.slice(0, assignment.teamSize).map(m => m.id))
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                          >
                            Assign Team
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const newStatus = assignment.status === 'Pending' ? 'Assigned' :
                                            assignment.status === 'Assigned' ? 'In Progress' :
                                            assignment.status === 'In Progress' ? 'Completed' : 'Pending'
                            updateAssignmentStatus(assignment.id, newStatus)
                          }}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
                        >
                          {assignment.status === 'Pending' ? 'Start' :
                           assignment.status === 'Assigned' ? 'Begin' :
                           assignment.status === 'In Progress' ? 'Complete' : 'Restart'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Team: {assignment.assignedTeam?.join(', ') || 'Not assigned'}</span>
                        <span className="text-sm text-gray-600">Duration: {assignment.estimatedDuration}h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Survey:</span>
                        <select
                          value={assignment.surveyStatus}
                          onChange={(e) => updateSurveyStatus(assignment.id, e.target.value as Assignment['surveyStatus'])}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Assignment Modal */}
        {showCreateAssignment && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Create Service Assignment</h2>
                <button onClick={() => setShowCreateAssignment(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Create assignment for <strong>{selectedLead.name}</strong> from <strong>{selectedLead.company}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Value: <strong>AED {selectedLead.value.toLocaleString()}</strong>
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateAssignment(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => createAssignmentFromLead(selectedLead)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Team Modal */}
        {showAssignTeam && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Assign Team - {selectedAssignment.title}</h2>
                <button onClick={() => setShowAssignTeam(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssignment.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {teamMembers.map(member => {
                    const isSelected = selectedTeamMembers.includes(member.id)
                    const hasRequiredSkills = selectedAssignment.requiredSkills.every(skill =>
                      member.skills.includes(skill)
                    )
                    const isAvailable = member.availability.includes(selectedAssignment.deadline)

                    return (
                      <div
                        key={member.id}
                        onClick={() => {
                          if (hasRequiredSkills && isAvailable) {
                            setSelectedTeamMembers(prev =>
                              prev.includes(member.id)
                                ? prev.filter(id => id !== member.id)
                                : [...prev, member.id]
                            )
                          }
                        }}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'border-blue-500 bg-blue-50' :
                          hasRequiredSkills && isAvailable ? 'border-gray-300 hover:border-gray-400' :
                          'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.experience}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{member.rating}</span>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                        </div>
                        {!hasRequiredSkills && (
                          <p className="text-xs text-red-600 mt-2">Missing required skills</p>
                        )}
                        {!isAvailable && (
                          <p className="text-xs text-red-600 mt-2">Not available on deadline</p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Selected: {selectedTeamMembers.length} / {selectedAssignment.teamSize} recommended
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAssignTeam(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignTeam}
                      disabled={selectedTeamMembers.length === 0}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      Assign Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
