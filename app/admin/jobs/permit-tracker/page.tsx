'use client'

import { useState, useMemo } from 'react'
import { FileCheck, AlertTriangle, Clock, CheckCircle2, Calendar, Bell, Download, RefreshCw } from 'lucide-react'

export default function PermitTracker() {
  const [permits, setPermits] = useState<any[]>([
    {
      id: 1,
      jobId: 1,
      jobTitle: 'Office Deep Cleaning - Downtown Tower',
      permitType: 'Building Access Pass',
      issuer: 'Downtown Business Tower',
      issuedDate: '2025-01-15',
      expiryDate: '2025-01-20',
      status: 'Active',
      documentUrl: '/permits/building-access-001.pdf',
      autoReminder: true,
      reminderDaysBeforeExpiry: 2,
      verificationStatus: 'Verified',
      cost: 150
    },
    {
      id: 2,
      jobId: 2,
      jobTitle: 'Medical Facility Sanitization',
      permitType: 'Biohazard Permit',
      issuer: 'Emirates Medical Center',
      issuedDate: '2025-01-10',
      expiryDate: '2025-01-18',
      status: 'Expiring Soon',
      documentUrl: '/permits/biohazard-permit-001.pdf',
      autoReminder: true,
      reminderDaysBeforeExpiry: 3,
      verificationStatus: 'Pending',
      cost: 500
    },
    {
      id: 3,
      jobId: 2,
      jobTitle: 'Medical Facility Sanitization',
      permitType: 'Medical Facility Authorization',
      issuer: 'Ministry of Health',
      issuedDate: '2025-01-12',
      expiryDate: '2025-12-31',
      status: 'Active',
      documentUrl: '/permits/medical-auth-001.pdf',
      autoReminder: true,
      reminderDaysBeforeExpiry: 7,
      verificationStatus: 'Verified',
      cost: 1000
    }
  ])

  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date('2025-01-17')
    const expiry = new Date(expiryDate)
    const diff = expiry.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-700'
      case 'Expired':
        return 'bg-red-100 text-red-700'
      case 'Pending':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'text-green-600 bg-green-50'
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'Rejected':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredPermits = useMemo(() => {
    return permits.filter(permit => {
      const matchesSearch =
        permit.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.permitType.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || permit.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [permits, searchTerm, filterStatus])

  const stats = useMemo(() => ({
    total: permits.length,
    active: permits.filter(p => p.status === 'Active').length,
    expiringSoon: permits.filter(p => p.status === 'Expiring Soon').length,
    expired: permits.filter(p => p.status === 'Expired').length,
    pendingVerification: permits.filter(p => p.verificationStatus === 'Pending').length
  }), [permits])

  const toggleAutoReminder = (permitId: number) => {
    setPermits(permits.map(permit =>
      permit.id === permitId ? { ...permit, autoReminder: !permit.autoReminder } : permit
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Permit Tracker</h1>
          <p className="text-muted-foreground">Auto-reminders, compliance tracking, and expiry forecasting</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
          <Download className="h-4 w-4" />
          Export Permits
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Permits</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Pending Verification</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pendingVerification}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Expired">Expired</option>
          <option value="Pending">Pending</option>
        </select>
        <input
          type="text"
          placeholder="Search permits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
        />
      </div>

      {/* Permits Table */}
      <div className="space-y-3">
        {filteredPermits.length > 0 ? (
          filteredPermits.map(permit => {
            const daysUntilExpiry = getDaysUntilExpiry(permit.expiryDate)
            const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0

            return (
              <div key={permit.id} className="bg-card border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{permit.permitType}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{permit.jobTitle}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded ${getStatusColor(permit.status)}`}>
                        {permit.status}
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded ${getVerificationColor(permit.verificationStatus)}`}>
                        {permit.verificationStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-600">{daysUntilExpiry}d</div>
                    <p className="text-xs text-muted-foreground">until expiry</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mb-3 pb-3 border-b">
                  <div>
                    <p className="text-muted-foreground">Issued</p>
                    <p className="font-semibold">{permit.issuedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expires</p>
                    <p className="font-semibold">{permit.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Issuer</p>
                    <p className="font-semibold">{permit.issuer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cost</p>
                    <p className="font-semibold">AED {permit.cost}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Renewal Reminder</p>
                    <p className="font-semibold">{permit.reminderDaysBeforeExpiry}d before</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permit.autoReminder}
                      onChange={() => toggleAutoReminder(permit.id)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      Auto-Reminder Enabled
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors">
                      View Document
                    </button>
                    {isExpiringSoon && (
                      <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                        Renew Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No permits found</p>
          </div>
        )}
      </div>

      {/* Expiry Forecast */}
      <div className="bg-card border rounded-lg p-4">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Expiry Forecast (Next 30 Days)
        </h2>
        <div className="space-y-2 text-sm">
          {permits.filter(p => getDaysUntilExpiry(p.expiryDate) > 0 && getDaysUntilExpiry(p.expiryDate) <= 30)
            .sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate))
            .map(permit => (
              <div key={permit.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <span>{permit.permitType}</span>
                <span className="text-yellow-600 font-semibold">{getDaysUntilExpiry(permit.expiryDate)} days left</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
