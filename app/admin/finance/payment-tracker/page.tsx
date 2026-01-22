'use client'

import { useState, useMemo } from 'react'
import { 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  MoreVertical,
  ChevronRight,
  Wallet,
  ShieldCheck,
  Zap,
  History,
  Bell
} from 'lucide-react'

export default function PaymentTrackerPage() {
  const [payments, setPayments] = useState<any[]>([
    {
      id: 1,
      invoiceNumber: 'INV-2025-001',
      clientName: 'Acme Corporation',
      dueDate: '2026-01-23',
      totalAmount: 1375.00,
      paidAmount: 0,
      remainingAmount: 1375.00,
      status: 'Pending',
      paymentSchedule: [
        { dueDate: '2026-01-23', amount: 1375.00, paid: false }
      ],
      paymentHistory: [],
      lastReminder: null,
      paymentMethod: null,
      daysOverdue: 0,
      currency: 'AED'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2025-002',
      clientName: 'Tech Solutions Inc',
      dueDate: '2026-01-22',
      totalAmount: 984.50,
      paidAmount: 984.50,
      remainingAmount: 0,
      status: 'Paid',
      paymentSchedule: [
        { dueDate: '2026-01-22', amount: 984.50, paid: true, paidOn: '2025-12-24' }
      ],
      paymentHistory: [
        { date: '2025-12-24', amount: 984.50, method: 'Bank Transfer' }
      ],
      lastReminder: null,
      paymentMethod: 'Bank Transfer',
      daysOverdue: 0,
      currency: 'AED'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2025-003',
      clientName: 'Medical Center West',
      dueDate: '2026-01-04',
      totalAmount: 2365.00,
      paidAmount: 1000.00,
      remainingAmount: 1365.00,
      status: 'Partial',
      paymentSchedule: [
        { dueDate: '2026-01-04', amount: 2365.00, paid: false, partialPaid: 1000.00, partialPaidOn: '2025-12-27' }
      ],
      paymentHistory: [
        { date: '2025-12-27', amount: 1000.00, method: 'Cheque' }
      ],
      lastReminder: '2025-12-28',
      paymentMethod: 'Cheque (Partial)',
      daysOverdue: 0,
      currency: 'AED'
    },
    {
      id: 4,
      invoiceNumber: 'INV-2025-004',
      clientName: 'Downtown Plaza',
      dueDate: '2025-12-20',
      totalAmount: 1150.00,
      paidAmount: 0,
      remainingAmount: 1150.00,
      status: 'Overdue',
      paymentSchedule: [
        { dueDate: '2025-12-20', amount: 1150.00, paid: false }
      ],
      paymentHistory: [],
      lastReminder: '2025-12-22',
      paymentMethod: null,
      daysOverdue: 3,
      currency: 'AED'
    }
  ])

  const [selectedPaymentId, setSelectedPaymentId] = useState(1)
  const [filterStatus, setFilterStatus] = useState('All')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    method: 'Bank Transfer',
    notes: ''
  })

  const selectedPayment = payments.find(p => p.id === selectedPaymentId) || payments[0]

  const filteredPayments = useMemo(() => {
    if (filterStatus === 'All') return payments
    return payments.filter(p => p.status === filterStatus)
  }, [payments, filterStatus])

  const stats = useMemo(() => ({
    total: payments.length,
    pending: payments.filter(p => p.status === 'Pending').length,
    partial: payments.filter(p => p.status === 'Partial').length,
    paid: payments.filter(p => p.status === 'Paid').length,
    overdue: payments.filter(p => p.status === 'Overdue').length,
    totalOutstanding: payments.reduce((sum, p) => sum + p.remainingAmount, 0),
    totalCollected: payments.reduce((sum, p) => sum + p.paidAmount, 0),
    collectionRate: ((payments.reduce((sum, p) => sum + p.paidAmount, 0) / payments.reduce((sum, p) => sum + p.totalAmount, 0)) * 100).toFixed(1)
  }), [payments])

  const handleRecordPayment = () => {
    if (paymentForm.amount <= 0) return

    setPayments(payments.map(p =>
      p.id === selectedPayment.id
        ? {
            ...p,
            paidAmount: p.paidAmount + paymentForm.amount,
            remainingAmount: Math.max(0, p.remainingAmount - paymentForm.amount),
            status: p.remainingAmount - paymentForm.amount === 0 ? 'Paid' : 'Partial',
            paymentHistory: [...p.paymentHistory, {
              date: new Date().toISOString().split('T')[0],
              amount: paymentForm.amount,
              method: paymentForm.method
            }],
            paymentMethod: paymentForm.method,
            lastReminder: null
          }
        : p
    ))
    setShowPaymentModal(false)
    setPaymentForm({ amount: 0, method: 'Bank Transfer', notes: '' })
  }

  const handleSendReminder = (paymentId: number) => {
    setPayments(payments.map(p =>
      p.id === paymentId
        ? { ...p, lastReminder: new Date().toISOString().split('T')[0] }
        : p
    ))
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-black">
              Payment Tracker
            </h1>
          </div>
          <p className="text-gray-600">Cash flow management, payment schedules, and reconciliation</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all text-black">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all shadow-lg shadow-green-500/20">
            <TrendingUp className="w-4 h-4" />
            <span>Cash Flow Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: `AED ${stats.totalCollected.toLocaleString()}`, icon: Wallet, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Outstanding', value: `AED ${stats.totalOutstanding.toLocaleString()}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Collection Rate', value: `${stats.collectionRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Overdue Invoices', value: stats.overdue, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${stat.bg} rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time</span>
            </div>
            <div className="text-2xl font-bold text-black mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Payment List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex gap-2">
                {['All', 'Pending', 'Partial', 'Paid', 'Overdue'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredPayments.map((payment) => (
                <button
                  key={payment.id}
                  onClick={() => setSelectedPaymentId(payment.id)}
                  className={`w-full p-5 text-left transition-all hover:bg-gray-50 ${
                    selectedPaymentId === payment.id ? 'bg-green-50 border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-black block">{payment.invoiceNumber}</span>
                      <span className="text-xs text-gray-600">{payment.clientName}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      payment.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      payment.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      payment.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-black font-medium">
                        {((payment.paidAmount / payment.totalAmount) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          payment.status === 'Paid' ? 'bg-green-500' :
                          payment.status === 'Overdue' ? 'bg-red-500' :
                          'bg-green-400'
                        }`}
                        style={{ width: `${(payment.paidAmount / payment.totalAmount) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {payment.dueDate}
                      </span>
                      <span className="font-bold text-white text-sm">
                        AED {payment.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Details & History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Detail Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-green-50 to-transparent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{selectedPayment.invoiceNumber}</h2>
                  <p className="text-sm text-gray-600">{selectedPayment.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Amount Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Total Amount</label>
                  <div className="text-xl font-bold text-black">AED {selectedPayment.totalAmount.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
                  <label className="text-[10px] font-bold text-green-600 uppercase tracking-widest block mb-1">Paid Amount</label>
                  <div className="text-xl font-bold text-green-700">AED {selectedPayment.paidAmount.toLocaleString()}</div>
                </div>
                <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
                  <label className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Outstanding</label>
                  <div className="text-xl font-bold text-red-700">AED {selectedPayment.remainingAmount.toLocaleString()}</div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Due Date</label>
                    <div className="flex items-center gap-2 text-black font-medium">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      {selectedPayment.dueDate}
                    </div>
                    {selectedPayment.daysOverdue > 0 && (
                      <div className="mt-1 text-xs text-red-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {selectedPayment.daysOverdue} days overdue
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Payment Method</label>
                    <div className="text-black font-medium">
                      {selectedPayment.paymentMethod || 'Not specified'}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Last Reminder</label>
                    <div className="text-black font-medium">
                      {selectedPayment.lastReminder || 'No reminders sent'}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Risk Level</label>
                    <div className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${
                      selectedPayment.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      selectedPayment.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedPayment.status === 'Overdue' ? 'CRITICAL' : 'STABLE'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction History</label>
                  <History className="w-4 h-4 text-gray-500" />
                </div>
                <div className="space-y-2">
                  {selectedPayment.paymentHistory.length > 0 ? (
                    selectedPayment.paymentHistory.map((history: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <ArrowDownRight className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-black">{history.method}</p>
                            <p className="text-[10px] text-gray-500">{history.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-700">+AED {history.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500">Confirmed</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-sm text-gray-500">No transactions recorded yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 flex gap-3">
                {selectedPayment.status !== 'Paid' && (
                  <>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-green-500/20"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Record Payment
                    </button>
                    <button
                      onClick={() => handleSendReminder(selectedPayment.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-xl transition-all font-bold border border-gray-300"
                    >
                      <Bell className="w-4 h-4" />
                      Send Reminder
                    </button>
                  </>
                )}
                <button className="p-3 bg-gray-100 hover:bg-gray-200 text-black rounded-xl transition-all border border-gray-300">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-700 mb-1">Cash Flow Insight</h4>
              <p className="text-xs text-blue-600 leading-relaxed">
                Based on current collection rates, you are projected to reach your monthly revenue target 3 days ahead of schedule. 
                Consider prioritizing the {stats.overdue} overdue invoices to maximize liquidity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-black">Record Payment</h3>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Amount (AED)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) })}
                    placeholder={selectedPayment.remainingAmount.toFixed(2)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">AED</div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 font-medium">
                  Outstanding Balance: <span className="text-red-600">AED {selectedPayment.remainingAmount.toLocaleString()}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all appearance-none"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Transaction reference, bank details..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
