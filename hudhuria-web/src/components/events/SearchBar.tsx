'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Tafuta matukio...', className }: SearchBarProps) {
  const [local, setLocal] = useState(value)
  const [focused, setFocused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(timerRef.current)
  }, [local, onChange])

  useEffect(() => { setLocal(value) }, [value])

  return (
    <motion.div
      animate={{ scale: focused ? 1.01 : 1, boxShadow: focused ? '0 0 0 2px rgba(196,34,77,0.3)' : '0 0 0 0px transparent' }}
      transition={{ duration: 0.2 }}
      className={cn('relative flex items-center rounded-xl overflow-hidden', className)}
    >
      <div className="absolute left-3.5 text-muted pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 text-sm text-[#F0F4FF] placeholder:text-muted focus:outline-none focus:border-burg-bright/40 transition-colors"
      />
      {local && (
        <button
          onClick={() => { setLocal(''); onChange('') }}
          className="absolute right-3 text-muted hover:text-[#F0F4FF] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )
}
