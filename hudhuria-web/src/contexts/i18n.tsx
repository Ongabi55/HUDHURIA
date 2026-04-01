'use client'
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'sw'

// ── Translations ─────────────────────────────────────────────────────────────
const dict = {
  en: {
    // Nav
    nav_discover: 'Discover',
    nav_dashboard: 'Dashboard',
    nav_admin: 'Admin',
    nav_sign_in: 'Sign In',
    nav_register: 'Register Free',
    nav_profile: 'My Profile',
    // Categories
    cat_all: 'All',
    cat_tech: 'Tech',
    cat_culture: 'Culture',
    cat_sports: 'Sports',
    cat_career: 'Career',
    cat_social: 'Social',
    cat_health: 'Health',
    // Events
    seats_full: 'Sold Out',
    seats_remaining: 'seats left',
    seats_critical: 'seats left!',
    event_cancelled: 'Cancelled',
    event_free: 'Free',
    see_all: 'See all',
    // Landing
    platform_badge: 'Campus Events Platform — Kenya',
    hero_line1: 'Discover.',
    hero_line2: 'Book.',
    hero_line3: 'Attend.',
    hero_sub: 'All campus events in Kenya, one place. Join over 1,200 students using Hudhuria every day.',
    cta_start: 'Start for Free',
    cta_explore: 'Explore Events',
    trust_free: '✓ Free to join',
    trust_ticket: '✓ Digital Ticket',
    trust_qr: '✓ QR Check-in',
    trust_kenya: '✓ All Kenya',
    // Stats
    stat_students: 'Students Joined',
    stat_events: 'Events Hosted',
    stat_campuses: 'Partner Campuses',
    stat_satisfaction: 'Satisfaction Rate',
    // Sections
    section_categories: 'Event Categories',
    section_categories_sub: 'Everything You Love',
    section_featured: 'Upcoming',
    section_featured_title: 'Trending Events 🔥',
    section_how: 'How It Works',
    section_how_title: 'Simple as 1-2-3',
    section_how_sub: 'No friction. Sign up, discover, and attend — all in minutes.',
    step1_label: 'STEP 01',
    step1_title: 'Create Account',
    step1_desc: 'Sign up for free in seconds. No credit card required.',
    step2_label: 'STEP 02',
    step2_title: 'Discover Events',
    step2_desc: 'Browse and filter events from universities across Kenya.',
    step3_label: 'STEP 03',
    step3_title: 'Book & Attend',
    step3_desc: 'Save your spot instantly and receive your digital ticket.',
    cta_title: "Don't Miss Another Event",
    cta_sub: 'Join a community of students discovering the best campus events in Kenya.',
    cta_signup: 'Sign Up Free',
    // Discover page
    page_discover_label: 'Events',
    page_discover_title: 'Discover Events',
    page_discover_sub_events: (n: number) => `${n} events waiting for you`,
    page_discover_sub_empty: 'Find events that excite you',
    no_results: 'No events found',
    no_results_sub: 'Try a different search or category',
    load_more: 'Load More',
    // Misc
    spots_left: (n: number) => `${n} spots remaining`,
    only_left: (n: number) => `Only ${n} left!`,
    seats_of: (left: number, total: number) => `${left} / ${total} seats`,
  },
  sw: {
    nav_discover: 'Gundua',
    nav_dashboard: 'Dashibodi',
    nav_admin: 'Msimamizi',
    nav_sign_in: 'Ingia',
    nav_register: 'Jisajili Bure',
    nav_profile: 'Wasifu Wangu',
    cat_all: 'Yote',
    cat_tech: 'Teknolojia',
    cat_culture: 'Utamaduni',
    cat_sports: 'Michezo',
    cat_career: 'Kazi',
    cat_social: 'Jamii',
    cat_health: 'Afya',
    seats_full: 'Imejaa',
    seats_remaining: 'viti vilivyobaki',
    seats_critical: 'viti vilivyobaki!',
    event_cancelled: 'Imefutwa',
    event_free: 'Bure',
    see_all: 'Tazama yote',
    platform_badge: 'Platform ya Matukio ya Campus Kenya',
    hero_line1: 'Gundua.',
    hero_line2: 'Hifadhi.',
    hero_line3: 'Hudhuria.',
    hero_sub: 'Matukio yote ya campus Kenya mahali pamoja. Jiunge na wanafunzi zaidi ya 1,200.',
    cta_start: 'Anza Bure Leo',
    cta_explore: 'Gundua Matukio',
    trust_free: '✓ Bila Malipo',
    trust_ticket: '✓ Tiketi ya Kidijitali',
    trust_qr: '✓ QR Check-in',
    trust_kenya: '✓ Kenya Yote',
    stat_students: 'Wanafunzi Waliojiunga',
    stat_events: 'Matukio Yaliyopita',
    stat_campuses: 'Vyuo Washirika',
    stat_satisfaction: 'Kuridhika',
    section_categories: 'Aina za Matukio',
    section_categories_sub: 'Kila Kitu Unachopenda',
    section_featured: 'Yanayokuja',
    section_featured_title: 'Matukio Maarufu 🔥',
    section_how: 'Jinsi Inavyofanya Kazi',
    section_how_title: 'Rahisi kama 1-2-3',
    section_how_sub: 'Hakuna utata. Jiunge, gundua, na uhudhirie — yote kwa dakika chache.',
    step1_label: 'HATUA 01',
    step1_title: 'Jisajili Haraka',
    step1_desc: 'Fungua akaunti yako bila malipo kwa sekunde chache tu.',
    step2_label: 'HATUA 02',
    step2_title: 'Gundua Matukio',
    step2_desc: 'Tafuta na kuchagua matukio yanayokuvutia kutoka vyuo mbalimbali.',
    step3_label: 'HATUA 03',
    step3_title: 'Hifadhi & Hudhuria',
    step3_desc: 'Hifadhi kiti lako kwa sekunde moja na upokee tiketi ya kidijitali.',
    cta_title: 'Usikose Tukio Lolote Tena',
    cta_sub: 'Jiunge na jamii ya wanafunzi wanaogundua matukio bora ya campus Kenya.',
    cta_signup: 'Jisajili Sasa — Bure',
    page_discover_label: 'Matukio',
    page_discover_title: 'Gundua Matukio',
    page_discover_sub_events: (n: number) => `Matukio ${n} yanayokusubiri`,
    page_discover_sub_empty: 'Tafuta matukio yanayokuvutia',
    no_results: 'Hakuna matukio',
    no_results_sub: 'Jaribu utafutaji au kategoria nyingine',
    load_more: 'Pakia Zaidi',
    spots_left: (n: number) => `Nafasi ${n} zilizobaki`,
    only_left: (n: number) => `Viti ${n} vilivyobaki!`,
    seats_of: (left: number, total: number) => `${left} / ${total} viti`,
  },
} as const

type StringKeys = {
  [K in keyof typeof dict.en]: typeof dict.en[K] extends string ? K : never
}[keyof typeof dict.en]

interface I18nContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: StringKeys) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('hudhuria-lang') as Lang | null
    if (stored && (stored === 'en' || stored === 'sw')) {
      setLangState(stored)
      document.documentElement.setAttribute('lang', stored)
    }
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('hudhuria-lang', l)
    document.documentElement.setAttribute('lang', l)
  }, [])

  const t = useCallback(
    (key: StringKeys): string => (dict[lang][key] as string),
    [lang]
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}

// Also export raw dict for non-hook access
export { dict }
