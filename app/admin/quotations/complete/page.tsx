'use client'

import { useEffect, useState } from 'react'
import { 
  Plus, FileText, TrendingUp, Bell, CheckSquare, 
  Download, History, Sparkles, ArrowUpRight, Loader2
} from 'lucide-react'
import { getPDFAsBlob } from '@/lib/pdfGenerator'

import QuotationDashboard from './components/QuotationDashboard'
import QuotationList from './components/QuotationList'
import QuotationBuilder from './components/QuotationBuilder'
import QuotationApproval from './components/QuotationApproval'
import QuotationReminders from './components/QuotationReminders'

// Common interface for all components
interface BaseQuotation {
  id: string;
  quoteNumber: string;
  client: string;
  company: string;
  email: string;
  phone: string;
  total: number;
  currency: string;
  status: string;
  date: string;
  validUntil: string;
}

interface FirestoreTimestampLike {
  toDate?: () => Date;
  seconds?: number;
}

// For QuotationBuilder and local state
export interface LocalQuotation extends BaseQuotation {
  services: Array<Record<string, unknown>>;
  products: Array<Record<string, unknown>>;
  notes: string;
  terms: string;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  discountAmount: number;
  discount: number;
  discountType: string;
  location: string;
  currentAddress?: string;
  amount?: number;
  version?: number;
  lastModified?: string;
  clientId?: string;
  dueDate?: string;
  paymentMethods?: string[];
  createdBy?: string;
  createdById?: string;
  createdByPhone?: string;
  confirmationLetter?: string;
  companySealImage?: string;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    swiftCode?: string;
    iban?: string;
  };
  createdAt?: string | Date | FirestoreTimestampLike;
  updatedAt?: string | Date | FirestoreTimestampLike;
}

