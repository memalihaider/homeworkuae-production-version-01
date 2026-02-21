'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AICenterDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/ai-command-center/recommendations')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to AI Recommendations...</p>
      </div>
    </div>
  )
}