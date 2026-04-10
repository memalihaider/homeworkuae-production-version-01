'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, Timestamp, updateDoc } from 'firebase/firestore'
import { addDays, format } from 'date-fns'
import { AlertTriangle, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import SearchSuggestSelect from '@/components/ui/search-suggest-select'

type JobStatus = 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Expired'

interface CalendarJob {
  id: string
  title: string
  status: JobStatus
  client?: string
  location?: string
  priority?: 'Low' | 'Medium' | 'High' | 'Critical'
  riskLevel?: 'Low' | 'Medium' | 'High'
  description?: string
  teamRequired?: number
  budget?: number
  scheduledDate: string
  scheduledEndDate?: string
  scheduledTime?: string
  endTime?: string
  estimatedDuration?: string
  estimatedDurationMinutes?: number
  createdAt?: string
  assignedEmployees?: Array<{ id: string; name: string; email: string }>
  jobCreatedBy?: string
}

interface CalendarMember {
  id: string
  name: string
  email?: string
  source: 'employee' | 'admin'
  assignmentId: string
  linkIds: string[]
  availabilityKeys: string[]
}

interface CalendarCreateForm {
  title: string
  clientId: string
  client: string
  location: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  riskLevel: 'Low' | 'Medium' | 'High'
  description: string
  teamRequired: number
  budget: number
  estimatedDuration: string
  slaDeadline: string
  requiredSkills: string
  tags: string
  specialInstructions: string
  recurring: boolean
  scheduledDate: string
  scheduledEndDate: string
  scheduledTime: string
  endTime: string
  createdById: string
  responsibleById: string
  teamMemberIds: string[]
  quotationRequired: boolean
  quotationStatus: 'Not Required' | 'Pending' | 'Approved' | 'Rejected'
  surveyRequired: boolean
  surveyStatus: 'Not Required' | 'Pending' | 'Completed'
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Collect After Job'
  paymentMethod: 'Payment Link' | 'Bank Transfer' | 'Cash' | 'Card' | 'N/A'
  paymentReference: string
  paymentLinkGeneratedBy: string
}

type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

type WeeklyAvailability = Record<DayKey, Array<{ start: string; end: string }>>

interface ClientOption {
  id: string
  name: string
  company: string
  email: string
  phone: string
  type: 'client' | 'lead'
  status?: string
}

const STATUS_COLOR: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  Scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-300',
  Completed: 'bg-green-100 text-green-800 border-green-300',
  Cancelled: 'bg-red-100 text-red-800 border-red-300',
  Expired: 'bg-gray-100 text-gray-800 border-gray-300'
}

const STATUS_DOT_COLOR: Record<string, string> = {
  Pending: 'text-amber-600',
  Scheduled: 'text-blue-600',
  'In Progress': 'text-purple-600',
  Completed: 'text-green-600',
  Cancelled: 'text-red-600',
  Expired: 'text-gray-600'
}

const DAY_START_HOUR = 6
const DAY_END_HOUR = 23
const SLOT_MINUTES = 30

const pad2 = (n: number) => String(n).padStart(2, '0')

const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

const normalizeDateOnly = (value: unknown): string => {
  if (!value) return ''

  if (typeof value === 'object' && value !== null) {
    const maybeTimestamp = value as { toDate?: () => Date; seconds?: number }
    if (typeof maybeTimestamp.toDate === 'function') {
      const d = maybeTimestamp.toDate()
      return Number.isNaN(d.getTime()) ? '' : toIsoDate(d)
    }
    if (typeof maybeTimestamp.seconds === 'number') {
      const d = new Date(maybeTimestamp.seconds * 1000)
      return Number.isNaN(d.getTime()) ? '' : toIsoDate(d)
    }
  }

  const raw = String(value).trim()
  if (!raw) return ''

  const isoLike = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoLike) return `${isoLike[1]}-${isoLike[2]}-${isoLike[3]}`

  const slashLike = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashLike) {
    const first = Number(slashLike[1])
    const second = Number(slashLike[2])
    const year = Number(slashLike[3])
    const day = first > 12 ? first : second
    const month = first > 12 ? second : first
    return `${year}-${pad2(month)}-${pad2(day)}`
  }

  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? '' : toIsoDate(parsed)
}

const addDaysToIso = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

const parseTimeToMinutes = (value?: string) => {
  if (!value || !value.includes(':')) return null
  const [hRaw, mRaw] = value.split(':')
  const h = Number(hRaw)
  const m = Number(mRaw)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return h * 60 + m
}

const minutesToTimeString = (totalMinutes: number) => {
  const safe = Math.max(0, totalMinutes)
  const h = Math.floor(safe / 60) % 24
  const m = safe % 60
  return `${pad2(h)}:${pad2(m)}`
}

const isDateInRange = (date: string, start: string, end?: string) => {
  const rangeEnd = end || start
  return date >= start && date <= rangeEnd
}

const doesJobCoverSlot = (job: CalendarJob, dateIso: string, slotMinutes: number) => {
  const startDate = normalizeDateOnly(job.scheduledDate)
  const endDate = normalizeDateOnly(job.scheduledEndDate) || startDate
  if (!startDate) return false
  if (dateIso < startDate || dateIso > endDate) return false

  const startMinutes = parseTimeToMinutes(job.scheduledTime) ?? DAY_START_HOUR * 60
  const rawEndMinutes = parseTimeToMinutes(job.endTime)
  const estimatedMinutes = Number(job.estimatedDurationMinutes || parseEstimatedDurationMinutes(job.estimatedDuration) || 0)
  const sameDayEndMinutes = rawEndMinutes != null && rawEndMinutes > startMinutes
    ? rawEndMinutes
    : (estimatedMinutes > 0 ? startMinutes + estimatedMinutes : startMinutes + SLOT_MINUTES)

  if (startDate === endDate) {
    return slotMinutes >= startMinutes && slotMinutes < sameDayEndMinutes
  }

  if (dateIso === startDate) {
    return slotMinutes >= startMinutes
  }

  if (dateIso === endDate) {
    return slotMinutes < (rawEndMinutes ?? (DAY_END_HOUR + 1) * 60)
  }

  return true
}

const isJobStartSlot = (job: CalendarJob, slotMinutes: number) => {
  const start = parseTimeToMinutes(job.scheduledTime) ?? slotMinutes
  return slotMinutes === start
}

