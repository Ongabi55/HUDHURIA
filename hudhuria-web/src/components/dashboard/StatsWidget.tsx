'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatsWidgetProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color?: 'burg' | 'blue' | 'green' | 'amber'
  trend?: string
  index?: number
}

const colorMap = {
  burg:  { bg: 'bg-burg/10',   text: 'text-burg-bright',  ring: 'ring-burg/20' },
  blue:  { bg: 'bg-blue-500/10', text: 'text-blue-400',  ring: 'ring-blue-500/20' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', ring: 'ring-green-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' },
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const raf = useRef<number>()
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.round(progress * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])
  return count
}

export function StatsWidget({ label, value, icon, color = 'burg', trend, index = 0 }: StatsWidgetProps) {
  const colors = colorMap[color]
  const numericValue = typeof value === 'number' ? value : null
  const animated = useCountUp(numericValue ?? 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl ring-1', colors.bg, colors.ring)}>
          <span className={colors.text}>{icon}</span>
        </div>
        {trend && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-[#F0F4FF]">
          {numericValue !== null ? animated : value}
        </p>
        <p className="text-sm text-muted mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
