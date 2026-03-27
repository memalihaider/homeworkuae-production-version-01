import { Suspense } from 'react'
import { ThankYouContent } from './ThankYouContent'

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#081a55] via-[#0f2b8a] to-[#173cae] p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <div className="h-24 w-24 mx-auto bg-green-400 rounded-full animate-pulse"></div>
            <h1 className="text-3xl md:text-4xl font-bold mt-4">Loading...</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#081a55] via-[#0f2b8a] to-[#173cae] p-4">
      <Suspense fallback={<LoadingFallback />}>
        <ThankYouContent />
      </Suspense>
    </div>
  )
}
