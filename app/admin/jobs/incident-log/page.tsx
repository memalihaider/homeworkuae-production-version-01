'use client'

import { useState, useMemo } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle2, TrendingUp, Clock, DollarSign, Zap, Send } from 'lucide-react'

export default function IncidentLog() {
  const [incidents, setIncidents] = useState<any[]>([
    {
      id: 1,
      jobId: 1,
      jobTitle: 'Office Deep Cleaning - Downtown Tower',
      title: 'Damaged Wall Outlet',
      severity: 'High',
      type: 'Safety Hazard',
      reportedAt: '10:30 AM',
      reportedBy: 'Ahmed Hassan',
      description: 'Exposed wiring in conference room outlet discovered during cleaning',
      escalationLevel: 'Immediate',
      status: 'Escalated',
      costEstimate: 750,
      resolution: 'Facility maintenance called, area secured',
      timeToResolve: '45 minutes',
      actions: [
        { time: '10:30 AM', action: 'Incident reported', by: 'Ahmed Hassan' },
        { time: '10:32 AM', action: 'Supervisor notified', by: 'System' },
        { time: '10:35 AM', action: 'Area cordoned off', by: 'Ali Ahmed' },
        { time: '11:15 AM', action: 'Facility maintenance arrived', by: 'Building Manager' }
      ]
    },
    {
      id: 2,
      jobId: 1,
      jobTitle: 'Office Deep Cleaning - Downtown Tower',
      title: 'Spilled Chemical',
      severity: 'Medium',
      type: 'Environmental',
      reportedAt: '11:45 AM',
      reportedBy: 'Zainab Rashid',
      description: 'Small floor cleaner spill in break room - quickly contained',
      escalationLevel: 'Standard',
      status: 'Resolved',
      costEstimate: 150,
      resolution: 'Spill cleaned and documented, no hazard to personnel',
      timeToResolve: '15 minutes',
      actions: [
        { time: '11:45 AM', action: 'Incident reported', by: 'Zainab Rashid' },
        { time: '11:47 AM', action: 'Supervisor reviewed', by: 'Ahmed Hassan' },
        { time: '12:00 PM', action: 'Spill cleaned and verified', by: 'Zainab Rashid' }
      ]
    },
    {
      id: 3,
      jobId: 2,
      jobTitle: 'Medical Facility Sanitization',
      title: 'Missing Equipment',
      severity: 'Critical',
      type: 'Equipment Loss',
      reportedAt: '08:20 AM',
      reportedBy: 'Fatima Al Mansouri',
      description: 'Biohazard containment vessel missing - audit trail required',
      escalationLevel: 'Emergency',
      status: 'Escalated',
      costEstimate: 5000,
      resolution: 'Pending facility investigation',
      timeToResolve: null,
      actions: [
        { time: '08:20 AM', action: 'Incident reported', by: 'Fatima Al Mansouri' },
        { time: '08:22 AM', action: 'Immediate escalation', by: 'System' },
        { time: '08:25 AM', action: 'Facility director notified', by: 'Management' },
        { time: '08:30 AM', action: 'Security review initiated', by: 'Facility Security' }
      ]
    }
  ])

  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(1)
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showEscalationModal, setShowEscalationModal] = useState(false)

  const selectedIncident = selectedIncidentId ? incidents.find(i => i.id === selectedIncidentId) : null

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Low':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-700'
      case 'Escalated':
        return 'bg-red-100 text-red-700'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getEscalationIcon = (level: string) => {
    switch (level) {
      case 'Emergency':
        return '🚨'
      case 'Immediate':
        return '⚠️'
      case 'Standard':
        return 'ℹ️'
      default:
        return '📋'
    }
  }

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity
      const matchesStatus = filterStatus === 'all' || incident.status === filterStatus
      return matchesSeverity && matchesStatus
    })
  }, [incidents, filterSeverity, filterStatus])

  const stats = useMemo(() => ({
    total: incidents.length,
    critical: incidents.filter(i => i.severity === 'Critical').length,
    escalated: incidents.filter(i => i.status === 'Escalated').length,
    resolved: incidents.filter(i => i.status === 'Resolved').length,
    totalCost: incidents.reduce((sum, i) => sum + i.costEstimate, 0)
  }), [incidents])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Incident Log</h1>
          <p className="text-muted-foreground">Real-time issue escalation and cost estimation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
          <AlertTriangle className="h-4 w-4" />
          Report Incident
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Incidents</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Critical</p>
          <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Escalated</p>
          <p className="text-2xl font-bold text-orange-600">{stats.escalated}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Incident Costs</p>
          <p className="text-2xl font-bold text-pink-600">AED {stats.totalCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
        >
          <option value="all">All Severity</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
        >
          <option value="all">All Status</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
          <option value="In Progress">In Progress</option>
        </select>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Incidents Sidebar */}
        <div className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto">
          {filteredIncidents.map(incident => (
            <button
              key={incident.id}
              onClick={() => setSelectedIncidentId(incident.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedIncidentId === incident.id
                  ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-300 dark:border-pink-700'
                  : 'bg-card hover:bg-muted border-border'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{getEscalationIcon(incident.escalationLevel)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm line-clamp-1">{incident.title}</p>
                  <p className="text-xs text-muted-foreground">{incident.reportedAt}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${getSeverityColor(incident.severity).split(' ')[0]} ${getSeverityColor(incident.severity).split(' ')[1]}`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Incident Details */}
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <div className="bg-card border rounded-lg p-4 space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-bold">{selectedIncident.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedIncident.jobTitle}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(selectedIncident.status)}`}>
                    {selectedIncident.status}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                    {selectedIncident.type}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">
                    {selectedIncident.escalationLevel}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Reported By</p>
                  <p className="font-semibold">{selectedIncident.reportedBy}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Reported At</p>
                  <p className="font-semibold">{selectedIncident.reportedAt}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Cost Estimate</p>
                  <p className="font-semibold text-pink-600">AED {selectedIncident.costEstimate}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Time to Resolve</p>
                  <p className="font-semibold">{selectedIncident.timeToResolve || 'Pending'}</p>
                </div>
              </div>

              {/* Resolution */}
              {selectedIncident.resolution && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">Resolution</p>
                  <p className="text-sm text-green-700 dark:text-green-400">{selectedIncident.resolution}</p>
                </div>
              )}

              {/* Action Timeline */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Action Timeline
                </h3>
                <div className="space-y-2">
                  {selectedIncident.actions.map((action: any, idx: number) => (
                    <div key={idx} className="flex gap-3 pb-2 border-b last:border-b-0">
                      <div className="shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-xs font-bold text-muted-foreground">{action.time}</p>
                        <p className="text-sm font-semibold">{action.action}</p>
                        <p className="text-xs text-muted-foreground">by {action.by}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedIncident.status === 'Escalated' && (
                <button
                  onClick={() => setShowEscalationModal(true)}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Add Follow-up Action
                </button>
              )}
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Select an incident to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Add Follow-up Action</h2>
            <div className="space-y-4 mb-4">
              <select className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none text-sm">
                <option>Select Action Type</option>
                <option>Escalate to Management</option>
                <option>Contact External Authority</option>
                <option>Schedule On-site Inspection</option>
                <option>Document for Insurance</option>
              </select>
              <textarea placeholder="Action details..." className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none text-sm min-h-24" />
              <input type="text" placeholder="Assigned to" className="w-full p-2 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowEscalationModal(false)} className="flex-1 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => setShowEscalationModal(false)} className="flex-1 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm">
                Add Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
