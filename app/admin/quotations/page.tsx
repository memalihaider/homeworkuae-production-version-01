'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QuotationsPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/admin/quotations/complete')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900 mb-2">Redirecting to Quotations Module...</p>
        <p className="text-gray-600">Please wait while we load the complete quotation system.</p>
      </div>
    </div>
  )
}
