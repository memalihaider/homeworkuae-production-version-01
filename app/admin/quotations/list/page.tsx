'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ListChecks } from 'lucide-react'
import QuotationList from '../complete/components/QuotationList'

export default function QuotationListOnlyPage() {
  const router = useRouter()

  return (
    <div className="w-full min-h-screen bg-white text-black space-y-6 pb-10">
      <div className="relative overflow-hidden rounded-[32px] bg-white p-8 md:p-10 text-black shadow-2xl border border-gray-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                <ListChecks className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Quotation Module</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black">Quotation List Only</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base font-medium">
              Dedicated page to view, download, and manage quotation records.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/quotations/complete')}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back To Full Module
          </button>
        </div>

        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-blue-50 blur-[90px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-indigo-50 blur-[90px]"></div>
      </div>

      <QuotationList />
    </div>
  )
}
