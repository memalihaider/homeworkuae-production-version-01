'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  ShieldCheck,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  Save
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Permit {
  id: string
  name: string
  type: string
  authority: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  applicationDate: string
  expiryDate: string
  approvedDate?: string
  referenceNumber?: string
  documents: string[]
  notes?: string
  required: boolean
}

export default function PermitTracker() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  // Mock job data
  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    location: 'Downtown, Dubai'
  }

  const [permits, setPermits] = useState<Permit[]>([
    {
      id: '1',
      name: 'Building Access Permit',
      type: 'Access Permit',
      authority: 'Dubai Municipality',
      status: 'approved',
      applicationDate: '2025-01-15',
      expiryDate: '2025-01-25',
      approvedDate: '2025-01-16',
      referenceNumber: 'DM-2025-001234',
      documents: ['application_form.pdf', 'approval_letter.pdf'],
      required: true
    },
    {
      id: '2',
      name: 'Commercial Cleaning License',
      type: 'Business License',
      authority: 'Dubai Chamber of Commerce',
      status: 'approved',
      applicationDate: '2025-01-10',
      expiryDate: '2025-12-31',
      approvedDate: '2025-01-12',
      referenceNumber: 'DCC-2025-CL-5678',
      documents: ['license_certificate.pdf'],
      required: true
    },
    {
      id: '3',
      name: 'Height Work Permit',
      type: 'Safety Permit',
      authority: 'Dubai Civil Defense',
      status: 'pending',
      applicationDate: '2025-01-18',
      expiryDate: '2025-01-22',
      documents: ['safety_plan.pdf', 'equipment_cert.pdf'],
      notes: 'Awaiting safety inspection approval',
      required: true
    },
    {
      id: '4',
      name: 'Parking Permit',
      type: 'Parking Permit',
      authority: 'Dubai Police',
      status: 'approved',
      applicationDate: '2025-01-17',
      expiryDate: '2025-01-21',
      approvedDate: '2025-01-18',
      referenceNumber: 'DP-2025-PARK-9012',
      documents: ['parking_application.pdf'],
      required: false
    }
  ])

  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'expired':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
  }

  const handleViewDetails = useCallback((permit: Permit) => {
    setSelectedPermit(permit)
    setShowDetailsModal(true)
  }, [])

  const approvedCount = permits.filter(p => p.status === 'approved').length
  const pendingCount = permits.filter(p => p.status === 'pending').length
  const requiredCount = permits.filter(p => p.required).length
  const requiredApproved = permits.filter(p => p.required && p.status === 'approved').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/jobs/${jobId}`}
            className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Permit Tracker</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{approvedCount}/{permits.length} Approved</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(approvedCount / permits.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            requiredApproved === requiredCount ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {requiredApproved}/{requiredCount} Required
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-gray-600">Approved</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{approvedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-bold text-gray-600">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold text-gray-600">Rejected</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{permits.filter(p => p.status === 'rejected').length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-bold text-gray-600">Expiring Soon</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {permits.filter(p => {
              const expiry = new Date(p.expiryDate)
              const today = new Date()
              const diffTime = expiry.getTime() - today.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              return diffDays <= 7 && diffDays > 0
            }).length}
          </div>
        </div>
      </div>

      {/* Permits List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Permit Status</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {permits.map((permit) => (
            <div key={permit.id} className="p-6 hover:bg-gray-50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(permit.status)}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{permit.name}</h3>
                      {permit.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        {permit.authority}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {permit.type}
                      </span>
                      {permit.referenceNumber && (
                        <span className="flex items-center gap-1">
                          <span className="font-bold">Ref:</span>
                          {permit.referenceNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Expires</div>
                    <div className="text-sm font-bold text-gray-900">{permit.expiryDate}</div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(permit.status)}`}>
                    {permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
                  </span>

                  <button
                    onClick={() => handleViewDetails(permit)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {permit.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm font-bold text-gray-700 mb-1">Notes:</div>
                  <div className="text-sm text-gray-600">{permit.notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Permit Details Modal */}
      {showDetailsModal && selectedPermit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedPermit.status)}
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPermit.name}</h2>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Permit Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">Type</div>
                      <div className="text-sm font-bold text-gray-900">{selectedPermit.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">Authority</div>
                      <div className="text-sm font-bold text-gray-900">{selectedPermit.authority}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">Application Date</div>
                      <div className="text-sm font-bold text-gray-900">{selectedPermit.applicationDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">Expiry Date</div>
                      <div className="text-sm font-bold text-gray-900">{selectedPermit.expiryDate}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Status Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">Current Status</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(selectedPermit.status)}`}>
                        {selectedPermit.status.charAt(0).toUpperCase() + selectedPermit.status.slice(1)}
                      </span>
                    </div>
                    {selectedPermit.approvedDate && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Approved Date</div>
                        <div className="text-sm font-bold text-gray-900">{selectedPermit.approvedDate}</div>
                      </div>
                    )}
                    {selectedPermit.referenceNumber && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Reference Number</div>
                        <div className="text-sm font-bold text-gray-900">{selectedPermit.referenceNumber}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">Required</div>
                      <div className="text-sm font-bold text-gray-900">
                        {selectedPermit.required ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Documents</h3>
                <div className="space-y-2">
                  {selectedPermit.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900">{doc}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPermit.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-widest">Notes</h3>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">{selectedPermit.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}