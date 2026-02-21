'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Save,
  User,
  MapPin,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Incident {
  id: string
  type: 'safety' | 'equipment' | 'environmental' | 'client' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  location: string
  reportedBy: string
  timestamp: string
  status: 'reported' | 'investigating' | 'resolved'
  actions: string[]
  resolution?: string
}

export default function IncidentLog() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower'
  }

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      type: 'equipment',
      severity: 'medium',
      title: 'Vacuum Motor Overheating',
      description: 'Industrial vacuum motor began overheating during use on floor 12',
      location: 'Floor 12 - Office Area',
      reportedBy: 'Fatima Al-Mazrouei',
      timestamp: '2025-01-20 14:30',
      status: 'resolved',
      actions: ['Reported to supervisor', 'Equipment inspected', 'Motor replaced'],
      resolution: 'Replaced faulty motor. Equipment back in service.'
    },
    {
      id: '2',
      type: 'safety',
      severity: 'high',
      title: 'Chemical Spill',
      description: 'Small amount of cleaning solution spilled in hallway',
      location: 'Floor 8 - Main Corridor',
      reportedBy: 'Ahmed Hassan',
      timestamp: '2025-01-20 11:15',
      status: 'resolved',
      actions: ['Area isolated', 'Spill cleaned immediately', 'Ventilation activated'],
      resolution: 'Spill contained and cleaned. No injuries reported.'
    }
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-300'
      case 'investigating': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'reported': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const resolvedCount = incidents.filter(i => i.status === 'resolved').length
  const totalIncidents = incidents.length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/admin/jobs/${jobId}`} className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Log</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-gray-900">{resolvedCount}/{totalIncidents} Resolved</div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Plus className="w-4 h-4" />
            Log Incident
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{incident.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>{incident.timestamp}</div>
                <div className="flex items-center gap-1 mt-1">
                  <User className="w-4 h-4" />
                  {incident.reportedBy}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{incident.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {incident.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                {incident.type}
              </div>
            </div>

            {incident.actions.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-bold text-gray-900 mb-2">Actions Taken:</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {incident.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {incident.resolution && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-bold text-green-900 mb-1">Resolution:</div>
                <div className="text-sm text-green-800">{incident.resolution}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}