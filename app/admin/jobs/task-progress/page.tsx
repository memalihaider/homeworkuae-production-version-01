'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, Clock, AlertCircle, MessageSquare, Send, TrendingUp } from 'lucide-react'

export default function TaskProgress() {
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      title: 'Office Deep Cleaning - Downtown Tower',
      tasks: [
        {
          id: 1,
          name: 'Entrance & Reception',
          description: 'Clean entrance, vacuum carpets, polish surfaces',
          status: 'Completed',
          progress: 100,
          startTime: '09:15 AM',
          completionTime: '10:45 AM',
          duration: '1h 30m',
          assignedTo: 'Ahmed Hassan',
          notes: 'All completed as per schedule',
          updates: [
            { time: '09:15 AM', message: 'Task started', type: 'started' },
            { time: '10:30 AM', message: 'Supervisor approved quality', type: 'update' },
            { time: '10:45 AM', message: 'Task completed', type: 'completed' }
          ]
        },
        {
          id: 2,
          name: 'Common Areas',
          description: 'Hallways, stairwells, bathrooms, break rooms',
          status: 'In Progress',
          progress: 60,
          startTime: '10:50 AM',
          completionTime: null,
          duration: null,
          assignedTo: 'Ali Ahmed, Zainab Rashid',
          notes: 'On track, hallways 100% done, bathrooms 40% done',
          updates: [
            { time: '10:50 AM', message: 'Task started', type: 'started' },
            { time: '11:30 AM', message: 'Hallways completed', type: 'milestone' },
            { time: '11:45 AM', message: 'Bathrooms in progress', type: 'update' }
          ]
        },
        {
          id: 3,
          name: 'Office Spaces',
          description: 'Individual offices, meeting rooms, conference areas',
          status: 'Pending',
          progress: 0,
          startTime: null,
          completionTime: null,
          duration: null,
          assignedTo: 'Mohammed Said, Support Team',
          notes: 'Pending common areas completion',
          updates: []
        }
      ]
    }
  ])

  const [selectedJobId, setSelectedJobId] = useState(1)
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)
  const [supervisorMessage, setSupervisorMessage] = useState('')

  const selectedJob = jobs.find(j => j.id === selectedJobId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'completed':
        return 'border-l-green-600 bg-green-50 dark:bg-green-950/20'
      case 'milestone':
        return 'border-l-blue-600 bg-blue-50 dark:bg-blue-950/20'
      case 'started':
        return 'border-l-purple-600 bg-purple-50 dark:bg-purple-950/20'
      case 'update':
        return 'border-l-gray-600 bg-gray-50 dark:bg-gray-950/20'
      default:
        return 'border-l-gray-600'
    }
  }

  const stats = useMemo(() => {
    if (!selectedJob) return { total: 0, completed: 0, inProgress: 0, pending: 0, avgProgress: 0 }
    return {
      total: selectedJob.tasks.length,
      completed: selectedJob.tasks.filter((t: any) => t.status === 'Completed').length,
      inProgress: selectedJob.tasks.filter((t: any) => t.status === 'In Progress').length,
      pending: selectedJob.tasks.filter((t: any) => t.status === 'Pending').length,
      avgProgress: Math.round(selectedJob.tasks.reduce((sum: number, t: any) => sum + t.progress, 0) / selectedJob.tasks.length)
    }
  }, [selectedJob])

  const addSupervisorUpdate = (taskId: number) => {
    if (!supervisorMessage.trim()) return

    setJobs(jobs.map(job => {
      if (job.id === selectedJobId) {
        return {
          ...job,
          tasks: job.tasks.map((task: any) => {
            if (task.id === taskId) {
              const now = new Date()
              const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
              return {
                ...task,
                updates: [
                  ...task.updates,
                  { time: timeStr, message: supervisorMessage, type: 'supervisor' }
                ]
              }
            }
            return task
          })
        }
      }
      return job
    }))
    setSupervisorMessage('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Live Task Progress</h1>
        <p className="text-muted-foreground">Real-time task tracking with supervisor updates</p>
      </div>

      {/* Stats Cards */}
      {selectedJob && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-card border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-card border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-card border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-card border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-card border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Avg. Progress</p>
            <p className="text-2xl font-bold">{stats.avgProgress}%</p>
          </div>
        </div>
      )}

      {/* Job Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {jobs.map(job => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedJobId === job.id
                ? 'bg-pink-600 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {job.title.split(' - ')[0]}
          </button>
        ))}
      </div>

      {selectedJob && (
        <div className="space-y-3">
          {selectedJob.tasks.map((task: any) => (
            <div key={task.id} className="bg-card border rounded-lg overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                      {task.status === 'Completed' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      {task.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">Progress</span>
                    <span className="text-xs font-bold text-pink-600">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        task.status === 'Completed'
                          ? 'bg-green-600'
                          : task.status === 'In Progress'
                          ? 'bg-blue-600'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.startTime || 'Not started'}
                  </div>
                  <div>
                    Assigned: {task.assignedTo}
                  </div>
                  {task.duration && (
                    <div>
                      ⏱️ {task.duration}
                    </div>
                  )}
                </div>
              </div>

              {expandedTaskId === task.id && (
                <div className="border-t p-4 space-y-4">
                  {/* Task Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Start Time</p>
                      <p className="font-semibold">{task.startTime || 'Pending'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Duration</p>
                      <p className="font-semibold">{task.duration || 'In progress'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Assigned To</p>
                      <p className="font-semibold">{task.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Completion</p>
                      <p className="font-semibold">{task.completionTime || 'In progress'}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-sm font-semibold mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{task.notes}</p>
                  </div>

                  {/* Updates Timeline */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Live Updates
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {task.updates.map((update: any, idx: number) => (
                        <div key={idx} className={`border-l-4 pl-3 py-2 ${getUpdateColor(update.type)}`}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-foreground">{update.time}</span>
                            <span className="text-xs font-semibold text-muted-foreground">{update.type.toUpperCase()}</span>
                          </div>
                          <p className="text-xs text-foreground">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supervisor Message */}
                  {task.status !== 'Pending' && (
                    <div className="border-t pt-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={supervisorMessage}
                          onChange={(e) => setSupervisorMessage(e.target.value)}
                          placeholder="Add supervisor update..."
                          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <button
                          onClick={() => addSupervisorUpdate(task.id)}
                          disabled={!supervisorMessage.trim()}
                          className="px-3 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
