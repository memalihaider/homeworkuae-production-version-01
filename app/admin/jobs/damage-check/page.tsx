'use client'

import { useState, useMemo } from 'react'
import { Camera, AlertTriangle, CheckCircle2, FileText, Download, MapPin, Clock } from 'lucide-react'

export default function DamageCheck() {
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      title: 'Office Deep Cleaning - Downtown Tower',
      status: 'In Progress',
      damageReports: [
        {
          id: 1,
          type: 'Carpet Stain',
          location: 'Conference Room A',
          severity: 'Medium',
          discoveryTime: '10:30 AM',
          description: 'Pre-existing stain on premium carpet',
          beforePhoto: '/damages/carpet-before.jpg',
          afterPhoto: null,
          status: 'Documented',
          estimatedRepairCost: 500,
          responsibility: 'Client',
          photoTimestamp: '2025-01-23 10:30:15',
          photoLocation: 'Conference Room A, Level 3'
        },
        {
          id: 2,
          type: 'Wall Damage',
          location: 'Hallway 2B',
          severity: 'Low',
          discoveryTime: '11:15 AM',
          description: 'Minor scuff mark on wall',
          beforePhoto: '/damages/wall-before.jpg',
          afterPhoto: null,
          status: 'Documented',
          estimatedRepairCost: 100,
          responsibility: 'Unknown',
          photoTimestamp: '2025-01-23 11:15:42',
          photoLocation: 'Hallway 2B, Level 2'
        }
      ]
    },
    {
      id: 2,
      title: 'Medical Facility Sanitization',
      status: 'In Progress',
      damageReports: [
        {
          id: 3,
          type: 'Equipment Damage',
          location: 'Isolation Ward',
          severity: 'High',
          discoveryTime: '08:45 AM',
          description: 'Damaged hospital bed frame',
          beforePhoto: '/damages/bed-before.jpg',
          afterPhoto: null,
          status: 'Escalated',
          estimatedRepairCost: 3500,
          responsibility: 'Facility',
          photoTimestamp: '2025-01-23 08:45:22',
          photoLocation: 'Isolation Ward, Medical Center'
        }
      ]
    }
  ])

  const [selectedJobId, setSelectedJobId] = useState(1)
  const [showNewDamageModal, setShowNewDamageModal] = useState(false)
  const [expandedDamageId, setExpandedDamageId] = useState<number | null>(null)

  const selectedJob = jobs.find(j => j.id === selectedJobId)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-700'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'Low':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Documented':
        return 'bg-blue-100 text-blue-700'
      case 'Escalated':
        return 'bg-red-100 text-red-700'
      case 'Resolved':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const stats = useMemo(() => {
    const allDamages = jobs.flatMap(j => j.damageReports || [])
    return {
      total: allDamages.length,
      high: allDamages.filter(d => d.severity === 'High').length,
      escalated: allDamages.filter(d => d.status === 'Escalated').length,
      totalCost: allDamages.reduce((sum, d) => sum + d.estimatedRepairCost, 0)
    }
  }, [jobs])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Damage Check & Documentation</h1>
          <p className="text-muted-foreground">Timestamped photo evidence with location tracking</p>
        </div>
        <button
          onClick={() => setShowNewDamageModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
        >
          <Camera className="h-4 w-4" />
          Report Damage
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Reports</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">High Severity</p>
          <p className="text-2xl font-bold text-red-600">{stats.high}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Escalated</p>
          <p className="text-2xl font-bold text-orange-600">{stats.escalated}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Estimated Cost</p>
          <p className="text-2xl font-bold text-pink-600">AED {stats.totalCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Job Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {jobs.map(job => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedJobId === job.id
                ? 'bg-pink-600 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {job.title.split(' - ')[0]}
          </button>
        ))}
      </div>

      {selectedJob && (
        <div className="space-y-3">
          {selectedJob.damageReports.length > 0 ? (
            selectedJob.damageReports.map((damage: any) => (
              <div key={damage.id} className="bg-card border rounded-lg overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedDamageId(expandedDamageId === damage.id ? null : damage.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${
                          damage.severity === 'High' ? 'text-red-600' :
                          damage.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        {damage.type}
                      </h3>
                      <p className="text-xs text-muted-foreground">{damage.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mb-1 ${getSeverityColor(damage.severity)}`}>
                        {damage.severity}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block ml-1 ${getStatusColor(damage.status)}`}>
                        {damage.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {damage.discoveryTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      GPS Tagged
                    </div>
                    <div className="text-pink-600 font-semibold">
                      AED {damage.estimatedRepairCost}
                    </div>
                  </div>
                </div>

                {expandedDamageId === damage.id && (
                  <div className="border-t p-4 space-y-4">
                    {/* Description */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{damage.description}</p>
                    </div>

                    {/* Photo Evidence */}
                    <div>
                      <p className="text-sm font-semibold mb-2">Photo Evidence</p>
                      <div className="grid grid-cols-2 gap-2">
                        {damage.beforePhoto && (
                          <div className="border rounded-lg overflow-hidden bg-muted">
                            <div className="aspect-square bg-gray-300 flex items-center justify-center">
                              <Camera className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-xs text-center p-2 text-muted-foreground">Before</p>
                          </div>
                        )}
                        {damage.afterPhoto && (
                          <div className="border rounded-lg overflow-hidden bg-muted">
                            <div className="aspect-square bg-gray-300 flex items-center justify-center">
                              <Camera className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-xs text-center p-2 text-muted-foreground">After</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Photo Metadata */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs">
                      <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Photo Metadata</p>
                      <div className="space-y-1 text-blue-700 dark:text-blue-400">
                        <p>📸 Timestamp: {damage.photoTimestamp}</p>
                        <p>📍 Location: {damage.photoLocation}</p>
                        <p>🔐 Verified: Yes</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Estimated Repair Cost</p>
                        <p className="font-semibold text-lg text-pink-600">AED {damage.estimatedRepairCost}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Responsibility</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${
                          damage.responsibility === 'Client' ? 'bg-orange-100 text-orange-700' :
                          damage.responsibility === 'Facility' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {damage.responsibility}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        View Full Image
                      </button>
                      {damage.status !== 'Resolved' && (
                        <button className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors font-medium">
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card border rounded-lg">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No damage reports for this job</p>
            </div>
          )}
        </div>
      )}

      {/* Damage Report Modal */}
      {showNewDamageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Report Damage</h2>
            <div className="space-y-4 mb-4">
              <input type="text" placeholder="Damage Type" className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none" />
              <input type="text" placeholder="Location" className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none" />
              <select className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none">
                <option>Low Severity</option>
                <option>Medium Severity</option>
                <option>High Severity</option>
              </select>
              <textarea placeholder="Description" className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none min-h-24" />
              <input type="number" placeholder="Estimated Cost (AED)" className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowNewDamageModal(false)} className="flex-1 px-3 py-2 border rounded-lg hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowNewDamageModal(false)} className="flex-1 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Report Damage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
