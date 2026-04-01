import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { eventsApi } from '../lib/api'
import EventCard, { EventCardSkeleton } from '../components/events/EventCard'
import CategoryFilter from '../components/events/CategoryFilter'
import { useI18n } from '../context/I18nContext'

const PAGE_SIZE = 9

function SearchBar({ value, onChange }) {
  const [local, setLocal] = useState(value)
  const timer = useRef(null)

  useEffect(() => { setLocal(value) }, [value])

  function handleChange(e) {
    const v = e.target.value
    setLocal(v)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(v), 300)
  }

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none" />
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder="Search events..."
        className="input-base pl-10 pr-10"
      />
      {local && (
        <button onClick={() => { setLocal(''); onChange('') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text)]">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default function Discover() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [page,     setPage]     = useState(1)
  const [events,   setEvents]   = useState([])
  const [total,    setTotal]    = useState(0)
  const [hasMore,  setHasMore]  = useState(false)
  const [loading,  setLoading]  = useState(true)
  const [fetching, setFetching] = useState(false)

  const fetchEvents = useCallback(async () => {
    setFetching(true)
    try {
      const res = await eventsApi.list({
        search: search || undefined,
        category: category || undefined,
        status: 'PUBLISHED',
        page,
        pageSize: PAGE_SIZE,
      })
      const data = res.data?.data
      setEvents(data?.items ?? [])
      setTotal(data?.total ?? 0)
      setHasMore(data?.hasNextPage ?? false)
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
      setFetching(false)
    }
  }, [search, category, page])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  function handleSearch(v)   { setSearch(v);   setPage(1) }
  function handleCategory(v) { setCategory(v); setPage(1); setSearchParams(v ? { category: v } : {}) }

  return (
    <div className="min-h-screen px-4 pt-10 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">Events</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ color: 'var(--text)' }}>
            Discover Events
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            {total > 0 ? `${total} events waiting for you` : 'Find events that excite you'}
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-8" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="max-w-6xl mx-auto space-y-3">
            <SearchBar value={search} onChange={handleSearch} />
            <CategoryFilter selected={category} onChange={handleCategory} />
          </div>
        </div>

        {/* Results count */}
        {!loading && events.length > 0 && (
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Showing <span className="font-semibold" style={{ color: 'var(--text)' }}>{events.length}</span> of{' '}
            <span className="font-semibold" style={{ color: 'var(--text)' }}>{total}</span> events
            {category && <span> in <span className="text-burg-bright font-semibold">{category}</span></span>}
          </p>
        )}

        {/* Grid — 1 col / 2 tablet / 3 desktop */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center">
            <Search size={48} className="mx-auto mb-4 text-[var(--text-subtle)]" />
            <p className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{t('no_results')}</p>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>{t('no_results_sub')}</p>
            <button onClick={() => { handleSearch(''); handleCategory('') }} className="btn-glass">
              {t('clear_filters')}
            </button>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${fetching ? 'opacity-60' : 'opacity-100'}`}>
              {events.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-12">
              {page > 1 && (
                <button onClick={() => setPage(p => p - 1)} className="btn-glass">← Previous</button>
              )}
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Page {page}</span>
              {hasMore && (
                <button onClick={() => setPage(p => p + 1)} disabled={fetching} className="btn-glass">
                  {fetching ? 'Loading...' : 'Next →'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
