import { type Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#060B1A',
          surface: '#0D1635',
          mid: '#1A2F6F',
        },
        burg: {
          DEFAULT: '#6B0F2A',
          mid: '#8B1538',
          bright: '#C4224D',
          glow: '#C4224D',
        },
        muted: '#8899BB',
        glass: 'rgba(22, 35, 72, 0.85)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.45)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: [],
}

export default config
