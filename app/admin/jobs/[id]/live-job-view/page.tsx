'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Navigation,
  Phone,
  MessageSquare,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckSquare
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface TeamMember {
  id: number
  name: string
  role: string
  status: 'active' | 'break' | 'offline'
  location: string
  lastUpdate: string
  currentTask: string
}

interface TaskUpdate {
  id: string
  memberId: number
  task: string
  status: 'completed' | 'in_progress' | 'pending'
  timestamp: string
  location: string
}

interface Incident {
  id: string
  type: 'safety' | 'equipment' | 'client' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  reportedBy: string
  timestamp: string
  status: 'reported' | 'investigating' | 'resolved'
}

export default function LiveJobView() {
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
    status: 'In Progress',
    progress: 65
  }

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'Ahmed Hassan',
      role: 'Team Lead',
      status: 'active',
      location: 'Floor 15',
      lastUpdate: '2 min ago',
      currentTask: 'Supervising floor cleaning'
    },
    {
      id: 2,
      name: 'Fatima Al-Mazrouei',
      role: 'Floor Specialist',
      status: 'active',
      location: 'Floor 12',
      lastUpdate: '1 min ago',
      currentTask: 'Deep cleaning main hallway'
    },
    {
      id: 3,
      name: 'Mohammed Bin Ali',
      role: 'Window Specialist',
      status: 'break',
      location: 'Floor 8',
      lastUpdate: '5 min ago',
      currentTask: 'Taking break'
    },
    {
      id: 4,
      name: 'Sara Al-Rashid',
      role: 'Safety Officer',
      status: 'active',
      location: 'Floor 20',
      lastUpdate: '3 min ago',
      currentTask: 'Safety inspection'
    }
  ])

  const [recentUpdates, setRecentUpdates] = useState<TaskUpdate[]>([
    {
      id: '1',
      memberId: 2,
      task: 'Completed deep cleaning of executive floor',
      status: 'completed',
      timestamp: '10:30 AM',
      location: 'Floor 20'
    },
    {
      id: '2',
      memberId: 1,
      task: 'Started window cleaning on north side',
      status: 'in_progress',
      timestamp: '10:25 AM',
      location: 'Floor 15'
    },
    {
      id: '3',
      memberId: 4,
      task: 'Safety checklist completed for floors 10-15',
      status: 'completed',
      timestamp: '10:20 AM',
      location: 'Floor 12'
    }
  ])

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      type: 'equipment',
      severity: 'medium',
      description: 'Vacuum cleaner motor making unusual noise',
      reportedBy: 'Fatima Al-Mazrouei',
      timestamp: '10:15 AM',
      status: 'investigating'
    }
  ])

  const [isCallActive, setIsCallActive] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random updates
      if (Math.random() > 0.8) {
        const randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)]
        const newUpdate: TaskUpdate = {
          id: Date.now().toString(),
          memberId: randomMember.id,
          task: `Updated task for ${randomMember.name}`,
          status: 'in_progress',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: randomMember.location
        }
        setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 9)])
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [teamMembers])

  const handleCallToggle = useCallback(() => {
    setIsCallActive(!isCallActive)
  }, [isCallActive])

  const handleMicToggle = useCallback(() => {
    setIsMicOn(!isMicOn)
  }, [])

  const handleVideoToggle = useCallback(() => {
    setIsVideoOn(!isVideoOn)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'break':
        return 'bg-yellow-100 text-yellow-700'
      case 'offline':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const totalMembers = teamMembers.length

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
            <h1 className="text-2xl font-bold text-gray-900">Live Job View</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{activeMembers}/{totalMembers} Active</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(activeMembers / totalMembers) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            Live
          </div>
        </div>
      </div>

      {/* Job Status Overview */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{job.progress}%</div>
            <div className="text-sm text-gray-600">Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{activeMembers}</div>
            <div className="text-sm text-gray-600">Active Team</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{incidents.filter(i => i.status !== 'resolved').length}</div>
            <div className="text-sm text-gray-600">Open Incidents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{recentUpdates.filter(u => u.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Members Status */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Team Status</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-600">{member.role}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 mb-2">
                    📍 {member.location} • {member.lastUpdate}
                  </div>

                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                    {member.currentTask}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Updates & Communication */}
        <div className="lg:col-span-2 space-y-6">
          {/* Communication Controls */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Communication</h2>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCallToggle}
                className={`p-4 rounded-full transition-all ${
                  isCallActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Phone className="w-6 h-6" />
              </button>

              <button
                onClick={handleMicToggle}
                className={`p-4 rounded-full transition-all ${
                  isMicOn ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-600 text-white'
                }`}
                disabled={!isCallActive}
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              <button
                onClick={handleVideoToggle}
                className={`p-4 rounded-full transition-all ${
                  isVideoOn ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-600 text-white'
                }`}
                disabled={!isCallActive}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              <button className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all">
                <MessageSquare className="w-6 h-6" />
              </button>

              <button className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all">
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mt-4">
              <div className="text-sm text-gray-600">
                {isCallActive ? 'Call active with team' : 'Click to start team call'}
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Live Updates</h2>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {recentUpdates.map((update) => {
                const member = teamMembers.find(m => m.id === update.memberId)
                return (
                  <div key={update.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded-full ${
                        update.status === 'completed' ? 'bg-green-100' :
                        update.status === 'in_progress' ? 'bg-blue-100' :
                        'bg-yellow-100'
                      }`}>
                        {update.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                         update.status === 'in_progress' ? <Navigation className="w-4 h-4 text-blue-600" /> :
                         <Clock className="w-4 h-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">{update.task}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {member?.name} • {update.timestamp} • 📍 {update.location}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Incidents */}
          {incidents.filter(i => i.status !== 'resolved').length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Active Incidents</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {incidents.filter(i => i.status !== 'resolved').map((incident) => (
                  <div key={incident.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        incident.severity === 'critical' ? 'text-red-600' :
                        incident.severity === 'high' ? 'text-orange-600' :
                        incident.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{incident.description}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Reported by {incident.reportedBy} • {incident.timestamp} • Status: {incident.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}