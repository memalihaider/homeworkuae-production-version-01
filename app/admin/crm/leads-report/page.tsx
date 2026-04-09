'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, TrendingUp, Users, Briefcase } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type DateLike = Date | string | { seconds: number } | { toDate: () => Date } | null | undefined

type LeadRecord = {
  id: string
  name?: string
  company?: string
  createdAt?: DateLike
}

type JobRecord = {
  id: string
  clientId?: string
  client?: string
  createdAt?: DateLike
  scheduledDate?: string
  
}

type Period = 'daily' | 'weekly' | 'monthly'

const toDate = (value: DateLike): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (typeof value === 'object' && value !== null) {
    if ('toDate' in value && typeof value.toDate === 'function') {
      return value.toDate()
    }
    if ('seconds' in value && typeof value.seconds === 'number') {
      return new Date(value.seconds * 1000)
    }
  }
  return null
}

const startOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const startOfWeek = (date: Date) => {
  const d = startOfDay(date)
  const day = d.getDay() || 7
  d.setDate(d.getDate() - (day - 1))
  return d
}

const startOfMonth = (date: Date) => {
  const d = startOfDay(date)
  d.setDate(1)
  return d
}

const inPeriod = (date: Date | null, period: Period) => {
  if (!date) return false
  const now = new Date()
  const d = startOfDay(date)
  const n = startOfDay(now)

  if (period === 'daily') {
    return d.getTime() === n.getTime()
  }

  if (period === 'weekly') {
    return d >= startOfWeek(now)
  }

  return d >= startOfMonth(now)
}

const formatDate = (date: Date | null) => {
  if (!date) return 'N/A'
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function CRMLeadsReportPage() {
  const [period, setPeriod] = useState<Period>('daily')
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [jobs, setJobs] = useState<JobRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [leadsSnap, jobsSnap] = await Promise.all([
          getDocs(collection(db, 'leads')),
          getDocs(collection(db, 'jobs')),
        ])

        const leadRows = leadsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<LeadRecord, 'id'>),
        }))

        const jobRows = jobsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<JobRecord, 'id'>),
        }))

        setLeads(leadRows)
        setJobs(jobRows)
      } catch (error) {
        console.error('Failed to load CRM leads report data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const mappedLeads = useMemo(() => {
    return leads.map((lead) => {
      const leadCreatedAt = toDate(lead.createdAt)
      const relatedJobs = jobs
        .filter((job) => job.clientId === lead.id || (job.client || '').trim() === (lead.name || '').trim())
        .map((job) => {
          const bookingDate = toDate(job.createdAt) || toDate(job.scheduledDate)
          return { ...job, bookingDate }
        })
        .sort((a, b) => {
          const aa = a.bookingDate?.getTime() || 0
          const bb = b.bookingDate?.getTime() || 0
          return aa - bb
        })

      const firstBookingDate = relatedJobs[0]?.bookingDate || null
      const converted = Boolean(firstBookingDate)

      return {
        ...lead,
        leadCreatedAt,
        firstBookingDate,
        converted,
      }
    })
  }, [leads, jobs])

  const periodLeads = useMemo(
    () => mappedLeads.filter((lead) => inPeriod(lead.leadCreatedAt, period)),
    [mappedLeads, period],
  )

  const periodBookings = useMemo(
    () => mappedLeads.filter((lead) => inPeriod(lead.firstBookingDate, period)),
    [mappedLeads, period],
  )

  const stats = useMemo(() => {
    const createdLeads = periodLeads.length
    const convertedLeads = periodLeads.filter((lead) => lead.converted).length
    const bookings = periodBookings.length
    const conversionRate = createdLeads > 0 ? (convertedLeads / createdLeads) * 100 : 0

    return {
      createdLeads,
      convertedLeads,
      bookings,
      conversionRate,
    }
  }, [periodLeads, periodBookings])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-black">CRM Leads Report</h1>
          <p className="text-sm text-gray-500">Daily/Weekly/Monthly conversion tracking using lead creation and job booking dates.</p>
        </div>
        <div className="flex items-center gap-2">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest border ${
                period === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-[10px] uppercase font-bold text-gray-400">Leads Created</p>
          <p className="text-2xl font-black text-black">{stats.createdLeads}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-[10px] uppercase font-bold text-gray-400">Converted</p>
          <p className="text-2xl font-black text-emerald-600">{stats.convertedLeads}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-[10px] uppercase font-bold text-gray-400">Job Bookings</p>
          <p className="text-2xl font-black text-blue-600">{stats.bookings}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-[10px] uppercase font-bold text-gray-400">Conversion Rate</p>
          <p className="text-2xl font-black text-purple-600">{stats.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-4 w-4 text-gray-600" />
          <p className="text-sm font-black text-gray-800">Lead vs Booking Dates</p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading report...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-[10px] uppercase text-gray-500">Lead</th>
                  <th className="py-2 text-[10px] uppercase text-gray-500">Company</th>
                  <th className="py-2 text-[10px] uppercase text-gray-500">Lead Created Date</th>
                  <th className="py-2 text-[10px] uppercase text-gray-500">Job Booking Date</th>
                  <th className="py-2 text-[10px] uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {mappedLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100">
                    <td className="py-2 text-sm font-semibold text-black">{lead.name || 'N/A'}</td>
                    <td className="py-2 text-sm text-gray-600">{lead.company || 'N/A'}</td>
                    <td className="py-2 text-sm text-gray-700">{formatDate(lead.leadCreatedAt)}</td>
                    <td className="py-2 text-sm text-gray-700">{formatDate(lead.firstBookingDate)}</td>
                    <td className="py-2">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          lead.converted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {lead.converted ? 'Converted' : 'In Pipeline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-black" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Lead Base</p>
            <p className="text-sm font-black text-black">{leads.length} total leads</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Jobs</p>
            <p className="text-sm font-black text-black">{jobs.length} total jobs</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Current {period}</p>
            <p className="text-sm font-black text-black">{stats.conversionRate.toFixed(1)}% conversion</p>
          </div>
        </div>
      </div>
    </div>
  )
}
