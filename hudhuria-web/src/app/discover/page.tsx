'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { eventsApi } from '@/lib/api'
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard'
import { CategoryFilter } from '@/components/events/CategoryFilter'
import { SearchBar } from '@/components/events/SearchBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/contexts/i18n'

const PAGE_SIZE = 9

export default function DiscoverPage() {
  const { t } = useI18n()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage]         = useState(1)

  const handleSearch   = useCallback((v: string) => { setSearch(v);   setPage(1) }, [])
  const handleCategory = useCallback((v: string) => { setCategory(v); setPage(1) }, [])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['events', { search, category, page }],
    queryFn: () =>
      eventsApi.list({ search: search || undefined, category: category || undefined, status: 'PUBLISHED', page, pageSize: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  })

  const events  = data?.data?.items ?? []
  const total   = data?.data?.total ?? 0
  const hasMore = data?.data?.hasNextPage ?? false

  return (
    <div className="min-h-screen px-4 pt-10 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t('page_discover_label')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-[var(--text)] mb-3">
            {t('page_discover_title')}
          </h1>
          <p className="text-[var(--text-muted)] text-lg">
            {total > 0 ? `${total} events waiting for you` : t('page_discover_sub_empty')}
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] mb-8">
          <div className="max-w-6xl mx-auto space-y-3">
            <SearchBar value={search} onChange={handleSearch} />
            <CategoryFilter selected={category} onChange={handleCategory} />
          </div>
        </div>

        {/* Results count */}
        {!isLoading && events.length > 0 && (
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Showing <span className="text-[var(--text)] font-semibold">{events.length}</span> of{' '}
            <span className="text-[var(--text)] font-semibold">{total}</span> events
            {category && <span> in <span className="text-burg-bright font-semibold">{category}</span></span>}
          </p>
        )}

        {/* Grid — 1 col mobile, 2 tablet, 3 desktop */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Search className="w-12 h-12" />}
            title={t('no_results')}
            description={t('no_results_sub')}
            action={
              <Button variant="glass" onClick={() => { setSearch(''); setCategory('') }}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-12">
              {page > 1 && (
                <Button variant="glass" onClick={() => setPage(p => p - 1)}>
                  ← Previous
                </Button>
              )}
              <span className="text-[var(--text-muted)] text-sm">Page {page}</span>
              {hasMore && (
                <Button variant="glass" onClick={() => setPage(p => p + 1)} disabled={isFetching}>
                  {isFetching ? 'Loading...' : 'Next →'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
