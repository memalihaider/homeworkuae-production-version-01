'use client'

import { useState, useMemo } from 'react'
import { 
  Plus, Trash2, Search, Eye, Download, Save, 
  FileText, DollarSign, Calendar, User, Building2, Mail, Phone, 
  MapPin, Percent, Tag, ShoppingCart, Sparkles, Settings,
  FileCheck, AlertCircle, X, Send, Upload, Paperclip
} from 'lucide-react'

export default function QuotationBuilder() {
  const [builderMode, setBuilderMode] = useState<'quotation' | 'contract'>('quotation')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '', address: '' })
  const [clients, setClients] = useState([
    { id: 1, name: 'John Doe', company: 'Tech Solutions Inc.', email: 'john@techsolutions.com', phone: '+1 234 567 890', address: '123 Tech Lane, Silicon Valley, CA' },
    { id: 2, name: 'Jane Smith', company: 'Creative Agency', email: 'jane@creativeagency.com', phone: '+1 987 654 321', address: '456 Design St, New York, NY' },
    { id: 3, name: 'Robert Brown', company: 'Global Logistics', email: 'robert@globallogistics.com', phone: '+1 555 123 456', address: '789 Port Rd, Miami, FL' },
  ])

  // Mock data for services
  const availableServices = [
    { id: 1, name: 'Residential Deep Cleaning', price: 299, unit: 'per session' },
    { id: 2, name: 'Office Cleaning', price: 450, unit: 'per session' },
    { id: 3, name: 'Carpet Cleaning', price: 180, unit: 'per room' },
    { id: 4, name: 'Window Cleaning', price: 120, unit: 'per floor' },
    { id: 5, name: 'Move-in/Out Cleaning', price: 550, unit: 'per property' },
  ]

  // Quotation Form State
  const [quotationData, setQuotationData] = useState({
    quoteName: '',
    quoteNumber: `QT-${Date.now()}`,
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    shippingAddress: '', // Added shipping address
    referenceNumber: '', // Added PO/Ref number
    projectName: '', // Added project name
    currency: 'USD', // Added currency
    depositPercentage: 0, // Added deposit
    validUntil: '',
    paymentTerms: '30',
    paymentDocuments: [] as any[], // Added payment documents
    lineItems: [] as any[],
    subtotal: 0,
    taxRate: 5,
    vatRate: 15, // Added VAT field
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    notes: '',
    terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
  })

  // Contract Form State
  const [contractData, setContractData] = useState({
    contractTitle: '',
    contractNumber: `CNT-${Date.now()}`,
    companyName: '',
    companyEmail: '',
    clientName: '',
    clientCompany: '',
    clientAddress: '', // Added client address
    quotationReference: '', // Added quotation reference
    quotationId: '', // Added quotation ID
    startDate: '',
    endDate: '',
    contractValue: '',
    paymentTerms: 'Monthly in advance',
    terminationNotice: '30', // Added termination notice
    governingLaw: 'State of California', // Added governing law
    confidentialityLevel: 'Standard', // Added confidentiality
    liabilityLimit: '', // Added liability limit
    signatoryName: '', // Added signatory
    signatoryTitle: '', // Added signatory title
    scopeOfWork: '',
    terms: '',
    deliverables: '',
  })

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === parseInt(clientId))
    if (client) {
      if (builderMode === 'quotation') {
        setQuotationData(prev => ({
          ...prev,
          clientName: client.name,
          clientCompany: client.company,
          clientEmail: client.email,
          clientPhone: client.phone,
          clientAddress: client.address,
          shippingAddress: client.address, // Default shipping to billing
          quoteName: `Quotation for ${client.company} - ${new Date().toLocaleDateString()}`
        }))
      } else {
        setContractData(prev => ({
          ...prev,
          clientName: client.name,
          clientCompany: client.company,
          clientAddress: client.address,
          contractTitle: `Service Agreement - ${client.company}`,
          quotationReference: `QT-${client.id}-${Date.now()}`, // Generate default quotation reference
          quotationId: `QT-${Date.now()}` // Generate default quotation ID
        }))
      }
    }
  }

  const handleAddNewClient = () => {
    if (newClient.name && newClient.company && newClient.email) {
      const client = {
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        ...newClient
      }
      setClients([...clients, client])
      setShowNewClientModal(false)
      setNewClient({ name: '', company: '', email: '', phone: '', address: '' })
      // Auto-select the new client
      setTimeout(() => {
        handleClientSelect(client.id.toString())
      }, 0)
    }
  }

  const handleAddPaymentDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setQuotationData(prev => ({
            ...prev,
            paymentDocuments: [...prev.paymentDocuments, {
              id: Date.now(),
              name: file.name,
              type: file.type,
              size: file.size,
              url: event.target?.result as string
            }]
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemovePaymentDocument = (id: number) => {
    setQuotationData(prev => ({
      ...prev,
      paymentDocuments: prev.paymentDocuments.filter(doc => doc.id !== id)
    }))
  }

  const handleServiceSelect = (itemId: number, serviceId: string) => {
    const service = availableServices.find(s => s.id === parseInt(serviceId))
    if (service) {
      updateLineItem(itemId, 'name', service.name)
      updateLineItem(itemId, 'price', service.price)
    }
  }

  const generateAiDescription = () => {
    // Mock AI generation
    const descriptions = [
      "Professional cleaning service tailored for high-end office spaces.",
      "Comprehensive residential deep cleaning including all rooms and specialized surfaces.",
      "Premium window cleaning service using eco-friendly solutions and advanced equipment.",
    ]
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)]
    setQuotationData(prev => ({ ...prev, notes: prev.notes + (prev.notes ? "\n" : "") + "AI Suggestion: " + randomDesc }))
  }

  const generateAiContractTerms = () => {
    const clauses = [
      "The Service Provider shall maintain professional liability insurance throughout the term.",
      "Confidentiality: Both parties agree to keep all business information private.",
      "Termination: Either party may terminate with 30 days written notice.",
      "Force Majeure: Neither party is liable for delays caused by natural disasters."
    ]
    const randomClause = clauses[Math.floor(Math.random() * clauses.length)]
    setContractData(prev => ({ ...prev, terms: prev.terms + (prev.terms ? "\n" : "") + "AI Clause: " + randomClause }))
  }

  // Quotation calculations
  const quotationCalculations = useMemo(() => {
    let subtotal = quotationData.lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    let taxAmount = (subtotal * quotationData.taxRate) / 100
    let vatAmount = (subtotal * quotationData.vatRate) / 100
    let discountAmount = quotationData.discountType === 'percentage' 
      ? (subtotal * quotationData.discountValue) / 100 
      : quotationData.discountValue
    let total = subtotal + taxAmount + vatAmount - discountAmount
    return { subtotal, taxAmount, vatAmount, discountAmount, total }
  }, [quotationData])

  const addLineItem = () => {
    setQuotationData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: Date.now(), name: '', quantity: 1, price: 0, total: 0 }]
    }))
  }

  const updateLineItem = (id: number, field: string, value: any) => {
    setQuotationData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'price') {
            updated.total = updated.quantity * updated.price
          }
          return updated
        }
        return item
      })
    }))
  }

  const removeLineItem = (id: number) => {
    setQuotationData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }))
  }

  // ==================== QUOTATION BUILDER UI ====================
  const QuotationBuilderUI = () => (
    <div className="space-y-8 w-full mx-auto">
      {/* Client Selection & Info */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Client Selection
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-3 w-3" />
            AI-Powered Auto-fill
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Select Client</label>
              <button
                onClick={() => setShowNewClientModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Client
              </button>
            </div>
            <select
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name} ({client.company})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Company</p>
            <p className="text-slate-900 font-medium">{quotationData.clientCompany || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</p>
            <p className="text-slate-900 font-medium">{quotationData.clientEmail || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</p>
            <p className="text-slate-900 font-medium">{quotationData.clientPhone || '—'}</p>
          </div>
          <div className="md:col-span-3 space-y-1 pt-2 border-t border-slate-50">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Billing Address</p>
            <p className="text-slate-900">{quotationData.clientAddress || '—'}</p>
          </div>
          <div className="md:col-span-3 space-y-1 pt-2 border-t border-slate-50">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Shipping/Service Address</label>
            <textarea
              value={quotationData.shippingAddress}
              onChange={(e) => setQuotationData({ ...quotationData, shippingAddress: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              rows={2}
              placeholder="Enter service location address..."
            />
          </div>
        </div>
      </div>

      {/* Quote Details */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Quote Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Quote Name</label>
              <input
                type="text"
                value={quotationData.quoteName}
                onChange={(e) => setQuotationData({ ...quotationData, quoteName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Auto-generated or custom name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
              <input
                type="text"
                value={quotationData.projectName}
                onChange={(e) => setQuotationData({ ...quotationData, projectName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Q4 Office Renovation"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Valid Until</label>
                <input
                  type="date"
                  value={quotationData.validUntil}
                  onChange={(e) => setQuotationData({ ...quotationData, validUntil: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Reference #</label>
                <input
                  type="text"
                  value={quotationData.referenceNumber}
                  onChange={(e) => setQuotationData({ ...quotationData, referenceNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="PO-12345"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Payment Terms (Days)</label>
              <input
                type="number"
                value={quotationData.paymentTerms}
                onChange={(e) => setQuotationData({ ...quotationData, paymentTerms: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            Services & Items
          </h2>
          <button
            onClick={addLineItem}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-sm font-medium shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>

        {quotationData.lineItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <ShoppingCart className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No services selected yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotationData.lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-slate-100/50">
                <div className="col-span-5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Service Selection</label>
                  <select
                    onChange={(e) => handleServiceSelect(item.id, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a service...</option>
                    {availableServices.map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Price</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 mr-1">Total</label>
                  <p className="text-sm font-bold text-slate-900 pr-1">${item.total.toFixed(2)}</p>
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary & AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Notes & AI</h2>
            <button
              onClick={generateAiDescription}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all text-xs font-bold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Suggestion
            </button>
          </div>
          <textarea
            value={quotationData.notes}
            onChange={(e) => setQuotationData({ ...quotationData, notes: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            rows={6}
            placeholder="Add notes or use AI to generate professional descriptions..."
          />
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Financial Summary</h2>
            <select
              value={quotationData.currency}
              onChange={(e) => setQuotationData({ ...quotationData, currency: e.target.value })}
              className="bg-slate-800 border-none rounded-lg px-3 py-1 text-xs text-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (د.إ)</option>
            </select>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span className="text-white font-medium">{quotationData.currency} {quotationCalculations.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <span>Tax Rate</span>
                <input
                  type="number"
                  value={quotationData.taxRate}
                  onChange={(e) => setQuotationData({ ...quotationData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-12 bg-slate-800 border-none rounded px-1 py-0.5 text-xs text-white text-center"
                />
                <span>%</span>
              </div>
              <span className="text-white font-medium">{quotationData.currency} {quotationCalculations.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <span>VAT Rate</span>
                <input
                  type="number"
                  value={quotationData.vatRate}
                  onChange={(e) => setQuotationData({ ...quotationData, vatRate: parseFloat(e.target.value) || 0 })}
                  className="w-12 bg-slate-800 border-none rounded px-1 py-0.5 text-xs text-white text-center"
                />
                <span>%</span>
              </div>
              <span className="text-white font-medium">{quotationData.currency} {quotationCalculations.vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Discount</span>
              <span className="text-red-400 font-medium">-{quotationData.currency} {quotationCalculations.discountAmount.toFixed(2)}</span>
            </div>
            <div className="pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm">Required Deposit (%)</span>
                <input
                  type="number"
                  value={quotationData.depositPercentage}
                  onChange={(e) => setQuotationData({ ...quotationData, depositPercentage: parseFloat(e.target.value) || 0 })}
                  className="w-16 bg-slate-800 border-none rounded px-2 py-1 text-xs text-white text-right"
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-white">{quotationData.currency} {quotationCalculations.total.toFixed(2)}</p>
                </div>
                {quotationData.depositPercentage > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Deposit Due</p>
                    <p className="text-sm font-bold text-blue-400">
                      {quotationData.currency} {((quotationCalculations.total * quotationData.depositPercentage) / 100).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Documents */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-500" />
            Payment Documents
          </h2>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all text-xs font-bold cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            Upload Document
            <input
              type="file"
              onChange={handleAddPaymentDocument}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
            />
          </label>
        </div>
        
        {quotationData.paymentDocuments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Paperclip className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No documents uploaded yet</p>
            <p className="text-slate-400 text-xs mt-1">Upload payment methods, bank details, or terms documents</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotationData.paymentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    <Paperclip className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-500">{(doc.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePaymentDocument(doc.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Payment Information</p>
              <p className="text-xs text-blue-700 mt-1">
                Upload supporting documents such as payment terms, invoicing details, bank account information, or payment method documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-end pt-4">
        <button className="px-8 py-3 text-slate-600 font-semibold hover:text-slate-900 transition-colors">
          Discard
        </button>
        <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all font-semibold shadow-sm flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Draft
        </button>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2">
          <Send className="h-4 w-4" />
          Finalize & Send
        </button>
      </div>
    </div>
  )

  // ==================== CONTRACT BUILDER UI ====================
  const ContractBuilderUI = () => (
    <div className="space-y-8 w-full mx-auto">
      {/* Contract Header & Client Selection */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-500" />
            Contract Information
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-3 w-3" />
            AI-Powered Drafting
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Select Client for Contract</label>
              <button
                onClick={() => setShowNewClientModal(true)}
                className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Client
              </button>
            </div>
            <select
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all text-slate-900"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name} ({client.company})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Contract Title</label>
            <input
              type="text"
              value={contractData.contractTitle}
              onChange={(e) => setContractData({ ...contractData, contractTitle: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="e.g. Annual Maintenance Agreement"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Contract #</label>
            <input
              type="text"
              value={contractData.contractNumber}
              readOnly
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-400"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Client Address</label>
            <textarea
              value={contractData.clientAddress}
              onChange={(e) => setContractData({ ...contractData, clientAddress: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all text-sm"
              rows={2}
              placeholder="Client's registered address..."
            />
          </div>
        </div>
      </div>

      {/* Quotation Reference */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          Related Quotation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Quotation Reference</label>
            <input
              type="text"
              value={contractData.quotationReference}
              onChange={(e) => setContractData({ ...contractData, quotationReference: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="e.g. QT-12345 or Quotation for Office Cleaning"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Quotation ID (Optional)</label>
            <input
              type="text"
              value={contractData.quotationId}
              onChange={(e) => setContractData({ ...contractData, quotationId: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Link to existing quotation ID"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-900">Quotation Integration</p>
              <p className="text-xs text-purple-700 mt-1">
                Link this contract to a quotation to maintain traceability and automatically populate contract details from the quotation data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dates & Value */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Timeline & Value
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
            <input
              type="date"
              value={contractData.startDate}
              onChange={(e) => setContractData({ ...contractData, startDate: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">End Date</label>
            <input
              type="date"
              value={contractData.endDate}
              onChange={(e) => setContractData({ ...contractData, endDate: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Value ($)</label>
            <input
              type="number"
              value={contractData.contractValue}
              onChange={(e) => setContractData({ ...contractData, contractValue: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Notice (Days)</label>
            <input
              type="number"
              value={contractData.terminationNotice}
              onChange={(e) => setContractData({ ...contractData, terminationNotice: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="30"
            />
          </div>
        </div>
      </div>

      {/* Legal & Signatories */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-500" />
          Legal & Signatories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Governing Law</label>
                <input
                  type="text"
                  value={contractData.governingLaw}
                  onChange={(e) => setContractData({ ...contractData, governingLaw: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Confidentiality</label>
                <select
                  value={contractData.confidentialityLevel}
                  onChange={(e) => setContractData({ ...contractData, confidentialityLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High</option>
                  <option value="NDA Required">NDA Required</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Liability Limit ($)</label>
              <input
                type="text"
                value={contractData.liabilityLimit}
                onChange={(e) => setContractData({ ...contractData, liabilityLimit: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="e.g. 1,000,000 or Full Contract Value"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Authorized Signatory Name</label>
              <input
                type="text"
                value={contractData.signatoryName}
                onChange={(e) => setContractData({ ...contractData, signatoryName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Full legal name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Signatory Title</label>
              <input
                type="text"
                value={contractData.signatoryTitle}
                onChange={(e) => setContractData({ ...contractData, signatoryTitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="e.g. CEO, Managing Director"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scope & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Scope of Work</h2>
          <textarea
            value={contractData.scopeOfWork}
            onChange={(e) => setContractData({ ...contractData, scopeOfWork: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all text-sm"
            rows={8}
            placeholder="Detailed description of services to be provided..."
          />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Terms & Clauses</h2>
            <button
              onClick={generateAiContractTerms}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all text-xs font-bold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Clause
            </button>
          </div>
          <textarea
            value={contractData.terms}
            onChange={(e) => setContractData({ ...contractData, terms: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all text-sm"
            rows={8}
            placeholder="Legal terms, conditions, and AI-generated clauses..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-4">
        <button className="px-8 py-3 text-slate-600 font-semibold hover:text-slate-900 transition-colors">
          Discard
        </button>
        <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all font-semibold shadow-sm flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Draft
        </button>
        <button className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold shadow-lg shadow-purple-500/25 flex items-center gap-2">
          <Send className="h-4 w-4" />
          Finalize & Sign
        </button>
      </div>
    </div>
  )

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                  <Sparkles className="h-8 w-8" />
                </div>
                Document Builder
              </h1>
              <p className="text-slate-600 mt-2">Create and manage quotations and contracts</p>
            </div>
          </div>

          {/* Mode Selection Tabs */}
          <div className="flex gap-3 bg-white rounded-xl p-1 shadow-sm border border-slate-200 w-fit">
            <button
              onClick={() => setBuilderMode('quotation')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                builderMode === 'quotation'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              Quotation Builder
            </button>
            <button
              onClick={() => setBuilderMode('contract')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                builderMode === 'contract'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileCheck className="h-5 w-5" />
              Contract Builder
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-linear-to-b from-white/50 to-transparent">
          {builderMode === 'quotation' ? <QuotationBuilderUI /> : <ContractBuilderUI />}
        </div>

        {/* New Client Modal */}
        {showNewClientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Add New Client</h3>
                <button
                  onClick={() => setShowNewClientModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Tech Solutions Inc."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Email *</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Address</label>
                  <textarea
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    rows={2}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowNewClientModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewClient}
                  disabled={!newClient.name || !newClient.company || !newClient.email}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Client
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
