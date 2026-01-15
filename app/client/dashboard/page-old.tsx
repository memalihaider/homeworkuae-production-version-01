'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Plus, 
  Star, 
  TrendingUp,
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Zap,
  Bell,
  Award,
  BarChart3
} from 'lucide-react'

interface Booking {
  id: string
  service: string
  date: string
  time: string
  status: 'Confirmed' | 'Scheduled' | 'Completed'
  location: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'booking' | 'invoice' | 'tip' | 'alert'
  date: string
}

export default function ClientDashboard() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([])

  // Mock Data
  const upcomingBookings: Booking[] = [
    { id: 'J001', service: 'Deep Cleaning - Villa', date: 'Dec 22, 2025', time: '10:00 AM', status: 'Confirmed', location: 'Palm Jumeirah' },
    { id: 'J002', service: 'Regular Maintenance', date: 'Dec 29, 2025', time: '02:00 PM', status: 'Scheduled', location: 'Palm Jumeirah' }
  ]

  const recentInvoices = [
    { id: 'INV001', service: 'Deep Cleaning', amount: 'AED 1,200', date: 'Dec 15, 2025', status: 'Paid' },
    { id: 'INV002', service: 'Regular Cleaning', amount: 'AED 800', date: 'Dec 10, 2025', status: 'Paid' },
    { id: 'INV003', service: 'Carpet Cleaning', amount: 'AED 1,500', date: 'Dec 20, 2025', status: 'Pending' }
  ]

  const notifications: Notification[] = [
    { id: 'N1', title: 'Booking Confirmed', message: 'Your deep cleaning service on Dec 22 is confirmed', type: 'booking', date: 'Today' },
    { id: 'N2', title: 'Invoice Ready', message: 'Invoice INV003 is ready for payment', type: 'invoice', date: 'Today' },
    { id: 'N3', title: 'Special Tip', message: 'Save 15% on your next booking this week!', type: 'tip', date: 'Yesterday' }
  ]

  const stats = [
    { label: 'Total Bookings', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Upcoming Services', value: '2', icon: Clock, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Total Spent', value: 'AED 15,600', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ]

  const activityTimeline = [
    { date: 'Dec 22, 2025 - 10:00 AM', action: 'Deep Cleaning scheduled', status: 'upcoming' },
    { date: 'Dec 21, 2025 - 3:45 PM', action: 'Invoice INV003 created', status: 'completed' },
    { date: 'Dec 20, 2025 - 2:30 PM', action: 'Carpet Cleaning service completed', status: 'completed', rating: 4.8 },
    { date: 'Dec 18, 2025 - 11:00 AM', action: 'Regular Cleaning completed', status: 'completed', rating: 5.0 },
  ]

  // Handler Functions
  const handleBookNewService = useCallback(() => {
    alert('Redirecting to booking page...')
  }, [])

  const handleDismissNotification = useCallback((id: string) => {
    setDismissedNotifications(prev => [...prev, id])
  }, [])

  const handleViewAllBookings = useCallback(() => {
    alert('Navigating to bookings page...')
  }, [])

  const handleViewAllInvoices = useCallback(() => {
    alert('Navigating to invoices page...')
  }, [])

  const handleViewAllNotifications = useCallback(() => {
    setShowNotifications(!showNotifications)
  }, [showNotifications])

  const handleRescheduleBooking = useCallback((bookingId: string) => {
    alert(`Rescheduling booking ${bookingId}...`)
  }, [])

  const handlePayInvoice = useCallback((invoiceId: string) => {
    alert(`Processing payment for ${invoiceId}...`)
  }, [])

  const handleDownloadReport = useCallback(() => {
    alert('Downloading annual service report...')
  }, [])

  // Filtered notifications (exclude dismissed)
  const visibleNotifications = useMemo(() => {
    return notifications.filter(n => !dismissedNotifications.includes(n.id))
  }, [notifications, dismissedNotifications])

  // Stats calculations
  const dashboardStats = useMemo(() => ({
    totalBookings: 12,
    upcomingServices: 2,
    totalSpent: 15600,
    paidInvoices: recentInvoices.filter(i => i.status === 'Paid').length,
    pendingInvoices: recentInvoices.filter(i => i.status === 'Pending').length,
  }), [recentInvoices])

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'booking': return <Calendar className="h-4 w-4" />
      case 'invoice': return <CreditCard className="h-4 w-4" />
      case 'tip': return <Zap className="h-4 w-4" />
      case 'alert': return <AlertCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'booking': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
      case 'invoice': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      case 'tip': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
      case 'alert': return 'bg-red-100 text-red-700 dark:bg-red-900/30'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      case 'Scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
      case 'Completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Welcome back, Ahmed! 👋</h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your home services today.</p>
        </div>
        <button 
          onClick={handleBookNewService}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 w-fit"
        >
          <Plus className="h-5 w-5" />
          Book New Service
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Bookings & Invoices */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Bookings */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Bookings
              </h3>
              <button 
                onClick={handleViewAllBookings}
                className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-4 rounded-xl border bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-900/20 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-base">{booking.service}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {booking.location}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ml-2 ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {booking.time}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRescheduleBooking(booking.id)}
                        className="text-blue-600 font-medium hover:underline text-xs"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                  <button onClick={handleBookNewService} className="mt-3 text-blue-600 font-medium hover:underline">
                    Book a service
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Recent Invoices
              </h3>
              <button 
                onClick={handleViewAllInvoices}
                className="text-sm text-green-600 font-medium hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 rounded-xl border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{invoice.service}</p>
                      <p className="text-xs text-muted-foreground mt-1">{invoice.id} • {invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{invoice.amount}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full block mt-1 ${
                        invoice.status === 'Paid' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    {invoice.status === 'Pending' && (
                      <button 
                        onClick={() => handlePayInvoice(invoice.id)}
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                      >
                        Pay
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">No invoices</p>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-card rounded-2xl border shadow-sm p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Activity Timeline
            </h3>
            <div className="space-y-4">
              {activityTimeline.map((activity, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.status === 'upcoming' 
                        ? 'bg-blue-600' 
                        : 'bg-green-600'
                    }`} />
                    {idx < activityTimeline.length - 1 && (
                      <div className="absolute left-1/2 top-5 w-0.5 h-8 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-bold text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                    {activity.rating && (
                      <div className="mt-2 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold">{activity.rating}/5 rating</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Notifications ({visibleNotifications.length})
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map((notif) => (
                  <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notif.type)}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notif.type)}
                        <p className="font-bold text-sm">{notif.title}</p>
                      </div>
                      <button 
                        onClick={() => handleDismissNotification(notif.id)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">No notifications</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl border shadow-sm p-6 space-y-3">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <button className="w-full p-3 rounded-lg border hover:bg-muted transition-colors font-bold text-sm text-left">
              📅 View Calendar
            </button>
            <button className="w-full p-3 rounded-lg border hover:bg-muted transition-colors font-bold text-sm text-left">
              💬 Contact Support
            </button>
            <button 
              onClick={handleDownloadReport}
              className="w-full p-3 rounded-lg border hover:bg-muted transition-colors font-bold text-sm text-left"
            >
              📊 Download Report
            </button>
            <button className="w-full p-3 rounded-lg border hover:bg-muted transition-colors font-bold text-sm text-left">
              ⭐ Rate Services
            </button>
          </div>

          {/* Member Benefits */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl border border-purple-200 dark:border-purple-900 p-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Member Benefits
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                Save 15% on all services
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                Priority booking access
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                24/7 support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                Loyalty rewards
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
