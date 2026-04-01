import { createContext, useContext, useState, useEffect } from 'react'

const dict = {
  en: {
    nav_discover: 'Discover', nav_dashboard: 'Dashboard', nav_sign_in: 'Sign In',
    nav_register: 'Register Free', nav_profile: 'My Profile',
    cat_all: 'All', cat_tech: 'Tech', cat_culture: 'Culture',
    cat_sports: 'Sports', cat_career: 'Career', cat_social: 'Social', cat_health: 'Health',
    hero_line1: 'Discover.', hero_line2: 'Book.', hero_line3: 'Attend.',
    hero_sub: 'All campus events in Kenya, one place. Join over 1,200 students using Hudhuria every day.',
    cta_start: 'Get Started Free', cta_explore: 'Explore Events',
    stat_students: 'Students', stat_events: 'Events', stat_campuses: 'Campuses', stat_satisfaction: 'Satisfaction',
    section_how: 'How It Works', section_how_title: 'Simple as 1-2-3',
    step1_title: 'Create Account', step1_desc: 'Sign up for free in seconds.',
    step2_title: 'Discover Events', step2_desc: 'Browse events from universities across Kenya.',
    step3_title: 'Book & Attend', step3_desc: 'Save your spot and get a digital ticket instantly.',
    no_results: 'No events found', no_results_sub: 'Try a different search or category',
    clear_filters: 'Clear Filters', load_more: 'Load More',
    sold_out: 'Sold Out', cancelled: 'Cancelled', seats_left: 'seats left',
    see_all: 'See all', sign_up_free: 'Sign Up Free',
  },
  sw: {
    nav_discover: 'Gundua', nav_dashboard: 'Dashibodi', nav_sign_in: 'Ingia',
    nav_register: 'Jisajili Bure', nav_profile: 'Wasifu Wangu',
    cat_all: 'Yote', cat_tech: 'Teknolojia', cat_culture: 'Utamaduni',
    cat_sports: 'Michezo', cat_career: 'Kazi', cat_social: 'Jamii', cat_health: 'Afya',
    hero_line1: 'Gundua.', hero_line2: 'Hifadhi.', hero_line3: 'Hudhuria.',
    hero_sub: 'Matukio yote ya campus Kenya mahali pamoja. Jiunge na wanafunzi zaidi ya 1,200.',
    cta_start: 'Anza Bure Leo', cta_explore: 'Gundua Matukio',
    stat_students: 'Wanafunzi', stat_events: 'Matukio', stat_campuses: 'Vyuo', stat_satisfaction: 'Kuridhika',
    section_how: 'Jinsi Inavyofanya Kazi', section_how_title: 'Rahisi kama 1-2-3',
    step1_title: 'Jisajili Haraka', step1_desc: 'Fungua akaunti yako bila malipo kwa sekunde chache.',
    step2_title: 'Gundua Matukio', step2_desc: 'Tafuta matukio yanayokuvutia kutoka vyuo mbalimbali.',
    step3_title: 'Hifadhi & Hudhuria', step3_desc: 'Hifadhi kiti lako na upokee tiketi ya kidijitali.',
    no_results: 'Hakuna matukio', no_results_sub: 'Jaribu utafutaji au kategoria nyingine',
    clear_filters: 'Futa Vichujio', load_more: 'Pakia Zaidi',
    sold_out: 'Imejaa', cancelled: 'Imefutwa', seats_left: 'viti vilivyobaki',
    see_all: 'Tazama yote', sign_up_free: 'Jisajili Sasa — Bure',
  },
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    const stored = localStorage.getItem('hudhuria-lang')
    if (stored === 'en' || stored === 'sw') {
      setLangState(stored)
      document.documentElement.setAttribute('lang', stored)
    }
  }, [])

  function setLang(l) {
    setLangState(l)
    localStorage.setItem('hudhuria-lang', l)
    document.documentElement.setAttribute('lang', l)
  }

  function t(key) {
    return dict[lang][key] ?? dict.en[key] ?? key
  }

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
