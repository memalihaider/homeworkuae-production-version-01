'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      // Throttle mouse move events for better performance
      if (throttleRef.current) clearTimeout(throttleRef.current)
      throttleRef.current = setTimeout(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }, 8) // ~60fps with throttling
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList.contains('cursor-hover') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = () => {
      setIsHovering(false)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    window.addEventListener('mousemove', mouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })

    return () => {
      if (throttleRef.current) clearTimeout(throttleRef.current)
      window.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        input,
        textarea,
        select {
          cursor: text !important;
        }
      `}</style>

      {/* Outer ring - Rotating effect */}
      <motion.div
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          rotate: isHovering ? 180 : 0,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-9998"
      >
        <div className="relative w-full h-full">
          {/* Outer rotating border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-transparent border-t-primary border-r-primary rounded-full"
          />
          
          {/* Middle ring */}
          <div className="absolute inset-1 border border-primary/40 rounded-full" />
          
          {/* Animated dots around ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1" />
            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-primary/40 rounded-full transform -translate-x-1/2 translate-y-1" />
            <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-primary/60 rounded-full transform translate-x-1 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-primary/30 rounded-full transform -translate-x-1 -translate-y-1/2" />
          </motion.div>
        </div>
      </motion.div>

      {/* Center dot with pulse */}
      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicking ? 1.8 : isHovering ? 1.4 : 1,
          opacity: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring' as const, stiffness: 500, damping: 28 }}
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-9998 shadow-lg shadow-primary/80"
      />

      {/* Hover glow - Primary */}
      {isHovering && (
        <motion.div
          animate={{
            x: mousePosition.x - 35,
            y: mousePosition.y - 35,
            scale: 1,
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="fixed top-0 left-0 w-20 h-20 bg-primary rounded-full pointer-events-none z-9997 blur-2xl"
        />
      )}

      {/* Hover glow - Secondary subtle */}
      {isHovering && (
        <motion.div
          animate={{
            x: mousePosition.x - 45,
            y: mousePosition.y - 45,
            scale: 1.2,
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="fixed top-0 left-0 w-24 h-24 bg-primary rounded-full pointer-events-none z-9996 blur-3xl"
        />
      )}

      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          animate={{
            scale: 3,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed top-0 left-0 w-8 h-8 border-2 border-primary rounded-full pointer-events-none z-9996"
          style={{
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
          }}
        />
      )}

      {/* Trailing dots on fast movement */}
      <motion.div
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
          opacity: 0.3,
        }}
        transition={{ type: 'spring' as const, stiffness: 200, damping: 40 }}
        className="fixed top-0 left-0 w-1 h-1 bg-primary rounded-full pointer-events-none z-9995 blur-sm"
      />
    </>
  )
}
