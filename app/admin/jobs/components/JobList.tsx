// /app/admin/jobs/components/JobList.tsx
'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  MoreVertical,
  ChevronRight,
  ArrowUpDown,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react'
import { Job, JobStatus, JobPriority } from '../lib/jobs-data'
import Link from 'next/link'

interface JobListProps {
  jobs: Job[]
  onUpdateStatus: (id: string, status: JobStatus) => void
  onDelete: (id: string) => void
}

const STATUS_COLORS: Record<JobStatus, string> = {
  'PENDING': 'bg-gray-100 text-gray-600',
  'SCHEDULED': 'bg-blue-100 text-blue-600',
  'IN_PROGRESS': 'bg-black text-white',
  'COMPLETED': 'bg-green-100 text-green-600',
  'CANCELLED': 'bg-red-100 text-red-600'
}

const PRIORITY_COLORS: Record<JobPriority, string> = {
  'LOW': 'bg-slate-50 text-slate-400',
  'MEDIUM': 'bg-blue-50 text-blue-500',
  'HIGH': 'bg-orange-50 text-orange-600',
  'CRITICAL': 'bg-red-50 text-red-600'
}

export default function JobList({ jobs, onUpdateStatus, onDelete }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'ALL'>('ALL')

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.jobId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-white border border-gray-200">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex bg-white border border-gray-200 p-1">
          {['ALL', 'PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map((stat) => (
            <button
              key={stat}
              onClick={() => setStatusFilter(stat as any)}
              className={`px-4 py-1.5 text-[10px] font-black tracking-[0.1em] transition-all uppercase ${
                statusFilter === stat 
                  ? 'bg-black text-white' 
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="SEARCH BY JOB ID, CLIENT OR TITLE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 text-xs font-bold focus:outline-none focus:border-black tracking-widest uppercase placeholder:text-gray-300"
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 bg-white hover:border-black transition-all">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Job Designation</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Budget/Actual</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Monitoring</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="group hover:bg-gray-50/80 transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-10 ${job.status === 'IN_PROGRESS' ? 'bg-blue-600 animate-pulse' : 'bg-gray-200'}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-blue-600 uppercase italic tracking-tighter">{job.jobId}</span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${PRIORITY_COLORS[job.priority]}`}>
                          {job.priority}
                        </span>
                      </div>
                      <Link href={`/admin/jobs/${job.id}`} className="text-sm font-black text-black block hover:underline underline-offset-4 decoration-2">
                        {job.title.toUpperCase()}
                      </Link>
                      <p className="text-[10px] font-bold text-gray-400 uppercase italic mt-0.5">{job.clientName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-[10px] font-black text-black uppercase">{job.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{job.startTime} - {job.endTime}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[job.status]}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-black">AED {job.budget.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                      ACTUAL: <span className={job.actualCost > job.budget ? 'text-red-500' : 'text-gray-500'}>AED {job.actualCost.toLocaleString()}</span>
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/admin/jobs/${job.id}`}
                      className="p-2 border border-black bg-black text-white hover:bg-gray-900 transition-all flex items-center gap-2 group/btn"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover/btn:block pl-1 animate-in slide-in-from-right-2">Manage</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredJobs.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Search className="h-12 w-12 text-gray-100 mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No operations found matching current filters</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Showing {filteredJobs.length} active deployment channels
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 border border-gray-200 text-[10px] font-black uppercase hover:bg-white transition-all">Prev</button>
          <button className="px-4 py-1.5 border border-black bg-black text-white text-[10px] font-black uppercase">1</button>
          <button className="px-4 py-1.5 border border-gray-200 text-[10px] font-black uppercase hover:bg-white transition-all">Next</button>
        </div>
      </div>
    </div>
  )
}
