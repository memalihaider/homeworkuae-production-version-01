'use client'

import { useState, useMemo } from 'react'
import { AlertTriangle, CheckCircle2, Wrench, TrendingUp, Calendar, Package, Lock, RefreshCw } from 'lucide-react'

export default function EquipmentReadiness() {
  const [equipment, setEquipment] = useState<any[]>([
    {
      id: 1,
      name: 'Commercial Vacuum Cleaner',
      quantity: 5,
      available: 3,
      maintenanceStatus: 'Good',
      lastMaintenance: '2025-01-10',
      nextMaintenance: '2025-02-10',
      readyForService: true,
      utilizationRate: 60,
      averageDowntime: 2,
      bookings: [
        { jobId: 1, date: '2025-01-20', duration: '8h' },
        { jobId: 2, date: '2025-01-21', duration: '12h' }
      ]
    },
    {
      id: 2,
      name: 'Biohazard Sanitization Kit',
      quantity: 2,
      available: 1,
      maintenanceStatus: 'Maintenance Required',
      lastMaintenance: '2024-12-20',
      nextMaintenance: '2025-01-20',
      readyForService: false,
      utilizationRate: 95,
      averageDowntime: 5,
      bookings: [
        { jobId: 2, date: '2025-01-19', duration: '12h' }
      ]
    },
    {
      id: 3,
      name: 'Carpet Cleaning Machine',
      quantity: 3,
      available: 2,
      maintenanceStatus: 'Good',
      lastMaintenance: '2025-01-05',
      nextMaintenance: '2025-02-05',
      readyForService: true,
      utilizationRate: 45,
      averageDowntime: 1,
      bookings: [
        { jobId: 3, date: '2025-01-18', duration: '6h' }
      ]
    },
    {
      id: 4,
      name: 'Floor Waxing Equipment',
      quantity: 2,
      available: 0,
      maintenanceStatus: 'Critical - Repair Needed',
      lastMaintenance: '2024-11-15',
      nextMaintenance: '2025-01-25',
      readyForService: false,
      utilizationRate: 100,
      averageDowntime: 8,
      bookings: []
    }
  ])

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const getStatusColor = (status: string) => {
    if (status.includes('Critical')) return 'bg-red-100 text-red-700'
    if (status.includes('Maintenance')) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const getAvailabilityText = (available: number, quantity: number) => {
    if (available === 0) return 'Unavailable'
    if (available < quantity / 2) return 'Low Stock'
    return 'Available'
  }

  const getDaysUntilMaintenance = (nextDate: string) => {
    const today = new Date('2025-01-17')
    const next = new Date(nextDate)
    const diff = next.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  const filteredEquipment = useMemo(() => {
    return equipment.filter(item => {
      if (filterStatus === 'all') return true
      if (filterStatus === 'ready') return item.readyForService
      if (filterStatus === 'unavailable') return !item.readyForService
      if (filterStatus === 'lowstock') return item.available < item.quantity / 2
      return true
    })
  }, [equipment, filterStatus])

  const stats = useMemo(() => ({
    total: equipment.reduce((sum, e) => sum + e.quantity, 0),
    available: equipment.reduce((sum, e) => sum + e.available, 0),
    ready: equipment.filter(e => e.readyForService).length,
    maintenance: equipment.filter(e => !e.readyForService).length,
    averageUtilization: Math.round(equipment.reduce((sum, e) => sum + e.utilizationRate, 0) / equipment.length)
  }), [equipment])

  const upcomingMaintenanceList = useMemo(() => {
    return equipment
      .map(item => ({ ...item, daysUntil: getDaysUntilMaintenance(item.nextMaintenance) }))
      .filter(item => item.daysUntil >= 0 && item.daysUntil <= 7)
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }, [equipment])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Equipment Readiness</h1>
          <p className="text-muted-foreground">Availability forecasting and maintenance tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
          <RefreshCw className="h-4 w-4" />
          Schedule Maintenance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Equipment</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Available</p>
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Ready for Service</p>
          <p className="text-2xl font-bold text-blue-600">{stats.ready}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Maintenance Needed</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Avg. Utilization</p>
          <p className="text-2xl font-bold">{stats.averageUtilization}%</p>
        </div>
      </div>

      {/* Filters */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
      >
        <option value="all">All Equipment</option>
        <option value="ready">Ready for Service</option>
        <option value="unavailable">Needs Maintenance</option>
        <option value="lowstock">Low Stock</option>
      </select>

      {/* Equipment List */}
      <div className="space-y-3">
        {filteredEquipment.map(item => {
          const daysUntilMaintenance = getDaysUntilMaintenance(item.nextMaintenance)
          const isMaintenanceUrgent = daysUntilMaintenance <= 3

          return (
            <div key={item.id} className="bg-card border rounded-lg overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded ${getStatusColor(item.maintenanceStatus)}`}>
                        {item.maintenanceStatus}
                      </span>
                      <span className="text-muted-foreground">
                        {item.available}/{item.quantity} available
                      </span>
                    </div>
                  </div>
                  {item.readyForService ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className={`h-full rounded-full ${
                          item.utilizationRate > 80
                            ? 'bg-red-600'
                            : item.utilizationRate > 50
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                        }`}
                        style={{ width: `${item.utilizationRate}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground mt-1">{item.utilizationRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Maintenance</p>
                    <p className={`font-semibold mt-1 ${isMaintenanceUrgent ? 'text-red-600' : ''}`}>
                      {daysUntilMaintenance > 0 ? `${daysUntilMaintenance}d` : 'Overdue'}
                    </p>
                  </div>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="border-t p-4 space-y-4">
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Total Units</p>
                      <p className="font-semibold">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Available</p>
                      <p className="font-semibold text-green-600">{item.available}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Last Maintenance</p>
                      <p className="font-semibold">{item.lastMaintenance}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Next Maintenance</p>
                      <p className={`font-semibold ${isMaintenanceUrgent ? 'text-red-600' : ''}`}>
                        {item.nextMaintenance}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Avg. Downtime</p>
                      <p className="font-semibold">{item.averageDowntime} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Status</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${getStatusColor(item.maintenanceStatus)}`}>
                        {item.maintenanceStatus}
                      </span>
                    </div>
                  </div>

                  {/* Bookings */}
                  {item.bookings.length > 0 && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-semibold mb-2">Upcoming Bookings</h4>
                      <div className="space-y-2">
                        {item.bookings.map((booking: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                            <span>Job {booking.jobId}</span>
                            <span className="text-muted-foreground">{booking.date} - {booking.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability Forecast */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Availability Forecast
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.available > 0
                        ? `${item.available} unit${item.available > 1 ? 's' : ''} available for deployment`
                        : 'No units available - scheduled maintenance in progress'}
                    </p>
                  </div>

                  {/* Actions */}
                  {!item.readyForService && (
                    <button className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Prevent Job Assignment
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Upcoming Maintenance Alert */}
      {upcomingMaintenanceList.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-sm text-yellow-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Maintenance Reminders (Next 7 Days)
          </h3>
          <div className="space-y-2">
            {upcomingMaintenanceList.map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-yellow-900">{item.name}</span>
                <span className="text-yellow-700 font-semibold">{item.daysUntil} days until scheduled maintenance</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
