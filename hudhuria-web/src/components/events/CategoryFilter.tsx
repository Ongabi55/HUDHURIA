'use client'

import { motion } from 'framer-motion'
import { Cpu, Palette, Zap, Briefcase, Users, Heart, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'Yote', value: '', icon: Grid3X3 },
  { label: 'Tech', value: 'Tech', icon: Cpu },
  { label: 'Culture', value: 'Culture', icon: Palette },
  { label: 'Sports', value: 'Sports', icon: Zap },
  { label: 'Career', value: 'Career', icon: Briefcase },
  { label: 'Social', value: 'Social', icon: Users },
  { label: 'Health', value: 'Health', icon: Heart },
]

interface CategoryFilterProps {
  selected: string
  onChange: (cat: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon
        const isActive = selected === cat.value
        return (
          <motion.button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0',
              isActive
                ? 'bg-gradient-burg text-white border-burg-bright/50 shadow-glow-sm'
                : 'bg-white/5 text-muted border-white/10 hover:bg-white/10 hover:text-[#F0F4FF]'
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{cat.label}</span>
            {isActive && (
              <motion.span
                layoutId="category-active"
                className="absolute inset-0 rounded-full bg-gradient-burg -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