const getJobWindow = (job: CalendarJob) => {
  const start = parseTimeToMinutes(job.scheduledTime) ?? DAY_START_HOUR * 60
  const rawEnd = parseTimeToMinutes(job.endTime)
  const estimatedMinutes = Number(job.estimatedDurationMinutes || parseEstimatedDurationMinutes(job.estimatedDuration) || 0)
  const end = rawEnd != null && rawEnd > start ? rawEnd : (estimatedMinutes > 0 ? start + estimatedMinutes : start + SLOT_MINUTES)
  return { start, end }
}

const isOverlapping = (a: CalendarJob, b: CalendarJob) => {
  const aw = getJobWindow(a)
  const bw = getJobWindow(b)
  return aw.start < bw.end && bw.start < aw.end
}

const parseEstimatedDurationMinutes = (value?: string): number | null => {
  if (!value) return null
  const raw = value.trim().toLowerCase()
  if (!raw) return null

  const hoursMatch = raw.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)/)
  const minutesMatch = raw.match(/(\d+(?:\.\d+)?)\s*(m|min|mins|minute|minutes)/)

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0
  const total = Math.round(hours * 60 + minutes)
  if (total > 0) return total

  const hhmm = raw.match(/^(\d{1,2}):(\d{2})$/)
  if (hhmm) {
    const h = Number(hhmm[1])
    const m = Number(hhmm[2])
    return h * 60 + m
  }

  const plain = Number(raw)
  if (Number.isFinite(plain) && plain > 0) return Math.round(plain * 60)

  return null
}

