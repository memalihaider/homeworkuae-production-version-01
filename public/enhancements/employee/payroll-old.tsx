'use client'

import { useState, useCallback, useMemo } from 'react'
import { DollarSign, Download, Eye, Filter, TrendingUp, Calendar } from 'lucide-react'

interface PayslipItem {
  id: string
  month: string
  year: number
  grossSalary: number
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  status: 'Processed' | 'Pending' | 'Paid'
  date: string
}

interface PayrollBreakdown {
  id: string
  label: string
  amount: number
  type: 'earning' | 'deduction'
  percentage?: number
}

interface TaxInfo {
  taxYear: number
  grossIncome: number
  taxableIncome: number
  taxPaid: number
  taxRate: number
  refund?: number
  status: string
}

export default function PayrollPage() {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipItem | null>(null)
  const [showPayslipModal, setShowPayslipModal] = useState(false)
  const [showTaxModal, setShowTaxModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Mock payslip data
  const payslips: PayslipItem[] = [
    {
      id: '1',
      month: 'January',
      year: 2024,
      basicSalary: 50000,
      allowances: 10000,
      grossSalary: 60000,
      deductions: 12000,
      netSalary: 48000,
      status: 'Paid',
      date: '2024-02-01'
    },
    {
      id: '2',
      month: 'December',
      year: 2023,
      basicSalary: 50000,
      allowances: 10000,
      grossSalary: 60000,
      deductions: 12000,
      netSalary: 48000,
      status: 'Paid',
      date: '2024-01-01'
    },
    {
      id: '3',
      month: 'November',
      year: 2023,
      basicSalary: 50000,
      allowances: 10000,
      grossSalary: 60000,
      deductions: 12000,
      netSalary: 48000,
      status: 'Processed',
      date: '2023-12-01'
    },
    {
      id: '4',
      month: 'October',
      year: 2023,
      basicSalary: 50000,
      allowances: 9000,
      grossSalary: 59000,
      deductions: 11800,
      netSalary: 47200,
      status: 'Paid',
      date: '2023-11-01'
    }
  ]

  // Mock current payroll details
  const currentPayrollBreakdown: PayrollBreakdown[] = [
    {
      id: '1',
      label: 'Basic Salary',
      amount: 50000,
      type: 'earning',
      percentage: 83.3
    },
    {
      id: '2',
      label: 'House Allowance',
      amount: 6000,
      type: 'earning',
      percentage: 10
    },
    {
      id: '3',
      label: 'Transportation Allowance',
      amount: 4000,
      type: 'earning',
      percentage: 6.7
    },
    {
      id: '4',
      label: 'Income Tax',
      amount: 8000,
      type: 'deduction',
      percentage: 13.3
    },
    {
      id: '5',
      label: 'Pension Contribution',
      amount: 3000,
      type: 'deduction',
      percentage: 5
    },
    {
      id: '6',
      label: 'Health Insurance',
      amount: 1000,
      type: 'deduction',
      percentage: 1.7
    }
  ]

  // Tax information
  const taxInformation: TaxInfo = {
    taxYear: 2024,
    grossIncome: 480000,
    taxableIncome: 430000,
    taxPaid: 64500,
    taxRate: 15,
    refund: 2000,
    status: 'Filed'
  }

  // Calculate statistics
  const totalEarnings = useMemo(() => {
    return payslips.reduce((sum, p) => sum + p.netSalary, 0)
  }, [])

  const averageSalary = useMemo(() => {
    return payslips.length > 0 ? Math.round(totalEarnings / payslips.length) : 0
  }, [])

  const latestPayslip = useMemo(() => {
    return payslips[0]
  }, [])

  // Filtered payslips
  const filteredPayslips = useMemo(() => {
    return payslips.filter(payslip => {
      const matchesSearch = payslip.month.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesYear = filterYear === 'all' || payslip.year.toString() === filterYear
      const matchesStatus = filterStatus === 'all' || payslip.status === filterStatus
      return matchesSearch && matchesYear && matchesStatus
    })
  }, [searchTerm, filterYear, filterStatus])

  const earningsItems = useMemo(() => {
    return currentPayrollBreakdown.filter(item => item.type === 'earning')
  }, [])

  const deductionsItems = useMemo(() => {
    return currentPayrollBreakdown.filter(item => item.type === 'deduction')
  }, [])

  const totalEarningsAmount = useMemo(() => {
    return earningsItems.reduce((sum, item) => sum + item.amount, 0)
  }, [earningsItems])

  const totalDeductionsAmount = useMemo(() => {
    return deductionsItems.reduce((sum, item) => sum + item.amount, 0)
  }, [deductionsItems])

  // Handler functions
  const handleViewPayslip = useCallback((payslip: PayslipItem) => {
    setSelectedPayslip(payslip)
    setShowPayslipModal(true)
  }, [])

  const handleDownloadPayslip = useCallback((payslipId: string) => {
    const payslip = payslips.find(p => p.id === payslipId)
    if (payslip) {
      alert(`Payslip for ${payslip.month} ${payslip.year} downloaded as PDF`)
    }
  }, [])

  const handleDownloadAllPayslips = useCallback(() => {
    alert('All payslips downloaded as ZIP file')
  }, [])

  const handleDownloadTaxCertificate = useCallback(() => {
    alert('Tax certificate downloaded as PDF')
  }, [])

  const handleViewTaxDetails = useCallback(() => {
    setShowTaxModal(true)
  }, [])

  const handleRequestPayslipReprint = useCallback(() => {
    alert('Payslip reprint request submitted. You will receive it within 2 business days.')
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Processed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll & Salary</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">View your salary, deductions, and payslips</p>
            </div>
            <button
              onClick={handleDownloadAllPayslips}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Download size={18} />
              Download All
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Salary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Monthly Salary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Latest Net Salary</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${latestPayslip.netSalary.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <DollarSign size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{latestPayslip.month} {latestPayslip.year}</p>
          </div>

          {/* Gross Salary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Latest Gross Salary</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${latestPayslip.grossSalary.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Before deductions</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">YTD Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Calendar size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{payslips.length} payslips</p>
          </div>

          {/* Average Salary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Average Salary</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${averageSalary.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <DollarSign size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Per month</p>
          </div>
        </div>

        {/* Earnings and Deductions Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Earnings</h2>
            <div className="space-y-3">
              {earningsItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3 bg-green-50 dark:bg-green-900/10 px-3 rounded-lg mt-4">
                <span className="font-bold text-gray-900 dark:text-white">Total Earnings</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">${totalEarningsAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Deductions</h2>
            <div className="space-y-3">
              {deductionsItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3 bg-red-50 dark:bg-red-900/10 px-3 rounded-lg mt-4">
                <span className="font-bold text-gray-900 dark:text-white">Total Deductions</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">${totalDeductionsAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tax Information (2024)</h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadTaxCertificate}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition"
              >
                <Download size={16} />
                Certificate
              </button>
              <button
                onClick={handleViewTaxDetails}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 rounded text-sm transition"
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Gross Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${taxInformation.grossIncome.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Taxable Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${taxInformation.taxableIncome.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Tax Paid</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${taxInformation.taxPaid.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Refund</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${taxInformation.refund?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payslips Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payslip History</h2>

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4 flex-col md:flex-row">
            <input
              type="text"
                placeholder="Search payslips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Processed">Processed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Payslips List */}
          <div className="space-y-4">
            {filteredPayslips.map((payslip) => (
              <div key={payslip.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {payslip.month} {payslip.year}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Processed on {payslip.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payslip.status)}`}>
                    {payslip.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">GROSS SALARY</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${payslip.grossSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">DEDUCTIONS</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">-${payslip.deductions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">NET SALARY</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">${payslip.netSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">DEDUCTION RATE</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {((payslip.deductions / payslip.grossSalary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewPayslip(payslip)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button
                    onClick={() => handleDownloadPayslip(payslip.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={handleRequestPayslipReprint}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Reprint Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payslip Detail Modal */}
      {showPayslipModal && selectedPayslip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Payslip - {selectedPayslip.month} {selectedPayslip.year}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPayslip.status)}`}>
                {selectedPayslip.status}
              </span>
            </div>

            <div className="space-y-6">
              {/* Earnings Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Basic Salary</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${selectedPayslip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Allowances</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${selectedPayslip.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-green-50 dark:bg-green-900/10 px-3 rounded">
                    <span className="font-bold text-gray-900 dark:text-white">Gross Salary</span>
                    <span className="font-bold text-green-600 dark:text-green-400">${selectedPayslip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Total Deductions</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">${selectedPayslip.deductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Net Salary</span>
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">${selectedPayslip.netSalary.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date: <span className="font-semibold text-gray-900 dark:text-white">{selectedPayslip.date}</span></p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDownloadPayslip(selectedPayslip.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                onClick={() => setShowPayslipModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Details Modal */}
      {showTaxModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tax Information 2024</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Tax Year</span>
                <span className="font-semibold text-gray-900 dark:text-white">{taxInformation.taxYear}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Gross Income</span>
                <span className="font-semibold text-gray-900 dark:text-white">${taxInformation.grossIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Taxable Income</span>
                <span className="font-semibold text-gray-900 dark:text-white">${taxInformation.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Tax Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">{taxInformation.taxRate}%</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Tax Paid</span>
                <span className="font-semibold text-red-600 dark:text-red-400">${taxInformation.taxPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 bg-green-50 dark:bg-green-900/10 px-3 rounded">
                <span className="font-bold text-gray-900 dark:text-white">Tax Refund</span>
                <span className="font-bold text-green-600 dark:text-green-400">${taxInformation.refund?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-700 dark:text-gray-300">Status</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold">
                  {taxInformation.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowTaxModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
