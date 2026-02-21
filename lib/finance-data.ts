// Unified Finance Data Structure
export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  location: string
  joinDate: string
  totalSpent: number
  projects: number
  lastService: string
  status: 'Active' | 'Inactive' | 'Suspended'
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze'
  notes: string
  taxId?: string
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  unit: string
  amount: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  clientEmail?: string
  invoiceDate: string
  dueDate: string
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'
  lineItems: InvoiceLineItem[]
  subtotal: number
  tax: number
  taxRate: number
  total: number
  notes?: string
  paymentTerms: string
  currencyCode: string
  sentDate?: string
  paidDate?: string
  createdBy: string
  updatedAt: string
}

export interface Payment {
  id: string
  invoiceId: string
  clientId: string
  amount: number
  paymentDate: string
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Cheque' | 'Cash' | 'Online'
  transactionRef?: string
  notes?: string
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded'
}

export interface Expense {
  id: string
  description: string
  category: string
  amount: number
  date: string
  paymentMethod: string
  vendor?: string
  invoice?: string
  approvalStatus: 'Pending' | 'Approved' | 'Rejected'
  approvedBy?: string
  notes?: string
}

export interface FinancialReport {
  period: string
  totalIncome: number
  totalExpenses: number
  profit: number
  profitMargin: number
  invoiceCount: number
  paidInvoices: number
  pendingInvoices: number
  overdueInvoices: number
  totalReceivables: number
}

// Mock Clients with real data
export const MOCK_CLIENTS: Client[] = [
  {
    id: 'CLI001',
    name: 'Ahmed Al-Mazrouei',
    company: 'Downtown Business Tower',
    email: 'ahmed.al-mazrouei@downtowntower.ae',
    phone: '+971-4-XXX-XXXX',
    location: 'Dubai, UAE',
    joinDate: '2024-06-15',
    totalSpent: 45000,
    projects: 12,
    lastService: '2026-01-20',
    status: 'Active',
    tier: 'Platinum',
    notes: 'VIP client, monthly maintenance contract'
  },
  {
    id: 'CLI002',
    name: 'Fatima Al-Ketbi',
    company: 'Shopping Mall Dubai',
    email: 'fatima.al-ketbi@malldubaiae',
    phone: '+971-4-XXX-XXXX',
    location: 'Dubai, UAE',
    joinDate: '2024-08-20',
    totalSpent: 32500,
    projects: 8,
    lastService: '2026-01-18',
    status: 'Active',
    tier: 'Gold',
    notes: 'Regular client with monthly deep cleaning'
  },
  {
    id: 'CLI003',
    name: 'Mohammed Hassan',
    company: 'Luxury Residential Complex',
    email: 'mohammed.hassan@luxuryres.ae',
    phone: '+971-4-XXX-XXXX',
    location: 'Dubai, UAE',
    joinDate: '2024-10-10',
    totalSpent: 18900,
    projects: 5,
    lastService: '2026-01-15',
    status: 'Active',
    tier: 'Silver',
    notes: 'New client, growing account'
  },
  {
    id: 'CLI004',
    name: 'Sarah Johnson',
    company: 'Healthcare Clinic',
    email: 'sarah.johnson@healthcareclinic.ae',
    phone: '+971-4-XXX-XXXX',
    location: 'Dubai, UAE',
    joinDate: '2025-02-01',
    totalSpent: 8500,
    projects: 3,
    lastService: '2026-01-10',
    status: 'Active',
    tier: 'Bronze',
    notes: 'Quarterly cleaning service'
  }
]

