import { ReactNode } from 'react'

interface InteractiveButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
}

export function InteractiveButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
}: InteractiveButtonProps) {
  const baseClasses = 'cursor-hover relative overflow-hidden group transition-all duration-300'

  const variants = {
    primary:
      'px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 hover:shadow-2xl hover:shadow-primary/40',
    secondary:
      'px-8 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:scale-105 hover:shadow-lg hover:bg-slate-200',
    outline:
      'px-8 py-3 border-2 border-primary text-primary rounded-xl font-bold hover:scale-105 hover:bg-primary/10',
  }

  const Component = href ? 'a' : 'button'

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {/* Hover background animation */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Component>
  )
}

interface InteractiveCardProps {
  children: ReactNode
  className?: string
}

export function InteractiveCard({ children, className = '' }: InteractiveCardProps) {
  return (
    <div
      className={`cursor-hover group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${className}`}
    >
      {/* Background animation on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-500" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
