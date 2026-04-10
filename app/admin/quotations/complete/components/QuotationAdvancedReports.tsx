'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileSpreadsheet, RefreshCw, Users, TrendingUp, Banknote, Filter, AlertCircle } from 'lucide-react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import * as XLSX from 'xlsx'
import SearchSuggestSelect from '@/components/ui/search-suggest-select'

interface FirestoreTimestampLike {
  toDate?: () => Date
  seconds?: number
}

interface FirebaseQuotation {
  id: string
  quoteNumber: string
  client: string
  company: string
  email: string
  phone: string
  date: string
  validUntil: string
  status: string
  selectedCategory?: string
  total: number
  currency: string
  createdBy?: string
  createdById?: string
  assignedTo?: string
  assignedToId?: string
  outcomeRemarks?: string
  createdAt?: string | Date | FirestoreTimestampLike
  updatedAt?: string | Date | FirestoreTimestampLike
}

type PersonReportRow = {
  person: string
  quotationsCount: number
  totalValue: number
  averageValue: number
  approvedCount: number
  wonCount: number
  sentCount: number
  conversionRate: number
}

const toDateValue = (value: string | Date | FirestoreTimestampLike | undefined): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (typeof value === 'object' && value !== null) {
    if (typeof value.toDate === 'function') return value.toDate()
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000)
  }
  return null
}

const normalizeStatus = (status: unknown): string => {
  if (typeof status !== 'string') return 'Sent'
  if (!status.trim()) return 'Sent'
  if (status.toLowerCase() === 'draft') return 'Sent'
  return status
}

const isRejectedStatus = (status: string | undefined): boolean => {
  const normalizedStatus = status?.trim().toLowerCase() || ''
  return normalizedStatus === 'rejected' || normalizedStatus.startsWith('reject due to')
}

const getDisplayStatus = (status: string | undefined): string => {
  if (isRejectedStatus(status)) return 'Rejected'
  return status?.trim() || 'Sent'
}

const getStatusOrRemarks = (quotation: FirebaseQuotation): string => {
  if (isRejectedStatus(quotation.status) && quotation.outcomeRemarks?.trim()) {
    return quotation.outcomeRemarks.trim()
  }
  return getDisplayStatus(quotation.status)
}

const getStatusBadgeClass = (status: string | undefined): string => {
  const normalizedStatus = getDisplayStatus(status).toLowerCase()
  switch (normalizedStatus) {
    case 'rejected':
      return 'bg-red-50 text-red-700 border border-red-100'
    case 'approved':
    case 'accepted':
      return 'bg-green-50 text-green-700 border border-green-100'
    case 'won':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    case 'lost':
      return 'bg-orange-50 text-orange-700 border border-orange-100'
    default:
      return 'bg-blue-50 text-blue-700 border border-blue-100'
  }
}

