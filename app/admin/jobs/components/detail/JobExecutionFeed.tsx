// /app/admin/jobs/components/detail/JobExecutionFeed.tsx
'use client'

import React from 'react'
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Info,
  User,
  Zap,
  Play
} from 'lucide-react'
import { Job, JobActivity } from '../../lib/jobs-data'

interface JobExecutionFeedProps {
  job: Job
}

const TYPE_STYLES = {
  'SUCCESS': { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500' },
  'INFO': { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500' },
  'WARNING': { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500' },
  'ALERT': { icon: Zap, color: 'text-red-500', bg: 'bg-red-500' }
}

export default function JobExecutionFeed({ job }: JobExecutionFeedProps) {
  return (
    <div className="bg-white border border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Live Telemetry Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-gray-400 uppercase">Syncing</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {job.activities.length > 0 ? (
          job.activities.map((activity, i) => {
            const Style = TYPE_STYLES[activity.type]
            return (
              <div key={activity.id} className="relative pl-8">
                {/* Timeline Line */}
                {i !== job.activities.length - 1 && (
                  <div className="absolute left-[7px] top-4 w-[1px] h-full bg-gray-100" />
                )}
                
                {/* Node */}
                <div className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-none border-2 border-white ${Style.bg} shadow-sm z-10`} />

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-black uppercase tracking-tight">{activity.action}</p>
                    <span className="text-[8px] font-bold text-gray-400 uppercase">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tighter">{activity.details}</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <User className="h-2.5 w-2.5 text-gray-300" />
                    <span className="text-[8px] font-black text-gray-400 uppercase">{activity.user}</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <Play className="h-8 w-8 text-gray-100 mb-4" />
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-relaxed">Awating operational start<br/>for telemetry data</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="ADD COMMAND OR NOTE..." 
            className="flex-1 bg-white border border-gray-200 px-3 py-2 text-[10px] uppercase font-bold focus:outline-none focus:border-black"
          />
          <button className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all">Send</button>
        </div>
      </div>
    </div>
  )
}
