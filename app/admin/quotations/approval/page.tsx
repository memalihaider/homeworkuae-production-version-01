'use client'

import { useState, useCallback, useMemo } from 'react'
import { CheckCircle, X, MessageSquare, Clock, AlertTriangle, TrendingUp } from 'lucide-react'

export default function ApprovalQueue() {
  const [approvals, setApprovals] = useState<any[]>([
    {
      id: 1,
      clientName: 'Emirates Shopping Mall',
      serviceType: 'Deep Cleaning',
      amount: 45000,
      margin: 22,
      discount: 15,
      approvalReason: 'Discount exceeds 15%',
      approvalLevel: 'Manager',
      submittedBy: 'Sales Executive',
      submittedDate: '2025-01-18',
      status: 'Pending',
      riskLevel: 'medium',
      marginDetails: { costPrice: 19800, sellingPrice: 25200 },
      comments: []
    },
    {
      id: 2,
      clientName: 'Downtown Business Park',
      serviceType: 'Office Cleaning',
      amount: 68000,
      margin: 12,
      discount: 8,
      approvalReason: 'Margin below 15%',
      approvalLevel: 'Director',
      submittedBy: 'Sales Manager',
      submittedDate: '2025-01-17',
      status: 'Pending',
      riskLevel: 'high',
      marginDetails: { costPrice: 59840, sellingPrice: 68000 },
      comments: [
        { user: 'Manager', text: 'Needs director review due to low margin', timestamp: '2025-01-17' }
      ]
    },
    {
      id: 3,
      clientName: 'Medical Clinic ABC',
      serviceType: 'Medical Facility Sanitization',
      amount: 32000,
      margin: 28,
      discount: 5,
      approvalReason: 'High-value contract',
      approvalLevel: 'Manager',
      submittedBy: 'Sales Executive',
      submittedDate: '2025-01-16',
      status: 'Approved',
      riskLevel: 'low',
      marginDetails: { costPrice: 23040, sellingPrice: 32000 },
      comments: [
        { user: 'Manager', text: 'Approved - strong margin maintained', timestamp: '2025-01-16' }
      ]
    }
  ])

  const [selectedApproval, setSelectedApproval] = useState<any>(approvals[0])
  const [newComment, setNewComment] = useState('')

  // Approval rules engine
  const getApprovalRequirements = useCallback((approval: any) => {
    const requirements: any[] = []

    if (approval.margin < 15) {
      requirements.push({
        icon: AlertTriangle,
        text: 'Margin critically low - Director approval required',
        severity: 'critical'
      })
    } else if (approval.margin < 20) {
      requirements.push({
        icon: AlertTriangle,
        text: 'Margin below optimal range - Manager approval required',
        severity: 'warning'
      })
    }

    if (approval.discount > 20) {
      requirements.push({
        icon: TrendingUp,
        text: 'Discount exceeds 20% - Requires escalation',
        severity: 'critical'
      })
    } else if (approval.discount > 15) {
      requirements.push({
        icon: TrendingUp,
        text: 'Discount between 15-20% - Manager approval needed',
        severity: 'warning'
      })
    }

    if (approval.amount > 50000) {
      requirements.push({
        icon: TrendingUp,
        text: 'High-value contract - Director approval required',
        severity: 'info'
      })
    }

    return requirements
  }, [])

  const pendingApprovals = useMemo(() => {
    return approvals.filter(a => a.status === 'Pending')
  }, [approvals])

  const handleApprove = useCallback(() => {
    if (!selectedApproval) return

    setApprovals(approvals.map(a =>
      a.id === selectedApproval.id
        ? {
            ...a,
            status: 'Approved',
            comments: [...a.comments, {
              user: 'Current User',
              text: 'Quotation approved',
              timestamp: new Date().toISOString().split('T')[0]
            }]
          }
        : a
    ))

    setSelectedApproval({
      ...selectedApproval,
      status: 'Approved',
      comments: [...selectedApproval.comments, {
        user: 'Current User',
        text: 'Quotation approved',
        timestamp: new Date().toISOString().split('T')[0]
      }]
    })

    alert('Quotation approved!')
  }, [selectedApproval, approvals])

  const handleReject = useCallback(() => {
    if (!selectedApproval) return

    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    setApprovals(approvals.map(a =>
      a.id === selectedApproval.id
        ? {
            ...a,
            status: 'Rejected',
            comments: [...a.comments, {
              user: 'Current User',
              text: `Rejected: ${reason}`,
              timestamp: new Date().toISOString().split('T')[0]
            }]
          }
        : a
    ))

    alert('Quotation rejected.')
  }, [selectedApproval, approvals])

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !selectedApproval) return

    const updatedApproval = {
      ...selectedApproval,
      comments: [...selectedApproval.comments, {
        user: 'Current User',
        text: newComment,
        timestamp: new Date().toISOString().split('T')[0]
      }]
    }

    setApprovals(approvals.map(a =>
      a.id === selectedApproval.id ? updatedApproval : a
    ))

    setSelectedApproval(updatedApproval)
    setNewComment('')
  }, [newComment, selectedApproval, approvals])

  const requirements = useMemo(() => {
    if (!selectedApproval) return []
    return getApprovalRequirements(selectedApproval)
  }, [selectedApproval, getApprovalRequirements])

  if (!selectedApproval) {
    return <div className="text-center py-12">No approvals to display</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Approval Queue</h1>
        <p className="text-muted-foreground">Review and approve quotations based on business rules and policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals List */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-yellow-600" />
            <h2 className="text-sm font-bold">Pending ({pendingApprovals.length})</h2>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                onClick={() => setSelectedApproval(approval)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-l-4 ${
                  selectedApproval.id === approval.id
                    ? 'bg-pink-100 dark:bg-pink-950/30 border-l-pink-600 border'
                    : `bg-muted ${
                        approval.status === 'Pending'
                          ? 'border-l-yellow-600 hover:border-l-yellow-400'
                          : 'border-l-green-600'
                      }`
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-bold">{approval.clientName}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    approval.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : approval.status === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {approval.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{approval.serviceType}</p>
                <p className="text-xs font-bold text-pink-600 mt-1">AED {approval.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{selectedApproval.clientName}</h3>
                <p className="text-sm text-muted-foreground">{selectedApproval.serviceType}</p>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                selectedApproval.status === 'Approved'
                  ? 'bg-green-100 text-green-700'
                  : selectedApproval.status === 'Rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedApproval.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-muted p-2 rounded">
                <p className="text-muted-foreground">Amount</p>
                <p className="font-bold text-pink-600">AED {selectedApproval.amount.toLocaleString()}</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-muted-foreground">Margin</p>
                <p className={`font-bold ${selectedApproval.margin >= 25 ? 'text-green-600' : selectedApproval.margin >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {selectedApproval.margin}%
                </p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-muted-foreground">Discount</p>
                <p className="font-bold">{selectedApproval.discount}%</p>
              </div>
            </div>
          </div>

          {/* Approval Requirements */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold">Approval Requirements</h3>
            <div className="space-y-2">
              {requirements.length > 0 ? (
                requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      req.severity === 'critical'
                        ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30'
                        : req.severity === 'warning'
                        ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30'
                        : 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30'
                    }`}
                  >
                    <req.icon className={`h-4 w-4 shrink-0 ${
                      req.severity === 'critical'
                        ? 'text-red-600'
                        : req.severity === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`} />
                    <p className={`text-sm ${
                      req.severity === 'critical'
                        ? 'text-red-700'
                        : req.severity === 'warning'
                        ? 'text-yellow-700'
                        : 'text-blue-700'
                    }`}>
                      {req.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                  <p className="text-sm text-green-700">✓ All approval requirements met</p>
                </div>
              )}
            </div>
          </div>

          {/* Margin Protection Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-bold">Pricing Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost Price:</span>
                <span className="font-bold">AED {selectedApproval.marginDetails.costPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selling Price:</span>
                <span className="font-bold">AED {selectedApproval.marginDetails.sellingPrice.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-muted-foreground">Margin Amount:</span>
                <span className="font-bold text-green-600">
                  AED {(selectedApproval.marginDetails.sellingPrice - selectedApproval.marginDetails.costPrice).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Approval Comments
            </h3>

            <div className="bg-muted/50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
              {selectedApproval.comments.length > 0 ? (
                selectedApproval.comments.map((comment: any, idx: number) => (
                  <div key={idx} className="bg-card p-2 rounded text-xs">
                    <p className="font-bold text-muted-foreground">{comment.user}</p>
                    <p className="mt-1">{comment.text}</p>
                    <p className="text-muted-foreground text-xs mt-1">{comment.timestamp}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">No comments yet</p>
              )}
            </div>

            {selectedApproval.status === 'Pending' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="px-3 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {selectedApproval.status === 'Pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
