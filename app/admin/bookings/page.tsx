'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Banknote,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  XCircle,
  Eye,
  Trash2,
  Download,
  MessageSquare,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin as LocationIcon,
  TrendingUp,
  Users,
  X,
  Edit2,
  Save,
  Ban,
  ThumbsUp,
  ThumbsDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  RotateCcw,
  Settings,
  PlusCircle,
  LayoutGrid,
  List,
  Scissors,
  UserCheck
} from 'lucide-react'

import { db } from '@/lib/firebase'
import { collection, getDocs, query, deleteDoc, doc, updateDoc, where, Timestamp, onSnapshot, addDoc } from 'firebase/firestore'
import { format, addDays, startOfDay, addMinutes, isSameDay } from 'date-fns'

interface Booking {
  id: string;
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  serviceName: string;
  serviceId?: string;
  bookingDate: string;
  bookingTime: string;
  bookingNumber: string;
  duration: number;
  estimatedPrice: number;
  status: 'pending' | 'accepted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  propertyType?: string;
  frequency?: string;
  clientId?: string;
  lastStatusChangedBy?: string;
  lastStatusChangeAt?: string;
  lastStatusChange?: {
    from: string;
    to: string;
    by: string;
    timestamp: unknown;
  };
}

interface Service {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  cost?: number;
  duration?: number;
  description: string;
  status: string;
  type: string;
  sku?: string;
  imageUrl?: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

type FirebaseTimestampInput =
  | { toDate?: () => Date; seconds?: number }
  | Date
  | number
  | string
  | null
  | undefined

// Status icons and colors
const statusIcons = {
  new: AlertCircle,
  pending: AlertCircle,
  accepted: ThumbsUp,
  confirmed: CheckCircle,
  'in-progress': ClockIcon,
  completed: CheckCircle,
  cancelled: XCircle,
  rejected: ThumbsDown
}

const statusColors = {
  new: 'bg-slate-100 text-slate-700 dark:bg-slate-950/30 dark:text-slate-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  accepted: 'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
  'in-progress': 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
}

const calendarStatusColors = {
  new: 'bg-slate-500',
  pending: 'bg-amber-500',
  accepted: 'bg-teal-500',
  confirmed: 'bg-blue-500',
  'in-progress': 'bg-purple-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  rejected: 'bg-rose-500'
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const servicesRef = useRef<Service[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [editFormData, setEditFormData] = useState<Booking | null>(null)
  const [sortBy, setSortBy] = useState<string>('created-desc')
  const [timeFrom, setTimeFrom] = useState('')
  const [timeTo, setTimeTo] = useState('')
  
  // Team member selection states
  const [showTeamDropdown, setShowTeamDropdown] = useState<boolean>(false)
  const [currentBookingId, setCurrentBookingId] = useState<string>('')
  const [pendingStatusChange, setPendingStatusChange] = useState<Booking['status'] | null>(null)
  
  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedService, setSelectedService] = useState<string>('all')
  const [timeSlotGap, setTimeSlotGap] = useState(30)
  const [layoutMode, setLayoutMode] = useState<'time-top' | 'service-top'>('time-top')
  const [businessHours, setBusinessHours] = useState({ start: 9, end: 18 })
  const [hiddenHours, setHiddenHours] = useState<number[]>([])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    servicesRef.current = services
  }, [services])

  // Fetch data from Firebase
  useEffect(() => {
    fetchServices()
    fetchEmployees()
    
    // Set up real-time listener for bookings
    const bookingsRef = collection(db, 'bookings')
    const q = query(bookingsRef)
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData: Array<{ booking: Booking; sortKey: number }> = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        const serviceDisplayName = data.serviceName || data.service || data.serviceId || 'N/A'
        const serviceInfo = getServiceInfo(serviceDisplayName, data.serviceId)
        
        const booking: Booking = {
          id: doc.id,
          bookingId: data.bookingId || `BK${Date.now()}`,
          clientName: data.name || data.clientName || 'N/A',
          clientEmail: data.email || data.clientEmail || 'N/A',
          clientPhone: data.phone || data.clientPhone || 'N/A',
          clientAddress: data.area || data.location || data.clientAddress || 'N/A',
          serviceName: serviceInfo.name,
          serviceId: serviceInfo.id || data.serviceId || '',
          bookingDate:
            (typeof data.date === 'string' && data.date) ||
            (typeof data.bookingDate === 'string' && data.bookingDate) ||
            formatFirebaseTimestamp(data.date || data.bookingDate),
          bookingTime:
            (typeof data.time === 'string' && data.time) ||
            (typeof data.bookingTime === 'string' && data.bookingTime) ||
            '00:00',
          bookingNumber: data.bookingId || `BK${Date.now()}`,
          duration: serviceInfo.duration,
          estimatedPrice: serviceInfo.price,
          status: (data.status || 'pending') as Booking['status'],
          notes: data.message || data.notes || '',
          propertyType: data.propertyType || '',
          frequency: data.frequency || 'once',
          createdAt: formatFirebaseTimestamp(data.createdAt),
          updatedAt: formatFirebaseTimestamp(data.updatedAt),
          clientId: data.clientId || '',
          lastStatusChangedBy: data.lastStatusChangedBy || '',
          lastStatusChangeAt: data.lastStatusChangeAt ? formatFirebaseTimestamp(data.lastStatusChangeAt) : '',
          lastStatusChange: data.lastStatusChange || null
        }

        const createdAtSortKey =
          data.createdAt?.toDate?.()?.getTime?.() ||
          (data.createdAt?.seconds ? data.createdAt.seconds * 1000 : 0)

        const fallbackDateTime = Date.parse(`${booking.bookingDate}T${booking.bookingTime || '00:00'}:00`)
        const sortKey = Number.isFinite(createdAtSortKey) && createdAtSortKey > 0
          ? createdAtSortKey
          : (Number.isFinite(fallbackDateTime) ? fallbackDateTime : 0)

        bookingsData.push({ booking, sortKey })
      })

      bookingsData.sort((a, b) => b.sortKey - a.sortKey)
      setBookings(bookingsData.map((entry) => entry.booking))
    }, (error) => {
      console.error('Error fetching bookings:', error)
    })
    
    return () => unsubscribe()
  }, [])

  const fetchServices = async () => {
    try {
      const servicesRef = collection(db, 'services')
      const q = query(servicesRef, where('status', '==', 'ACTIVE'), where('type', '==', 'SERVICE'))
      const querySnapshot = await getDocs(q)
      
      const servicesData: Service[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        servicesData.push({
          id: doc.id,
          name: data.name || 'Unknown Service',
          categoryId: data.categoryId || '',
          categoryName: data.categoryName || 'Uncategorized',
          price: data.price || 0,
          cost: data.cost || 0,
          duration: data.duration ? Math.ceil(data.duration / 60) : 2, // Convert minutes to hours
          description: data.description || '',
          status: data.status || 'ACTIVE',
          type: data.type || 'SERVICE',
          sku: data.sku || '',
          imageUrl: data.imageUrl || ''
        })
      })
      
      setServices(servicesData)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, 'employees')
      const q = query(employeesRef, where('status', '==', 'Active'))
      const querySnapshot = await getDocs(q)
      
      const employeesData: Employee[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        employeesData.push({
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          role: data.role || '',
          department: data.department || '',
          status: data.status || 'Active'
        })
      })
      
      setEmployees(employeesData)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const getServiceInfo = (
    serviceValue: string,
    serviceId?: string
  ): { id: string; name: string; price: number; duration: number } => {
    const currentServices = servicesRef.current
    const normalizedValue = (serviceValue || '').toLowerCase().trim()
    const normalizedServiceId = (serviceId || '').toLowerCase().trim()

    let service =
      currentServices.find(s => s.id.toLowerCase() === normalizedServiceId) ||
      currentServices.find(s => s.id.toLowerCase() === normalizedValue) ||
      currentServices.find(s => s.name.toLowerCase() === normalizedValue)

    if (!service && normalizedValue) {
      service = currentServices.find(
        s => normalizedValue.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(normalizedValue)
      )
    }

    if (!service) {
      return {
        id: serviceId || '',
        name: serviceValue || 'N/A',
        price: 0,
        duration: 2
      }
    }
    
    return {
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration || 2
    }
  }

  const formatFirebaseTimestamp = (timestamp: FirebaseTimestampInput): string => {
    if (!timestamp) return new Date().toISOString().split('T')[0]
    if (typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toISOString().split('T')[0]
    }
    if (typeof timestamp === 'object' && 'seconds' in timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000).toISOString().split('T')[0]
    }
    if (timestamp instanceof Date) return timestamp.toISOString().split('T')[0]
    if (typeof timestamp === 'number') return new Date(timestamp).toISOString().split('T')[0]
    if (typeof timestamp === 'string') return timestamp
    return new Date().toISOString().split('T')[0]
  }

  const toSafeDate = (value: unknown, fallback = new Date()): Date => {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? fallback : value
    }

    if (value && typeof value === 'object') {
      const maybe = value as { toDate?: () => Date; seconds?: number }
      if (typeof maybe.toDate === 'function') {
        const fromToDate = maybe.toDate()
        return Number.isNaN(fromToDate.getTime()) ? fallback : fromToDate
      }
      if (typeof maybe.seconds === 'number') {
        const fromSeconds = new Date(maybe.seconds * 1000)
        return Number.isNaN(fromSeconds.getTime()) ? fallback : fromSeconds
      }
    }

    if (typeof value === 'number') {
      const fromNumber = new Date(value)
      return Number.isNaN(fromNumber.getTime()) ? fallback : fromNumber
    }

    if (typeof value === 'string' && value.trim()) {
      const fromString = new Date(value)
      return Number.isNaN(fromString.getTime()) ? fallback : fromString
    }

    return fallback
  }

  // Calendar Functions
  const generateTimeSlots = () => {
    const slots = []
    const startTime = new Date(selectedDate)
    startTime.setHours(businessHours.start, 0, 0, 0)

    const endTime = new Date(selectedDate)
    endTime.setHours(businessHours.end, 0, 0, 0)

    let currentTime = startTime
    while (currentTime < endTime) {
      const hour = currentTime.getHours()
      if (!hiddenHours.includes(hour)) {
        slots.push(format(currentTime, 'HH:mm'))
      }
      currentTime = addMinutes(currentTime, timeSlotGap)
    }

    return slots
  }

  const timeSlots = useMemo(() => generateTimeSlots(), [selectedDate, businessHours, timeSlotGap, hiddenHours])

  const filteredAppointments = useMemo(() => 
    bookings.filter(apt => {
      const aptDate = toSafeDate(apt.bookingDate, selectedDate)
      const matchesDate = isSameDay(aptDate, selectedDate)
      const matchesService = selectedService === 'all' || apt.serviceId === selectedService || apt.serviceName === selectedService
      return matchesDate && matchesService
    }),
    [bookings, selectedDate, selectedService]
  )

  const convertTo24Hour = (timeValue: unknown): string => {
    const time12h = String(timeValue ?? '').trim()
    if (!time12h) return "00:00"
    if (time12h.includes(':') && !time12h.includes(' ')) return time12h
    if (!time12h.includes(' ')) return time12h
    
    const [time, period] = time12h.split(' ')
    const [hours, minutes] = time.split(':')
    let hour24 = parseInt(hours)
    
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    else if (period === 'AM' && hour24 === 12) hour24 = 0
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`
  }

  const parseDuration = (duration: number): number => {
    return duration * 60 // Convert hours to minutes
  }

  const doesAppointmentCoverSlot = (appointment: Booking, slot: string): boolean => {
    const appointmentTime24 = convertTo24Hour(appointment.bookingTime)
    const appointmentDuration = parseDuration(appointment.duration)
    
    const [slotHours, slotMinutes] = slot.split(':').map(Number)
    const [aptHours, aptMinutes] = appointmentTime24.split(':').map(Number)
    
    const slotStartMinutes = slotHours * 60 + slotMinutes
    const slotEndMinutes = slotStartMinutes + timeSlotGap
    const appointmentStartMinutes = aptHours * 60 + aptMinutes
    const appointmentEndMinutes = appointmentStartMinutes + appointmentDuration
    
    return (appointmentStartMinutes < slotEndMinutes) && (appointmentEndMinutes > slotStartMinutes)
  }

  const getAppointmentsForSlot = (timeSlot: string): Booking[] => {
    return filteredAppointments.filter(apt => doesAppointmentCoverSlot(apt, timeSlot))
  }

  const isAppointmentStart = (appointment: Booking, timeSlot: string): boolean => {
    const appointmentTime24 = convertTo24Hour(appointment.bookingTime)
    const [aptHours, aptMinutes] = appointmentTime24.split(':').map(Number)
    const appointmentStartMinutes = aptHours * 60 + aptMinutes
    
    const [slotHours, slotMinutes] = timeSlot.split(':').map(Number)
    const slotStartMinutes = slotHours * 60 + slotMinutes
    const slotEndMinutes = slotStartMinutes + timeSlotGap
    
    return appointmentStartMinutes >= slotStartMinutes && appointmentStartMinutes < slotEndMinutes
  }

  const getAppointmentSpan = (appointment: Booking): number => {
    const appointmentTime24 = convertTo24Hour(appointment.bookingTime)
    const duration = parseDuration(appointment.duration)
    const [aptHours, aptMinutes] = appointmentTime24.split(':').map(Number)
    const appointmentStartMinutes = aptHours * 60 + aptMinutes
    const appointmentEndMinutes = appointmentStartMinutes + duration
    
    let startSlotIndex = -1
    for (let i = 0; i < timeSlots.length; i++) {
      const [h, m] = timeSlots[i].split(':').map(Number)
      const slotStart = h * 60 + m
      const slotEnd = slotStart + timeSlotGap
      
      if (appointmentStartMinutes >= slotStart && appointmentStartMinutes < slotEnd) {
        startSlotIndex = i
        break
      }
    }
    
    if (startSlotIndex === -1) return 1
    
    let span = 0
    for (let i = startSlotIndex; i < timeSlots.length; i++) {
      const [h, m] = timeSlots[i].split(':').map(Number)
      const slotStart = h * 60 + m
      
      if (slotStart < appointmentEndMinutes) {
        span++
      } else {
        break
      }
    }
    
    return span || 1
  }

  const getStatusColor = (status: string): string => {
    return calendarStatusColors[status as keyof typeof calendarStatusColors] || 'bg-gray-500'
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => direction === 'next' ? addDays(prev, 1) : addDays(prev, -1))
  }

  const toggleHiddenHour = (hour: number) => {
    setHiddenHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    )
  }

  const resetHiddenHours = () => setHiddenHours([])

  const filteredAndSortedBookings = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim()
    const safeLower = (value: unknown) => String(value ?? '').toLowerCase()
    const safeDateMs = (value: unknown) => toSafeDate(value, new Date(0)).getTime()
    const safeNumber = (value: unknown) => {
      const num = Number(value)
      return Number.isFinite(num) ? num : 0
    }
    const toMinutes = (value: string) => {
      if (!value) return null
      const [hours, minutes] = value.split(':').map(Number)
      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
      return hours * 60 + minutes
    }

    const filterFrom = toMinutes(timeFrom)
    const filterTo = toMinutes(timeTo)

    const filtered = bookings.filter(booking => {
      const matchesSearch = 
        safeLower(booking.clientName).includes(normalizedSearch) ||
        safeLower(booking.serviceName).includes(normalizedSearch) ||
        safeLower(booking.bookingNumber).includes(normalizedSearch) ||
        safeLower(booking.clientEmail).includes(normalizedSearch)
      
      const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus

      const bookingTime24 = convertTo24Hour(booking.bookingTime)
      const bookingMinutes = toMinutes(bookingTime24) ?? 0
      const matchesTime =
        (filterFrom === null || bookingMinutes >= filterFrom) &&
        (filterTo === null || bookingMinutes <= filterTo)
      
      return matchesSearch && matchesStatus && matchesTime
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created-desc': return safeDateMs(b.createdAt) - safeDateMs(a.createdAt)
        case 'created-asc': return safeDateMs(a.createdAt) - safeDateMs(b.createdAt)
        case 'date-desc': return safeDateMs(b.bookingDate) - safeDateMs(a.bookingDate)
        case 'date-asc': return safeDateMs(a.bookingDate) - safeDateMs(b.bookingDate)
        case 'price-desc': return safeNumber(b.estimatedPrice) - safeNumber(a.estimatedPrice)
        case 'price-asc': return safeNumber(a.estimatedPrice) - safeNumber(b.estimatedPrice)
        case 'name-asc': return safeLower(a.clientName).localeCompare(safeLower(b.clientName))
        case 'name-desc': return safeLower(b.clientName).localeCompare(safeLower(a.clientName))
        default: return 0
      }
    })

    return filtered
  }, [bookings, searchTerm, selectedStatus, sortBy, timeFrom, timeTo])

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    revenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.estimatedPrice, 0)
  }

  // Updated status change handler with team member selection
  const handleStatusChangeWithTeamMember = (bookingId: string, newStatus: Booking['status']) => {
    // Agar status pending hai toh direct update kar do
    if (newStatus === 'pending') {
      updateBookingStatus(bookingId, newStatus, 'System')
      return
    }

    // Keep status updates functional even when no employees are configured.
    if (employees.length === 0) {
      updateBookingStatus(bookingId, newStatus, 'Admin')
      return
    }
    
    // Warna team member select karne ka modal dikhao
    setCurrentBookingId(bookingId)
    setPendingStatusChange(newStatus)
    setShowTeamDropdown(true)
  }

  // Actual status update function
  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status'], teamMemberName: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId)
      const bookingRef = doc(db, 'bookings', bookingId)
      
      const updateData: Record<string, unknown> = {
        status: newStatus,
        updatedAt: Timestamp.now(),
        lastStatusChangedBy: teamMemberName,
        lastStatusChangeAt: Timestamp.now(),
        lastStatusChange: {
          from: booking?.status || 'unknown',
          to: newStatus,
          by: teamMemberName,
          timestamp: Timestamp.now()
        }
      }
      
      await updateDoc(bookingRef, updateData)
      
      // Update local state
      setBookings(bookings.map(b =>
        b.id === bookingId ? { 
          ...b, 
          status: newStatus, 
          updatedAt: new Date().toISOString().split('T')[0],
          lastStatusChangedBy: teamMemberName,
          lastStatusChangeAt: new Date().toISOString(),
          lastStatusChange: {
            from: b.status,
            to: newStatus,
            by: teamMemberName,
            timestamp: new Date()
          }
        } : b
      ))
      
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus })
      }
      
      // AUTO-CREATE CLIENT when booking is accepted or confirmed
      if ((newStatus === 'accepted' || newStatus === 'confirmed') && booking) {
        try {
          // Check if client with this email already exists in clients collection
          const clientsRef = collection(db, 'clients')
          const q = query(clientsRef, where('email', '==', booking.clientEmail))
          const querySnapshot = await getDocs(q)
          
          // Only create new client if no existing client found
          if (querySnapshot.empty) {
            // Prepare client data with exact fields as specified
            const clientData = {
              company: booking.clientName,
              contracts: [],
              createdAt: new Date().toISOString(),
              email: booking.clientEmail,
              joinDate: new Date().toISOString().split('T')[0],
              lastService: booking.serviceName,
              location: booking.clientAddress || 'Not specified',
              name: booking.clientName,
              notes: `Auto-created from booking: ${booking.serviceName} on ${booking.bookingDate}`,
              phone: booking.clientPhone,
              projects: 1,
              status: 'Active',
              tier: 'Bronze',
              totalSpent: booking.estimatedPrice,
              updatedAt: new Date().toISOString()
            }
            
            // Add new client to Firebase
            const docRef = await addDoc(collection(db, 'clients'), clientData)
            console.log('New client created with ID:', docRef.id)
            
            // Update the booking with client reference
            await updateDoc(bookingRef, {
              clientId: docRef.id,
              clientCreatedAt: Timestamp.now()
            })
          } else {
            // Client already exists - update their info
            const existingClientDoc = querySnapshot.docs[0]
            const clientRef = doc(db, 'clients', existingClientDoc.id)
            
            // Get current client data
            const currentData = existingClientDoc.data()
            
            // Update client with new booking info
            await updateDoc(clientRef, {
              lastService: booking.serviceName,
              projects: (currentData.projects || 0) + 1,
              totalSpent: (currentData.totalSpent || 0) + booking.estimatedPrice,
              updatedAt: new Date().toISOString()
            })
            
            // Update booking with existing client reference
            await updateDoc(bookingRef, {
              clientId: existingClientDoc.id,
              clientUpdatedAt: Timestamp.now()
            })
          }
        } catch (clientError) {
          console.error('Error in client creation/update:', clientError)
        }
      }
      
      setShowTeamDropdown(false)
      setCurrentBookingId('')
      setPendingStatusChange(null)
      
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Status update failed!')
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId))
        setBookings(bookings.filter(b => b.id !== bookingId))
        setShowDetailsModal(false)
        setSelectedBooking(null)
      } catch (error) {
        console.error('Error deleting booking:', error)
        alert('Delete failed!')
      }
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setEditFormData({ ...booking })
    setShowDetailsModal(true)
    setIsEditingDetails(false)
  }

  const handleSaveEdits = async () => {
    if (!editFormData) return
    
    try {
      const bookingRef = doc(db, 'bookings', editFormData.id)
      await updateDoc(bookingRef, {
        name: editFormData.clientName,
        email: editFormData.clientEmail,
        phone: editFormData.clientPhone,
        area: editFormData.clientAddress,
        service: editFormData.serviceName,
        date: editFormData.bookingDate,
        time: editFormData.bookingTime,
        status: editFormData.status,
        message: editFormData.notes || '',
        updatedAt: Timestamp.now()
      })
      
      setBookings(bookings.map(b => b.id === editFormData.id ? editFormData : b))
      setSelectedBooking(editFormData)
      setIsEditingDetails(false)
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Update failed!')
    }
  }

  const statuses = ['all', 'pending', 'accepted', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected']
  const statusLabels = {
    all: 'All Bookings',
    pending: 'Pending',
    accepted: 'Accepted',
    confirmed: 'Confirmed',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Bookings Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
          {bookings.length} bookings, {services.length} services, {employees.length} team members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              showCalendar 
                ? 'bg-purple-600 text-white shadow-purple-500/20 hover:bg-purple-700' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? <LayoutGrid className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
            {showCalendar ? 'Show List View' : 'Show Calendar View'}
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
            onClick={() => {
              fetchServices()
              fetchEmployees()
            }}
          >
            <Download className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards - Hide when calendar is open */}
      {!showCalendar && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-950/30 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Pending</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Accepted</p>
                <p className="text-2xl font-black text-teal-600 mt-1">{stats.accepted}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-950/30 flex items-center justify-center shrink-0">
                <ThumbsUp className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Confirmed</p>
                <p className="text-2xl font-black text-blue-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">In Progress</p>
                <p className="text-2xl font-black text-purple-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                <ClockIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Completed</p>
                <p className="text-2xl font-black text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Cancelled</p>
                <p className="text-2xl font-black text-red-600 mt-1">{stats.cancelled}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Rejected</p>
                <p className="text-2xl font-black text-rose-600 mt-1">{stats.rejected}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center shrink-0">
                <ThumbsDown className="h-5 w-5 text-rose-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View - Full screen when active */}
      {showCalendar ? (
        <div className="bg-card border rounded-2xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-purple-600" />
              Service Booking Calendar
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredAppointments.length} bookings on {format(selectedDate, 'MMM dd, yyyy')})
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {/* Service Filter Dropdown */}
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-3 py-1.5 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all min-w-45"
              >
                <option value="all">All Services ({services.length})</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - AED {service.price} ({service.duration}h)
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLayoutMode('time-top')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    layoutMode === 'time-top' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Time View
                </button>
                <button
                  onClick={() => setLayoutMode('service-top')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    layoutMode === 'service-top' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                  Service View
                </button>
              </div>

              <select
                value={timeSlotGap.toString()}
                onChange={(e) => setTimeSlotGap(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium min-w-30 text-center px-2">
                  {format(selectedDate, 'MMM dd, yyyy')}
                </span>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {showSettings && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Hours</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={businessHours.start.toString()}
                      onChange={(e) => setBusinessHours(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                      className="px-3 py-1.5 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 6).map(hour => (
                        <option key={hour} value={hour}>
                          {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </option>
                      ))}
                    </select>
                    <span>to</span>
                    <select
                      value={businessHours.end.toString()}
                      onChange={(e) => setBusinessHours(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                      className="px-3 py-1.5 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 12).map(hour => (
                        <option key={hour} value={hour}>
                          {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Hidden Hours</label>
                    <button
                      onClick={resetHiddenHours}
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: businessHours.end - businessHours.start }, (_, i) => businessHours.start + i).map(hour => (
                      <button
                        key={hour}
                        onClick={() => toggleHiddenHour(hour)}
                        className={`w-12 h-8 text-xs rounded transition-colors ${
                          hiddenHours.includes(hour)
                            ? 'bg-red-500 text-white'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {hour > 12 ? `${hour - 12}P` : `${hour}A`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Grid */}
          <div className="overflow-x-auto overflow-y-auto max-h-150 w-full border rounded-lg">
            <div className="min-w-full" style={{ width: 'max-content' }}>
              {layoutMode === 'time-top' ? (
                <>
                  {/* Time Top Layout - Show all appointments in one row */}
                  <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `150px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}>
                   
                    {timeSlots.map(slot => (
                      <div key={slot} className="p-2 text-xs text-center font-medium bg-muted">
                        {slot}
                      </div>
                    ))}
                  </div>

                  {/* Single row for all appointments */}
                  <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `150px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}>
                    
                    
                    {timeSlots.map((slot, slotIndex) => {
                      const appointmentsInSlot = getAppointmentsForSlot(slot)
                      
                      if (appointmentsInSlot.length > 0) {
                        // Show the first appointment that starts at this slot
                        const startAppointment = appointmentsInSlot.find(apt => isAppointmentStart(apt, slot))
                        
                        if (startAppointment) {
                          const span = Math.min(getAppointmentSpan(startAppointment), timeSlots.length - slotIndex)
                          
                          return (
                            <div
                              key={`${slot}`}
                              className={`p-2 rounded cursor-pointer hover:shadow-md transition-all border-2 ${
                                startAppointment.status === 'completed' ? 'border-green-500' :
                                startAppointment.status === 'cancelled' ? 'border-red-500' :
                                startAppointment.status === 'rejected' ? 'border-rose-500' :
                                'border-purple-500'
                              } ${getStatusColor(startAppointment.status)}/10`}
                              style={{ gridColumn: `span ${span}` }}
                              onClick={() => handleViewDetails(startAppointment)}
                            >
                              <div className="flex flex-col text-xs">
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(startAppointment.status)}`} />
                                  <span className="font-bold truncate">{startAppointment.clientName}</span>
                                </div>
                                <div className="text-muted-foreground truncate">
                                  {startAppointment.serviceName}
                                </div>
                                <div className="text-muted-foreground text-[10px] mt-1">
                                  {startAppointment.bookingTime} - {startAppointment.duration}h
                                </div>
                                {startAppointment.lastStatusChangedBy && (
                                  <div className="mt-1 text-[8px] text-muted-foreground flex items-center gap-1">
                                    <User className="h-2 w-2" />
                                    <span className="truncate">by {startAppointment.lastStatusChangedBy}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }
                      }
                      
                      // Empty slot
                      return (
                        <div
                          key={`${slot}`}
                          className="p-2 border border-dashed border-muted-foreground/30 rounded bg-muted/5 min-h-20"
                        />
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* Service Top Layout - Show services in rows */}
                  <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `200px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}>
                    <div className="p-3 font-medium text-sm bg-muted sticky left-0">Services / Time</div>
                    {timeSlots.map(slot => (
                      <div key={slot} className="p-2 text-xs text-center font-medium bg-muted">
                        {slot}
                      </div>
                    ))}
                  </div>

                  {/* Filter services based on selection */}
                  {(selectedService === 'all' ? services : services.filter(s => s.id === selectedService)).map(service => (
                    <div key={service.id} className="grid gap-px bg-border" style={{ gridTemplateColumns: `200px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}>
                      <div className="p-3 bg-muted flex items-center gap-2 sticky left-0">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Scissors className="w-3 h-3 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{service.name}</div>
                          <div className="text-xs text-muted-foreground">
                            AED {service.price} • {service.duration}h
                          </div>
                        </div>
                      </div>

                      {timeSlots.map((slot, slotIndex) => {
                        // Find appointments for this service at this time slot
                        const serviceAppointments = filteredAppointments.filter(apt => 
                          (apt.serviceId === service.id || apt.serviceName === service.name) &&
                          doesAppointmentCoverSlot(apt, slot)
                        )
                        
                        const startAppointment = serviceAppointments.find(apt => isAppointmentStart(apt, slot))
                        
                        if (startAppointment) {
                          const span = Math.min(getAppointmentSpan(startAppointment), timeSlots.length - slotIndex)
                          
                          return (
                            <div
                              key={`${service.id}-${slot}`}
                              className={`p-2 rounded cursor-pointer hover:shadow-md transition-all border-2 ${
                                startAppointment.status === 'completed' ? 'border-green-500' :
                                startAppointment.status === 'cancelled' ? 'border-red-500' :
                                startAppointment.status === 'rejected' ? 'border-rose-500' :
                                'border-purple-500'
                              } ${getStatusColor(startAppointment.status)}/10`}
                              style={{ gridColumn: `span ${span}` }}
                              onClick={() => handleViewDetails(startAppointment)}
                            >
                              <div className="flex flex-col text-xs">
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(startAppointment.status)}`} />
                                  <span className="font-bold truncate">{startAppointment.clientName}</span>
                                </div>
                                <div className="text-muted-foreground text-[10px]">
                                  {startAppointment.bookingTime}
                                </div>
                                {startAppointment.lastStatusChangedBy && (
                                  <div className="mt-1 text-[8px] text-muted-foreground flex items-center gap-1">
                                    <User className="h-2 w-2" />
                                    <span className="truncate">by {startAppointment.lastStatusChangedBy}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }
                        
                        // Empty slot for this service
                        return (
                          <div
                            key={`${service.id}-${slot}`}
                            className="p-2 border border-dashed border-muted-foreground/30 rounded bg-muted/5 min-h-15"
                          />
                        )
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span>Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Rejected</span>
            </div>
          </div>

          {/* Services Info */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-4 h-4" />
              <span className="font-medium">Services from Firebase:</span> {services.length} active services
            </div>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {services.map(service => (
                <div key={service.id} className="px-2 py-1 bg-background rounded border text-xs flex items-center gap-1">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-green-600">AED {service.price}</span>
                  <span className="text-muted-foreground">({service.duration}h)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filters - Only show when calendar is closed */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by booking number, client name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                className="px-3 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                className="px-3 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {statusLabels[status as keyof typeof statusLabels]}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="created-desc">Latest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="date-desc">Booking Date: Newest</option>
              <option value="date-asc">Booking Date: Oldest</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredAndSortedBookings.length > 0 ? (
              filteredAndSortedBookings.map((booking) => {
                const StatusIcon = statusIcons[booking.status] || AlertCircle
                const safePrice = Number(booking.estimatedPrice)
                return (
                  <div
                    key={booking.id}
                    className="bg-card border rounded-2xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${statusColors[booking.status]}`}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-black text-foreground truncate">{booking.serviceName}</p>
                            <p className="text-xs text-muted-foreground">{booking.bookingNumber}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="text-foreground font-bold">{booking.clientName}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MailIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="text-muted-foreground truncate">{booking.clientEmail}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <PhoneIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="text-muted-foreground">{booking.clientPhone}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <LocationIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="text-muted-foreground truncate">{booking.clientAddress}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="text-muted-foreground">{booking.bookingDate}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="text-muted-foreground">{booking.bookingTime} ({booking.duration}h)</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Banknote className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="text-foreground font-bold">AED {(Number.isFinite(safePrice) ? safePrice : 0).toLocaleString()}</p>
                            </div>
                            <div className="relative">
                              <select
                                value={booking.status}
                                onChange={(e) => handleStatusChangeWithTeamMember(booking.id, e.target.value as Booking['status'])}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none outline-none transition-all cursor-pointer ${statusColors[booking.status]}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-2 border-amber-500">
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Notes</p>
                            <p className="text-sm text-muted-foreground">{booking.notes}</p>
                          </div>
                        )}

                        {/* Show client reference if exists */}
                        {booking.clientId && (
                          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Client ID: {booking.clientId}
                          </div>
                        )}

                        {/* Show who changed the status */}
                        {booking.lastStatusChangedBy && (
                          <div className="mt-2 text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-600 p-2 rounded-lg flex items-center gap-2">
                            <UserCheck className="h-3 w-3" />
                            <span>
                              <span className="font-bold">Last status changed by:</span> {booking.lastStatusChangedBy}
                            </span>
                            {booking.lastStatusChangeAt && (
                              <span className="text-muted-foreground text-[10px] ml-auto">
                                {new Date(booking.lastStatusChangeAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-950/30 rounded-lg text-blue-600 transition-colors"
                          title="View & edit details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-950/30 rounded-lg text-green-600 transition-colors"
                          title="Send message"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-lg text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="bg-card border rounded-2xl p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-bold">No bookings found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Team Member Selection Modal */}
      {showTeamDropdown && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-black">Select Team Member</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Who is changing this booking status to {pendingStatusChange}?
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {employees.length > 0 ? (
                  employees.map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        if (currentBookingId && pendingStatusChange) {
                          updateBookingStatus(currentBookingId, pendingStatusChange, emp.name)
                        }
                      }}
                      className="w-full p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all border-2 border-transparent hover:border-purple-500 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {emp.role} • {emp.department}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-bold">No employees found</p>
                    <p className="text-sm text-muted-foreground">Add employees in Employees section</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t bg-muted/30 flex justify-end">
              <button
                onClick={() => {
                  setShowTeamDropdown(false)
                  setCurrentBookingId('')
                  setPendingStatusChange(null)
                }}
                className="px-4 py-2 border rounded-lg font-bold text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal - Same for both views */}
      {showDetailsModal && selectedBooking && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Booking Details</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedBooking.bookingNumber}</p>
                {selectedBooking.clientId && (
                  <p className="text-xs text-green-600 mt-1">Client ID: {selectedBooking.clientId}</p>
                )}
                {selectedBooking.lastStatusChangedBy && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    Last changed by: {selectedBooking.lastStatusChangedBy}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Service</p>
                <p className="text-lg font-black">{editFormData.serviceName}</p>
              </div>

              <div>
                <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client Information
                </h3>
                <div className="space-y-3">
                  {isEditingDetails ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Full Name</label>
                        <input
                          type="text"
                          value={editFormData.clientName}
                          onChange={(e) => setEditFormData({ ...editFormData, clientName: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                        <input
                          type="email"
                          value={editFormData.clientEmail}
                          onChange={(e) => setEditFormData({ ...editFormData, clientEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Phone</label>
                        <input
                          type="tel"
                          value={editFormData.clientPhone}
                          onChange={(e) => setEditFormData({ ...editFormData, clientPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Address</label>
                        <input
                          type="text"
                          value={editFormData.clientAddress}
                          onChange={(e) => setEditFormData({ ...editFormData, clientAddress: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                          <p className="font-bold">{editFormData.clientName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                          <p className="font-bold">{editFormData.clientPhone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                        <p className="font-bold">{editFormData.clientEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Service Address</p>
                        <p className="font-bold">{editFormData.clientAddress}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </h3>
                <div className="space-y-3">
                  {isEditingDetails ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Date</label>
                        <input
                          type="date"
                          value={editFormData.bookingDate}
                          onChange={(e) => setEditFormData({ ...editFormData, bookingDate: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Time</label>
                        <input
                          type="time"
                          value={editFormData.bookingTime}
                          onChange={(e) => setEditFormData({ ...editFormData, bookingTime: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                          <p className="font-bold">{editFormData.bookingDate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Time</p>
                          <p className="font-bold">{editFormData.bookingTime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
                        <p className="font-bold">{editFormData.duration} hours</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimated Price</p>
                    <p className="text-xl font-black">AED {(Number.isFinite(Number(editFormData.estimatedPrice)) ? Number(editFormData.estimatedPrice) : 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as Booking['status'] })}
                      className={`w-full px-2 py-1 rounded-lg text-xs font-bold border-none outline-none cursor-pointer ${statusColors[editFormData.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black mb-3">Special Notes</h3>
                {isEditingDetails ? (
                  <textarea
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    placeholder="Add any special notes or requests..."
                    className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                  />
                ) : (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">{editFormData.notes || 'No notes added'}</p>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                <p>Created: {editFormData.createdAt}</p>
                <p>Updated: {editFormData.updatedAt}</p>
                {editFormData.lastStatusChangedBy && (
                  <p className="text-blue-600">
                    Last status changed by: {editFormData.lastStatusChangedBy} on {editFormData.lastStatusChangeAt}
                  </p>
                )}
                {editFormData.propertyType && <p>Property Type: {editFormData.propertyType}</p>}
                {editFormData.frequency && <p>Frequency: {editFormData.frequency}</p>}
              </div>
            </div>

            <div className="sticky bottom-0 bg-muted/50 border-t p-4 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteBooking(selectedBooking.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
              >
                Delete Booking
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-sm hover:bg-muted transition-colors"
                >
                  Close
                </button>
                {isEditingDetails ? (
                  <button
                    onClick={handleSaveEdits}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingDetails(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}