// Mock Invoices with real data
export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-2026-001',
    clientId: 'CLI001',
    clientName: 'Ahmed Al-Mazrouei - Downtown Business Tower',
    clientEmail: 'ahmed.al-mazrouei@downtowntower.ae',
    invoiceDate: '2026-01-15',
    dueDate: '2026-02-15',
    status: 'Paid',
    lineItems: [
      { id: 'LI001', description: 'Deep Cleaning Service (8 hours)', quantity: 2, unitPrice: 500, unit: 'hours', amount: 1000 },
      { id: 'LI002', description: 'Carpet Steam Cleaning', quantity: 10, unitPrice: 75, unit: 'sqm', amount: 750 },
      { id: 'LI003', description: 'Window Cleaning (High Rise)', quantity: 1, unitPrice: 250, unit: 'service', amount: 250 }
    ],
    subtotal: 2000,
    tax: 200,
    taxRate: 0.10,
    total: 2200,
    notes: 'Monthly maintenance service. Thank you for your business.',
    paymentTerms: '30 days',
    currencyCode: 'AED',
    sentDate: '2026-01-15',
    paidDate: '2026-01-20',
    createdBy: 'Admin',
    updatedAt: '2026-01-20'
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV-2026-002',
    clientId: 'CLI002',
    clientName: 'Fatima Al-Ketbi - Shopping Mall Dubai',
    clientEmail: 'fatima.al-ketbi@malldubaiae',
    invoiceDate: '2026-01-18',
    dueDate: '2026-02-18',
    status: 'Sent',
    lineItems: [
      { id: 'LI004', description: 'Full Floor Deep Cleaning', quantity: 3, unitPrice: 400, unit: 'floors', amount: 1200 },
      { id: 'LI005', description: 'Restroom Sanitization', quantity: 8, unitPrice: 100, unit: 'units', amount: 800 },
      { id: 'LI006', description: 'Lobby Maintenance', quantity: 1, unitPrice: 300, unit: 'service', amount: 300 }
    ],
    subtotal: 2300,
    tax: 230,
    taxRate: 0.10,
    total: 2530,
    notes: 'Regular monthly service with special attention to high-traffic areas.',
    paymentTerms: '30 days',
    currencyCode: 'AED',
    sentDate: '2026-01-18',
    createdBy: 'Admin',
    updatedAt: '2026-01-18'
  },
  {
    id: 'INV003',
    invoiceNumber: 'INV-2026-003',
    clientId: 'CLI003',
    clientName: 'Mohammed Hassan - Luxury Residential Complex',
    clientEmail: 'mohammed.hassan@luxuryres.ae',
    invoiceDate: '2026-01-10',
    dueDate: '2026-02-10',
    status: 'Overdue',
    lineItems: [
      { id: 'LI007', description: 'Residential Complex Cleaning', quantity: 2, unitPrice: 600, unit: 'service', amount: 1200 },
      { id: 'LI008', description: 'Exterior Maintenance', quantity: 1, unitPrice: 400, unit: 'service', amount: 400 }
    ],
    subtotal: 1600,
    tax: 160,
    taxRate: 0.10,
    total: 1760,
    notes: 'Quarterly deep cleaning service.',
    paymentTerms: '30 days',
    currencyCode: 'AED',
    sentDate: '2026-01-10',
    createdBy: 'Admin',
    updatedAt: '2026-01-10'
  },
  {
    id: 'INV004',
    invoiceNumber: 'INV-2026-004',
    clientId: 'CLI004',
    clientName: 'Sarah Johnson - Healthcare Clinic',
    clientEmail: 'sarah.johnson@healthcareclinic.ae',
    invoiceDate: '2026-01-22',
    dueDate: '2026-02-22',
    status: 'Sent',
    lineItems: [
      { id: 'LI009', description: 'Medical Facility Sanitization', quantity: 1, unitPrice: 800, unit: 'service', amount: 800 },
      { id: 'LI010', description: 'Biohazard Cleaning Supplies', quantity: 2, unitPrice: 150, unit: 'units', amount: 300 }
    ],
    subtotal: 1100,
    tax: 110,
    taxRate: 0.10,
    total: 1210,
    notes: 'Healthcare facility cleaning with special protocols.',
    paymentTerms: '30 days',
    currencyCode: 'AED',
    sentDate: '2026-01-22',
    createdBy: 'Admin',
    updatedAt: '2026-01-22'
  }
]

// Mock Payments
export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'PAY001',
    invoiceId: 'INV001',
    clientId: 'CLI001',
    amount: 2200,
    paymentDate: '2026-01-20',
    paymentMethod: 'Bank Transfer',
    transactionRef: 'TXN-2026-001',
    status: 'Completed',
    notes: 'Full payment received'
  },
  {
    id: 'PAY002',
    invoiceId: 'INV002',
    clientId: 'CLI002',
    amount: 2530,
    paymentDate: '2026-01-25',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    notes: 'Awaiting confirmation'
  }
]

// Mock Expenses
export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'EXP001',
    description: 'Industrial Cleaning Supplies',
    category: 'Supplies',
    amount: 2500,
    date: '2026-01-20',
    paymentMethod: 'Credit Card',
    vendor: 'Al-Manara Chemicals',
    approvalStatus: 'Approved',
    approvedBy: 'Ahmed Al-Mazrouei',
    notes: 'Monthly stock replenishment'
  },
  {
    id: 'EXP002',
    description: 'Vehicle Fuel & Maintenance',
    category: 'Transportation',
    amount: 1200,
    date: '2026-01-19',
    paymentMethod: 'Debit Card',
    vendor: 'ENOC',
    approvalStatus: 'Approved',
    approvedBy: 'Ahmed Al-Mazrouei',
    notes: 'Vehicle maintenance and fuel'
  },
  {
    id: 'EXP003',
    description: 'Staff Wages - Bi-weekly',
    category: 'Payroll',
    amount: 15000,
    date: '2026-01-15',
    paymentMethod: 'Bank Transfer',
    approvalStatus: 'Approved',
    approvedBy: 'Maria Rodriguez',
    notes: 'January bi-weekly payroll'
  },
  {
    id: 'EXP004',
    description: 'Equipment Rental',
    category: 'Equipment',
    amount: 800,
    date: '2026-01-18',
    paymentMethod: 'Credit Card',
    vendor: 'Equipment Rentals LLC',
    approvalStatus: 'Pending',
    notes: 'High-pressure cleaning equipment rental'
  },
  {
    id: 'EXP005',
    description: 'Office Utilities',
    category: 'Utilities',
    amount: 650,
    date: '2026-01-17',
    paymentMethod: 'Bank Transfer',
    approvalStatus: 'Approved',
    approvedBy: 'Sarah Johnson',
    notes: 'January electricity and water bills'
  }
]

// Calculate financial summary
export const calculateFinancialSummary = (invoices: Invoice[], payments: Payment[], expenses: Expense[]) => {
  const totalIncome = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0)

  const totalPending = invoices
    .filter(inv => inv.status === 'Sent' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.total, 0)

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const profit = totalIncome - totalExpenses
  const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0

  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length
  const pendingInvoices = invoices.filter(inv => inv.status === 'Sent').length
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue').length

  return {
    totalIncome,
    totalPending,
    totalExpenses,
    profit,
    profitMargin,
    totalInvoices: invoices.length,
    paidInvoices,
    pendingInvoices,
    overdueInvoices,
    netRevenue: totalIncome - totalExpenses
  }
}
