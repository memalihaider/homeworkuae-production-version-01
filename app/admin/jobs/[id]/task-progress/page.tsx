'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  CheckSquare,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Plus,
  Save,
  Users,
  Calendar,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority: 'high' | 'medium' | 'low'
  estimatedHours: number
  actualHours?: number
  location: string
  startTime?: string
  endTime?: string
  dependencies: string[]
  progress: number
  notes?: string
}

export default function TaskProgress() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  // Mock job data
  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    location: 'Downtown, Dubai'
  }

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Deep Clean Executive Floor',
      description: 'Complete deep cleaning of executive offices and boardroom',
      assignedTo: 'Fatima Al-Mazrouei',
      status: 'completed',
      priority: 'high',
      estimatedHours: 4,
      actualHours: 3.5,
      location: 'Floor 20',
      startTime: '08:00',
      endTime: '11:30',
      dependencies: [],
      progress: 100
    },
    {
      id: '2',
      title: 'Window Cleaning - North Side',
      description: 'Clean all windows on north-facing side of building',
      assignedTo: 'Mohammed Bin Ali',
      status: 'in_progress',
      priority: 'high',
      estimatedHours: 6,
      location: 'Floors 5-15',
      startTime: '09:00',
      dependencies: ['1'],
      progress: 65
    },
    {
      id: '3',
      title: 'Floor Maintenance - Common Areas',
      description: 'Clean and maintain floors in lobbies and corridors',
      assignedTo: 'Ahmed Hassan',
      status: 'pending',
      priority: 'medium',
      estimatedHours: 3,
      location: 'Ground Floor',
      dependencies: ['2'],
      progress: 0
    },
    {
      id: '4',
      title: 'Safety Equipment Check',
      description: 'Inspect and verify all safety equipment functionality',
      assignedTo: 'Sara Al-Rashid',
      status: 'completed',
      priority: 'high',
      estimatedHours: 1,
      actualHours: 0.8,
      location: 'All Floors',
      startTime: '08:00',
      endTime: '08:48',
      dependencies: [],
      progress: 100
    },
    {
      id: '5',
      title: 'Client Feedback Collection',
      description: 'Gather feedback from building management',
      assignedTo: 'Ahmed Hassan',
      status: 'pending',
      priority: 'low',
      estimatedHours: 0.5,
      location: 'Management Office',
      dependencies: ['1', '2', '3'],
      progress: 0
    }
  ])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  const handleStatusChange = useCallback((taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus }

        if (newStatus === 'in_progress' && !task.startTime) {
          updatedTask.startTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (newStatus === 'completed' && !task.endTime) {
          updatedTask.endTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          updatedTask.actualHours = task.estimatedHours // Simplified
          updatedTask.progress = 100
        }

        return updatedTask
      }
      return task
    }))
  }, [])

  const handleProgressUpdate = useCallback((taskId: string, progress: number) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, progress } : task
    ))
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'blocked':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const totalTasks = tasks.length
  const overallProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks

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
            <h1 className="text-2xl font-bold text-gray-900">Task Progress</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{completedTasks}/{totalTasks} Completed</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm font-bold text-gray-900">{inProgressTasks} In Progress</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-gray-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedTasks}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <PlayCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-600">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{inProgressTasks}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-bold text-gray-600">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'pending').length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold text-gray-600">Blocked</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'blocked').length}</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Task Details</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div key={task.id} className="p-6 hover:bg-gray-50 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{task.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {task.assignedTo}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {task.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {task.estimatedHours}h estimated
                      </div>
                      {task.actualHours && (
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4" />
                          {task.actualHours}h actual
                        </div>
                      )}
                    </div>

                    {task.dependencies.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Dependencies</div>
                        <div className="flex flex-wrap gap-1">
                          {task.dependencies.map((dep, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-bold text-gray-900">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {task.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-sm font-bold text-gray-700 mb-1">Notes:</div>
                        <div className="text-sm text-gray-600">{task.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleProgressUpdate(task.id, Math.min(task.progress + 25, 100))}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-bold hover:bg-green-200 transition-all"
                  >
                    +25%
                  </button>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button
                      onClick={() => handleStatusChange(task.id, 'pending')}
                      className={`px-3 py-2 text-sm font-bold transition-all ${
                        task.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(task.id, 'in_progress')}
                      className={`px-3 py-2 text-sm font-bold transition-all ${
                        task.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      className={`px-3 py-2 text-sm font-bold transition-all ${
                        task.status === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}