const WEEKDAY_KEYS: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export default function UniversalCalendarPage() {
  const [jobs, setJobs] = useState<CalendarJob[]>([])
  const [members, setMembers] = useState<CalendarMember[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [sourceFilter, setSourceFilter] = useState<'all' | 'admin' | 'employee'>('all')
  const [staffFilter, setStaffFilter] = useState<string>('all')
  const [activeJobMenuKey, setActiveJobMenuKey] = useState<string | null>(null)
  const [isDateAnimating, setIsDateAnimating] = useState(false)
  const [navDirection, setNavDirection] = useState<-1 | 1>(1)
  const [userAvailability, setUserAvailability] = useState<Record<string, WeeklyAvailability>>({})
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<CalendarJob | null>(null)
  const [savingCreateJob, setSavingCreateJob] = useState(false)
  const [serviceCategories, setServiceCategories] = useState<string[]>([])
  const [clients, setClients] = useState<ClientOption[]>([])
  const [teamMemberToAdd, setTeamMemberToAdd] = useState('')
  const dateAnimationTimerRef = useRef<number | null>(null)
  const [createForm, setCreateForm] = useState<CalendarCreateForm>({
    title: '',
    clientId: '',
    client: '',
    location: '',
    priority: 'Medium',
    riskLevel: 'Low',
    description: '',
    teamRequired: 1,
    budget: 0,
    estimatedDuration: '',
    slaDeadline: '',
    requiredSkills: '',
    tags: '',
    specialInstructions: '',
    recurring: false,
    scheduledDate: toIsoDate(new Date()),
    scheduledEndDate: toIsoDate(new Date()),
    scheduledTime: '09:00',
    endTime: '10:00',
    createdById: '',
    responsibleById: '',
    teamMemberIds: [],
    quotationRequired: false,
    quotationStatus: 'Not Required',
    surveyRequired: false,
    surveyStatus: 'Not Required',
    paymentStatus: 'Pending',
    paymentMethod: 'N/A',
    paymentReference: '',
    paymentLinkGeneratedBy: ''
  })

  useEffect(() => {
    const jobsQuery = query(collection(db, 'jobs'))

    const unsubscribe = onSnapshot(jobsQuery, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const raw = d.data() as Record<string, unknown>
        return {
          id: d.id,
          title: String(raw.title || 'Untitled Job'),
          status: String(raw.status || 'Pending') as JobStatus,
          client: String(raw.client || ''),
          location: String(raw.location || ''),
          priority: String(raw.priority || 'Medium') as CalendarJob['priority'],
          riskLevel: String(raw.riskLevel || 'Low') as CalendarJob['riskLevel'],
          description: String(raw.description || ''),
          teamRequired: Number(raw.teamRequired || 0),
          budget: Number(raw.budget || 0),
          scheduledDate: normalizeDateOnly(raw.scheduledDate),
          scheduledEndDate: normalizeDateOnly(raw.scheduledEndDate),
          scheduledTime: String(raw.scheduledTime || ''),
          endTime: String(raw.endTime || ''),
          estimatedDuration: String(raw.estimatedDuration || ''),
          estimatedDurationMinutes: Number(raw.estimatedDurationMinutes || 0),
          createdAt: String(raw.createdAt || ''),
          assignedEmployees: Array.isArray(raw.assignedEmployees)
            ? (raw.assignedEmployees as Array<{ id: string; name: string; email: string }>)
            : [],
          jobCreatedBy: String(raw.jobCreatedBy || '')
        } as CalendarJob
      })

      setJobs(data)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const servicesQuery = query(collection(db, 'services'))
    const unsubscribe = onSnapshot(servicesQuery, (snapshot) => {
      const categorySet = new Set<string>()
      snapshot.docs.forEach((docSnap) => {
        const raw = docSnap.data() as Record<string, unknown>
        const category = String(raw.categoryName || raw.name || '').trim()
        if (category) categorySet.add(category)
      })
      setServiceCategories(Array.from(categorySet).sort((a, b) => a.localeCompare(b)))
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const clientsQuery = query(collection(db, 'clients'))
    const leadsQuery = query(collection(db, 'leads'))

    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      const clientItems = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data() as Record<string, unknown>
        return {
          id: docSnap.id,
          name: String(raw.name || ''),
          company: String(raw.company || ''),
          email: String(raw.email || ''),
          phone: String(raw.phone || ''),
          type: 'client' as const,
          status: String(raw.status || 'Active')
        }
      })

      setClients((prev) => {
        const leadsOnly = prev.filter((item) => item.type === 'lead')
        return [...clientItems, ...leadsOnly].sort((a, b) => a.name.localeCompare(b.name))
      })
    })

    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const leadItems = snapshot.docs
        .map((docSnap) => {
          const raw = docSnap.data() as Record<string, unknown>
          return {
            id: docSnap.id,
            name: String(raw.name || ''),
            company: String(raw.company || ''),
            email: String(raw.email || ''),
            phone: String(raw.phone || ''),
            type: 'lead' as const,
            status: String(raw.status || '')
          }
        })
        .filter((lead) => {
          const status = lead.status.toLowerCase()
          return status === 'qualified' || status === 'won'
        })

      setClients((prev) => {
        const clientsOnly = prev.filter((item) => item.type === 'client')
        return [...clientsOnly, ...leadItems].sort((a, b) => a.name.localeCompare(b.name))
      })
    })

    return () => {
      unsubscribeClients()
      unsubscribeLeads()
    }
  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      const merged = new Map<string, CalendarMember>()

      const employeesSnapshot = await getDocs(collection(db, 'employees'))
      const employeeById = new Map<string, { id: string; name: string; email: string }>()
      const employeeByEmail = new Map<string, { id: string; name: string; email: string }>()

      employeesSnapshot.docs.forEach((d) => {
        const raw = d.data() as Record<string, unknown>
        const status = String(raw.status || '')
        if (status && status !== 'Active') return

        const name = String(raw.name || 'Employee')
        const email = String(raw.email || '')
        const id = d.id

        employeeById.set(id, { id, name, email })
        if (email) employeeByEmail.set(email.toLowerCase(), { id, name, email })

        const member: CalendarMember = {
          id,
          name,
          email,
          source: 'employee',
          assignmentId: id,
          linkIds: Array.from(new Set([id, email.toLowerCase(), name.toLowerCase()].filter(Boolean))),
          availabilityKeys: [`employee:${id}`]
        }
        merged.set(`member:${member.id}`, member)
      })

      const usersRoleSnapshot = await getDocs(collection(db, 'users-role'))
      usersRoleSnapshot.docs.forEach((d) => {
        const raw = d.data() as Record<string, unknown>
        const roleName = String(raw.roleName || '').toLowerCase()
        const portal = String(raw.portal || '').toLowerCase()
        if (portal && portal !== 'admin') return
        if (roleName !== 'admin') return

        const roleEmail = String(raw.email || '').toLowerCase()
        const roleEmployeeId = String(raw.employeeId || '')
        const employeeMatch = roleEmployeeId
          ? employeeById.get(roleEmployeeId)
          : (roleEmail ? employeeByEmail.get(roleEmail) : undefined)

        const assignmentId = employeeMatch?.id || roleEmployeeId || d.id
        const canonicalId = assignmentId
        const key = `member:${canonicalId}`

        const existing = merged.get(key)
        const mergedLinkIds = new Set<string>([
          ...(existing?.linkIds || []),
          canonicalId,
          d.id,
          roleEmployeeId,
          roleEmail,
          String(raw.name || '').toLowerCase()
        ].filter(Boolean))

        const mergedAvailabilityKeys = new Set<string>([
          ...(existing?.availabilityKeys || []),
          `employee:${assignmentId}`,
          `admin:${d.id}`
        ])

        const member: CalendarMember = {
          id: canonicalId,
          name: String(raw.name || employeeMatch?.name || raw.email || existing?.name || 'Admin'),
          email: String(raw.email || employeeMatch?.email || existing?.email || ''),
          source: 'admin',
          assignmentId,
          linkIds: Array.from(mergedLinkIds),
          availabilityKeys: Array.from(mergedAvailabilityKeys)
        }

        merged.set(key, member)
      })

      setMembers(Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name)))
    }

    fetchMembers().catch((err) => console.error('Failed to fetch calendar members:', err))
  }, [])

  useEffect(() => {
    const fetchAvailability = async () => {
      const availabilitySnapshot = await getDocs(collection(db, 'user-availability'))
      const nextMap: Record<string, WeeklyAvailability> = {}

      availabilitySnapshot.docs.forEach((availabilityDoc) => {
        const raw = availabilityDoc.data() as {
          userId?: string
          userType?: string
          weeklyAvailability?: WeeklyAvailability
        }
        if (!raw.userId || !raw.userType || !raw.weeklyAvailability) return
        nextMap[`${raw.userType}:${raw.userId}`] = raw.weeklyAvailability
      })

      setUserAvailability(nextMap)
    }

    fetchAvailability().catch((error) => console.error('Failed to fetch user availability:', error))
  }, [])

  const selectedIsoDate = useMemo(() => toIsoDate(selectedDate), [selectedDate])

  const memberOptions = useMemo(() => {
    return members.map((member) => ({
      value: member.id,
      label: `${member.name} (${member.source})`,
      keywords: [member.email || '', member.source, member.assignmentId]
    }))
  }, [members])

  const serviceCategoryOptions = useMemo(() => {
    return serviceCategories.map((category) => ({
      value: category,
      label: category,
      keywords: [category]
    }))
  }, [serviceCategories])

  const clientOptions = useMemo(() => {
    return clients.map((client) => ({
      value: client.id,
      label: `${client.name} - ${client.company} (${client.type === 'client' ? 'Client' : `${client.status || 'Lead'} Lead`})`,
      keywords: [client.name, client.company, client.email, client.phone, client.status || '', client.type]
    }))
  }, [clients])

  useEffect(() => {
    setCreateForm((prev) => ({
      ...prev,
      scheduledDate: selectedIsoDate,
      scheduledEndDate: prev.scheduledEndDate || selectedIsoDate
    }))
  }, [selectedIsoDate])

  useEffect(() => {
    return () => {
      if (dateAnimationTimerRef.current) {
        window.clearTimeout(dateAnimationTimerRef.current)
      }
    }
  }, [])

  const timeSlots = useMemo(() => {
    const slots: Array<{ label: string; minutes: number }> = []
    for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const minutes = h * 60 + m
        slots.push({ label: `${pad2(h)}:${pad2(m)}`, minutes })
      }
    }
    return slots
  }, [])

  const slotMinutesList = useMemo(() => timeSlots.map((slot) => slot.minutes), [timeSlots])

  const dayJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (!job.scheduledDate) return false
      return isDateInRange(selectedIsoDate, job.scheduledDate, job.scheduledEndDate)
    })
  }, [jobs, selectedIsoDate])

  const visibleMembers = useMemo(() => {
    let next = members
    if (sourceFilter !== 'all') {
      next = next.filter((member) => member.source === sourceFilter)
    }
    if (staffFilter !== 'all') {
      next = next.filter((member) => member.id === staffFilter)
    }
    return next
  }, [members, sourceFilter, staffFilter])

  const jobsCreatedToday = useMemo(() => {
    const today = new Date()
    return jobs.filter((job) => {
      if (!job.createdAt) return false
      const created = new Date(job.createdAt)
      return created.toDateString() === today.toDateString()
    }).length
  }, [jobs])

  const memberMatchesJob = (member: CalendarMember, job: CalendarJob) => {
    const assigned = job.assignedEmployees || []
    const memberId = String(member.id || '').toLowerCase()
    const memberAssignmentId = String(member.assignmentId || '').toLowerCase()
    const memberEmail = String(member.email || '').toLowerCase()
    const memberLinkIds = (member.linkIds || []).map((id) => String(id || '').toLowerCase())

    const assignedMatch = assigned.some((emp) => {
      const empId = String(emp.id || '').toLowerCase()
      const empEmail = String(emp.email || '').toLowerCase()

      const idMatched = !!empId && (empId === memberId || empId === memberAssignmentId || memberLinkIds.includes(empId))
      const emailMatched = !!empEmail && (empEmail === memberEmail || memberLinkIds.includes(empEmail))

      return idMatched || emailMatched
    })

    if (assignedMatch) return true

    if (assigned.length === 0 && job.jobCreatedBy) {
      const creator = String(job.jobCreatedBy).toLowerCase()
      return creator === memberId || creator === memberAssignmentId || memberLinkIds.includes(creator)
    }

    return false
  }

  const memberJobsMap = useMemo(() => {
    const map = new Map<string, CalendarJob[]>()

    visibleMembers.forEach((member) => {
      const assignedJobs = dayJobs.filter((job) => {
        return memberMatchesJob(member, job)
      })
      map.set(member.id, assignedJobs)
    })
    return map
  }, [dayJobs, visibleMembers])

  const jobsByMemberAndSlot = useMemo(() => {
    const map = new Map<string, CalendarJob[]>()

    visibleMembers.forEach((member) => {
      const memberJobs = memberJobsMap.get(member.id) || []

      timeSlots.forEach((slot) => {
        const key = `${member.id}-${slot.minutes}`
        const slotJobs = memberJobs.filter((job) => doesJobCoverSlot(job, selectedIsoDate, slot.minutes))
        if (slotJobs.length > 0) {
          map.set(key, slotJobs)
        }
      })
    })

    return map
  }, [memberJobsMap, selectedIsoDate, timeSlots, visibleMembers])

  const conflictJobIds = useMemo(() => {
    const conflicted = new Set<string>()

    visibleMembers.forEach((member) => {
      const jobsForMember = memberJobsMap.get(member.id) || []
      for (let i = 0; i < jobsForMember.length; i++) {
        for (let j = i + 1; j < jobsForMember.length; j++) {
          if (isOverlapping(jobsForMember[i], jobsForMember[j])) {
            conflicted.add(jobsForMember[i].id)
            conflicted.add(jobsForMember[j].id)
          }
        }
      }
    })

    return conflicted
  }, [memberJobsMap, visibleMembers])

  const memberConflictCount = useMemo(() => {
    const map = new Map<string, number>()
    visibleMembers.forEach((member) => {
      const jobsForMember = memberJobsMap.get(member.id) || []
      const conflictedIds = new Set<string>()
      for (let i = 0; i < jobsForMember.length; i++) {
        for (let j = i + 1; j < jobsForMember.length; j++) {
          if (isOverlapping(jobsForMember[i], jobsForMember[j])) {
            conflictedIds.add(jobsForMember[i].id)
            conflictedIds.add(jobsForMember[j].id)
          }
        }
      }
      map.set(member.id, conflictedIds.size)
    })
    return map
  }, [memberJobsMap, visibleMembers])

  const totalConflicts = conflictJobIds.size

  const selectedDayKey = useMemo(() => WEEKDAY_KEYS[selectedDate.getDay()], [selectedDate])

  const availabilityByMemberAndSlot = useMemo(() => {
    const map = new Map<string, boolean>()

    visibleMembers.forEach((member) => {
      let availability: WeeklyAvailability | null = null
      for (const key of member.availabilityKeys) {
        if (userAvailability[key]) {
          availability = userAvailability[key]
          break
        }
      }

      const dayWindows = availability ? (availability[selectedDayKey] || []) : null
      const parsedWindows = (dayWindows || [])
        .map((window) => ({
          start: parseTimeToMinutes(window.start),
          end: parseTimeToMinutes(window.end)
        }))
        .filter((window) => window.start != null && window.end != null)

      slotMinutesList.forEach((slotMinutes) => {
        const slotKey = `${member.id}-${slotMinutes}`

        if (!availability) {
          map.set(slotKey, true)
          return
        }

        if (parsedWindows.length === 0) {
          map.set(slotKey, false)
          return
        }

        const slotEnd = slotMinutes + SLOT_MINUTES
        const available = parsedWindows.some((window) => {
          if (window.start == null || window.end == null) return false
          return slotMinutes >= window.start && slotEnd <= window.end
        })

        map.set(slotKey, available)
      })
    })

    return map
  }, [selectedDayKey, slotMinutesList, userAvailability, visibleMembers])

  const isMemberAvailableAtSlot = (member: CalendarMember, slotMinutes: number) => {
    const slotKey = `${member.id}-${slotMinutes}`
    return availabilityByMemberAndSlot.get(slotKey) ?? true
  }

  const bookedMembersCount = useMemo(() => {
    const booked = new Set<string>()
    dayJobs.forEach((job) => {
      ;(job.assignedEmployees || []).forEach((m) => booked.add(m.id || m.name))
    })
    return booked.size
  }, [dayJobs])

  const todayAssignmentsByMember = useMemo(() => {
    const todayIso = toIsoDate(new Date())
    return visibleMembers
      .map((member) => {
        const count = jobs.filter((job) => {
          if (!job.scheduledDate) return false
          if (!isDateInRange(todayIso, job.scheduledDate, job.scheduledEndDate)) return false
          return memberMatchesJob(member, job)
        }).length

        return {
          memberId: member.id,
          memberName: member.name,
          source: member.source,
          count
        }
      })
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count
        return a.memberName.localeCompare(b.memberName)
      })
  }, [jobs, visibleMembers])

  const handleQuickStatusChange = async (jobId: string, nextStatus: JobStatus) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: nextStatus,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Failed to change job status from calendar menu:', error)
      alert('Failed to update status.')
    } finally {
      setActiveJobMenuKey(null)
    }
  }

  const isAssignedEmployeeForMember = (
    member: CalendarMember,
    employee: { id: string; name: string; email: string },
  ) => {
    const empId = String(employee.id || '').toLowerCase()
    const empEmail = String(employee.email || '').toLowerCase()
    const memberId = String(member.id || '').toLowerCase()
    const memberAssignmentId = String(member.assignmentId || '').toLowerCase()
    const memberEmail = String(member.email || '').toLowerCase()
    const memberLinkIds = (member.linkIds || []).map((id) => String(id || '').toLowerCase())

    const idMatched = !!empId && (empId === memberId || empId === memberAssignmentId || memberLinkIds.includes(empId))
    const emailMatched = !!empEmail && (empEmail === memberEmail || memberLinkIds.includes(empEmail))

    return idMatched || emailMatched
  }

  const handleDeleteSlot = async (job: CalendarJob, member: CalendarMember) => {
    const confirmed = window.confirm('Delete this slot assignment? If this is the last assigned member, the full job will be deleted.')
    if (!confirmed) return

    try {
      const assignedEmployees = job.assignedEmployees || []
      const remainingEmployees = assignedEmployees.filter((employee) => !isAssignedEmployeeForMember(member, employee))

      if (remainingEmployees.length === 0) {
        await deleteDoc(doc(db, 'jobs', job.id))
      } else {
        await updateDoc(doc(db, 'jobs', job.id), {
          assignedEmployees: remainingEmployees,
          assignedTo: remainingEmployees.map((employee) => employee.name),
          updatedAt: Timestamp.now()
        })
      }
    } catch (error) {
      console.error('Failed to delete slot assignment:', error)
      alert('Failed to delete slot. Please try again.')
    } finally {
      setActiveJobMenuKey(null)
    }
  }

  const handleDeleteJob = async (job: CalendarJob) => {
    const confirmed = window.confirm(`Delete complete job \"${job.title}\"? This action cannot be undone.`)
    if (!confirmed) return

    try {
      await deleteDoc(doc(db, 'jobs', job.id))
    } catch (error) {
      console.error('Failed to delete complete job:', error)
      alert('Failed to delete job. Please try again.')
    } finally {
      setActiveJobMenuKey(null)
    }
  }

  const handleOpenJobDetails = (job: CalendarJob) => {
    setSelectedJobForDetails(job)
    setActiveJobMenuKey(null)
  }

  const openCreateModal = (prefill?: Partial<CalendarCreateForm>) => {
    const defaultMember = visibleMembers[0]?.id || members[0]?.id || ''
    setCreateForm((prev) => ({
      ...prev,
      title: '',
      clientId: '',
      client: '',
      location: '',
      priority: 'Medium',
      riskLevel: 'Low',
      description: '',
      teamRequired: 1,
      budget: 0,
      estimatedDuration: '',
      slaDeadline: '',
      requiredSkills: '',
      tags: '',
      specialInstructions: '',
      recurring: false,
      scheduledDate: selectedIsoDate,
      scheduledEndDate: selectedIsoDate,
      scheduledTime: '09:00',
      endTime: '10:00',
      createdById: defaultMember,
      responsibleById: defaultMember,
      teamMemberIds: [],
      quotationRequired: false,
      quotationStatus: 'Not Required',
      surveyRequired: false,
      surveyStatus: 'Not Required',
      paymentStatus: 'Pending',
      paymentMethod: 'N/A',
      paymentReference: '',
      paymentLinkGeneratedBy: '',
      ...prefill
    }))
    setShowCreateModal(true)
  }

  const handleCreateJobFromCalendar = async () => {
    if (!createForm.title.trim() || !createForm.client.trim() || !createForm.location.trim()) {
      alert('Please fill title, client, and location.')
      return
    }

    const createdBy = members.find((m) => m.id === createForm.createdById)
    const responsibleBy = members.find((m) => m.id === createForm.responsibleById)
    if (!createdBy || !responsibleBy) {
      alert('Please select both "Created by" and "Assigned to" persons.')
      return
    }

    const selectedTeamMembers = members.filter((member) => createForm.teamMemberIds.includes(member.id))
    const allAssignedMembers = [...selectedTeamMembers]

    if (allAssignedMembers.length === 0) {
      alert('Please select at least one team member.')
      return
    }

    if (!createForm.teamMemberIds.includes(createForm.responsibleById)) {
      alert('Responsible person must also be added in Team Members.')
      return
    }

    const targetMinutes = parseTimeToMinutes(createForm.scheduledTime)
    if (targetMinutes == null) {
      alert('Please provide a valid start time.')
      return
    }

    const estimatedMinutes = parseEstimatedDurationMinutes(createForm.estimatedDuration) || 0
    const endMinutesFromClock = parseTimeToMinutes(createForm.endTime)
    const effectiveEndMinutes = estimatedMinutes > 0
      ? targetMinutes + estimatedMinutes
      : (endMinutesFromClock && endMinutesFromClock > targetMinutes ? endMinutesFromClock : targetMinutes + SLOT_MINUTES)
    const effectiveEndTime = minutesToTimeString(effectiveEndMinutes)
    const dayCarry = Math.floor(effectiveEndMinutes / (24 * 60))
    const normalizedEndMinutes = effectiveEndMinutes % (24 * 60)
    const finalEndTime = minutesToTimeString(normalizedEndMinutes)
    const finalEndDate = addDaysToIso(createForm.scheduledDate, dayCarry)

    const requiredSlots: number[] = []
    for (let cursor = targetMinutes; cursor < effectiveEndMinutes; cursor += SLOT_MINUTES) {
      requiredSlots.push(cursor)
    }

    const unavailableMembers = allAssignedMembers.filter((member) => {
      return requiredSlots.some((slotMinute) => !isMemberAvailableAtSlot(member, slotMinute))
    })

    if (unavailableMembers.length > 0) {
      alert(`Unavailable members in selected duration: ${unavailableMembers.map((member) => member.name).join(', ')}`)
      return
    }

    try {
      setSavingCreateJob(true)

      const assignedEmployees = allAssignedMembers.map((member) => ({
        id: member.assignmentId,
        name: member.name,
        email: member.email || ''
      }))

      const nowIso = new Date().toISOString()
      const budget = Math.max(0, Number(createForm.budget) || 0)
      const taxRate = 0.05
      const taxAmount = Number((budget * taxRate).toFixed(2))
      const budgetWithTax = Number((budget + taxAmount).toFixed(2))

      await addDoc(collection(db, 'jobs'), {
        title: createForm.title.trim(),
        client: createForm.client.trim(),
        clientId: '',
        priority: createForm.priority,
        riskLevel: createForm.riskLevel,
        scheduledDate: createForm.scheduledDate,
        scheduledEndDate: estimatedMinutes > 0 ? finalEndDate : (createForm.scheduledEndDate || createForm.scheduledDate),
        scheduledTime: createForm.scheduledTime,
        endTime: estimatedMinutes > 0 ? finalEndTime : effectiveEndTime,
        location: createForm.location.trim(),
        teamRequired: Math.max(1, Number(createForm.teamRequired) || 1, assignedEmployees.length),
        budget: budgetWithTax,
        baseBudget: budget,
        taxRate,
        taxAmount,
        actualCost: 0,
        description: createForm.description.trim() || 'Created from Universal Calendar',
        slaDeadline: createForm.slaDeadline,
        estimatedDuration: createForm.estimatedDuration,
        estimatedDurationMinutes: 0,
        actualDuration: '',
        actualDurationMinutes: 0,
        timePerformanceStatus: 'Unknown',
        timePerformanceDeltaMinutes: 0,
        timePerformanceNote: '',
        requiredSkills: createForm.requiredSkills.split(',').map((item) => item.trim()).filter(Boolean),
        equipment: [],
        permits: [],
        tags: ['Calendar Created', ...createForm.tags.split(',').map((item) => item.trim()).filter(Boolean)],
        specialInstructions: createForm.specialInstructions,
        recurring: createForm.recurring,
        services: [],
        upsales: [],
        tasks: [],
        updatedAt: nowIso,
        createdAt: nowIso,
        completedAt: '',
        status: 'Scheduled',
        executionLogs: [],
        assignedTo: assignedEmployees.map((member) => member.name),
        assignedEmployees,
        jobCreatedBy: createdBy.assignmentId,
        jobResponsibleBy: responsibleBy.assignmentId,
        quotationRequired: createForm.quotationRequired,
        quotationStatus: createForm.quotationRequired ? createForm.quotationStatus : 'Not Required',
        surveyRequired: createForm.surveyRequired,
        surveyStatus: createForm.surveyRequired ? createForm.surveyStatus : 'Not Required',
        paymentStatus: createForm.paymentStatus,
        paymentMethod: createForm.paymentMethod,
        paymentReference: createForm.paymentReference,
        paymentLinkGeneratedBy: createForm.paymentLinkGeneratedBy,
        availabilityOverride: true,
        reminderEnabled: false,
        reminderSent: false,
        listingDurationDays: 0,
        listingExpiresAt: '',
        overtimeRequired: false,
        overtimeHours: 0,
        overtimeReason: '',
        overtimeApproved: false
      })

      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create job from calendar:', error)
      alert('Failed to create job. Please try again.')
    } finally {
      setSavingCreateJob(false)
    }
  }

  const goToDate = (direction: -1 | 1) => {
    if (dateAnimationTimerRef.current) {
      window.clearTimeout(dateAnimationTimerRef.current)
    }

    setNavDirection(direction)
    setIsDateAnimating(true)

    dateAnimationTimerRef.current = window.setTimeout(() => {
      setSelectedDate((prev) => addDays(prev, direction))
      setIsDateAnimating(false)
    }, 120)
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Universal Calendar</h1>
          <p className="text-sm text-gray-600 mt-1">All admins and employees by time slot, with job occupancy and availability.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreateModal({ scheduledDate: selectedIsoDate, scheduledEndDate: selectedIsoDate })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Create Job
          </button>
          <button onClick={() => goToDate(-1)} className="p-2 border rounded-lg hover:bg-gray-50" aria-label="Previous day">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-2 border rounded-lg font-semibold min-w-36 text-center">
            {format(selectedDate, 'MMM dd, yyyy')}
          </div>
          <button onClick={() => goToDate(1)} className="p-2 border rounded-lg hover:bg-gray-50" aria-label="Next day">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-4 gap-3 transition-all duration-200 motion-reduce:transition-none ${
          isDateAnimating
            ? `opacity-80 ${navDirection === 1 ? '-translate-x-1' : 'translate-x-1'}`
            : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="border rounded-xl bg-white p-4">
          <p className="text-xs text-gray-500 uppercase">Jobs On Selected Day</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{dayJobs.length}</p>
        </div>
        <div className="border rounded-xl bg-white p-4">
          <p className="text-xs text-gray-500 uppercase">Jobs Created Today</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{jobsCreatedToday}</p>
        </div>
        <div className="border rounded-xl bg-white p-4">
          <p className="text-xs text-gray-500 uppercase">Booked Members</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{bookedMembersCount}</p>
        </div>
        <div className="border rounded-xl bg-white p-4">
          <p className="text-xs text-gray-500 uppercase">Total Members</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{visibleMembers.length}</p>
        </div>
        <div className="border rounded-xl bg-white p-4">
          <p className="text-xs text-gray-500 uppercase">Conflict Warnings</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{totalConflicts}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sourceFilter}
          onChange={(e) => {
            const next = e.target.value as 'all' | 'admin' | 'employee'
            setSourceFilter(next)
            setStaffFilter('all')
          }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">All Members ({members.length})</option>
          <option value="admin">Admins ({members.filter((m) => m.source === 'admin').length})</option>
          <option value="employee">Employees ({members.filter((m) => m.source === 'employee').length})</option>
        </select>

        <select
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm min-w-52"
        >
          <option value="all">All Staff ({visibleMembers.length})</option>
          {members
            .filter((member) => sourceFilter === 'all' || member.source === sourceFilter)
            .map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.source})
              </option>
            ))}
        </select>

        <div className="text-xs text-gray-600">
          Use slot actions to view, update, delete slot assignment, or delete the full job.
        </div>
      </div>

      <div
        className={`border rounded-2xl bg-white overflow-auto transition-all duration-200 motion-reduce:transition-none ${
          isDateAnimating
            ? `opacity-80 ${navDirection === 1 ? '-translate-x-1' : 'translate-x-1'}`
            : 'opacity-100 translate-x-0'
        }`}
      >
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-gray-50 border-b border-r px-3 py-2 text-left min-w-20">Time</th>
              {visibleMembers.map((member) => (
                <th key={member.id} className="border-b border-r px-3 py-2 min-w-40 text-left bg-gray-50">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-gray-900 truncate">{member.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{member.source}</div>
                    </div>
                    {(memberConflictCount.get(member.id) || 0) > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-red-100 text-red-700 border border-red-300">
                        <AlertTriangle className="w-3 h-3" />
                        {memberConflictCount.get(member.id)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.label}>
                <td className="sticky left-0 z-10 bg-white border-r border-b px-3 py-2 font-medium text-gray-700">
                  {slot.label}
                </td>
                {visibleMembers.map((member) => {
                  const slotKey = `${member.id}-${slot.minutes}`
                  const slotJobs = jobsByMemberAndSlot.get(slotKey) || []
                  const startJob = slotJobs.find((job) => isJobStartSlot(job, slot.minutes))
                  const startJobMenuKey = startJob ? `${startJob.id}-${member.id}-${slot.minutes}` : ''
                  const coveringJob = slotJobs[0]
                  const sameSlotStartCount = slotJobs.filter((job) => isJobStartSlot(job, slot.minutes)).length
                  const hasConflict = slotJobs.some((job) => conflictJobIds.has(job.id))
                  const isOccupied = slotJobs.length > 0
                  const isAvailable = isMemberAvailableAtSlot(member, slot.minutes)

                  return (
                    <td
                      key={slotKey}
                      className={`border-r border-b align-top p-1 min-w-40 h-14 ${!isAvailable ? 'bg-gray-100' : ''}`}
                    >
                      {startJob ? (
                        <div
                          className={`relative h-full w-full border rounded-md p-1 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm ${STATUS_COLOR[startJob.status] || STATUS_COLOR.Pending} ${hasConflict ? 'ring-2 ring-red-500' : ''}`}
                          title={hasConflict ? 'Conflict warning: overlapping jobs for this staff' : 'Job'}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold truncate">{startJob.title}</div>
                            <button
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                              }}
                              onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                setActiveJobMenuKey((prev) => (prev === startJobMenuKey ? null : startJobMenuKey))
                              }}
                              className={`text-[10px] font-bold tracking-wider px-1 rounded transition-colors hover:bg-white/60 ${STATUS_DOT_COLOR[startJob.status] || 'text-gray-600'}`}
                              aria-label="Open job actions"
                            >
                              •••
                            </button>
                          </div>
                          {activeJobMenuKey === startJobMenuKey && (
                            <div
                              className="absolute right-1 top-5 z-20 min-w-36 rounded-lg border bg-white text-gray-800 shadow-lg p-1 transition-opacity duration-150"
                              onMouseDown={(event) => {
                                event.stopPropagation()
                              }}
                            >
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  handleOpenJobDetails(startJob)
                                }}
                                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 font-medium"
                              >
                                View Details
                              </button>
                              <Link
                                href={`/admin/jobs/${startJob.id}/job-closure`}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setActiveJobMenuKey(null)
                                }}
                                className="block w-full text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 font-medium text-blue-700"
                              >
                                View Job Complete View
                              </Link>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  void handleDeleteSlot(startJob, member)
                                }}
                                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-red-50 text-red-700 font-medium"
                              >
                                Delete Slot
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  void handleDeleteJob(startJob)
                                }}
                                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-red-100 text-red-800 font-semibold"
                              >
                                Delete Job
                              </button>
                              <div className="my-1 border-t" />
                              {(['Pending', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'] as JobStatus[]).map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    void handleQuickStatusChange(startJob.id, status)
                                  }}
                                  className={`w-full text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 ${startJob.status === status ? 'font-semibold text-blue-700' : ''}`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="text-[10px] mt-0.5 truncate">
                            {startJob.scheduledTime || slot.label} - {startJob.endTime || '...'}
                          </div>
                          {sameSlotStartCount > 1 && (
                            <div className="text-[10px] mt-0.5 text-blue-800 font-semibold">
                              {sameSlotStartCount} jobs in this slot
                            </div>
                          )}
                          {hasConflict && (
                            <div className="text-[10px] mt-0.5 inline-flex items-center gap-1 text-red-700">
                              <AlertTriangle className="w-3 h-3" />
                              Overlap
                            </div>
                          )}
                        </div>
                      ) : isOccupied ? (
                        <div className={`h-full w-full rounded-md border ${hasConflict ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'} flex flex-col items-center justify-center text-[10px] ${hasConflict ? 'text-red-700' : 'text-blue-700'}`}>
                          <span className="font-semibold">Not Available</span>
                          <span className="truncate max-w-full px-1">{coveringJob?.title || 'Busy Slot'}</span>
                        </div>
                      ) : !isAvailable ? (
                        <div className="h-full w-full border rounded-md bg-gray-200 text-gray-500 text-[10px] flex items-center justify-center">
                          Unavailable
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openCreateModal({
                            scheduledDate: selectedIsoDate,
                            scheduledEndDate: selectedIsoDate,
                            scheduledTime: slot.label,
                            endTime: slot.label,
                            createdById: member.id,
                            responsibleById: member.id,
                            teamMemberIds: [member.id]
                          })}
                          className="h-full w-full border border-dashed rounded-md text-gray-400 transition-colors hover:text-green-700 hover:border-green-500 flex items-center justify-center"
                          title="Create job in this slot"
                        >
                          <Calendar className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-600 bg-gray-50 border rounded-lg p-3">
        Calendar is linked directly with Jobs data. Multi-day jobs automatically show on each day from start date to end date, and unavailable staff slots are blocked from booking.
      </div>

      <div className="border rounded-xl bg-white p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Today Assignment Summary</h3>
          <span className="text-xs text-gray-500">{format(new Date(), 'MMM dd, yyyy')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {todayAssignmentsByMember.map((item) => (
            <div key={item.memberId} className="border rounded-lg px-3 py-2 bg-gray-50">
              <div className="text-xs text-gray-500 uppercase">{item.source}</div>
              <div className="font-medium text-gray-900 truncate">{item.memberName}</div>
              <div className="text-sm text-blue-700 font-semibold mt-0.5">{item.count} jobs assigned today</div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-[98vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[94vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
            <div className="px-4 sm:px-5 lg:px-6 py-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900">Create Job On Calendar</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Job Category</label>
                  <SearchSuggestSelect
                    value={createForm.title}
                    onChange={(value) => setCreateForm((prev) => ({ ...prev, title: value || '' }))}
                    options={serviceCategoryOptions}
                    placeholder={serviceCategoryOptions.length > 0 ? 'Search service category...' : 'No service categories'}
                    inputClassName="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Client / Qualified-Won Lead</label>
                  <SearchSuggestSelect
                    value={createForm.clientId}
                    onChange={(value) => {
                      const selected = clients.find((client) => client.id === value)
                      setCreateForm((prev) => ({
                        ...prev,
                        clientId: selected?.id || '',
                        client: selected?.name || ''
                      }))
                    }}
                    options={clientOptions}
                    placeholder={clientOptions.length > 0 ? 'Search client or lead...' : 'No clients/leads found'}
                    inputClassName="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Job Created By</label>
                  <SearchSuggestSelect
                    value={createForm.createdById}
                    onChange={(value) => setCreateForm((prev) => ({ ...prev, createdById: value || '' }))}
                    options={memberOptions}
                    placeholder="Select creator (admin or employee)"
                    inputClassName="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Job Assigned To (Responsible)</label>
                  <SearchSuggestSelect
                    value={createForm.responsibleById}
                    onChange={(value) => {
                      setCreateForm((prev) => ({ ...prev, responsibleById: value || '' }))
                    }}
                    options={memberOptions}
                    placeholder="Select responsible person"
                    inputClassName="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <textarea
                placeholder="Description"
                value={createForm.description}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />

              <input
                type="text"
                placeholder="Location"
                value={createForm.location}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <input
                  type="date"
                  value={createForm.scheduledDate}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={createForm.scheduledEndDate}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, scheduledEndDate: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
                <input
                  type="time"
                  value={createForm.scheduledTime}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="time"
                  value={createForm.endTime}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, priority: e.target.value as CalendarCreateForm['priority'] }))}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
                <select
                  value={createForm.riskLevel}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, riskLevel: e.target.value as CalendarCreateForm['riskLevel'] }))}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
                <input
                  type="number"
                  min="1"
                  value={createForm.teamRequired}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, teamRequired: Math.max(1, Number(e.target.value) || 1) }))}
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Team size"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.budget}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, budget: Math.max(0, Number(e.target.value) || 0) }))}
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Budget (AED)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <input
                  type="text"
                  value={createForm.estimatedDuration}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, estimatedDuration: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Estimated duration (e.g., 4 hours)"
                />
                <input
                  type="date"
                  value={createForm.slaDeadline}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, slaDeadline: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <input
                type="text"
                value={createForm.requiredSkills}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, requiredSkills: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Required skills (comma separated)"
              />

              <input
                type="text"
                value={createForm.tags}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Tags (comma separated)"
              />

              <textarea
                value={createForm.specialInstructions}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
                placeholder="Special instructions"
              />

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={createForm.recurring}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, recurring: e.target.checked }))}
                />
                Recurring job
              </label>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Team Members (Multi-select)</label>
                <SearchSuggestSelect
                  value={teamMemberToAdd}
                  onChange={(value) => {
                    const memberId = value || ''
                    setTeamMemberToAdd(memberId)
                    if (!memberId) return
                    setCreateForm((prev) => {
                      if (prev.teamMemberIds.includes(memberId)) return prev
                      return { ...prev, teamMemberIds: [...prev.teamMemberIds, memberId] }
                    })
                    setTeamMemberToAdd('')
                  }}
                  options={memberOptions}
                  placeholder="Search and add team member"
                  inputClassName="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex flex-wrap gap-2">
                  {createForm.teamMemberIds.map((memberId) => {
                    const member = members.find((item) => item.id === memberId)
                    if (!member) return null
                    return (
                      <span key={memberId} className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full border border-blue-300">
                        {member.name}
                        <button
                          type="button"
                          className="text-blue-900 hover:text-blue-700"
                          onClick={() => {
                            setCreateForm((prev) => ({
                              ...prev,
                              teamMemberIds: prev.teamMemberIds.filter((id) => id !== memberId)
                            }))
                          }}
                        >
                          ×
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={createForm.quotationRequired}
                    onChange={(e) => setCreateForm((prev) => ({
                      ...prev,
                      quotationRequired: e.target.checked,
                      quotationStatus: e.target.checked ? 'Pending' : 'Not Required'
                    }))}
                  />
                  Quotation Required
                </label>
                <select
                  value={createForm.quotationStatus}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, quotationStatus: e.target.value as CalendarCreateForm['quotationStatus'] }))}
                  disabled={!createForm.quotationRequired}
                  className="px-3 py-2 border rounded-lg disabled:bg-gray-100"
                >
                  <option value="Not Required">Not Required</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={createForm.surveyRequired}
                    onChange={(e) => setCreateForm((prev) => ({
                      ...prev,
                      surveyRequired: e.target.checked,
                      surveyStatus: e.target.checked ? 'Pending' : 'Not Required'
                    }))}
                  />
                  Survey Required
                </label>
                <select
                  value={createForm.surveyStatus}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, surveyStatus: e.target.value as CalendarCreateForm['surveyStatus'] }))}
                  disabled={!createForm.surveyRequired}
                  className="px-3 py-2 border rounded-lg disabled:bg-gray-100"
                >
                  <option value="Not Required">Not Required</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <select
                  value={createForm.paymentStatus}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, paymentStatus: e.target.value as CalendarCreateForm['paymentStatus'] }))}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Collect After Job">Collect After Job</option>
                </select>
                <select
                  value={createForm.paymentMethod}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, paymentMethod: e.target.value as CalendarCreateForm['paymentMethod'] }))}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="N/A">N/A</option>
                  <option value="Payment Link">Payment Link</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <input
                  type="text"
                  value={createForm.paymentReference}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, paymentReference: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Payment reference"
                />
                <input
                  type="text"
                  value={createForm.paymentLinkGeneratedBy}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, paymentLinkGeneratedBy: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Payment link generated by"
                />
              </div>
            </div>

            <div className="px-4 sm:px-5 lg:px-6 py-4 border-t flex justify-end gap-2 bg-white sticky bottom-0 z-10">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button
                onClick={() => void handleCreateJobFromCalendar()}
                disabled={savingCreateJob}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-60"
              >
                {savingCreateJob ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Job Details</h3>
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close job details"
              >
                ✕
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase">Job Title</p>
                <p className="font-semibold text-gray-900">{selectedJobForDetails.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Status</p>
                <p className="font-semibold text-gray-900">{selectedJobForDetails.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Client</p>
                <p className="font-semibold text-gray-900">{selectedJobForDetails.client || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Location</p>
                <p className="font-semibold text-gray-900">{selectedJobForDetails.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Date Range</p>
                <p className="font-semibold text-gray-900">
                  {selectedJobForDetails.scheduledDate || 'N/A'} to {selectedJobForDetails.scheduledEndDate || selectedJobForDetails.scheduledDate || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Time Range</p>
                <p className="font-semibold text-gray-900">{selectedJobForDetails.scheduledTime || 'N/A'} - {selectedJobForDetails.endTime || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Priority / Risk</p>
                <p className="font-semibold text-gray-900">{selectedJobForDetails.priority || 'N/A'} / {selectedJobForDetails.riskLevel || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Team / Budget</p>
                <p className="font-semibold text-gray-900">{selectedJobForDetails.teamRequired || 0} members / AED {(selectedJobForDetails.budget || 0).toLocaleString()}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 uppercase">Assigned Members</p>
                <p className="font-semibold text-gray-900">
                  {selectedJobForDetails.assignedEmployees && selectedJobForDetails.assignedEmployees.length > 0
                    ? selectedJobForDetails.assignedEmployees.map((member) => member.name).join(', ')
                    : 'No members assigned'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 uppercase">Description</p>
                <p className="font-semibold text-gray-900 whitespace-pre-wrap">{selectedJobForDetails.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="px-5 py-4 border-t flex justify-end gap-2 bg-gray-50">
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Close
              </button>
              <Link
                href={`/admin/jobs/${selectedJobForDetails.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                View Job
              </Link>
              <Link
                href={`/admin/jobs/${selectedJobForDetails.id}/job-closure`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                View Complete Job
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
