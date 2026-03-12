export default function ServicePageLoading() {
  return (
    <div className="flex flex-col overflow-hidden animate-pulse">
      {/* Hero skeleton */}
      <div className="relative py-32 bg-slate-900 overflow-hidden min-h-105 flex flex-col items-center justify-center gap-5">
        <div className="h-5 w-32 rounded-full bg-slate-700 mx-auto" />
        <div className="h-16 w-2/3 max-w-lg rounded-xl bg-slate-700 mx-auto" />
        <div className="h-6 w-1/2 max-w-md rounded-lg bg-slate-800 mx-auto" />
        <div className="h-6 w-64 rounded-lg bg-slate-800 mx-auto" />
      </div>

      {/* Details skeleton */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image placeholder */}
            <div className="rounded-[3rem] bg-slate-100 aspect-video" />
            {/* Text placeholder */}
            <div className="flex flex-col gap-5">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-10 w-3/4 rounded-lg bg-slate-200" />
              <div className="h-10 w-1/2 rounded-lg bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 w-4/6 rounded bg-slate-100" />
              <div className="grid grid-cols-2 gap-3 mt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA skeleton */}
      <div className="py-20 bg-slate-950 flex flex-col items-center gap-4">
        <div className="h-8 w-64 rounded-lg bg-slate-800 mx-auto" />
        <div className="h-5 w-80 rounded bg-slate-800 mx-auto" />
        <div className="h-12 w-48 rounded-xl bg-slate-700 mx-auto mt-4" />
      </div>
    </div>
  )
}