export default function QuotationsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'builder' | 'approval' | 'reminders'>('dashboard')
  const [editingQuotation, setEditingQuotation] = useState<LocalQuotation | null>(null)
  const [selectedQuotation, setSelectedQuotation] = useState<(Partial<LocalQuotation> & { id?: string | number }) | null>(null)
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  useEffect(() => {
    return () => {
      if (previewPdfUrl) {
        URL.revokeObjectURL(previewPdfUrl)
      }
    }
  }, [previewPdfUrl])

  const handleEdit = (quotation: Partial<LocalQuotation> & { id?: string | number }) => {
    // Convert any quotation format to LocalQuotation
    const editedQuotation: LocalQuotation = {
      ...(quotation as LocalQuotation),
      id: quotation.id?.toString() || '',
      quoteNumber: quotation.quoteNumber || `QUOTE-${Date.now()}`,
      client: quotation.client || 'No Client',
      company: quotation.company || '',
      email: quotation.email || '',
      phone: quotation.phone || '',
      total: quotation.total ?? quotation.amount ?? 0,
      currency: quotation.currency || 'AED',
      status: quotation.status || 'Sent',
      date: quotation.date || new Date().toISOString().split('T')[0],
      validUntil: quotation.validUntil || '',
      dueDate: (quotation as LocalQuotation).dueDate || quotation.validUntil || '',
      services: quotation.services || [],
      products: quotation.products || [],
      notes: quotation.notes ?? '',
      terms: quotation.terms ?? '',
      subtotal: quotation.subtotal ?? quotation.total ?? 0,
      taxAmount: quotation.taxAmount ?? 0,
      taxRate: quotation.taxRate ?? 0,
      discountAmount: quotation.discountAmount ?? 0,
      discount: quotation.discount ?? 0,
      discountType: quotation.discountType || 'percentage',
      location: quotation.location || '',
      currentAddress: (quotation as LocalQuotation).currentAddress || '',
      amount: quotation.amount ?? quotation.total ?? 0,
      version: quotation.version ?? 1,
      lastModified: quotation.lastModified || new Date().toISOString()
    }
    setEditingQuotation(editedQuotation)
    setActiveTab('builder')
  }

  const handleView = async (quotation: Partial<LocalQuotation> & { id?: string | number }) => {
    setSelectedQuotation(quotation)
    setIsGeneratingPreview(true)

    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl)
      setPreviewPdfUrl(null)
    }

    try {
      const previewData = {
        ...quotation,
        id: quotation.id?.toString() || '',
        client: quotation.client || 'Valued Customer',
        company: quotation.company || '',
        email: quotation.email || '',
        phone: quotation.phone || '',
        location: quotation.location || 'Dubai, UAE',
        currentAddress: (quotation as LocalQuotation).currentAddress || '',
        quoteNumber: quotation.quoteNumber || `QUOTE-${Date.now()}`,
        date: quotation.date || new Date().toISOString().split('T')[0],
        validUntil: quotation.validUntil || new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        dueDate: quotation.validUntil || new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        currency: quotation.currency || 'AED',
        taxRate: (quotation as any).taxRate || 5,
        discount: (quotation as any).discount || 0,
        discountAmount: (quotation as any).discountAmount || 0,
        discountType: (quotation as any).discountType || 'percentage',
        status: quotation.status || 'Sent',
        subtotal: (quotation as any).subtotal || quotation.total || 0,
        taxAmount: (quotation as any).taxAmount || 0,
        total: quotation.total || 0,
        notes: quotation.notes || '',
        terms: quotation.terms || '',
        paymentMethods: (quotation as any).paymentMethods || ['bank-transfer'],
        services: (quotation as any).services || [],
        products: (quotation as any).products || [],
        createdAt: (quotation as any).createdAt || new Date().toISOString(),
        updatedAt: (quotation as any).updatedAt || new Date().toISOString(),
        createdBy: (quotation as any).createdBy || '',
      }

      const pdfBlob = getPDFAsBlob(previewData as any)
      const objectUrl = URL.createObjectURL(pdfBlob)
      setPreviewPdfUrl(objectUrl)
    } catch (error) {
      console.error('Error generating quotation preview:', error)
      setPreviewPdfUrl(null)
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const closePreview = () => {
    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl)
      setPreviewPdfUrl(null)
    }
    setSelectedQuotation(null)
    setIsGeneratingPreview(false)
  }

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: TrendingUp },
    { id: 'list', label: 'Quotation List', icon: FileText },
    { id: 'builder', label: editingQuotation ? 'Edit Quotation' : 'Create New', icon: Plus },
    { id: 'approval', label: 'Approval Queue', icon: CheckSquare },
    { id: 'reminders', label: 'Notifications', icon: Bell },
  ] as const

  return (
    <div className="w-full min-h-screen bg-white text-black space-y-8 pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-8 md:p-12 text-black shadow-2xl border border-gray-200">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Sales Workspace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Quotation Management</h1>
            <p className="text-gray-600 mt-3 text-lg font-medium max-w-3xl">
              Generate professional quotes, manage approvals, and keep client follow-ups organized in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="group inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4 text-blue-600" />
              Export
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
            <button className="group inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all">
              <History className="w-4 h-4 text-blue-600" />
              Audit Log
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={`hero-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== 'builder') setEditingQuotation(null)
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-[11px] uppercase font-black tracking-widest transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-blue-50 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-indigo-50 blur-[100px]"></div>
      </div>

      {/* Content Area */}
      <div className="min-h-150 rounded-[28px] border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        {activeTab === 'dashboard' && <QuotationDashboard />}
        {activeTab === 'list' && (
          <QuotationList 
            onEdit={handleEdit}
            onView={handleView}
          />
        )}
        {activeTab === 'builder' && (
          <QuotationBuilder 
            initialData={editingQuotation}
            onSave={() => {
              setEditingQuotation(null)
              setActiveTab('list')
            }}
            onCancel={() => {
              setEditingQuotation(null)
              setActiveTab('list')
            }}
          />
        )}
        {activeTab === 'approval' && <QuotationApproval />}
        {activeTab === 'reminders' && <QuotationReminders />}
      </div>

      {selectedQuotation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-black">{selectedQuotation.quoteNumber || 'Quotation Preview'}</h3>
                <p className="text-sm text-gray-500">Complete quotation PDF preview</p>
              </div>
              <div className="flex items-center gap-2">
                {previewPdfUrl && (
                  <a
                    href={previewPdfUrl}
                    download={`Quotation_${(selectedQuotation.quoteNumber || 'Preview').toString().replace('#', '')}.pdf`}
                    className="px-3 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                )}
                <button
                  onClick={closePreview}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="bg-gray-50 h-[76vh]">
              {isGeneratingPreview ? (
                <div className="h-full flex items-center justify-center text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating quotation preview...
                </div>
              ) : previewPdfUrl ? (
                <iframe
                  title={`Quotation preview ${selectedQuotation.quoteNumber || ''}`}
                  src={previewPdfUrl}
                  className="w-full h-full"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Unable to generate preview. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}