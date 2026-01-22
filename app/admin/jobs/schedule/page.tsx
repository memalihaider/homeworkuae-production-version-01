'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Users, 
  Calendar as CalendarIcon, 
  Zap, 
  Lock,
  ArrowUpRight,
  Filter,
  Plus,
  Search,
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight as ChevronRightIcon
} from 'lucide-react'

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 18))
  const [draggedJob, setDraggedJob] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      title: 'Office Deep Cleaning',
      client: 'Downtown Tower',
      date: '2025-01-20',
      time: '08:00',
      duration: 8,
      team: ['Ahmed', 'Fatima'],
      teamCapacity: 4,
      status: 'Scheduled',
      priority: 'High',
      location: 'Downtown',
      budget: 5000
    },
    {
      id: 2,
      title: 'Medical Facility Sanitization',
      client: 'Emirates Medical',
      date: '2025-01-21',
      time: '09:00',
      duration: 12,
      team: [],
      teamCapacity: 6,
      status: 'Pending',
      priority: 'Critical',
      location: 'Al Baraha',
      budget: 8500
    },
    {
      id: 3,
      title: 'Carpet Cleaning',
      client: 'Hotel Al Manara',
      date: '2025-01-18',
      time: '10:00',
      duration: 6,
      team: ['Ali', 'Zainab'],
      teamCapacity: 3,
      status: 'In Progress',
      priority: 'Medium',
      location: 'Al Manara',
      budget: 3500
    },
    {
      id: 4,
      title: 'Emergency Spill Cleanup',
      client: 'Tech Hub',
      date: '2025-01-18',
      time: '14:00',
      duration: 2,
      team: ['Karim'],
      teamCapacity: 2,
      status: 'Scheduled',
      priority: 'Critical',
      location: 'TECOM',
      budget: 1500
    }
  ])

  const [resources] = useState<any[]>([
    { id: 1, name: 'Ahmed Hassan', skills: ['Floor Cleaning', 'Safety'], availability: ['2025-01-20', '2025-01-21'], capacity: 8 },
    { id: 2, name: 'Fatima Al-Mazrouei', skills: ['Floor Cleaning', 'Window Cleaning'], availability: ['2025-01-20'], capacity: 8 },
    { id: 3, name: 'Ali Hassan', skills: ['Carpet Cleaning', 'Stain Removal'], availability: ['2025-01-18', '2025-01-19'], capacity: 8 },
    { id: 4, name: 'Zainab', skills: ['Carpet Cleaning'], availability: ['2025-01-18'], capacity: 8 },
    { id: 5, name: 'Karim', skills: ['Emergency Response'], availability: ['2025-01-18'], capacity: 8 }
  ])

  const detectConflicts = useCallback((job: any) => {
    const conflicts: any[] = []
    jobs.forEach(other => {
      if (job.id === other.id || other.date !== job.date) return
      const jobStart = parseInt(job.time)
      const jobEnd = jobStart + job.duration
      const otherStart = parseInt(other.time)
      const otherEnd = otherStart + other.duration
      if (jobStart < otherEnd && jobEnd > otherStart) {
        const sharedTeam = job.team.filter((t: string) => other.team.includes(t))
        if (sharedTeam.length > 0) {
          conflicts.push({
            type: 'Team Conflict',
            message: `Team member(s) already assigned: ${sharedTeam.join(', ')}`,
            severity: 'high'
          })
        }
      }
    })
    return conflicts
  }, [jobs])

  const checkCapacity = useCallback((date: string) => {
    const jobsOnDate = jobs.filter(j => j.date === date)
    const totalLoad = jobsOnDate.reduce((sum: number, j: any) => sum + j.duration, 0)
    const totalCapacity = resources.length * 8
    return { load: totalLoad, capacity: totalCapacity, available: totalCapacity - totalLoad }
  }, [jobs, resources])

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handleDragStart = (job: any) => setDraggedJob(job)
  const handleDrop = (date: string) => {
    if (!draggedJob) return
    const updatedJobs = jobs.map(j => j.id === draggedJob.id ? { ...j, date } : j)
    const conflicts = detectConflicts({ ...draggedJob, date })
    if (conflicts.length > 0) alert(`Warning: ${conflicts.map(c => c.message).join('\n')}`)
    setJobs(updatedJobs)
    setDraggedJob(null)
  }

  const monthDays = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const calendarDays = Array.from({ length: monthDays }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Operational Scheduler
            </h1>
          </div>
          <p className="text-slate-400">Drag-and-drop scheduling with AI conflict detection</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-900/50 border border-white/5 rounded-xl">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-bold text-white min-w-[140px] text-center">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-900/20">
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Calendar Grid */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-4 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[120px] rounded-2xl bg-white/[0.02] border border-transparent" />
              ))}

              {calendarDays.map(day => {
                const dateStr = `2025-01-${String(day).padStart(2, '0')}`
                const dayJobs = jobs.filter(j => j.date === dateStr)
                const capacity = checkCapacity(dateStr)
                const isToday = day === 18 && currentDate.getMonth() === 0

                return (
                  <div
                    key={day}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(dateStr)}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`min-h-[120px] p-3 border rounded-2xl transition-all cursor-pointer group relative ${
                      selectedDate === dateStr
                        ? 'bg-indigo-500/10 border-indigo-500/50'
                        : isToday 
                        ? 'bg-white/5 border-indigo-500/30'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>{day}</span>
                      <div className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                        {capacity.available}h free
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      {dayJobs.map(job => (
                        <div
                          key={job.id}
                          draggable
                          onDragStart={() => handleDragStart(job)}
                          className={`text-[10px] p-1.5 rounded-lg border-l-2 cursor-move transition-all hover:scale-[1.02] ${
                            job.priority === 'Critical' ? 'bg-rose-500/10 border-rose-500 text-rose-400' :
                            job.priority === 'High' ? 'bg-orange-500/10 border-orange-500 text-orange-400' :
                            'bg-blue-500/10 border-blue-500 text-blue-400'
                          }`}
                        >
                          <div className="font-bold truncate">{job.title}</div>
                          <div className="opacity-60 flex items-center gap-1">
                            <Clock className="w-2 h-2" />
                            {job.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Insights Bar */}
          <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-400 mb-1">Scheduling Optimization</h4>
              <p className="text-xs text-indigo-400/70 leading-relaxed">
                Moving "Medical Facility Sanitization" to Jan 22nd would free up 12 hours of high-priority capacity and reduce team travel overlap by 40%.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar: Resources & Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Capacity Overview */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              Resource Load
            </h3>
            <div className="space-y-4">
              {resources.map(res => (
                <div key={res.id} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{res.name}</span>
                    <span className="text-slate-500">8h capacity</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-3/4 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend & Filters */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <h3 className="font-bold text-white mb-4">Priority Legend</h3>
            <div className="space-y-3">
              {[
                { label: 'Critical', color: 'bg-rose-500' },
                { label: 'High Priority', color: 'bg-orange-500' },
                { label: 'Standard', color: 'bg-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6">
            <h3 className="font-bold text-indigo-400 mb-4 text-sm">Operational Health</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xs text-slate-300">No critical conflicts detected for the next 48 hours.</div>
            </div>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20">
              Auto-Optimize Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
