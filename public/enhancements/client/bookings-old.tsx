'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle,
  Edit2,
  Trash2,
  Check,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Phone,
  MessageSquare,
  Star,
  User,
  X
} from 'lucide-react'

interface Booking {
  id: string
  service: string
  date: string
  time: string
  status: 'Confirmed' | 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending'
  location: string
  address: string
  price: string
  team: string
  rating: number | null
  notes?: string
  contactPerson?: string
  phone?: string
  specialRequests?: string
}

export default function BookingHistory() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' })
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingForm, setRatingForm] = useState({ bookingId: '', rating: 0, comment: '' })
  const [showContactModal, setShowContactModal] = useState(false)

  const bookings = [
    { 
      id: 'J001', 
      service: 'Deep Cleaning - Villa', 
      date: 'Dec 22, 2025', 
      time: '10:00 AM', 
      status: 'Confirmed',
      location: 'Palm Jumeirah',
      address: 'Villa 45, Palm Jumeirah, Dubai',
      price: 'AED 1,200',
      team: 'Ahmad & Sarah',
      rating: null
    },
    { 
      id: 'J002', 
      service: 'Regular Maintenance', 
      date: 'Dec 29, 2025', 
      time: '02:00 PM', 
      status: 'Scheduled',
      location: 'Palm Jumeirah',
      address: 'Villa 45, Palm Jumeirah, Dubai',
      price: 'AED 800',
      team: 'Pending Assignment',
      rating: null
    },
    { 
      id: 'J003', 
      service: 'Carpet Cleaning', 
      date: 'Dec 15, 2025', 
      time: '03:00 PM', 
      status: 'Completed',
      location: 'Downtown Dubai',
      address: 'Apt 2401, Downtown Dubai',
      price: 'AED 450',
      team: 'Hassan & Omar',
      rating: 4.8
    },
    { 
      id: 'J004', 
      service: 'Window Cleaning', 
      date: 'Dec 8, 2025', 
      time: '09:00 AM', 
      status: 'Completed',
      location: 'Marina',
      address: 'Marina Tower, Dubai',
      price: 'AED 600',
      team: 'Fatima & Noor',
      rating: 5.0
    },
  ]

  const handleReschedule = (id: string) => {
    if (rescheduleDate && rescheduleTime) {
      alert(`Booking ${id} rescheduled to ${rescheduleDate} at ${rescheduleTime}`)
      setEditingId(null)
      setRescheduleDate('')
      setRescheduleTime('')
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-700'
      case 'Scheduled': return 'bg-blue-100 text-blue-700'
      case 'Completed': return 'bg-gray-100 text-gray-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const canReschedule = (status: string) => status === 'Confirmed' || status === 'Scheduled'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Booking History</h1>
        <p className="text-muted-foreground mt-1">Manage all your home service bookings in one place</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
          <p className="text-3xl font-black">12</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-3xl font-black text-green-600">8</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
          <p className="text-3xl font-black text-blue-600">2</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
          <p className="text-3xl font-black text-red-600">2</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{booking.service}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{booking.address}</p>
              </div>
              {booking.rating && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Your Rating</p>
                  <p className="text-lg font-black text-yellow-500">⭐ {booking.rating}</p>
                </div>
              )}
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  {booking.date}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {booking.time}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <MapPin className="h-4 w-4 text-green-600" />
                  {booking.location}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Service Team</p>
                <p className="text-sm font-bold">{booking.team}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-lg font-black text-green-600">{booking.price}</p>
              </div>
            </div>

            {/* Reschedule Section */}
            {editingId === booking.id && canReschedule(booking.status) && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-4">
                <p className="font-bold mb-3">Reschedule Booking</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input 
                    type="date" 
                    value={rescheduleDate} 
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900"
                  />
                  <input 
                    type="time" 
                    value={rescheduleTime} 
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleReschedule(booking.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Confirm Reschedule
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {canReschedule(booking.status) && (
                <button 
                  onClick={() => setEditingId(booking.id)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Reschedule
                </button>
              )}
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold text-sm transition-colors">
                View Details
              </button>
              {booking.status === 'Completed' && !booking.rating && (
                <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-bold text-sm transition-colors">
                  Rate Service
                </button>
              )}
              {canReschedule(booking.status) && (
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold text-sm flex items-center gap-2 transition-colors">
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Tracking Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900 dark:text-blue-100">Real-Time Job Tracking</p>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">For confirmed bookings, you'll receive live GPS updates and arrival notifications from our service team.</p>
        </div>
      </div>
    </div>
  )
}