'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  ShieldCheck,
  Zap,
  FileText,
  MapPin,
  Calendar,
  CheckSquare,
  X,
  Save,
  AlertTriangle,
  Camera,
  Upload,
  MessageSquare,
  Bot,
  TrendingUp,
  Target,
  RefreshCw,
  Eye,
  Edit3,
  Plus,
  Search,
  Filter,
  BarChart3,
  Activity,
  Wifi,
  WifiOff,
  Smartphone,
  QrCode,
  Scan,
  Mic,
  MicOff,
  Wrench,
  Cloud
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  required: boolean
  status: 'pending' | 'completed' | 'failed' | 'in_progress'
  notes?: string
  completedBy?: string
  completedAt?: string
  attachments?: string[]
  aiRecommendation?: string
  automatedCheck?: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedTime?: string
  dependencies?: string[]
}

interface AutomatedCheck {
  id: string
  type: 'equipment_scan' | 'permit_verification' | 'team_check' | 'weather_check'
  status: 'idle' | 'running' | 'completed' | 'failed'
  result?: any
  lastRun?: string
}

export default function PreJobChecklist() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  // Enhanced job data with AI insights
  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    location: 'Downtown, Dubai',
    scheduledDate: '2025-01-20',
    scheduledTime: '08:00 - 16:00',
    aiInsights: {
      riskLevel: 'low',
      recommendedStartTime: '07:30',
      weatherImpact: 'None',
      trafficDelay: '15 minutes'
    }
  }

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // Equipment & Supplies
    {
      id: '1',
      category: 'Equipment & Supplies',
      title: 'Cleaning Equipment Check',
      description: 'Verify all required cleaning equipment is available and functional',
      required: true,
      status: 'completed',
      completedBy: 'Ahmed Hassan',
      completedAt: '2025-01-19 14:30',
      attachments: ['equipment-list.pdf'],
      aiRecommendation: 'All equipment verified. Consider additional microfiber cloths.',
      automatedCheck: true,
      priority: 'high',
      estimatedTime: '15 min',
      dependencies: []
    },
    {
      id: '2',
      category: 'Equipment & Supplies',
      title: 'Safety Equipment',
      description: 'Check safety gear, harnesses, and protective equipment',
      required: true,
      status: 'completed',
      completedBy: 'Ahmed Hassan',
      completedAt: '2025-01-19 14:35',
      aiRecommendation: 'Safety equipment inspection passed. All items within expiry dates.',
      automatedCheck: false,
      priority: 'critical',
      estimatedTime: '10 min',
      dependencies: []
    },
    {
      id: '3',
      category: 'Equipment & Supplies',
      title: 'Consumables Stock',
      description: 'Verify sufficient cleaning supplies and chemicals',
      required: true,
      status: 'in_progress',
      aiRecommendation: 'Stock levels optimal. Consider ordering additional disinfectant.',
      automatedCheck: true,
      priority: 'medium',
      estimatedTime: '5 min',
      dependencies: ['1']
    },

    // Team & Personnel
    {
      id: '4',
      category: 'Team & Personnel',
      title: 'Team Assignment',
      description: 'Confirm all team members are assigned and briefed',
      required: true,
      status: 'completed',
      completedBy: 'HR Manager',
      completedAt: '2025-01-19 10:00',
      aiRecommendation: 'Team composition optimal for job requirements.',
      automatedCheck: false,
      priority: 'high',
      estimatedTime: '20 min',
      dependencies: []
    },
    {
      id: '5',
      category: 'Team & Personnel',
      title: 'Safety Briefing',
      description: 'Conduct pre-job safety briefing with all team members',
      required: true,
      status: 'pending',
      aiRecommendation: 'Schedule briefing for 07:45 AM. Include weather-related safety protocols.',
      automatedCheck: false,
      priority: 'critical',
      estimatedTime: '30 min',
      dependencies: ['4']
    },

    // Site & Access
    {
      id: '6',
      category: 'Site & Access',
      title: 'Site Access Verification',
      description: 'Confirm building access permissions and entry procedures',
      required: true,
      status: 'completed',
      completedBy: 'Operations Manager',
      completedAt: '2025-01-18 16:00',
      aiRecommendation: 'Access confirmed. Rear entrance recommended due to ongoing construction.',
      automatedCheck: true,
      priority: 'high',
      estimatedTime: '10 min',
      dependencies: []
    },
    {
      id: '7',
      category: 'Site & Access',
      title: 'Parking Arrangements',
      description: 'Verify parking availability for team vehicles',
      required: false,
      status: 'pending',
      aiRecommendation: 'Parking confirmed in basement level 2. Security code: 7421.',
      automatedCheck: false,
      priority: 'low',
      estimatedTime: '5 min',
      dependencies: ['6']
    },

    // Documentation
    {
      id: '8',
      category: 'Documentation',
      title: 'Work Permits',
      description: 'Obtain and verify all required work permits',
      required: true,
      status: 'completed',
      completedBy: 'Compliance Officer',
      completedAt: '2025-01-19 09:00',
      attachments: ['permit-commercial.pdf', 'permit-building.pdf'],
      aiRecommendation: 'All permits valid. Commercial permit expires in 3 days.',
      automatedCheck: true,
      priority: 'critical',
      estimatedTime: '15 min',
      dependencies: []
    },
    {
      id: '9',
      category: 'Documentation',
      title: 'Client Approval',
      description: 'Obtain final client approval for work schedule',
      required: true,
      status: 'pending',
      aiRecommendation: 'Client approval pending. Send reminder email.',
      automatedCheck: false,
      priority: 'high',
      estimatedTime: '10 min',
      dependencies: []
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showNotesModal, setShowNotesModal] = useState<string | null>(null)
  const [notesText, setNotesText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [automatedChecks, setAutomatedChecks] = useState<AutomatedCheck[]>([
    { id: '1', type: 'equipment_scan', status: 'completed', lastRun: '2025-01-19 14:30' },
    { id: '2', type: 'permit_verification', status: 'completed', lastRun: '2025-01-19 09:00' },
    { id: '3', type: 'team_check', status: 'completed', lastRun: '2025-01-19 10:00' },
    { id: '4', type: 'weather_check', status: 'idle' }
  ])
  const [isOnline, setIsOnline] = useState(true)
  const [voiceRecording, setVoiceRecording] = useState<string | null>(null)

  const categories = ['all', ...Array.from(new Set(checklistItems.map(item => item.category)))]

  // Enhanced filtering with search and priority
  const filteredItems = checklistItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort by priority and status
  const sortedItems = filteredItems.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    const statusOrder = { failed: 4, pending: 3, in_progress: 2, completed: 1 }

    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return statusOrder[b.status] - statusOrder[a.status]
  })

  const handleStatusChange = useCallback((itemId: string, status: 'pending' | 'completed' | 'failed' | 'in_progress') => {
    setChecklistItems(prev => prev.map(item =>
      item.id === itemId
        ? {
            ...item,
            status,
            completedBy: status === 'completed' ? 'Current User' : undefined,
            completedAt: status === 'completed' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : undefined
          }
        : item
    ))
  }, [])

  const handleSaveNotes = useCallback(() => {
    if (showNotesModal) {
      setChecklistItems(prev => prev.map(item =>
        item.id === showNotesModal
          ? { ...item, notes: notesText }
          : item
      ))
      setShowNotesModal(null)
      setNotesText('')
    }
  }, [showNotesModal, notesText])

  const runAutomatedCheck = useCallback((checkId: string) => {
    setAutomatedChecks(prev => prev.map(check =>
      check.id === checkId
        ? { ...check, status: 'running' as const }
        : check
    ))

    // Simulate automated check
    setTimeout(() => {
      setAutomatedChecks(prev => prev.map(check =>
        check.id === checkId
          ? { ...check, status: 'completed' as const, lastRun: new Date().toISOString().slice(0, 16).replace('T', ' ') }
          : check
      ))
    }, 2000)
  }, [])

  // Calculate progress metrics
  const completedCount = checklistItems.filter(item => item.status === 'completed').length
  const totalRequired = checklistItems.filter(item => item.required).length
  const completedRequired = checklistItems.filter(item => item.required && item.status === 'completed').length
  const progressPercentage = (completedCount / checklistItems.length) * 100
  const criticalItems = checklistItems.filter(item => item.priority === 'critical')
  const criticalCompleted = criticalItems.filter(item => item.status === 'completed').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Enhanced Header with AI Insights */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/jobs/${jobId}`}
            className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pre-Job Checklist</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
            <div className="flex items-center gap-2 mt-1">
              {isOnline ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="w-3 h-3" />
                  <span className="text-xs font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <WifiOff className="w-3 h-3" />
                  <span className="text-xs font-medium">Offline</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-blue-600">
                <Bot className="w-3 h-3" />
                <span className="text-xs font-medium">AI Enhanced</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* AI Panel Toggle */}
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              showAIPanel ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Assistant
          </button>

          {/* Progress Summary */}
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">
              {completedCount}/{checklistItems.length} Completed
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {criticalCompleted}/{criticalItems.length} Critical Items
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAIPanel && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Recommendations
            </h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              job.aiInsights.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
              job.aiInsights.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              Risk Level: {job.aiInsights.riskLevel.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">Recommended Start</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{job.aiInsights.recommendedStartTime}</div>
              <div className="text-xs text-gray-600">Optimal timing</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">Weather Impact</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{job.aiInsights.weatherImpact}</div>
              <div className="text-xs text-gray-600">Current conditions</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">Traffic Delay</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{job.aiInsights.trafficDelay}</div>
              <div className="text-xs text-gray-600">Estimated delay</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search checklist items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job Summary */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-bold text-gray-900">{job.scheduledDate}</div>
              <div className="text-xs text-gray-600">Date</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-bold text-gray-900">{job.scheduledTime}</div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-bold text-gray-900">{job.location}</div>
              <div className="text-xs text-gray-600">Location</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-bold text-gray-900">{job.client}</div>
              <div className="text-xs text-gray-600">Client</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-white border border-gray-200 rounded-xl w-fit">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Enhanced Checklist Items */}
      <div className="space-y-4">
        {sortedItems.map((item) => (
          <div key={item.id} className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-md ${
            item.priority === 'critical' ? 'border-red-300 bg-red-50/30' :
            item.priority === 'high' ? 'border-orange-300 bg-orange-50/30' :
            'border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    {item.required && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        Required
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(item.priority)}`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                    {item.estimatedTime && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        {item.estimatedTime}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{item.description}</p>

                  {/* AI Recommendation */}
                  {item.aiRecommendation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-900">AI Recommendation</span>
                      </div>
                      <div className="text-sm text-blue-800">{item.aiRecommendation}</div>
                    </div>
                  )}

                  {/* Dependencies */}
                  {item.dependencies && item.dependencies.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-bold text-gray-700 mb-2">Dependencies:</div>
                      <div className="flex flex-wrap gap-2">
                        {item.dependencies.map((dep, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-bold text-gray-700 mb-2">Attachments:</div>
                      <div className="flex flex-wrap gap-2">
                        {item.attachments.map((attachment, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                            <FileText className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-gray-700">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.completedBy && item.completedAt && (
                    <div className="text-sm text-gray-500 mb-3">
                      Completed by {item.completedBy} on {item.completedAt}
                    </div>
                  )}

                  {item.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="text-sm font-bold text-gray-700 mb-1">Notes:</div>
                      <div className="text-sm text-gray-600">{item.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {/* Voice Notes */}
                <button
                  onClick={() => setVoiceRecording(item.id)}
                  className={`p-2 rounded-lg transition-all ${
                    voiceRecording === item.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {voiceRecording === item.id ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Camera/Photo */}
                <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
                  <Camera className="w-4 h-4" />
                </button>

                {/* Notes */}
                <button
                  onClick={() => {
                    setShowNotesModal(item.id)
                    setNotesText(item.notes || '')
                  }}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {/* Status Controls */}
                <div className="flex rounded-lg overflow-hidden border border-gray-300 ml-2">
                  <button
                    onClick={() => handleStatusChange(item.id, 'pending')}
                    className={`px-3 py-2 text-sm font-bold transition-all ${
                      item.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'in_progress')}
                    className={`px-3 py-2 text-sm font-bold transition-all ${
                      item.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'completed')}
                    className={`px-3 py-2 text-sm font-bold transition-all ${
                      item.status === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'failed')}
                    className={`px-3 py-2 text-sm font-bold transition-all ${
                      item.status === 'failed' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Failed
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automated Checks Panel */}
      <div className="bg-white rounded-2xl p-6 mt-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Automated Checks
          </h3>
          <button
            onClick={() => automatedChecks.forEach(check => runAutomatedCheck(check.id))}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
          >
            Run All Checks
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automatedChecks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  check.status === 'completed' ? 'bg-green-100' :
                  check.status === 'running' ? 'bg-blue-100' :
                  check.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {check.type === 'equipment_scan' && <Wrench className={`w-4 h-4 ${
                    check.status === 'completed' ? 'text-green-600' :
                    check.status === 'running' ? 'text-blue-600' :
                    check.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                  }`} />}
                  {check.type === 'permit_verification' && <ShieldCheck className={`w-4 h-4 ${
                    check.status === 'completed' ? 'text-green-600' :
                    check.status === 'running' ? 'text-blue-600' :
                    check.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                  }`} />}
                  {check.type === 'team_check' && <Users className={`w-4 h-4 ${
                    check.status === 'completed' ? 'text-green-600' :
                    check.status === 'running' ? 'text-blue-600' :
                    check.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                  }`} />}
                  {check.type === 'weather_check' && <Cloud className={`w-4 h-4 ${
                    check.status === 'completed' ? 'text-green-600' :
                    check.status === 'running' ? 'text-blue-600' :
                    check.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                  }`} />}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {check.type.replace('_', ' ').charAt(0).toUpperCase() + check.type.replace('_', ' ').slice(1)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {check.lastRun ? `Last run: ${check.lastRun}` : 'Not run yet'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  check.status === 'completed' ? 'bg-green-100 text-green-700' :
                  check.status === 'running' ? 'bg-blue-100 text-blue-700' :
                  check.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                </span>
                {check.status !== 'running' && (
                  <button
                    onClick={() => runAutomatedCheck(check.id)}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-all"
                  >
                    <RefreshCw className="w-3 h-3 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Notes</h3>
              <button
                onClick={() => setShowNotesModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Enter notes..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowNotesModal(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}