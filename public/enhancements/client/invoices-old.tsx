'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  FileText,
  Download,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Mail,
  CreditCard,
  Search,
  Filter,
  X,
  Plus,
  Clock,
  Award
} from 'lucide-react'

interface Invoice {
  id: string
  service: string
  date: string
  dueDate: string
  amount: string
  amountNum: number
  status: 'Paid' | 'Pending' | 'Overdue'
  paidDate?: string
  jobId: string
  items?: { description: string; amount: string }[]
  paymentMethod?: string
}

export default function Invoices() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [paymentForm, setPaymentForm] = useState({ method: 'credit-card', cardNumber: '', expiryDate: '', cvv: '' })
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailForm, setEmailForm] = useState({ recipientEmail: '', message: '' })

  const invoices: Invoice[] = [
    { 
      id: 'INV001', 
      service: 'Deep Cleaning - Villa', 
      date: 'Dec 15, 2025',
      dueDate: 'Dec 22, 2025',
      amount: 'AED 1,200',
      amountNum: 1200,
      status: 'Paid',
      paidDate: 'Dec 18, 2025',
      jobId: 'J001'
    },
    { 
      id: 'INV002', 
      service: 'Regular Cleaning', 
      date: 'Dec 10, 2025',
      dueDate: 'Dec 17, 2025',
      amount: 'AED 800',
      amountNum: 800,
      status: 'Paid',
      paidDate: 'Dec 12, 2025',
      jobId: 'J003'
    },
    { 
      id: 'INV003', 
      service: 'Carpet Cleaning + Treatment', 
      date: 'Dec 20, 2025',
      dueDate: 'Dec 27, 2025',
      amount: 'AED 1,500',
      amountNum: 1500,
      status: 'Pending',
      paidDate: undefined,
      jobId: 'J002'
    },
    { 
      id: 'INV004', 
      service: 'Window Cleaning - Annual', 
      date: 'Nov 25, 2025',
      dueDate: 'Dec 2, 2025',
      amount: 'AED 2,100',
      amountNum: 2100,
      status: 'Overdue',
      paidDate: undefined,
      jobId: 'J004'
    },
    { 
      id: 'INV005', 
      service: 'Disinfection Service', 
      date: 'Dec 5, 2025',
      dueDate: 'Dec 12, 2025',
      amount: 'AED 950',
      amountNum: 950,
      status: 'Paid',
      paidDate: 'Dec 10, 2025',
      jobId: 'J005'
    },
  ]

  // Handler Functions (useCallback for optimization)
  const handleMarkAsPaid = useCallback(() => {
    if (!selectedInvoice) return
    alert(`Payment of ${selectedInvoice.amount} processed successfully!`)
    setShowPaymentModal(false)
  }, [selectedInvoice])

  const handleDownloadPDF = useCallback((invoiceId: string) => {
    alert(`Downloading PDF for invoice ${invoiceId}...`)
  }, [])

  const handleSendEmail = useCallback(() => {
    if (!emailForm.recipientEmail) {
      alert('Please enter recipient email')
      return
    }
    alert(`Invoice emailed successfully to ${emailForm.recipientEmail}!`)
    setShowEmailModal(false)
    setEmailForm({ recipientEmail: '', message: '' })
  }, [emailForm])

  const handleViewDetails = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowDetailModal(true)
  }, [])

  const handleOpenPaymentModal = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPaymentModal(true)
  }, [])

  const handleOpenEmailModal = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowEmailModal(true)
  }, [])

  // Calculate statistics
  const stats = useMemo(() => ({
    total: invoices.reduce((sum, inv) => sum + inv.amountNum, 0),
    paid: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amountNum, 0),
    pending: invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amountNum, 0),
    overdue: invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amountNum, 0),
  }), [invoices])

  // Filtered invoices based on search and filter
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.id.includes(searchTerm) || inv.service.includes(searchTerm)
      const matchesFilter = selectedFilter === 'all' || inv.status.toLowerCase() === selectedFilter
      return matchesSearch && matchesFilter
    })
  }, [invoices, searchTerm, selectedFilter])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30'
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
      case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Paid': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Pending': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'Overdue': return <AlertCircle className="h-5 w-5 text-red-600" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Invoices & Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your payments and download invoices</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
          <p className="text-3xl font-black">AED {stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-muted-foreground">Paid</p>
          </div>
          <p className="text-3xl font-black text-green-600">AED {stats.paid.toLocaleString()}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <p className="text-3xl font-black text-yellow-600">AED {stats.pending.toLocaleString()}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
          <p className="text-3xl font-black text-red-600">AED {stats.overdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex gap-2 flex-wrap mb-4">
          {(['all', 'paid', 'pending', 'overdue'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-bold text-sm capitalize transition-all ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {filter === 'all' ? 'All Invoices' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by invoice ID or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">#</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Service</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Due Date</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-muted-foreground">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm font-bold">{invoice.service}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleViewDetails(invoice)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(invoice.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
                          title="Download"
                        >
                          <Download className="h-4 w-4 text-green-600" />
                        </button>
                        {invoice.status !== 'Paid' && (
                          <button 
                            onClick={() => handleOpenPaymentModal(invoice)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
                            title="Pay"
                          >
                            <CreditCard className="h-4 w-4 text-purple-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No invoices found for this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-600 transition-colors text-left">
            <p className="font-bold mb-2">💳 Credit/Debit Card</p>
            <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
          </button>
          <button className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-600 transition-colors text-left">
            <p className="font-bold mb-2">🏦 Bank Transfer</p>
            <p className="text-sm text-muted-foreground">Bank account on file</p>
          </button>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Billing Name</p>
            <p className="font-bold">Ahmed Al-Mansoori</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Email</p>
            <p className="font-bold">ahmed@example.com</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Billing Address</p>
            <p className="font-bold">Villa 45, Palm Jumeirah, Dubai</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Phone</p>
            <p className="font-bold">+971 50 123 4567</p>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors">
          Edit Billing Information
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Make Payment</h3>
              <button onClick={() => setShowPaymentModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Invoice ID</p>
                <p className="font-bold text-lg">{selectedInvoice.id}</p>
                <p className="text-sm text-muted-foreground mt-2 mb-1">Amount Due</p>
                <p className="text-2xl font-black text-blue-600">{selectedInvoice.amount}</p>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-background"
                >
                  <option value="credit-card">Credit/Debit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Email Invoice</h3>
              <button onClick={() => setShowEmailModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Recipient Email</label>
                <input
                  type="email"
                  value={emailForm.recipientEmail}
                  onChange={(e) => setEmailForm({...emailForm, recipientEmail: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Message (Optional)</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  className="w-full p-2 border rounded-lg h-24"
                  placeholder="Add a message..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
