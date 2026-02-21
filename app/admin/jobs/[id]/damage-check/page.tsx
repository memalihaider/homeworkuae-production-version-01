'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  Camera,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Save,
  MapPin,
  Clock,
  User,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface DamageReport {
  id: string
  location: string
  type: 'property' | 'equipment' | 'client_belongings' | 'other'
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  description: string
  reportedBy: string
  timestamp: string
  status: 'reported' | 'investigating' | 'resolved'
  photos: string[]
  notes?: string
  resolution?: string
}

export default function DamageCheck() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  // Mock job data
  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    location: 'Downtown, Dubai'
  }

  const [damageReports, setDamageReports] = useState<DamageReport[]>([
    {
      id: '1',
      location: 'Floor 15 - Conference Room A',
      type: 'property',
      severity: 'minor',
      description: 'Small scratch on mahogany conference table during cleaning',
      reportedBy: 'Fatima Al-Mazrouei',
      timestamp: '2025-01-20 11:30',
      status: 'resolved',
      photos: ['damage_001.jpg', 'damage_002.jpg'],
      notes: 'Client approved repair. Repair completed with touch-up paint.',
      resolution: 'Repaired with matching wood filler and stain. Client satisfied.'
    },
    {
      id: '2',
      location: 'Floor 8 - Office 812',
      type: 'client_belongings',
      severity: 'moderate',
      description: 'Coffee stain on client\'s desk chair during floor cleaning',
      reportedBy: 'Ahmed Hassan',
      timestamp: '2025-01-20 10:15',
      status: 'investigating',
      photos: ['stain_001.jpg'],
      notes: 'Professional cleaning service contacted. Awaiting quote.'
    }
  ])

  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<DamageReport | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const [newReport, setNewReport] = useState({
    location: '',
    type: 'property' as DamageReport['type'],
    severity: 'minor' as DamageReport['severity'],
    description: '',
    photos: [] as string[]
  })

  const handleCreateReport = useCallback(() => {
    const report: DamageReport = {
      id: Date.now().toString(),
      ...newReport,
      reportedBy: 'Current User',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'reported'
    }
    setDamageReports(prev => [report, ...prev])
    setNewReport({
      location: '',
      type: 'property',
      severity: 'minor',
      description: '',
      photos: []
    })
    setShowReportModal(false)
  }, [newReport])

  const handleViewDetails = useCallback((report: DamageReport) => {
    setSelectedReport(report)
    setShowDetailsModal(true)
  }, [])

  const handleStatusUpdate = useCallback((reportId: string, status: DamageReport['status']) => {
    setDamageReports(prev => prev.map(report =>
      report.id === reportId ? { ...report, status } : report
    ))
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'major':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'minor':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'investigating':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'reported':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property':
        return '🏢'
      case 'equipment':
        return '🔧'
      case 'client_belongings':
        return '💼'
      default:
        return '⚠️'
    }
  }

  const totalReports = damageReports.length
  const resolvedReports = damageReports.filter(r => r.status === 'resolved').length
  const criticalReports = damageReports.filter(r => r.severity === 'critical' || r.severity === 'major').length

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
            <h1 className="text-2xl font-bold text-gray-900">Damage Check</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{resolvedReports}/{totalReports} Resolved</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            Report Damage
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold text-gray-600">Total Reports</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalReports}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-gray-600">Resolved</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{resolvedReports}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-bold text-gray-600">Investigating</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{damageReports.filter(r => r.status === 'investigating').length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-bold text-gray-600">Critical/Major</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{criticalReports}</div>
        </div>
      </div>

      {/* Damage Reports */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Damage Reports</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {damageReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-2xl">{getTypeIcon(report.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{report.description}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {report.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {report.reportedBy}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {report.timestamp}
                      </div>
                    </div>

                    {report.photos.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Photos ({report.photos.length})</div>
                        <div className="flex gap-2">
                          {report.photos.slice(0, 3).map((photo, i) => (
                            <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Camera className="w-6 h-6 text-gray-500" />
                            </div>
                          ))}
                          {report.photos.length > 3 && (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                              +{report.photos.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {report.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                        <div className="text-sm font-bold text-gray-700 mb-1">Notes:</div>
                        <div className="text-sm text-gray-600">{report.notes}</div>
                      </div>
                    )}

                    {report.resolution && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-sm font-bold text-green-700 mb-1">Resolution:</div>
                        <div className="text-sm text-gray-700">{report.resolution}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(report)}
                    className="px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    Details
                  </button>
                  {report.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusUpdate(report.id, 'resolved')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Damage Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Report Damage</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newReport.location}
                  onChange={(e) => setNewReport(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Floor 15 - Conference Room A"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value as DamageReport['type'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="property">Property Damage</option>
                  <option value="equipment">Equipment Damage</option>
                  <option value="client_belongings">Client Belongings</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Severity</label>
                <select
                  value={newReport.severity}
                  onChange={(e) => setNewReport(prev => ({ ...prev, severity: e.target.value as DamageReport['severity'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the damage..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Report Damage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Damage Report Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Location</div>
                    <div className="text-sm font-bold text-gray-900">{selectedReport.location}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Type</div>
                    <div className="text-sm font-bold text-gray-900">{selectedReport.type.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Severity</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getSeverityColor(selectedReport.severity)}`}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Description</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Reported By</div>
                    <div className="text-sm font-bold text-gray-900">{selectedReport.reportedBy}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Timestamp</div>
                    <div className="text-sm font-bold text-gray-900">{selectedReport.timestamp}</div>
                  </div>
                </div>

                {selectedReport.notes && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Notes</div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.notes}</div>
                  </div>
                )}

                {selectedReport.resolution && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Resolution</div>
                    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">{selectedReport.resolution}</div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}