const toIsoDateInput = (value: Date) => {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function QuotationAdvancedReports() {
  const [quotations, setQuotations] = useState<FirebaseQuotation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [fromDate, setFromDate] = useState(() => toIsoDateInput(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
  const [toDate, setToDate] = useState(() => toIsoDateInput(new Date()))

  useEffect(() => {
    let unsubscribeQuotes: (() => void) | null = null

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeQuotes) {
        unsubscribeQuotes()
        unsubscribeQuotes = null
      }

      if (!firebaseUser) {
        setQuotations([])
        setLoading(false)
        setError('Please sign in to view reports.')
        return
      }

      setLoading(true)
      setError(null)

      const quotesQuery = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'))

      unsubscribeQuotes = onSnapshot(
        quotesQuery,
        (snapshot) => {
          const records = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as Record<string, unknown>
            return {
              id: docSnap.id,
              quoteNumber: (data.quoteNumber as string) || `QT-${docSnap.id.slice(0, 6).toUpperCase()}`,
              client: (data.client as string) || 'N/A',
              company: (data.company as string) || '',
              email: (data.email as string) || '',
              phone: (data.phone as string) || '',
              date: (data.date as string) || '',
              validUntil: (data.validUntil as string) || '',
              status: normalizeStatus(data.status),
              selectedCategory: (data.selectedCategory as string) || '',
              total: Number(data.total) || 0,
              currency: (data.currency as string) || 'AED',
              createdBy: (data.createdBy as string) || 'Unassigned',
              createdById: (data.createdById as string) || '',
              assignedTo: (data.assignedTo as string) || '',
              assignedToId: (data.assignedToId as string) || '',
              outcomeRemarks: (data.outcomeRemarks as string) || '',
              createdAt: data.createdAt as string | Date | FirestoreTimestampLike | undefined,
              updatedAt: data.updatedAt as string | Date | FirestoreTimestampLike | undefined,
            } as FirebaseQuotation
          })

          setQuotations(records)
          setLoading(false)
          setError(null)
        },
        (listenerError) => {
          console.error('Quotation report listener error:', listenerError)
          setLoading(false)
          setError('Unable to load quotation reports right now.')
        },
      )
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeQuotes) unsubscribeQuotes()
    }
  }, [])

  const statusOptions = useMemo(() => {
    const unique = new Set(quotations.map((quotation) => getDisplayStatus(quotation.status)))
    return ['All', ...Array.from(unique)]
  }, [quotations])

  const statusFilterOptions = useMemo(() => {
    return statusOptions.map((option) => ({ value: option, label: option }))
  }, [statusOptions])

  const filteredQuotations = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null

    return quotations.filter((quotation) => {
      const createdAt = toDateValue(quotation.createdAt) || (quotation.date ? new Date(quotation.date) : null)

      if (from && createdAt && createdAt < from) return false
      if (to && createdAt && createdAt > to) return false
      if (statusFilter !== 'All' && getDisplayStatus(quotation.status) !== statusFilter) return false

      return true
    })
  }, [quotations, fromDate, toDate, statusFilter])

  const personReport = useMemo<PersonReportRow[]>(() => {
    const grouped = new Map<string, FirebaseQuotation[]>()

    const addPersonQuote = (rawPerson: string | undefined, quotation: FirebaseQuotation) => {
      const key = rawPerson?.trim() || 'Unassigned'
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)?.push(quotation)
    }

    filteredQuotations.forEach((quotation) => {
      addPersonQuote(quotation.createdBy, quotation)

      const creatorKey = quotation.createdBy?.trim() || 'Unassigned'
      const assignedKey = quotation.assignedTo?.trim() || ''
      if (assignedKey && assignedKey !== creatorKey) {
        addPersonQuote(assignedKey, quotation)
      }
    })

    return Array.from(grouped.entries())
      .map(([person, personQuotes]) => {
        const quotationsCount = personQuotes.length
        const totalValue = personQuotes.reduce((sum, quotation) => sum + (quotation.total || 0), 0)
        const approvedCount = personQuotes.filter((quotation) => quotation.status.toLowerCase() === 'approved').length
        const wonCount = personQuotes.filter((quotation) => quotation.status.toLowerCase() === 'won').length
        const sentCount = personQuotes.filter((quotation) => quotation.status.toLowerCase() === 'sent').length
        const averageValue = quotationsCount > 0 ? totalValue / quotationsCount : 0
        const conversionBase = approvedCount + wonCount
        const conversionRate = quotationsCount > 0 ? (conversionBase / quotationsCount) * 100 : 0

        return {
          person,
          quotationsCount,
          totalValue,
          averageValue,
          approvedCount,
          wonCount,
          sentCount,
          conversionRate,
        }
      })
      .sort((a, b) => b.totalValue - a.totalValue)
  }, [filteredQuotations])

  const overview = useMemo(() => {
    const totalQuotations = filteredQuotations.length
    const totalValue = filteredQuotations.reduce((sum, quotation) => sum + (quotation.total || 0), 0)
    const peopleCount = personReport.length
    const avgPerQuotation = totalQuotations > 0 ? totalValue / totalQuotations : 0

    return { totalQuotations, totalValue, peopleCount, avgPerQuotation }
  }, [filteredQuotations, personReport.length])

  const formatCurrency = (value: number) => {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)} AED`
  }

  const exportExcel = () => {
    const summaryRows = personReport.map((row) => ({
      Person: row.person,
      'No. of Quotations': row.quotationsCount,
      'Total Value (AED)': row.totalValue,
      'Average Value (AED)': Math.round(row.averageValue),
      Approved: row.approvedCount,
      Won: row.wonCount,
      Sent: row.sentCount,
      'Conversion Rate %': Number(row.conversionRate.toFixed(2)),
    }))

    const quotationRows = filteredQuotations.map((quotation) => {
      const createdAt = toDateValue(quotation.createdAt)
      return {
        'Quotation ID': quotation.id,
        'Quote Number': quotation.quoteNumber,
        'Created By': quotation.createdBy || 'Unassigned',
        'Assigned To': quotation.assignedTo || 'N/A',
        Client: quotation.client,
        Company: quotation.company,
        Category: quotation.selectedCategory || '',
        Status: quotation.status,
        'Status (Grouped)': getDisplayStatus(quotation.status),
        'Rejection Remarks': isRejectedStatus(quotation.status) ? (quotation.outcomeRemarks || '') : '',
        'Display Status/Reason': getStatusOrRemarks(quotation),
        'Total (AED)': quotation.total || 0,
        Currency: quotation.currency || 'AED',
        Date: quotation.date || '',
        'Valid Until': quotation.validUntil || '',
        'Created At': createdAt ? createdAt.toISOString() : '',
      }
    })

    const workbook = XLSX.utils.book_new()
    const summarySheet = XLSX.utils.json_to_sheet(summaryRows)
    const quotationSheet = XLSX.utils.json_to_sheet(quotationRows)

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'By Person')
    XLSX.utils.book_append_sheet(workbook, quotationSheet, 'Quotation Details')

    const stamp = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `quotation-advanced-report-${stamp}.xlsx`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-black">Advanced Report Management</h2>
          <p className="text-sm text-gray-500">Per-person quotation analytics with Excel export.</p>
        </div>
        <button
          onClick={exportExcel}
          disabled={filteredQuotations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Excel Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold tracking-wide mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Quotations
          </div>
          <p className="text-2xl font-black text-black">{overview.totalQuotations}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold tracking-wide mb-1">
            <Users className="w-3.5 h-3.5" /> People
          </div>
          <p className="text-2xl font-black text-black">{overview.peopleCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold tracking-wide mb-1">
            <Banknote className="w-3.5 h-3.5" /> Total Value
          </div>
          <p className="text-2xl font-black text-black">{formatCurrency(overview.totalValue)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold tracking-wide mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Avg / Quote
          </div>
          <p className="text-2xl font-black text-black">{formatCurrency(overview.avgPerQuotation)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 text-sm font-bold">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
            <SearchSuggestSelect
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || 'All')}
              options={statusFilterOptions}
              placeholder="Search status..."
              inputClassName="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm bg-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('All')
                setFromDate(toIsoDateInput(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
                setToDate(toIsoDateInput(new Date()))
              }}
              className="w-full h-10 rounded-lg border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-black text-black">Per Person Performance</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading report data...</div>
        ) : personReport.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No report data found for current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-gray-500 uppercase text-[11px] tracking-wide">
                  <th className="text-left px-4 py-3 font-bold">Person</th>
                  <th className="text-right px-4 py-3 font-bold">Quotations</th>
                  <th className="text-right px-4 py-3 font-bold">Total Value</th>
                  <th className="text-right px-4 py-3 font-bold">Avg Value</th>
                  <th className="text-right px-4 py-3 font-bold">Approved</th>
                  <th className="text-right px-4 py-3 font-bold">Won</th>
                  <th className="text-right px-4 py-3 font-bold">Sent</th>
                  <th className="text-right px-4 py-3 font-bold">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {personReport.map((row) => (
                  <tr key={row.person} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-black">{row.person}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{row.quotationsCount}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.totalValue)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.averageValue)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{row.approvedCount}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{row.wonCount}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{row.sentCount}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-700">{row.conversionRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-black text-black">Quotation-Level Details</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading quotation details...</div>
        ) : filteredQuotations.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No quotations found for current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-gray-500 uppercase text-[11px] tracking-wide">
                  <th className="text-left px-4 py-3 font-bold">Quote #</th>
                  <th className="text-left px-4 py-3 font-bold">Created By</th>
                  <th className="text-left px-4 py-3 font-bold">Assigned To</th>
                  <th className="text-left px-4 py-3 font-bold">Client</th>
                  <th className="text-left px-4 py-3 font-bold">Category</th>
                  <th className="text-left px-4 py-3 font-bold">Status</th>
                  <th className="text-left px-4 py-3 font-bold">Reason</th>
                  <th className="text-right px-4 py-3 font-bold">Value</th>
                  <th className="text-left px-4 py-3 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-black">{quotation.quoteNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{quotation.createdBy || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-gray-700">{quotation.assignedTo || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">{quotation.client}</td>
                    <td className="px-4 py-3 text-gray-700">{quotation.selectedCategory || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span
                        title={getDisplayStatus(quotation.status)}
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(quotation.status)}`}
                      >
                        {getDisplayStatus(quotation.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-64 truncate" title={isRejectedStatus(quotation.status) ? (quotation.outcomeRemarks || '') : ''}>
                      {isRejectedStatus(quotation.status) ? (quotation.outcomeRemarks || '-') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(quotation.total || 0)}</td>
                    <td className="px-4 py-3 text-gray-600">{quotation.date || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
