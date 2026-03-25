'use client'

import { useState } from 'react'
import { 
  Plus, FileText, TrendingUp, Bell, CheckSquare, 
  Download, History, Sparkles, ArrowUpRight
} from 'lucide-react'

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
  amount?: number;
  version?: number;
  lastModified?: string;
}

export default function QuotationsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'builder' | 'approval' | 'reminders'>('dashboard')
  const [editingQuotation, setEditingQuotation] = useState<LocalQuotation | null>(null)

  const handleEdit = (quotation: Partial<LocalQuotation> & { id?: string | number }) => {
    // Convert any quotation format to LocalQuotation
    const editedQuotation: LocalQuotation = {
      id: quotation.id?.toString() || '',
      quoteNumber: quotation.quoteNumber || `QUOTE-${Date.now()}`,
      client: quotation.client || 'No Client',
      company: quotation.company || 'No Company',
      email: quotation.email || '',
      phone: quotation.phone || '',
      total: quotation.total || quotation.amount || 0,
      currency: quotation.currency || 'AED',
      status: quotation.status || 'Draft',
      date: quotation.date || new Date().toISOString().split('T')[0],
      validUntil: quotation.validUntil || '',
      services: quotation.services || [],
      products: quotation.products || [],
      notes: quotation.notes || '',
      terms: quotation.terms || '',
      subtotal: quotation.subtotal || quotation.total || 0,
      taxAmount: quotation.taxAmount || 0,
      taxRate: quotation.taxRate || 0,
      discountAmount: quotation.discountAmount || 0,
      discount: quotation.discount || 0,
      discountType: quotation.discountType || 'percentage',
      location: quotation.location || '',
      amount: quotation.amount || quotation.total || 0,
      version: quotation.version || 1,
      lastModified: quotation.lastModified || new Date().toISOString()
    }
    setEditingQuotation(editedQuotation)
    setActiveTab('builder')
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
    </div>
  )
}