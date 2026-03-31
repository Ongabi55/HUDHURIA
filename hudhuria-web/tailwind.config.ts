import { type Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#060B1A',
          surface: '#0D1627',
          mid: '#1A2F6F',
        },
        burg: {
          DEFAULT: '#8B1A4A',
          mid: '#A8205A',
          bright: '#C4224D',
          glow: '#C4224D',
        },
        muted: '#8899BB',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4)',
        'glow-burg': '0 0 24px rgba(196,34,77,0.3)',
        'glow-sm': '0 0 12px rgba(196,34,77,0.2)',
      },
      backgroundImage: {
        'gradient-hero':
          'linear-gradient(135deg, #060B1A 0%, #0D1627 40%, #1A2F6F 100%)',
        'gradient-card':
          'linear-gradient(160deg, rgba(13,22,39,0.8) 0%, rgba(6,11,26,0.9) 100%)',
        'gradient-burg':
          'linear-gradient(135deg, #8B1A4A 0%, #C4224D 100%)',
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPositionX: '-100%' },
          '100%': { backgroundPositionX: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
