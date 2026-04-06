'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Save,
  Clock
} from 'lucide-react'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

const TIMEZONE = 'Asia/Dubai'

type UserType = 'admin' | 'employee'

type UserProfile = {
  id: string
  name: string
  email: string
  type: UserType
}

type TimeRange = {
  start: string
  end: string
}

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

type WeeklyAvailability = Record<DayKey, TimeRange[]>

type AvailabilityDoc = {
  userId: string
  userType: UserType
  timezone: string
  weeklyAvailability: WeeklyAvailability
  updatedAt: string
}

type JobBusySlot = {
  start: string
  end: string
  jobId: string
  jobTitle: string
}

const DAYS: Array<{ key: DayKey; label: string }> = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' }
]

const SHIFT_TEMPLATES: Array<{ key: 'morning' | 'evening' | 'night'; label: string; start: string; end: string }> = [
  { key: 'morning', label: 'Morning', start: '08:00', end: '16:00' },
  { key: 'evening', label: 'Evening', start: '16:00', end: '00:00' },
  { key: 'night', label: 'Night', start: '00:00', end: '08:00' }
]

const emptyWeeklyAvailability = (): WeeklyAvailability => ({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: []
})

const getWeekStart = (date: Date) => {
  const day = date.getDay() || 7
  const start = new Date(date)
  start.setDate(date.getDate() - (day - 1))
  start.setHours(0, 0, 0, 0)
  return start
}

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const formatWeekRangeLabel = (start: Date) => {
  const end = addDays(start, 6)
  const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${startLabel} - ${endLabel}`
}

const buildUserKey = (userId: string, userType: UserType) => `${userType}:${userId}`

const buildAvailabilityDocId = (userId: string, userType: UserType) => `${userType}_${userId}`

const normalizeUserName = (name: string) => name || 'Unknown'

const normalizeTime24 = (value?: string) => {
  if (!value) return ''
  const trimmed = value.trim()

  const hhmmMatch = /^(\d{1,2}):(\d{2})$/.exec(trimmed)
  if (hhmmMatch) {
    const hours = Number(hhmmMatch[1])
    const minutes = Number(hhmmMatch[2])
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }
  }

  const ampmMatch = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed)
  if (ampmMatch) {
    let hours = Number(ampmMatch[1])
    const minutes = Number(ampmMatch[2])
    const meridiem = ampmMatch[3].toUpperCase()
    if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
      if (meridiem === 'AM') {
        hours = hours === 12 ? 0 : hours
      } else {
        hours = hours === 12 ? 12 : hours + 12
      }
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }
  }

  return ''
}

const toMinutes = (value: string) => {
  const normalized = normalizeTime24(value)
  if (!normalized) return null
  const [hoursRaw, minutesRaw] = normalized.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw || 0)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

const toTimeLabel = (minutes: number) => {
  const clamped = Math.max(0, Math.min(minutes, 24 * 60))
  const hours = String(Math.floor(clamped / 60)).padStart(2, '0')
  const mins = String(clamped % 60).padStart(2, '0')
  return `${hours}:${mins}`
}

const toHourBucketStart = (minutes: number) => Math.floor(minutes / 60) * 60

const expandRangesToHourlySlots = (ranges: TimeRange[]) => {
  const slots = new Set<string>()
  ranges.forEach((range) => {
    const start = toMinutes(range.start)
    const end = toMinutes(range.end)
    if (start == null || end == null || end <= start) return
    // Convert to hour buckets so any overlap in an hour is represented in that hour slot.
    for (let minute = toHourBucketStart(start); minute < end; minute += 60) {
      slots.add(toTimeLabel(minute))
    }
  })
  return Array.from(slots).sort()
}

const expandBusyToHourlySlots = (ranges: JobBusySlot[]) => {
  const slots = new Set<string>()
  ranges.forEach((range) => {
    const start = toMinutes(range.start)
    const end = toMinutes(range.end)
    if (start == null || end == null || end <= start) return
    // Convert to hour buckets so booked slots correctly turn red even for half-hour jobs.
    for (let minute = toHourBucketStart(start); minute < end; minute += 60) {
      slots.add(toTimeLabel(minute))
    }
  })
  return Array.from(slots).sort()
}

const removeBookedSlots = (available: string[], busy: string[]) => {
  const busySet = new Set(busy)
  return available.filter((slot) => !busySet.has(slot))
}

const getDayKeyForDate = (date: Date): DayKey => {
  const day = date.getDay()
  switch (day) {
    case 1:
      return 'monday'
    case 2:
      return 'tuesday'
    case 3:
      return 'wednesday'
    case 4:
      return 'thursday'
    case 5:
      return 'friday'
    case 6:
      return 'saturday'
    default:
      return 'sunday'
  }
}

export default function UniversalCalendarPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'availability' | 'calendar'>('calendar')
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, AvailabilityDoc>>({})
  const [jobs, setJobs] = useState<Record<string, any>[]>([])
  const [selectedUserKey, setSelectedUserKey] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()))
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly')
  const [editingAvailability, setEditingAvailability] = useState<WeeklyAvailability>(emptyWeeklyAvailability())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const employeesSnap = await getDocs(collection(db, 'employees'))
      const employeeUsers: UserProfile[] = employeesSnap.docs.map(docSnap => ({
        id: docSnap.id,
        name: normalizeUserName(docSnap.data().name || ''),
        email: docSnap.data().email || '',
        type: 'employee'
      }))

      const adminsSnap = await getDocs(query(collection(db, 'users-role'), where('portal', '==', 'admin')))
      const adminUsers: UserProfile[] = adminsSnap.docs.map(docSnap => ({
        id: docSnap.id,
        name: normalizeUserName(docSnap.data().name || ''),
        email: docSnap.data().email || '',
        type: 'admin'
      }))

      const combined = [...adminUsers, ...employeeUsers]
      setUsers(combined)
      if (combined.length > 0) {
        setSelectedUserKey(prev => prev || buildUserKey(combined[0].id, combined[0].type))
      }
    }

    const fetchAvailability = async () => {
      const availabilitySnap = await getDocs(collection(db, 'user-availability'))
      const nextMap: Record<string, AvailabilityDoc> = {}
      availabilitySnap.docs.forEach(docSnap => {
        const data = docSnap.data() as AvailabilityDoc
        const userKey = buildUserKey(data.userId, data.userType)
        nextMap[userKey] = {
          ...data,
          weeklyAvailability: data.weeklyAvailability || emptyWeeklyAvailability()
        }
      })
      setAvailabilityMap(nextMap)
    }

    const fetchJobs = async () => {
      const jobsSnap = await getDocs(collection(db, 'jobs'))
      const jobData = jobsSnap.docs.map(docSnap => {
        const data = docSnap.data() as Record<string, any>
        return {
          id: docSnap.id,
          ...data,
          scheduledTime: normalizeTime24(data.scheduledTime),
          endTime: normalizeTime24(data.endTime)
        }
      })
      setJobs(jobData)
    }

    fetchUsers().catch(console.error)
    fetchAvailability().catch(console.error)
    fetchJobs().catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedUserKey) return
    const availabilityDoc = availabilityMap[selectedUserKey]
    setEditingAvailability(availabilityDoc?.weeklyAvailability || emptyWeeklyAvailability())
  }, [availabilityMap, selectedUserKey])

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    const term = searchTerm.toLowerCase()
    return users.filter(user =>
      user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    )
  }, [users, searchTerm])

  const busySlotsByUserAndDate = useMemo(() => {
    const map: Record<string, Record<string, JobBusySlot[]>> = {}
    const blockedStatuses = new Set(['Cancelled', 'Completed', 'Expired'])

    jobs.forEach(job => {
      if (blockedStatuses.has(job.status)) return
      const scheduledDate = job.scheduledDate
      const scheduledTime = job.scheduledTime
      const endTime = job.endTime
      if (!scheduledDate || !scheduledTime || !endTime) return

      const assignedEmployees = Array.isArray(job.assignedEmployees) ? job.assignedEmployees : []
      assignedEmployees.forEach((employee: { id: string }) => {
        if (!employee?.id) return
        const userKey = buildUserKey(employee.id, 'employee')
        const dateKey = scheduledDate
        if (!map[userKey]) map[userKey] = {}
        if (!map[userKey][dateKey]) map[userKey][dateKey] = []
        map[userKey][dateKey].push({
          start: scheduledTime,
          end: endTime,
          jobId: job.id,
          jobTitle: job.title || 'Job'
        })
      })
    })

    return map
  }, [jobs])

  const handleAddRange = (dayKey: DayKey) => {
    setEditingAvailability(prev => ({
      ...prev,
      [dayKey]: [...prev[dayKey], { start: '09:00', end: '17:00' }]
    }))
  }

  const handleUpdateRange = (dayKey: DayKey, index: number, field: keyof TimeRange, value: string) => {
    setEditingAvailability(prev => {
      const updated = [...prev[dayKey]]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, [dayKey]: updated }
    })
  }

  const handleRemoveRange = (dayKey: DayKey, index: number) => {
    setEditingAvailability(prev => {
      const updated = prev[dayKey].filter((_, i) => i !== index)
      return { ...prev, [dayKey]: updated }
    })
  }

  const handleSaveAvailability = useCallback(async () => {
    if (!selectedUserKey) return
    const [userType, userId] = selectedUserKey.split(':') as [UserType, string]
    const docId = buildAvailabilityDocId(userId, userType)

    setSaving(true)
    try {
      const payload: AvailabilityDoc = {
        userId,
        userType,
        timezone: TIMEZONE,
        weeklyAvailability: editingAvailability,
        updatedAt: new Date().toISOString()
      }
      await setDoc(doc(db, 'user-availability', docId), payload, { merge: true })
      setAvailabilityMap(prev => ({
        ...prev,
        [selectedUserKey]: payload
      }))
    } catch (error) {
      console.error('Failed to save availability', error)
      alert('Failed to save availability')
    } finally {
      setSaving(false)
    }
  }, [editingAvailability, selectedUserKey])

  const applyShiftToDay = (dayKey: DayKey, shiftKey: 'morning' | 'evening' | 'night') => {
    const selectedShift = SHIFT_TEMPLATES.find((shift) => shift.key === shiftKey)
    if (!selectedShift) return
    setEditingAvailability((prev) => ({
      ...prev,
      [dayKey]: [{ start: selectedShift.start, end: selectedShift.end }]
    }))
  }

  const applyShiftToWeekdays = (shiftKey: 'morning' | 'evening' | 'night') => {
    const selectedShift = SHIFT_TEMPLATES.find((shift) => shift.key === shiftKey)
    if (!selectedShift) return
    setEditingAvailability((prev) => ({
      ...prev,
      monday: [{ start: selectedShift.start, end: selectedShift.end }],
      tuesday: [{ start: selectedShift.start, end: selectedShift.end }],
      wednesday: [{ start: selectedShift.start, end: selectedShift.end }],
      thursday: [{ start: selectedShift.start, end: selectedShift.end }],
      friday: [{ start: selectedShift.start, end: selectedShift.end }]
    }))
  }

  const clearWeekSlots = () => {
    setEditingAvailability(emptyWeeklyAvailability())
  }

  const weekDates = useMemo(() => {
    return DAYS.map((_, index) => addDays(currentWeekStart, index))
  }, [currentWeekStart])

  const monthlyDates = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const startDay = start.getDay() || 7
    const calendarStart = addDays(start, -(startDay - 1))
    const days: Date[] = []
    for (let i = 0; i < 42; i += 1) {
      days.push(addDays(calendarStart, i))
    }
    return days
  }, [currentMonth])

  const selectedUser = users.find(user => buildUserKey(user.id, user.type) === selectedUserKey)
  const todayDateKey = toDateKey(new Date())
  const todayDayKey = getDayKeyForDate(new Date())

  const todayHourlySlotsByUser = useMemo(() => {
    const result: Record<string, { available: string[]; busy: string[] }> = {}
    filteredUsers.forEach((user) => {
      const userKey = buildUserKey(user.id, user.type)
      const weeklyAvailability = availabilityMap[userKey]?.weeklyAvailability || emptyWeeklyAvailability()
      const available = expandRangesToHourlySlots(weeklyAvailability[todayDayKey] || [])
      const busy = expandBusyToHourlySlots(busySlotsByUserAndDate[userKey]?.[todayDateKey] || [])
      result[userKey] = { available, busy }
    })
    return result
  }, [filteredUsers, availabilityMap, busySlotsByUserAndDate, todayDateKey, todayDayKey])

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Universal Calendar</h1>
        <p className="text-gray-600">Simple team schedule view with busy slots from assigned jobs.</p>
        <p className="text-xs text-gray-500 mt-1">Timezone: {TIMEZONE}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdvancedControls((prev) => !prev)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {showAdvancedControls ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${showAdvancedControls ? '' : 'hidden'}`}
          >
            Users
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'availability' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${showAdvancedControls ? '' : 'hidden'}`}
          >
            Availability
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Calendar
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold text-gray-800">All Users</h2>
            </div>
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2 max-h-130 overflow-y-auto">
              {filteredUsers.map(user => {
                const key = buildUserKey(user.id, user.type)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedUserKey(key)}
                    className={`w-full text-left border rounded-lg px-3 py-2 transition-colors ${selectedUserKey === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <span className={`text-[10px] uppercase font-bold ${user.type === 'admin' ? 'text-purple-600' : 'text-emerald-600'}`}>
                        {user.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                  </button>
                )
              })}
              {filteredUsers.length === 0 && (
                <p className="text-xs text-gray-500">No users found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">Weekly Availability</h2>
                <p className="text-xs text-gray-500">{selectedUser ? `${selectedUser.name} (${selectedUser.type})` : 'Select a user from Users tab'}</p>
              </div>
              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={!selectedUserKey || saving}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Quick Shift Presets</p>
              <div className="flex flex-wrap gap-2">
                {SHIFT_TEMPLATES.map((shift) => (
                  <button
                    key={shift.key}
                    type="button"
                    onClick={() => applyShiftToWeekdays(shift.key)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    Weekdays {shift.label} ({shift.start}-{shift.end})
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearWeekSlots}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                >
                  Clear Week
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {DAYS.map(day => (
                <div key={day.key} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{day.label}</span>
                    <div className="flex flex-wrap gap-1">
                      {SHIFT_TEMPLATES.map((shift) => (
                        <button
                          key={`${day.key}-${shift.key}`}
                          type="button"
                          onClick={() => applyShiftToDay(day.key, shift.key)}
                          className="text-[10px] px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        >
                          {shift.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddRange(day.key)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Add range
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {editingAvailability[day.key].map((range, index) => (
                      <div key={`${day.key}-${index}`} className="flex flex-wrap items-center gap-2">
                        <input
                          type="time"
                          step={3600}
                          lang="en-GB"
                          value={range.start}
                          onChange={(e) => handleUpdateRange(day.key, index, 'start', normalizeTime24(e.target.value))}
                          className="px-2 py-1 border border-gray-200 rounded-md text-sm"
                        />
                        <span className="text-xs text-gray-500">to</span>
                        <input
                          type="time"
                          step={3600}
                          lang="en-GB"
                          value={range.end}
                          onChange={(e) => handleUpdateRange(day.key, index, 'end', normalizeTime24(e.target.value))}
                          className="px-2 py-1 border border-gray-200 rounded-md text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveRange(day.key, index)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {editingAvailability[day.key].length === 0 && (
                      <p className="text-xs text-gray-400">No availability set.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('weekly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Weekly View
                </button>
                <button
                  type="button"
                  onClick={() => setView('monthly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Monthly View
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {view === 'weekly' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="text-sm font-semibold text-gray-700">{formatWeekRangeLabel(currentWeekStart)}</div>
                    <button
                      type="button"
                      onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="text-sm font-semibold text-gray-700">{formatMonthLabel(currentMonth)}</div>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <h2 className="font-semibold text-gray-800">Calendar Overview</h2>
          </div>

          {view === 'weekly' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase py-2 px-2">User</th>
                    {weekDates.map((date, index) => (
                      <th key={index} className="text-left text-xs font-semibold text-gray-500 uppercase py-2 px-2">
                        {DAYS[index].label}
                        <div className="text-[10px] text-gray-400">{date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const userKey = buildUserKey(user.id, user.type)
                    const weeklyAvailability = availabilityMap[userKey]?.weeklyAvailability || emptyWeeklyAvailability()
                    return (
                      <tr key={userKey} className="border-t border-gray-100">
                        <td className="py-3 px-2 text-sm font-semibold text-gray-700">
                          {user.name}
                          <div className="text-[10px] uppercase text-gray-400">{user.type}</div>
                        </td>
                        {weekDates.map((date, index) => {
                          const dateKey = toDateKey(date)
                          const dayKey = DAYS[index].key
                          const availabilityRanges = weeklyAvailability[dayKey] || []
                          const busyRanges = busySlotsByUserAndDate[userKey]?.[dateKey] || []
                          const hourlyAvailable = expandRangesToHourlySlots(availabilityRanges)
                          const hourlyBusy = expandBusyToHourlySlots(busyRanges)
                          const remainingAvailable = removeBookedSlots(hourlyAvailable, hourlyBusy)
                          return (
                            <td key={dateKey} className="py-3 px-2 align-top">
                              <div className="space-y-1">
                                {hourlyBusy.map((slot, idx) => (
                                  <div key={`busy-${idx}`} className="text-[10px] px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                                    Busy {slot}
                                  </div>
                                ))}
                                {remainingAvailable.map((slot, idx) => (
                                  <div key={`avail-${idx}`} className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {slot}
                                  </div>
                                ))}
                                {remainingAvailable.length === 0 && hourlyBusy.length === 0 && (
                                  <div className="text-[10px] text-gray-300">--</div>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-sm text-gray-400">No users to display.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div className="mb-3 text-sm text-gray-600">
                {selectedUser ? `Monthly view for ${selectedUser.name}` : 'Select a user to view monthly availability.'}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map(day => (
                  <div key={day.key} className="text-[10px] font-semibold text-gray-500 uppercase text-center">
                    {day.label}
                  </div>
                ))}
                {monthlyDates.map((date, index) => {
                  const dateKey = toDateKey(date)
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                  const userKey = selectedUser ? buildUserKey(selectedUser.id, selectedUser.type) : ''
                  const dayKey = DAYS[(index % 7)].key
                  const availabilityRanges = userKey
                    ? availabilityMap[userKey]?.weeklyAvailability?.[dayKey] || []
                    : []
                  const busyRanges = userKey
                    ? busySlotsByUserAndDate[userKey]?.[dateKey] || []
                    : []

                  return (
                    <div
                      key={dateKey}
                      className={`border rounded-lg p-2 min-h-22 ${isCurrentMonth ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}
                    >
                      <div className="text-[10px] font-semibold text-gray-600">{date.getDate()}</div>
                      <div className="mt-1 space-y-1">
                        {availabilityRanges.length > 0 && (
                          <div className="text-[10px] text-emerald-600">Avail: {availabilityRanges.length}</div>
                        )}
                        {busyRanges.length > 0 && (
                          <div className="text-[10px] text-red-600">Busy: {busyRanges.length}</div>
                        )}
                        {availabilityRanges.length === 0 && busyRanges.length === 0 && (
                          <div className="text-[10px] text-gray-300">--</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-800">Today Hourly Slots</h3>
                </div>
                <p className="text-xs text-gray-500">All users with 1-hour slot gaps.</p>
                <div className="space-y-2 max-h-130 overflow-y-auto">
                  {filteredUsers.map((user) => {
                    const key = buildUserKey(user.id, user.type)
                    const slots = todayHourlySlotsByUser[key] || { available: [], busy: [] }
                    const remainingAvailable = removeBookedSlots(slots.available, slots.busy)
                    return (
                      <div key={key} className="border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                          <span className={`text-[10px] uppercase font-bold ${user.type === 'admin' ? 'text-purple-600' : 'text-emerald-600'}`}>
                            {user.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {slots.busy.map((slot) => (
                            <span key={`busy-${key}-${slot}`} className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                              Busy {slot}
                            </span>
                          ))}
                          {remainingAvailable.map((slot) => (
                            <span key={`avail-${key}-${slot}`} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {slot}
                            </span>
                          ))}
                          {remainingAvailable.length === 0 && slots.busy.length === 0 && (
                            <span className="text-[10px] text-gray-300">--</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
