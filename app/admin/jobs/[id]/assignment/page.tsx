'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  ArrowLeft,
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
  RotateCcw,
  Save,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface TeamMember {
  id: number
  name: string
  role: string
  skills: string[]
  availability: 'Available' | 'Busy' | 'Off Duty'
  rating: number
  experience: number
  currentJobs: number
  certifications: string[]
}

interface Assignment {
  memberId: number
  role: string
  assigned: boolean
  startTime?: string
  endTime?: string
}

export default function JobAssignment() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  // Mock job data
  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    location: 'Downtown, Dubai',
    scheduledDate: '2025-01-20',
    scheduledTime: '08:00 - 16:00',
    teamRequired: 4,
    requiredSkills: ['Floor Cleaning', 'Window Cleaning', 'Safety Certification', 'Team Lead'],
    estimatedDuration: '8 hours',
    priority: 'High'
  }

  const [assignments, setAssignments] = useState<Assignment[]>([
    { memberId: 1, role: 'Team Lead', assigned: true, startTime: '08:00', endTime: '16:00' },
    { memberId: 2, role: 'Floor Specialist', assigned: true, startTime: '08:00', endTime: '16:00' },
    { memberId: 3, role: 'Window Specialist', assigned: true, startTime: '08:00', endTime: '16:00' },
    { memberId: 4, role: 'Safety Officer', assigned: false }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterAvailability, setFilterAvailability] = useState<string>('all')
  const [filterSkills, setFilterSkills] = useState<string>('all')

  // Mock team members data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'Ahmed Hassan',
      role: 'Senior Technician',
      skills: ['Floor Cleaning', 'Safety Certification', 'Team Lead'],
      availability: 'Available',
      rating: 4.8,
      experience: 5,
      currentJobs: 1,
      certifications: ['Safety Level 3', 'Equipment Certified']
    },
    {
      id: 2,
      name: 'Fatima Al-Mazrouei',
      role: 'Floor Specialist',
      skills: ['Floor Cleaning', 'Equipment Handling'],
      availability: 'Available',
      rating: 4.6,
      experience: 3,
      currentJobs: 0,
      certifications: ['Equipment Certified']
    },
    {
      id: 3,
      name: 'Mohammed Bin Ali',
      role: 'Window Specialist',
      skills: ['Window Cleaning', 'Height Work'],
      availability: 'Available',
      rating: 4.7,
      experience: 4,
      currentJobs: 1,
      certifications: ['Height Safety', 'Equipment Certified']
    },
    {
      id: 4,
      name: 'Sara Al-Rashid',
      role: 'Safety Officer',
      skills: ['Safety Certification', 'First Aid', 'Risk Assessment'],
      availability: 'Available',
      rating: 4.9,
      experience: 6,
      currentJobs: 0,
      certifications: ['Safety Level 4', 'First Aid Certified']
    },
    {
      id: 5,
      name: 'Omar Al-Farsi',
      role: 'General Technician',
      skills: ['Floor Cleaning', 'Basic Equipment'],
      availability: 'Busy',
      rating: 4.2,
      experience: 2,
      currentJobs: 2,
      certifications: ['Basic Safety']
    }
  ])

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesAvailability = filterAvailability === 'all' || member.availability.toLowerCase() === filterAvailability
      const matchesSkills = filterSkills === 'all' || member.skills.includes(filterSkills)

      return matchesSearch && matchesAvailability && matchesSkills
    })
  }, [teamMembers, searchTerm, filterAvailability, filterSkills])

  const handleAssignMember = useCallback((memberId: number, role: string) => {
    setAssignments(prev => {
      const existing = prev.find(a => a.memberId === memberId)
      if (existing) {
        return prev.map(a => a.memberId === memberId ? { ...a, assigned: !a.assigned } : a)
      } else {
        return [...prev, { memberId, role, assigned: true, startTime: '08:00', endTime: '16:00' }]
      }
    })
  }, [])

  const handleSaveAssignments = useCallback(() => {
    // In a real app, this would save to backend
    alert('Team assignments saved successfully!')
  }, [])

  const assignedCount = assignments.filter(a => a.assigned).length
  const progressPercentage = (assignedCount / job.teamRequired) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/jobs/${jobId}`}
            className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Assignment</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">{assignedCount}/{job.teamRequired} Assigned</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={handleSaveAssignments}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Assignments
          </button>
        </div>
      </div>

      {/* Job Summary */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{job.teamRequired}</div>
            <div className="text-sm text-gray-600">Team Size Required</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{job.estimatedDuration}</div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{job.scheduledDate}</div>
            <div className="text-sm text-gray-600">Date</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{job.scheduledTime}</div>
            <div className="text-sm text-gray-600">Time</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Assignments */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Current Assignments</h2>
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const member = teamMembers.find(m => m.id === assignment.memberId)
                if (!member) return null

                return (
                  <div key={assignment.memberId} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-600">{assignment.role}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        assignment.assigned ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {assignment.assigned ? 'Assigned' : 'Unassigned'}
                      </div>
                    </div>
                    {assignment.assigned && (
                      <div className="text-xs text-gray-600">
                        {assignment.startTime} - {assignment.endTime}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Team Member Pool */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Available Team Members</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredMembers.map((member) => {
                const isAssigned = assignments.some(a => a.memberId === member.id && a.assigned)
                const hasRequiredSkills = job.requiredSkills.some(skill => member.skills.includes(skill))

                return (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900">{member.name}</span>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              member.availability === 'Available' ? 'bg-green-100 text-green-700' :
                              member.availability === 'Busy' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {member.availability}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{member.role} • {member.experience} years exp.</div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {member.rating}
                            </span>
                            <span>{member.currentJobs} active jobs</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-gray-600 mb-1">Skills Match</div>
                          <div className={`text-xs font-bold px-2 py-1 rounded ${
                            hasRequiredSkills ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {hasRequiredSkills ? 'Good Match' : 'Limited Match'}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAssignMember(member.id, member.role)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            isAssigned
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isAssigned ? 'Remove' : 'Assign'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-gray-600 mb-2">Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, i) => (
                          <span key={i} className={`px-2 py-1 rounded text-xs font-bold ${
                            job.requiredSkills.includes(skill)
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}