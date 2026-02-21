'use client'

import { useState } from 'react'
import { 
  Plus, FileText, TrendingUp, Bell, CheckSquare, 
  Download, History
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
  services: any[];
  products: any[];
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

  const handleEdit = (quotation: any) => {
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
    <div className="w-full bg-white min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Quotation Management</h1>
          <p className="text-sm text-gray-500 font-medium">Generate professional quotes, track approvals, and manage client follow-ups</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold uppercase tracking-tight text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
           </button>
           <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold uppercase tracking-tight text-gray-600 hover:bg-gray-50 transition-colors">
              <History className="w-4 h-4" />
              Audit Log
           </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded border border-gray-300 p-1 mb-6 flex gap-1 overflow-x-auto shadow-none">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id !== 'builder') setEditingQuotation(null)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors whitespace-nowrap text-[12px] uppercase font-bold tracking-tight ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
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