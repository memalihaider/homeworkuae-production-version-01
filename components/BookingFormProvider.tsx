"use client"

import { Suspense } from 'react'
import BookingForm from './BookingForm'

interface BookingFormProviderProps {
  preselectedServiceName?: string
}

function BookingFormSkeleton() {
  return (
    <div className="p-10 md:p-16 bg-white rounded-[3.5rem] border border-slate-100 shadow-3xl animate-pulse">
      <div className="h-12 bg-slate-200 rounded w-48 mb-6"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-8"></div>
    </div>
  )
}

export default function BookingFormProvider({ 
  preselectedServiceName
}: BookingFormProviderProps) {
  return (
    <Suspense fallback={<BookingFormSkeleton />}>
      <BookingForm 
        preselectedServiceName={preselectedServiceName}
      />
    </Suspense>
  )
}
