import { ReactNode } from 'react'
import { Brain } from 'lucide-react'
import Link from 'next/link'

export default function AICenterLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { href: '/admin/ai-command-center/recommendations', label: 'AI Recommendations', icon: '💡' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-navigation */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap font-bold text-sm cursor-pointer">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      {children}
    </div>
  )
}