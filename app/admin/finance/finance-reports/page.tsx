'use client'

import { useState, useMemo } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  DollarSign, 
  PieChart, 
  Download,
  Search,
  Filter,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Activity,
  FileText,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  ArrowDownRight,
  Calendar,
  Zap,
  Target,
  Building2,
  Wallet,
  Receipt,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  User,
  MessageSquare
} from 'lucide-react'

export default function FinanceReportsPage() {
  const [mainTab, setMainTab] = useState('reports')
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState('current-month')

  const revenueData = useMemo(() => ({
    totalRevenue: 12450.00,
    recognizedRevenue: 10850.00,
    deferredRevenue: 1600.00,
    unrealizedRevenue: 0,
    vatCollected: 1085.00,
    vatPayable: 1085.00,
    grossProfit: 8900.00,
    operatingExpenses: 2150.00,
    netProfit: 6750.00,
    margins: {
      gross: 71.4,
      net: 54.2
    }
  }), [])

  const reconciliationData = useMemo(() => ({
    bankBalance: 45250.00,
    bookBalance: 45150.00,
    difference: 100.00,
    unreconciled: [
      { date: '2025-12-27', amount: 50.00, description: 'Pending bank fee' },
      { date: '2025-12-26', amount: 50.00, description: 'Pending transfer' }
    ],
    reconciliationStatus: 'Pending',
    lastReconciled: '2025-12-22',
    daysSinceReconciliation: 1
  }), [])

  const cashLeakageData = useMemo(() => ({
    suspiciousActivity: [
      {
        id: 1,
        type: 'Duplicate Payment',
        amount: 984.50,
        date: '2025-12-24',
        client: 'Tech Solutions Inc',
        riskLevel: 'High',
        status: 'Flagged',
        resolved: false
      },
      {
        id: 2,
        type: 'Unclaimed Refund',
        amount: 250.00,
        date: '2025-12-15',
        client: 'Downtown Plaza',
        riskLevel: 'Medium',
        status: 'Investigation',
        resolved: false
      },
      {
        id: 3,
        type: 'Discount Variance',
        amount: 175.50,
        date: '2025-12-10',
        client: 'Medical Center West',
        riskLevel: 'Low',
        status: 'Resolved',
        resolved: true
      }
    ],
    totalLeakageRisk: 1409.50,
    detectionRate: 0.98,
    preventionRate: 0.92
  }), [])

  const vatData = useMemo(() => ({
    taxableAmount: 10850.00,
    vatRate: 0.10,
    vatCollected: 1085.00,
    vatPaid: 500.00,
    vatPayable: 585.00,
    invoicesWithoutVat: 2,
    complianceStatus: 'Compliant',
    lastFiledReturn: '2025-11-30',
    nextFilingDate: '2026-01-31',
    daysUntilFiling: 39
  }), [])

  const [debtors, setDebtors] = useState<any[]>([
    {
      id: 1,
      invoiceNumber: 'INV-2025-004',
      clientName: 'Downtown Plaza',
      amount: 1150.00,
      dueDate: '2025-12-20',
      daysOverdue: 3,
      lastReminder: '2025-12-22',
      agingBucket: 'Current',
      paymentDelayPrediction: {
        riskLevel: 'High',
        probability: 0.85,
        expectedPaymentDate: '2026-01-10',
        reason: 'Consistent late payments (avg 15 days)'
      },
      paymentHistory: {
        onTimePayments: 2,
        latePayments: 4,
        latenessAverage: 15
      },
      contactHistory: [
        { date: '2025-12-22', method: 'Email', status: 'Delivered' },
        { date: '2025-12-20', method: 'Email', status: 'Delivered' }
      ],
      escallationLevel: 1,
      nextAction: 'Phone call',
      notes: 'Frequent late payer, needs payment plan discussion'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2025-005',
      clientName: 'Green Valley Services',
      amount: 2800.00,
      dueDate: '2025-11-15',
      daysOverdue: 38,
      lastReminder: '2025-12-10',
      agingBucket: '31-60',
      paymentDelayPrediction: {
        riskLevel: 'Critical',
        probability: 0.95,
        expectedPaymentDate: '2026-02-01',
        reason: 'No payment activity, increasing default risk'
      },
      paymentHistory: {
        onTimePayments: 1,
        latePayments: 3,
        latenessAverage: 25
      },
      contactHistory: [
        { date: '2025-12-10', method: 'Phone', status: 'Promised payment' },
        { date: '2025-12-05', method: 'Email', status: 'No response' }
      ],
      escallationLevel: 2,
      nextAction: 'Executive follow-up',
      notes: 'Legal notice may be required if payment not received by 2026-01-05'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2025-006',
      clientName: 'Bright Solutions Ltd',
      amount: 1750.00,
      dueDate: '2025-10-20',
      daysOverdue: 64,
      lastReminder: '2025-12-15',
      agingBucket: '61-90',
      paymentDelayPrediction: {
        riskLevel: 'Critical',
        probability: 0.98,
        expectedPaymentDate: '2026-02-15',
        reason: 'Account on hold, multiple failed collections'
      },
      paymentHistory: {
        onTimePayments: 0,
        latePayments: 5,
        latenessAverage: 45
      },
      contactHistory: [
        { date: '2025-12-15', method: 'Phone', status: 'No answer' },
        { date: '2025-12-12', method: 'Email', status: 'Bounced' }
      ],
      escallationLevel: 3,
      nextAction: 'Legal action',
      notes: 'Account suspended, collection agency recommended'
    }
  ])

  const debtorsStats = useMemo(() => {
    const totalDebt = debtors.reduce((sum, debtor) => sum + debtor.amount, 0)
    const criticalRisk = debtors.filter(d => d.paymentDelayPrediction.riskLevel === 'Critical').length
    const avgOverdue = Math.round(debtors.reduce((sum, debtor) => sum + debtor.daysOverdue, 0) / debtors.length)
    const collectionRate = 84 // Mock data

    return { totalDebt, criticalRisk, avgOverdue, collectionRate }
  }, [debtors])

  return (
    <div className="min-h-screen bg-white text-black p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-8 md:p-12 text-black shadow-2xl border border-gray-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center border border-green-200">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Financial Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Finance Center</h1>
            <p className="text-gray-600 mt-3 text-lg font-medium max-w-xl">
              Comprehensive financial reports, VAT compliance, leakage detection, and debtor management.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="group relative flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98]">
              <Download className="h-5 w-5" />
              Export All Reports
            </button>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-green-50 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-blue-50 blur-[100px]"></div>
      </div>

      {/* Main Tab Selector */}
      <div className="flex bg-white border border-gray-200 rounded-2xl p-1 w-fit overflow-x-auto shadow-sm">
        {[
          { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
          { id: 'debtors', label: 'Debtors Dashboard', icon: AlertTriangle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              mainTab === tab.id 
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* REVENUE OVERVIEW */}
      {mainTab === 'reports' && reportType === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Revenue', value: `AED ${revenueData.totalRevenue.toLocaleString()}`, color: 'green', icon: Wallet, trend: 'Recognized: AED 10,850' },
              { label: 'Gross Profit', value: `AED ${revenueData.grossProfit.toLocaleString()}`, color: 'blue', icon: TrendingUp, trend: `${revenueData.margins.gross}% Margin` },
              { label: 'Net Profit', value: `AED ${revenueData.netProfit.toLocaleString()}`, color: 'purple', icon: DollarSign, trend: `${revenueData.margins.net}% Margin` }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm group hover:border-green-300 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600 border border-${stat.color}-200`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-${stat.color}-600 text-[10px] font-bold uppercase tracking-widest`}>{stat.trend}</span>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-black mt-2 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-8 flex items-center gap-3">
                <PieChart className="h-6 w-6 text-green-600" />
                Revenue Breakdown
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Recognized Revenue', value: revenueData.recognizedRevenue, color: 'green' },
                  { label: 'Deferred Revenue', value: revenueData.deferredRevenue, color: 'amber' },
                  { label: 'VAT Collected', value: revenueData.vatCollected, color: 'blue' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-black">AED {item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${item.color}-500 rounded-full`}
                        style={{ width: `${(item.value / revenueData.totalRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-8 flex items-center gap-3">
                <Activity className="h-6 w-6 text-green-600" />
                Operating Efficiency
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Operating Expenses</p>
                  <p className="text-2xl font-bold text-black">AED {revenueData.operatingExpenses.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Expense Ratio</p>
                  <p className="text-2xl font-bold text-green-600">17.2%</p>
                </div>
              </div>
              <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <p className="text-xs font-bold text-green-600 uppercase tracking-widest">AI Insight</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Operating expenses are 5% lower than industry average. Net margin is optimized for current scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANK RECONCILIATION */}
      {mainTab === 'reports' && reportType === 'reconciliation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-black">Reconciliation Status</h3>
                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  reconciliationData.reconciliationStatus === 'Compliant' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  {reconciliationData.reconciliationStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Bank Balance</p>
                  <p className="text-3xl font-bold text-black">AED {reconciliationData.bankBalance.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Book Balance</p>
                  <p className="text-3xl font-bold text-black">AED {reconciliationData.bookBalance.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="text-sm font-bold text-black">Unreconciled Difference</p>
                    <p className="text-xs text-gray-600">2 transactions pending review</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-600">AED {reconciliationData.difference.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-black">Pending Transactions</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reconciliationData.unreconciled.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4 text-xs text-gray-600">{item.date}</td>
                      <td className="px-8 py-4 text-xs text-black font-medium">{item.description}</td>
                      <td className="px-8 py-4 text-xs text-red-600 font-bold text-right">AED {item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-green-600" />
                History
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Reconciled</p>
                  <p className="text-xs font-bold text-black">{reconciliationData.lastReconciled}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Days Since</p>
                  <p className="text-xs font-bold text-green-600">{reconciliationData.daysSinceReconciliation} Day</p>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all">
                Start Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEAKAGE DETECTION */}
      {mainTab === 'reports' && reportType === 'leakage' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Leakage Risk</p>
              <p className="text-4xl font-black text-red-600">AED {cashLeakageData.totalLeakageRisk.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 mt-2">Across 3 flagged activities</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Detection Rate</p>
              <p className="text-4xl font-black text-green-600">{(cashLeakageData.detectionRate * 100).toFixed(0)}%</p>
              <p className="text-[10px] text-gray-500 mt-2">AI-powered monitoring</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Prevention Rate</p>
              <p className="text-4xl font-black text-blue-600">{(cashLeakageData.preventionRate * 100).toFixed(0)}%</p>
              <p className="text-[10px] text-gray-500 mt-2">Automated blocks active</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-xl font-black text-black">Suspicious Activity Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Risk</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cashLeakageData.suspiciousActivity.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-black">{item.type}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{item.date}</p>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-600">{item.client}</td>
                      <td className="px-8 py-6 text-sm font-black text-black">AED {item.amount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          item.riskLevel === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                        }`}>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-600">{item.status}</td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-all">
                          Investigate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VAT COMPLIANCE */}
      {mainTab === 'reports' && reportType === 'vat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-black">VAT Summary</h3>
                <span className="px-4 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 text-[10px] font-black uppercase tracking-widest">
                  {vatData.complianceStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">VAT Collected</p>
                  <p className="text-2xl font-black text-black">AED {vatData.vatCollected.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">VAT Paid</p>
                  <p className="text-2xl font-black text-black">AED {vatData.vatPaid.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">VAT Payable</p>
                  <p className="text-2xl font-black text-green-600">AED {vatData.vatPayable.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-black text-black">Invoices without VAT</p>
                    <p className="text-xs text-gray-600">Requires manual review for compliance</p>
                  </div>
                </div>
                <p className="text-2xl font-black text-yellow-600">{vatData.invoicesWithoutVat}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-lg font-black text-black mb-6 flex items-center gap-3">
                <Target className="h-5 w-5 text-green-600" />
                Filing Timeline
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Next Filing</p>
                  <p className="text-xs font-black text-black">{vatData.nextFilingDate}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Days Remaining</p>
                  <p className="text-xs font-black text-green-600">{vatData.daysUntilFiling} Days</p>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                Prepare VAT Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEBTORS DASHBOARD */}
      {mainTab === 'debtors' && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Outstanding', value: `AED ${debtorsStats.totalDebt.toLocaleString()}`, color: 'green', icon: DollarSign, trend: '12 Invoices' },
              { label: 'Critical Risk', value: debtorsStats.criticalRisk, color: 'red', icon: Flame, trend: 'Requires Action' },
              { label: 'Avg. Days Overdue', value: debtorsStats.avgOverdue, color: 'amber', icon: Clock, trend: 'Days' },
              { label: 'Collection Rate', value: `${debtorsStats.collectionRate}%`, color: 'blue', icon: Target, trend: 'Target: 95%' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm group hover:border-green-300 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600 border border-${stat.color}-200`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-${stat.color}-600 text-[10px] font-bold uppercase tracking-widest`}>{stat.trend}</span>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-black mt-2 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Debtors List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 p-6 rounded-[32px] flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Search className="h-6 w-6 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search debtors..."
                    className="bg-transparent text-black font-bold text-lg focus:outline-none w-full placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl border border-gray-200 transition-all">
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {debtors.map((debtor) => (
                <div key={debtor.id} className="bg-white border border-gray-200 p-8 rounded-[32px] group hover:border-green-300 transition-all shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold text-xl">
                        {debtor.clientName[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black group-hover:text-green-700 transition-colors">{debtor.clientName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{debtor.invoiceNumber}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${debtor.daysOverdue > 30 ? 'text-red-600' : 'text-amber-600'}`}>
                            {debtor.daysOverdue} Days Overdue
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-black">AED {debtor.amount.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Due: {debtor.dueDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 text-green-600" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Risk Prediction</p>
                      </div>
                      <p className={`text-lg font-bold ${debtor.paymentDelayPrediction.riskLevel === 'Critical' ? 'text-red-600' : debtor.paymentDelayPrediction.riskLevel === 'High' ? 'text-amber-600' : 'text-green-600'}`}>
                        {debtor.paymentDelayPrediction.riskLevel} Risk
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{debtor.paymentDelayPrediction.reason}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment History</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-black">{debtor.paymentHistory.onTimePayments}</p>
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">On-Time</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div>
                          <p className="text-lg font-bold text-red-600">{debtor.paymentHistory.latePayments}</p>
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Late</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-purple-600" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Next Action</p>
                      </div>
                      <p className="text-lg font-bold text-black">{debtor.nextAction}</p>
                      <p className="text-[10px] text-gray-500 mt-1">Escalation Level: {debtor.escallationLevel}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl border border-green-200 transition-all text-[10px] font-bold uppercase tracking-widest">
                        <Mail className="h-3 w-3" />
                        Send Reminder
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-200 transition-all text-[10px] font-bold uppercase tracking-widest">
                        <Phone className="h-3 w-3" />
                        Log Call
                      </button>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-black transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="bg-linear-to-br from-green-600 to-blue-600 rounded-[32px] p-8 text-white shadow-2xl shadow-green-600/20">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6" />
                  Recovery Strategy
                </h3>
                <div className="space-y-6">
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                    <p className="text-3xl font-bold">AED 4,550</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">Recoverable this week</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">Legal escalations pending</p>
                  </div>
                </div>
                <button className="w-full mt-8 py-4 bg-white text-green-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-green-50 transition-all">
                  Generate Recovery Report
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  Aging Summary
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Current (0-30)', value: 'AED 2,515', percent: 45, color: 'green' },
                    { label: '31-60 Days', value: 'AED 2,800', percent: 35, color: 'amber' },
                    { label: '61-90 Days', value: 'AED 1,750', percent: 20, color: 'red' }
                  ].map((bucket, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-gray-500">{bucket.label}</span>
                        <span className="text-black">{bucket.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${bucket.color}-500 rounded-full`}
                          style={{ width: `${bucket.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Recent Activity
                </h3>
                <div className="space-y-6">
                  {[
                    { user: 'System', action: 'Sent reminder to Downtown Plaza', time: '2h ago' },
                    { user: 'Ahmed', action: 'Logged call with Green Valley', time: '4h ago' },
                    { user: 'System', action: 'Escalated Bright Solutions', time: '1d ago' }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-[10px]">
                        {activity.user[0]}
                      </div>
                      <div>
                        <p className="text-xs text-black font-medium">{activity.action}</p>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
