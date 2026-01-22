'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  FileText,
  Send,
  Download,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface ClientSummary {
  clientName: string
  contactPerson: string
  email: string
  phone: string
  jobTitle: string
  jobDate: string
  duration: string
  teamSize: number
  services: string[]
  totalCost: number
  paymentStatus: 'paid' | 'pending' | 'overdue'
  satisfaction: number
  feedback: string
  nextService: string
  recommendations: string[]
}

export default function ClientSummary() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  const [summary] = useState<ClientSummary>({
    clientName: 'Downtown Business Tower',
    contactPerson: 'Sarah Johnson',
    email: 'sarah.johnson@dtbt.com',
    phone: '+971-50-123-4567',
    jobTitle: 'Office Deep Cleaning - Downtown Tower',
    jobDate: '2025-01-20',
    duration: '8 hours',
    teamSize: 4,
    services: [
      'Deep carpet cleaning',
      'Office furniture cleaning',
      'Restroom sanitization',
      'Floor maintenance',
      'Window cleaning'
    ],
    totalCost: 2400,
    paymentStatus: 'paid',
    satisfaction: 5,
    feedback: 'Excellent service! The team was professional, thorough, and completed the work ahead of schedule. Highly recommend for future cleaning needs.',
    nextService: '2025-02-20',
    recommendations: [
      'Schedule quarterly deep cleaning',
      'Consider window cleaning service monthly',
      'Implement regular maintenance program'
    ]
  })

  const [isSending, setIsSending] = useState(false)

  const handleSendEmail = async () => {
    setIsSending(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    alert('Client summary sent successfully!')
  }

  const handleDownload = () => {
    // Simulate PDF download
    alert('Downloading client summary PDF...')
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/admin/jobs/${jobId}`} className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Summary</h1>
            <p className="text-sm text-gray-600">{summary.jobTitle}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Send to Client'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Job Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Service Date</div>
                    <div className="text-sm text-gray-600">{summary.jobDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Duration</div>
                    <div className="text-sm text-gray-600">{summary.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Team Size</div>
                    <div className="text-sm text-gray-600">{summary.teamSize} members</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Total Cost</div>
                    <div className="text-sm text-gray-600">AED {summary.totalCost.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    summary.paymentStatus === 'paid' ? 'bg-green-500' :
                    summary.paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Payment Status</div>
                    <div className="text-sm text-gray-600 capitalize">{summary.paymentStatus}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Services Provided</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {summary.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Client Feedback</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Satisfaction Rating:</span>
                {renderStars(summary.satisfaction)}
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Comments:</div>
                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">
                  "{summary.feedback}"
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {summary.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Client Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{summary.clientName}</div>
                <div className="text-sm text-gray-600">Contact: {summary.contactPerson}</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {summary.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {summary.phone}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Next Service</h3>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">Scheduled</div>
                <div className="text-sm text-gray-600">{summary.nextService}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <MessageSquare className="w-5 h-5" />
              <div className="text-sm font-medium">Quick Actions</div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900">
                Schedule follow-up call
              </button>
              <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900">
                Send thank you note
              </button>
              <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900">
                Request referral
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}