import { useRef, useState, useCallback } from 'react'
import { LayoutGrid, Cpu, Palette, Zap, Briefcase, Users, Heart } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { cn } from '../../lib/utils'

const CATS = [
  { value: '',        Icon: LayoutGrid, color: 'text-[var(--text-muted)]',  grad: 'linear-gradient(135deg,#8B1A4A,#C4224D)' },
  { value: 'Tech',    Icon: Cpu,        color: 'text-blue-400',              grad: 'linear-gradient(135deg,#1d4ed8,#60a5fa)' },
  { value: 'Culture', Icon: Palette,    color: 'text-purple-400',            grad: 'linear-gradient(135deg,#7c3aed,#c084fc)' },
  { value: 'Sports',  Icon: Zap,        color: 'text-green-400',             grad: 'linear-gradient(135deg,#15803d,#4ade80)' },
  { value: 'Career',  Icon: Briefcase,  color: 'text-amber-400',             grad: 'linear-gradient(135deg,#b45309,#fbbf24)' },
  { value: 'Social',  Icon: Users,      color: 'text-pink-400',              grad: 'linear-gradient(135deg,#be185d,#f472b6)' },
  { value: 'Health',  Icon: Heart,      color: 'text-teal-400',              grad: 'linear-gradient(135deg,#0f766e,#2dd4bf)' },
]

export default function CategoryFilter({ selected, onChange }) {
  const { t } = useI18n()
  const ref = useRef(null)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ x: 0, scrollLeft: 0 })

  const labelMap = {
    '':        t('cat_all'),
    'Tech':    t('cat_tech'),
    'Culture': t('cat_culture'),
    'Sports':  t('cat_sports'),
    'Career':  t('cat_career'),
    'Social':  t('cat_social'),
    'Health':  t('cat_health'),
  }

  const onMouseDown = useCallback((e) => {
    const el = ref.current
    if (!el) return
    setDragging(false)
    drag.current = { x: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.style.cursor = 'grabbing'
    const onMove = (ev) => {
      const walk = (ev.pageX - el.offsetLeft - drag.current.x) * 1.5
      if (Math.abs(walk) > 4) setDragging(true)
      el.scrollLeft = drag.current.scrollLeft - walk
    }
    const onUp = () => {
      el.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      setTimeout(() => setDragging(false), 50)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--bg), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--bg), transparent)' }} />

      <div
        ref={ref}
        onMouseDown={onMouseDown}
        className="flex gap-2 overflow-x-auto pb-0.5 px-1 scrollbar-hide select-none cursor-grab"
      >
        {CATS.map((cat) => {
          const isActive = selected === cat.value
          const label = labelMap[cat.value]
          return (
            <button
              key={cat.value === '' ? 'all' : cat.value}
              onClick={() => { if (!dragging) onChange(cat.value) }}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                'whitespace-nowrap shrink-0 border transition-all duration-200',
                'focus-visible:outline-none',
                isActive ? 'text-white border-transparent' : cn('border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]', cat.color)
              )}
              style={isActive ? { background: cat.grad, boxShadow: '0 0 12px rgba(196,34,77,0.2)' } : {}}
            >
              <cat.Icon size={14} className={cn('shrink-0', isActive ? 'text-white' : cat.color)} />
              <span>{label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
