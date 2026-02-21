export interface QuotationService {
  id: number
  name: string
  quantity: number
  unitPrice: number
  total: number
  description?: string
}

export interface QuotationProduct {
  id: number
  name: string
  quantity: number
  unitPrice: number
  total: number
  sku?: string
}

export interface Quotation {
  total: any
  discountAmount: number
  subtotal: any
  id: number
  quoteNumber: string
  clientId: number
  client: string
  company: string
  email: string
  phone: string
  location: string
  amount: number
  amountOriginal?: number
  discount?: number
  discountType?: 'percentage' | 'fixed'
  tax?: number
  taxRate?: number
  currency: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired' | 'Cancelled'
  date: string
  validUntil: string
  dueDate: string
  paymentMethods: string[]
  template: 'standard' | 'professional' | 'minimal' | 'detailed'
  services: QuotationService[]
  products: QuotationProduct[]
  notes?: string
  terms?: string
  paymentTerms?: string
  version: number
  lastModified: string
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected'
  sentVia?: string[]
  reminderSent?: boolean
  reminderSentDate?: string
}

export interface HistoryRecord {
  id: number
  quotationId: number
  quoteNumber: string
  type: 'created' | 'modified' | 'sent' | 'accepted' | 'rejected' | 'invoice_generated' | 'contract_generated'
  timestamp: string
  user: string
  details: string
  metadata?: any
}

export interface Reminder {
  id: number
  documentId: number
  documentNumber: string
  documentType: 'quotation' | 'invoice' | 'contract'
  dueDate: string
  reminderDate: string
  reminderSent: boolean
  reminderSentDate?: string
  clientName: string
  amount: number
  status: 'overdue' | 'due-soon' | 'on-time'
  reminderMethod: 'email' | 'sms' | 'whatsapp'
}

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 1,
    quoteNumber: '#QT-001-2025',
    clientId: 1,
    client: 'Ahmed Al-Mansouri',
    company: 'Dubai Properties LLC',
    email: 'ahmed@dubaiprop.ae',
    phone: '+971-50-1111111',
    location: 'Dubai Marina',
    amount: 25500,
    amountOriginal: 30000,
    discount: 15,
    discountType: 'percentage',
    taxRate: 5,
    currency: 'AED',
    status: 'Sent',
    date: '2025-01-10',
    validUntil: '2025-02-10',
    dueDate: '2025-02-10',
    paymentMethods: ['bank-transfer', 'credit-card'],
    template: 'professional',
    services: [
      { id: 1, name: 'Residential Cleaning', quantity: 1, unitPrice: 15000, total: 15000, description: 'Complete residential cleaning' },
      { id: 2, name: 'Deep Cleaning', quantity: 1, unitPrice: 15000, total: 15000, description: 'Deep cleaning service' }
    ],
    products: [
      { id: 1, name: 'Cleaning Supplies Kit', quantity: 2, unitPrice: 500, total: 1000, sku: 'KIT-001' }
    ],
    notes: 'Monthly cleaning services arrangement',
    version: 1,
    lastModified: '2025-01-10',
    approvalStatus: 'Approved',
    sentVia: ['email'],
    reminderSent: false,
    total: undefined,
    discountAmount: 0,
    subtotal: undefined
  },
  {
    id: 2,
    quoteNumber: '#QT-002-2025',
    clientId: 2,
    client: 'Layla Hassan',
    company: 'Paradise Hotels & Resorts',
    email: 'layla@paradisehotels.ae',
    phone: '+971-50-4444444',
    location: 'Palm Jumeirah',
    amount: 102000,
    amountOriginal: 102000,
    discount: 0,
    discountType: 'percentage',
    taxRate: 5,
    currency: 'AED',
    status: 'Accepted',
    date: '2025-01-12',
    validUntil: '2025-02-12',
    dueDate: '2025-02-12',
    paymentMethods: ['bank-transfer', 'installment'],
    template: 'detailed',
    services: [
      { id: 3, name: 'Hotel Maintenance', quantity: 12, unitPrice: 8500, total: 102000, description: 'Monthly maintenance contract' }
    ],
    products: [],
    notes: 'High-value hotel maintenance contract',
    version: 1,
    lastModified: '2025-01-12',
    approvalStatus: 'Approved',
    sentVia: ['email', 'whatsapp'],
    reminderSent: true,
    reminderSentDate: '2025-01-14',
    total: undefined,
    discountAmount: 0,
    subtotal: undefined
  }
]

export const MOCK_HISTORY: HistoryRecord[] = [
  { id: 1, quotationId: 1, quoteNumber: '#QT-001-2025', type: 'created', timestamp: '2025-01-10 10:30 AM', user: 'Ahmed Al-Mazrouei', details: 'Quotation created for Ahmed Al-Mansouri', metadata: { amount: 25500, status: 'Draft' } },
  { id: 2, quotationId: 1, quoteNumber: '#QT-001-2025', type: 'modified', timestamp: '2025-01-10 11:45 AM', user: 'Ahmed Al-Mazrouei', details: 'Applied 15% discount and updated pricing', metadata: { discount: 15, originalAmount: 30000 } },
  { id: 3, quotationId: 1, quoteNumber: '#QT-001-2025', type: 'sent', timestamp: '2025-01-10 02:00 PM', user: 'Ahmed Al-Mazrouei', details: 'Quotation sent via Email', metadata: { method: 'email', recipient: 'ahmed@dubaiprop.ae' } },
]

export const MOCK_REMINDERS: Reminder[] = [
  { id: 1, documentId: 1, documentNumber: '#QT-001-2025', documentType: 'quotation', dueDate: '2025-02-10', reminderDate: '2025-02-03', reminderSent: false, clientName: 'Ahmed Al-Mansouri', amount: 25500, status: 'due-soon', reminderMethod: 'email' },
]

export const AVAILABLE_CLIENTS = [
  { id: 1, name: 'Ahmed Al-Mansouri', company: 'Dubai Properties LLC', email: 'ahmed@dubaiprop.ae', phone: '+971-50-1111111' },
  { id: 2, name: 'Layla Hassan', company: 'Paradise Hotels & Resorts', email: 'layla@paradisehotels.ae', phone: '+971-50-4444444' },
  { id: 3, name: 'Fatima Al-Noor', company: 'Al Noor Logistics', email: 'fatima@alnoorlogistics.ae', phone: '+971-50-2222222' }
]

export const AVAILABLE_SERVICES = [
  { id: 1, name: 'Residential Cleaning', price: 150, unit: 'hour', category: 'Cleaning' },
  { id: 2, name: 'Deep Cleaning', price: 450, unit: 'session', category: 'Cleaning' },
  { id: 3, name: 'AC Duct Cleaning', price: 800, unit: 'unit', category: 'Maintenance' },
  { id: 4, name: 'Pest Control', price: 300, unit: 'session', category: 'Maintenance' }
]

export const AVAILABLE_PRODUCTS = [
  { id: 1, name: 'Vacuum Cleaner', price: 1200, unit: 'pcs', sku: 'VC-001' },
  { id: 2, name: 'Cleaning Fluid 5L', price: 75, unit: 'can', sku: 'CF-005' },
  { id: 3, name: 'Microfiber Towel Set', price: 25, unit: 'set', sku: 'MT-010' }
]
