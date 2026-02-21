'use client'

import { useState, useMemo, Suspense } from 'react'
import { CheckCircle2, AlertCircle, FileText, DollarSign, Users, Calendar, Download, Send, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function JobClosureContent() {
  const searchParams = useSearchParams()
  const jobIdParam = searchParams?.get('jobId')
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      clientName: 'Acme Corporation',
      serviceType: 'Deep Cleaning',
      completionDate: '2025-12-23',
      completionTime: '14:30',
      duration: '4 hours 15 min',
      teamMembers: ['John Smith', 'Sarah Johnson', 'Mike Chen'],
      tasks: [
        { name: 'Carpet Cleaning', completed: true },
        { name: 'Window Cleaning', completed: true },
        { name: 'Floor Waxing', completed: true },
        { name: 'Trash Removal', completed: true }
      ],
      invoiceGenerated: true,
      invoiceAmount: 1250.00,
      paymentStatus: 'Pending',
      invoiceDate: '2025-12-23',
      quality: 'Excellent',
      inspection: { passed: true, notes: 'All tasks completed to spec, no issues noted', inspector: 'Lisa Park' },
      signoffStatus: 'Pending Client',
      materialCost: 125.50,
      laborCost: 1000.00,
      tax: 124.50,
      additionalCharges: 0
    },
    {
      id: 2,
      clientName: 'Tech Solutions Inc',
      serviceType: 'Office Maintenance',
      completionDate: '2025-12-22',
      completionTime: '17:00',
      duration: '3 hours 45 min',
      teamMembers: ['James Wilson', 'Patricia Davis'],
      tasks: [
        { name: 'Common Area Cleaning', completed: true },
        { name: 'Restroom Sanitization', completed: true },
        { name: 'Kitchen Deep Clean', completed: true }
      ],
      invoiceGenerated: true,
      invoiceAmount: 895.00,
      paymentStatus: 'Paid',
      invoiceDate: '2025-12-22',
      quality: 'Good',
      inspection: { passed: true, notes: 'Minor touch-ups needed in kitchen corner', inspector: 'Lisa Park' },
      signoffStatus: 'Complete',
      materialCost: 85.00,
      laborCost: 750.00,
      tax: 60.00,
      additionalCharges: 0
    },
    {
      id: 3,
      clientName: 'Medical Center West',
      serviceType: 'Post-Construction Cleaning',
      completionDate: '2025-12-21',
      completionTime: '16:15',
      duration: '5 hours 30 min',
      teamMembers: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'David Brown'],
      tasks: [
        { name: 'Debris Removal', completed: true },
        { name: 'Dust Suppression', completed: true },
        { name: 'Final Floor Treatment', completed: true },
        { name: 'Inspection Walkthrough', completed: true }
      ],
      invoiceGenerated: true,
      invoiceAmount: 2150.00,
      paymentStatus: 'Pending',
      invoiceDate: '2025-12-21',
      quality: 'Excellent',
      inspection: { passed: true, notes: 'Ready for facility operations. All areas compliant.', inspector: 'Robert Kim' },
      signoffStatus: 'Pending Client',
      materialCost: 250.00,
      laborCost: 1800.00,
      tax: 100.00,
      additionalCharges: 0
    }
  ])

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [selectedJobId, setSelectedJobId] = useState(1)
  const [showHandoffModal, setShowHandoffModal] = useState(false)
  const [handoffNotes, setHandoffNotes] = useState('')

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0]

  const stats = useMemo(() => ({
    total: jobs.length,
    invoicesGenerated: jobs.filter(j => j.invoiceGenerated).length,
    paid: jobs.filter(j => j.paymentStatus === 'Paid').length,
    pending: jobs.filter(j => j.paymentStatus === 'Pending').length,
    totalRevenue: jobs.reduce((sum, j) => sum + j.invoiceAmount, 0),
    totalInspections: jobs.filter(j => j.inspection.passed).length,
    signedOff: jobs.filter(j => j.signoffStatus === 'Complete').length
  }), [jobs])

  const handleGenerateInvoice = (jobId: number) => {
    setJobs(jobs.map(j => 
      j.id === jobId ? { ...j, invoiceGenerated: true, invoiceDate: new Date().toISOString().split('T')[0] } : j
    ))
  }

  const handlePaymentStatusChange = (jobId: number, status: string) => {
    setJobs(jobs.map(j => 
      j.id === jobId ? { ...j, paymentStatus: status } : j
    ))
  }

  const handleSignoff = (jobId: number) => {
    setJobs(jobs.map(j => 
      j.id === jobId ? { ...j, signoffStatus: 'Complete' } : j
    ))
  }

  const handleCreateHandoff = () => {
    // In real app, would create handoff document
    setShowHandoffModal(false)
    setHandoffNotes('')
    alert('Handoff document created and ready for download')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {jobIdParam && (
          <Link href={`/admin/jobs/${jobIdParam}`} className="text-green-600 hover:text-green-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="bg-linear-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white flex-1">
          <h1 className="text-3xl font-bold">Job Closure Management</h1>
          <p className="text-green-100 mt-1">Final quality inspection, invoicing, and client handoff</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Invoices Generated</p>
          <p className="text-2xl font-bold text-blue-600">{stats.invoicesGenerated}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Payments Received</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Job Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {jobs.map(job => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedJobId === job.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {job.clientName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Job Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Job Details
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-semibold">{selectedJob.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="font-semibold">{selectedJob.serviceType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Date & Time</p>
              <p className="font-semibold">{selectedJob.completionDate} at {selectedJob.completionTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">{selectedJob.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedJob.teamMembers.map((member: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quality Inspection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Quality Inspection
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-semibold text-green-700">Inspection Passed</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Quality Rating</p>
              <p className="font-semibold text-lg">{selectedJob.quality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Inspector Notes</p>
              <p className="text-sm mt-1 p-3 bg-gray-50 rounded border border-gray-200">{selectedJob.inspection.notes}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Inspector</p>
              <p className="font-semibold">{selectedJob.inspection.inspector}</p>
            </div>
          </div>
        </div>

        {/* Invoice & Payment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Invoice & Payment
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Materials</span>
                <span className="font-semibold">${selectedJob.materialCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Labor</span>
                <span className="font-semibold">${selectedJob.laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${selectedJob.tax.toFixed(2)}</span>
              </div>
              {selectedJob.additionalCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Charges</span>
                  <span className="font-semibold">${selectedJob.additionalCharges.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-green-600">${selectedJob.invoiceAmount.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Invoice Status</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerateInvoice(selectedJob.id)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
                >
                  {selectedJob.invoiceGenerated ? '✓ Generated' : 'Generate Invoice'}
                </button>
                {selectedJob.invoiceGenerated && (
                  <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium text-sm flex items-center justify-center gap-1">
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Payment Status</p>
              <div className="flex gap-2">
                {(['Pending', 'Paid'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => handlePaymentStatusChange(selectedJob.id, status)}
                    className={`flex-1 px-3 py-2 rounded font-medium text-sm transition-colors ${
                      selectedJob.paymentStatus === status
                        ? status === 'Paid' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Client Handoff */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Client Handoff & Signoff
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Completion Checklist</p>
              <div className="space-y-2">
                {selectedJob.tasks.map((task: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{task.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Signoff Status</p>
              <p className={`font-semibold px-3 py-2 rounded text-sm ${
                selectedJob.signoffStatus === 'Complete'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedJob.signoffStatus}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowHandoffModal(true)}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm flex items-center justify-center gap-1"
              >
                <FileText className="w-4 h-4" /> Create Handoff
              </button>
              <button
                onClick={() => handleSignoff(selectedJob.id)}
                className={`flex-1 px-3 py-2 rounded font-medium text-sm ${
                  selectedJob.signoffStatus === 'Complete'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedJob.signoffStatus === 'Complete' ? '✓ Signed Off' : 'Obtain Signoff'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Handoff Modal */}
      {showHandoffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Create Handoff Document</h3>
            <textarea
              value={handoffNotes}
              onChange={(e) => setHandoffNotes(e.target.value)}
              placeholder="Add any special notes or instructions for the client..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowHandoffModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateHandoff}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium flex items-center justify-center gap-1"
              >
                <Send className="w-4 h-4" /> Create & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Navigation */}
      {jobIdParam && (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-2">Job Completed ✓</h3>
              <p className="text-sm text-muted-foreground">Proceed to collect feedback and client review</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/jobs/${jobIdParam}`} className="flex items-center gap-2 px-4 py-2 border border-green-300 bg-white rounded-lg hover:bg-green-50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Job
              </Link>
              <Link href={`/admin/jobs/feedback-collection?jobId=${jobIdParam}`} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Collect Feedback
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobClosurePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <JobClosureContent />
    </Suspense>
  )
}
