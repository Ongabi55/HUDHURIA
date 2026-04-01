'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, Cpu, Palette, Zap, Briefcase, Users, Heart } from 'lucide-react'
import { useI18n } from '@/contexts/i18n'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: '',        icon: LayoutGrid, color: 'text-[var(--text-muted)]' },
  { value: 'Tech',    icon: Cpu,        color: 'text-blue-400'            },
  { value: 'Culture', icon: Palette,    color: 'text-purple-400'          },
  { value: 'Sports',  icon: Zap,        color: 'text-green-400'           },
  { value: 'Career',  icon: Briefcase,  color: 'text-amber-400'           },
  { value: 'Social',  icon: Users,      color: 'text-pink-400'            },
  { value: 'Health',  icon: Heart,      color: 'text-teal-400'            },
]

const ACTIVE_GRADIENTS: Record<string, string> = {
  '':        'from-burg via-burg-bright to-burg-mid',
  'Tech':    'from-blue-600 to-blue-400',
  'Culture': 'from-purple-600 to-purple-400',
  'Sports':  'from-green-600 to-green-400',
  'Career':  'from-amber-600 to-amber-400',
  'Social':  'from-pink-600 to-pink-400',
  'Health':  'from-teal-600 to-teal-400',
}

interface CategoryFilterProps {
  selected: string
  onChange: (cat: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { t } = useI18n()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const labelMap: Record<string, string> = {
    '':        t('cat_all'),
    'Tech':    t('cat_tech'),
    'Culture': t('cat_culture'),
    'Sports':  t('cat_sports'),
    'Career':  t('cat_career'),
    'Social':  t('cat_social'),
    'Health':  t('cat_health'),
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(false)
    dragStart.current = { x: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.style.cursor = 'grabbing'
    const onMove = (ev: MouseEvent) => {
      const walk = (ev.pageX - el.offsetLeft - dragStart.current.x) * 1.5
      if (Math.abs(walk) > 4) setIsDragging(true)
      el.scrollLeft = dragStart.current.scrollLeft - walk
    }
    const onUp = () => {
      el.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      setTimeout(() => setIsDragging(false), 50)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="flex gap-2 overflow-x-auto pb-0.5 px-1 scrollbar-hide select-none cursor-grab"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = selected === cat.value
          const label = labelMap[cat.value]

          return (
            <motion.button
              key={cat.value === '' ? 'all' : cat.value}
              onClick={() => { if (!isDragging) onChange(cat.value) }}
              whileTap={{ scale: 0.94 }}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                'whitespace-nowrap shrink-0 transition-colors duration-200 border',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burg-bright/50',
                isActive
                  ? 'text-white border-transparent shadow-glow-sm'
                  : cn(
                      'bg-[var(--glass-bg)] backdrop-blur-sm border-[var(--glass-border)]',
                      'hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]',
                      cat.color
                    )
              )}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="cat-active-pill"
                    className={cn(
                      'absolute inset-0 rounded-full bg-gradient-to-r -z-10',
                      ACTIVE_GRADIENTS[cat.value]
                    )}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              <Icon className={cn('w-3.5 h-3.5 shrink-0', isActive ? 'text-white' : cat.color)} />
              <span>{label}</span>

              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
