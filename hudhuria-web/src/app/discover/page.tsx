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

const PAGE_SIZE = 9

export default function DiscoverPage() {
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

  const events   = data?.data?.items ?? []
  const total    = data?.data?.total ?? 0
  const hasMore  = data?.data?.hasNextPage ?? false

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-burg-bright text-sm font-medium uppercase tracking-widest mb-2">Matukio</p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#F0F4FF] mb-3">
            Gundua Matukio
          </h1>
          <p className="text-muted text-lg">
            {total > 0 ? `Matukio ${total} yanayokusubiri` : 'Tafuta matukio yanayokuvutia'}
          </p>
        </div>

        {/* Sticky filters */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-navy/80 backdrop-blur-xl border-b border-white/[0.06] mb-8">
          <div className="max-w-6xl mx-auto space-y-3">
            <SearchBar value={search} onChange={handleSearch} />
            <CategoryFilter selected={category} onChange={handleCategory} />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Search className="w-12 h-12" />}
            title="Hakuna matukio yaliyopatikana"
            description="Jaribu kutafuta kwa maneno tofauti au uchague kategoria nyingine."
            action={
              <Button variant="glass" onClick={() => { setSearch(''); setCategory('') }}>
                Futa Vichujio
              </Button>
            }
          />
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-12">
              {page > 1 && (
                <Button variant="glass" onClick={() => setPage(p => p - 1)}>
                  ← Iliyotangulia
                </Button>
              )}
              <span className="text-muted text-sm">Ukurasa {page}</span>
              {hasMore && (
                <Button variant="glass" onClick={() => setPage(p => p + 1)} disabled={isFetching}>
                  {isFetching ? 'Inapakuliwa...' : 'Inayofuata →'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
