'use client'

import { useState, useMemo, Suspense } from 'react'
import { 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Navigation, 
  Wifi, 
  WifiOff, 
  ArrowLeft, 
  ArrowRight,
  Activity,
  Zap,
  ShieldCheck,
  Timer,
  ChevronRight,
  Signal,
  Radar
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function LiveJobViewContent() {
  const searchParams = useSearchParams()
  const jobIdParam = searchParams?.get('jobId')
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      title: 'Office Deep Cleaning - Downtown Tower',
      client: 'Downtown Business Tower',
      location: 'Dubai Marina, Dubai',
      coordinates: { lat: 25.0854, lng: 55.1399 },
      startTime: '09:00 AM',
      estimatedEndTime: '5:00 PM',
      actualStartTime: '09:15 AM',
      status: 'In Progress',
      progress: 65,
      teamLead: 'Ahmed Hassan',
      teamSize: 4,
      teamMembers: [
        { id: 1, name: 'Ahmed Hassan', role: 'Lead', status: 'On-site', gpsAccuracy: '5m' },
        { id: 2, name: 'Ali Ahmed', role: 'Technician', status: 'On-site', gpsAccuracy: '3m' },
        { id: 3, name: 'Zainab Rashid', role: 'Assistant', status: 'On-site', gpsAccuracy: '4m' },
        { id: 4, name: 'Mohammed Said', role: 'Support', status: 'On-site', gpsAccuracy: '6m' }
      ],
      assignedTasks: [
        { id: 1, name: 'Entrance & Reception', status: 'Completed', progress: 100 },
        { id: 2, name: 'Common Areas', status: 'In Progress', progress: 60 },
        { id: 3, name: 'Office Spaces', status: 'Pending', progress: 0 }
      ],
      onlineStatus: 'Online',
      lastUpdate: '2 minutes ago',
      checkedIn: true,
      checkInTime: '09:15 AM',
      checkInLocation: 'Main Entrance'
    },
    {
      id: 2,
      title: 'Medical Facility Sanitization',
      client: 'Emirates Medical Center',
      location: 'Al Baraha, Dubai',
      coordinates: { lat: 25.1972, lng: 55.2744 },
      startTime: '06:00 AM',
      estimatedEndTime: '6:00 PM',
      actualStartTime: '06:05 AM',
      status: 'In Progress',
      progress: 45,
      teamLead: 'Fatima Al Mansouri',
      teamSize: 6,
      teamMembers: [
        { id: 5, name: 'Fatima Al Mansouri', role: 'Lead', status: 'On-site', gpsAccuracy: '2m' },
        { id: 6, name: 'Dr. Karim', role: 'Supervisor', status: 'On-site', gpsAccuracy: '3m' },
        { id: 7, name: 'Nurse Amira', role: 'Technician', status: 'On-site', gpsAccuracy: '4m' }
      ],
      assignedTasks: [
        { id: 1, name: 'Biohazard Prep', status: 'Completed', progress: 100 },
        { id: 2, name: 'Isolation Ward', status: 'In Progress', progress: 50 },
        { id: 3, name: 'Common Areas', status: 'Pending', progress: 0 }
      ],
      onlineStatus: 'Online',
      lastUpdate: '1 minute ago',
      checkedIn: true,
      checkInTime: '06:05 AM',
      checkInLocation: 'Main Gate'
    }
  ])

  const [selectedJobId, setSelectedJobId] = useState<number | null>(1)
  const selectedJob = selectedJobId ? jobs.find(j => j.id === selectedJobId) : jobs[0]

  const stats = useMemo(() => ({
    activeJobs: jobs.filter(j => j.status === 'In Progress').length,
    completedJobs: jobs.filter(j => j.status === 'Completed').length,
    totalTeamMembers: jobs.reduce((sum, j) => sum + j.teamMembers.length, 0),
    averageProgress: Math.round(jobs.filter(j => j.status === 'In Progress').reduce((sum, j) => sum + j.progress, 0) / jobs.filter(j => j.status === 'In Progress').length)
  }), [jobs])

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/jobs" className="p-2 bg-slate-900/50 border border-white/5 rounded-xl hover:bg-slate-800 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Live Execution Hub</h1>
              <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Pulse</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">Real-time GPS tracking and team coordination</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl flex items-center gap-3">
            <Signal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-300">System Status: Optimal</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Operations', value: stats.activeJobs, icon: Activity, color: 'text-indigo-400' },
          { label: 'Avg. Progress', value: `${stats.averageProgress}%`, icon: Zap, color: 'text-amber-400' },
          { label: 'Personnel On-Site', value: stats.totalTeamMembers, icon: Users, color: 'text-emerald-400' },
          { label: 'Completed Today', value: stats.completedJobs, icon: CheckCircle2, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/5 rounded-lg">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Job Selection Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl w-fit overflow-x-auto no-scrollbar">
        {jobs.map(job => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              selectedJobId === job.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {job.title.split(' - ')[0]}
          </button>
        ))}
      </div>

      {selectedJob && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Real-time Monitoring */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedJob.client}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedJob.location}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full uppercase tracking-wider">
                    {selectedJob.status}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Wifi className="w-3 h-3 text-emerald-500" />
                    Last update: {selectedJob.lastUpdate}
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">Operational Progress</span>
                  <span className="text-sm font-bold text-indigo-400">{selectedJob.progress}%</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                  <div 
                    className="h-full bg-linear-to-r from-indigo-600 to-blue-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${selectedJob.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Time & GPS Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Time Metrics</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Started</span>
                      <span className="text-white font-bold">{selectedJob.actualStartTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Elapsed</span>
                      <span className="text-indigo-400 font-bold">2h 45m</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">GPS Verification</div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Navigation className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">On-Site Verified</div>
                      <div className="text-[10px] text-slate-500">{selectedJob.checkInLocation}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Signal Strength</div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Wifi className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">High Precision</div>
                      <div className="text-[10px] text-slate-500">±3m Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Breakdown */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-6">Task Execution Breakdown</h3>
              <div className="space-y-4">
                {selectedJob.assignedTasks.map((task: any) => (
                  <div key={task.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${
                          task.status === 'Completed' ? 'bg-emerald-500/10' : 
                          task.status === 'In Progress' ? 'bg-indigo-500/10' : 'bg-slate-800'
                        }`}>
                          {task.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : 
                           task.status === 'In Progress' ? <Activity className="w-3.5 h-3.5 text-indigo-400" /> : 
                           <Clock className="w-3.5 h-3.5 text-slate-500" />}
                        </div>
                        <span className="text-sm font-bold text-white">{task.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{task.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          task.status === 'Completed' ? 'bg-emerald-500' : 
                          task.status === 'In Progress' ? 'bg-indigo-500' : 'bg-slate-700'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Team Tracking */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Radar className="w-4 h-4 text-indigo-400" />
                  Team GPS Status
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full">All On-Site</span>
              </div>
              <div className="space-y-4">
                {selectedJob.teamMembers.map((member: any) => (
                  <div key={member.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{member.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">{member.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-emerald-400">{member.status}</div>
                        <div className="text-[10px] text-slate-500">±{member.gpsAccuracy}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-2xl text-sm font-bold transition-all border border-indigo-500/20 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Broadcast to Team
              </button>
            </div>

            {/* Live Feed */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                Execution Feed
              </h3>
              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                {[
                  { time: '11:45 AM', event: 'Task "Common Areas" reached 60%', type: 'update' },
                  { time: '11:30 AM', event: 'GPS Ping: All members within 10m', type: 'gps' },
                  { time: '11:15 AM', event: 'Task "Entrance" marked Completed', type: 'success' },
                ].map((item, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-3 top-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <div className="text-[10px] text-slate-500 mb-1">{item.time}</div>
                    <div className="text-xs text-slate-300">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LiveJobViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <LiveJobViewContent />
    </Suspense>
  )
}
