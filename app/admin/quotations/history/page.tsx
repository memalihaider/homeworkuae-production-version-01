'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Search, Download, Eye, RefreshCw, CheckCircle, Clock, Archive, AlertCircle } from 'lucide-react'
import { getQuotations, Quotation } from '@/lib/quotations-data'

export default function QuotationHistory() {
  const [quotationHistory, setQuotationHistory] = useState<Quotation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAuditDetails, setShowAuditDetails] = useState(false)

  useEffect(() => {
    const loadedQuotations = getQuotations()
    setQuotationHistory(loadedQuotations)
  }, [])

  const filteredHistory = useMemo(() => {
    return quotationHistory.filter(history => {
      const matchesSearch = history.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           history.selectedServices[0]?.name.toLowerCase().includes(searchTerm.toLowerCase())

      if (statusFilter === 'all') return matchesSearch
      return matchesSearch && history.status === statusFilter
    })
  }, [quotationHistory, searchTerm, statusFilter])

  const handleDownloadVersion = useCallback((version: number) => {
    alert(`Downloading quotation version ${version} for ${selectedQuotation?.client.name || 'Unknown Client'}`)
  }, [selectedQuotation])

  const handleRenewQuotation = useCallback(() => {
    alert('New quotation created for renewal. Redirecting to builder...')
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-700'
      case 'Rejected':
        return 'bg-red-100 text-red-700'
      case 'Expired':
        return 'bg-gray-100 text-gray-700'
      case 'Active':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  const getAcceptanceIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Archive className="h-4 w-4 text-gray-600" />
    }
  }

  if (!selectedQuotation) {
    return <div className="text-center py-12">No quotation history to display</div>
  }

  const currentVersion = selectedQuotation

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quotation History</h1>
        <p className="text-muted-foreground">Track quotation versions, acceptance status, and audit logs</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client or service..."
            className="w-full pl-10 pr-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-muted border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* History List */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold mb-3">Quotations ({filteredHistory.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredHistory.map((history) => (
              <div
                key={history.id}
                onClick={() => setSelectedQuotation(history)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-l-4 ${
                  selectedQuotation.id === history.id
                    ? 'bg-pink-100 dark:bg-pink-950/30 border-l-pink-600 border'
                    : 'bg-muted border-l-gray-300 hover:border-l-pink-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-bold">{history.client.name}</p>
                  {getAcceptanceIcon(history.status)}
                </div>
                <p className="text-xs text-muted-foreground">{history.selectedServices[0]?.name || 'No service'}</p>
                <p className="text-xs font-bold text-pink-600 mt-1">v{history.version}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{selectedQuotation.client.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedQuotation.selectedServices[0]?.name || 'No service'}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {getAcceptanceIcon(selectedQuotation.status)}
                <span className={`font-bold px-3 py-1 rounded-full text-xs ${getStatusColor(selectedQuotation.status)}`}>
                  {selectedQuotation.status}
                </span>
              </div>
            </div>

            {selectedQuotation.status === 'Accepted' && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded p-2">
                <p className="text-xs text-green-700"><strong>Total Value:</strong> AED {selectedQuotation.totals.subtotal.toLocaleString()}</p>
                <p className="text-xs text-green-700"><strong>Expiry Date:</strong> {selectedQuotation.expiryDate}</p>
              </div>
            )}

            {selectedQuotation.status === 'Rejected' && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded p-2">
                <p className="text-xs text-red-700"><strong>Status:</strong> Quotation was rejected</p>
                <p className="text-xs text-red-700"><strong>Date:</strong> {selectedQuotation.createdDate}</p>
              </div>
            )}
          </div>

          {/* Version History */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold">Version History</h3>
            <div className="space-y-2">
              {selectedQuotation.auditLog.map((log: any, idx: number) => (
                <div key={idx} className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.changes || 'Quotation updated'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-pink-600">v{selectedQuotation.version}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getStatusColor(selectedQuotation.status)}`}>
                        {selectedQuotation.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-bold">{selectedQuotation.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Margin</p>
                      <p className="font-bold text-green-600">{selectedQuotation.totals.margin}%</p>
                    </div>
                    <button
                      onClick={() => handleDownloadVersion(selectedQuotation.version)}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 justify-center"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Tracking */}
          <div className={`rounded-lg p-4 space-y-2 border ${
            selectedQuotation.status === 'Expired'
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'
              : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30'
          }`}>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Expiry Information
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expiry Date:</span>
                <span className="font-bold">{selectedQuotation.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-bold ${
                  selectedQuotation.status === 'Expired'
                    ? 'text-red-600'
                    : selectedQuotation.status === 'Accepted'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}>
                  {selectedQuotation.status}
                </span>
              </div>

                {selectedQuotation.status === 'Accepted' && (
                  <button
                    onClick={handleRenewQuotation}
                    className="w-full mt-2 px-3 py-1.5 bg-pink-600 text-white rounded font-bold text-sm hover:bg-pink-700 transition-colors"
                  >
                    Create Renewal Quote
                  </button>
                )}
              </div>
            </div>

          {/* Audit Log Toggle */}
          <button
            onClick={() => setShowAuditDetails(!showAuditDetails)}
            className="w-full px-4 py-2 border rounded-lg font-medium hover:bg-muted transition-colors text-sm"
          >
            {showAuditDetails ? 'Hide' : 'Show'} Full Audit Log
          </button>
        </div>
      </div>

      {/* Audit Log Details */}
      {showAuditDetails && (
        <div className="bg-card border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-bold">Complete Audit Log</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {selectedQuotation.auditLog.map((log: any, idx: number) => (
              <div key={idx} className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-pink-600 mt-2 shrink-0"></div>
                <div className="flex-1">
                  <p className="font-bold">{log.action}</p>
                  <p className="text-muted-foreground text-xs">{log.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.user} • {log.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Quotations</p>
          <p className="text-2xl font-bold">{quotationHistory.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{quotationHistory.filter(q => q.status === 'Accepted').length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{quotationHistory.filter(q => q.status === 'Rejected').length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{quotationHistory.filter(q => q.status === 'Sent').length}</p>
        </div>
      </div>
    </div>
  )
}
