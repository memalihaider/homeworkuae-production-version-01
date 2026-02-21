'use client'

import { useState, useMemo, Suspense } from 'react'
import { Check, AlertCircle, CheckCircle2, Clock, Lock, FileText, Download, Send, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function PreJobChecklistContent() {
  const searchParams = useSearchParams()
  const jobIdParam = searchParams?.get('jobId')
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      title: 'Office Deep Cleaning - Downtown Tower',
      serviceType: 'Commercial Cleaning',
      scheduledDate: '2025-01-20',
      supervisor: 'Ahmed Hassan',
      checklist: [
        { id: 1, category: 'Safety', item: 'Safety Checklist', completed: true, required: true },
        { id: 2, category: 'Equipment', item: 'Equipment Readiness', completed: true, required: true },
        { id: 3, category: 'Team', item: 'Team Briefing', completed: true, required: true },
        { id: 4, category: 'Documentation', item: 'Site Access Pass', completed: false, required: true },
        { id: 5, category: 'Documentation', item: 'Risk Assessment', completed: true, required: false },
        { id: 6, category: 'Equipment', item: 'Chemical Inventory Checked', completed: true, required: false },
      ]
    },
    {
      id: 2,
      title: 'Medical Facility Sanitization',
      serviceType: 'Medical Facility',
      scheduledDate: '2025-01-19',
      supervisor: 'Fatima Al Mansouri',
      checklist: [
        { id: 1, category: 'Compliance', item: 'Medical Compliance', completed: false, required: true },
        { id: 2, category: 'Safety', item: 'Safety Checklist', completed: true, required: true },
        { id: 3, category: 'Equipment', item: 'Equipment Readiness', completed: true, required: true },
        { id: 4, category: 'Documentation', item: 'Site Access Pass', completed: false, required: true },
        { id: 5, category: 'Team', item: 'Team Briefing', completed: false, required: true },
      ]
    }
  ])

  const [expandedJob, setExpandedJob] = useState<number | null>(null)
  const [lockReason, setLockReason] = useState('')
  const [showLockModal, setShowLockModal] = useState(false)
  const [selectedJobForLock, setSelectedJobForLock] = useState<number | null>(null)

  const serviceTypeChecklists: Record<string, string[]> = {
    'Commercial Cleaning': [
      'Safety Checklist',
      'Equipment Readiness',
      'Team Briefing',
      'Site Access Pass',
      'Risk Assessment',
      'Chemical Inventory Checked'
    ],
    'Medical Facility': [
      'Medical Compliance',
      'Safety Checklist',
      'Equipment Readiness',
      'Site Access Pass',
      'Team Briefing',
      'Waste Disposal Plan Confirmed'
    ],
    'Residential': [
      'Client Preferences Confirmed',
      'Equipment Readiness',
      'Team Briefing',
      'Site Access Pass',
      'Parking Arranged',
      'Access Arrangements Confirmed'
    ]
  }

  const toggleChecklistItem = (jobId: number, itemId: number) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          checklist: job.checklist.map((item: any) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        }
      }
      return job
    }))
  }

  const getCompletionStatus = (job: any) => {
    const total = job.checklist.length
    const completed = job.checklist.filter((item: any) => item.completed).length
    return Math.round((completed / total) * 100)
  }

  const getRequiredItemsComplete = (job: any) => {
    const requiredItems = job.checklist.filter((item: any) => item.required)
    const completedRequired = requiredItems.filter((item: any) => item.completed)
    return completedRequired.length === requiredItems.length
  }

  const handleLockJob = (jobId: number) => {
    setSelectedJobForLock(jobId)
    setShowLockModal(true)
  }

  const submitLock = () => {
    if (lockReason && selectedJobForLock) {
      setJobs(jobs.map(job => {
        if (job.id === selectedJobForLock) {
          return { ...job, locked: true, lockReason }
        }
        return job
      }))
      setShowLockModal(false)
      setLockReason('')
      setSelectedJobForLock(null)
    }
  }

  const stats = useMemo(() => ({
    total: jobs.length,
    allChecklistsComplete: jobs.filter(j => getRequiredItemsComplete(j)).length,
    pendingApproval: jobs.filter(j => !j.locked && getRequiredItemsComplete(j)).length,
    locked: jobs.filter(j => j.locked).length
  }), [jobs])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {jobIdParam && (
              <Link href={`/admin/jobs/${jobIdParam}`} className="text-pink-600 hover:text-pink-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <h1 className="text-3xl font-bold">Pre-Job Readiness</h1>
          </div>
          <p className="text-muted-foreground">Ensure all pre-job readiness requirements are met before execution</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Jobs</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Checklists Complete</p>
          <p className="text-2xl font-bold text-green-600">{stats.allChecklistsComplete}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pendingApproval}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Locked</p>
          <p className="text-2xl font-bold text-red-600">{stats.locked}</p>
        </div>
      </div>

      {/* Checklists */}
      <div className="space-y-3">
        {jobs.map(job => {
          const isComplete = getRequiredItemsComplete(job)
          const completion = getCompletionStatus(job)

          return (
            <div key={job.id} className="bg-card border rounded-lg overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{job.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{job.serviceType}</span>
                      <span className={`px-2 py-0.5 rounded ${
                        completion >= 85 ? 'bg-green-100 text-green-700' : completion >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {completion >= 85 ? '85% Ready' : `${completion}% Ready`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.locked ? (
                      <Lock className="h-5 w-5 text-red-600" />
                    ) : isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isComplete ? 'bg-green-600' : completion >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{completion}% Complete</p>
              </div>

              {expandedJob === job.id && (
                <div className="border-t p-4 space-y-4">
                  {/* Checklist by Category */}
                  {['Safety', 'Equipment', 'Documentation', 'Team', 'Compliance'].map((category: string) => {
                    const categoryItems = job.checklist.filter((item: any) => item.category === category)
                    if (categoryItems.length === 0) return null

                    return (
                      <div key={category}>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">{category}</h4>
                        <div className="space-y-2 ml-2">
                          {categoryItems.map((item: any) => (
                            <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleChecklistItem(job.id, item.id)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {item.item}
                              </span>
                              {item.required && (
                                <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    {!job.locked && (
                      <>
                        <button
                          onClick={() => handleLockJob(job.id)}
                          disabled={!isComplete}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isComplete
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          <Lock className="h-4 w-4" />
                          Lock for Approval
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors">
                          <Send className="h-4 w-4" />
                          Send for Review
                        </button>
                      </>
                    )}
                    {job.locked && (
                      <span className="text-xs text-red-600 font-medium">Locked - {job.lockReason}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Lock Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Lock Checklist for Approval</h2>
            <textarea
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
              placeholder="Enter reason for locking (supervisor accountability)..."
              className="w-full p-3 border rounded-lg bg-muted focus:ring-2 focus:ring-pink-500 outline-none mb-4 min-h-24"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowLockModal(false)}
                className="flex-1 px-3 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitLock}
                disabled={!lockReason}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Lock & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Navigation */}
      {jobIdParam && (
        <div className="bg-linear-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-2">Next Steps</h3>
              <p className="text-sm text-muted-foreground">Complete this checklist to proceed to team assignment</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/jobs/${jobIdParam}`} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Job
              </Link>
              <Link href={`/admin/jobs/assignment?jobId=${jobIdParam}`} className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Assign Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PreJobChecklist() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PreJobChecklistContent />
    </Suspense>
  )
}
