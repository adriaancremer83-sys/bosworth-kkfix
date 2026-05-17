import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: '#C8102E',
        black: '#0A0A0A',
        charcoal: '#1C1C1C',
        steel: '#242424',
        iron: '#383838',
        silver: '#8A8A8A',
        ash: '#B0B0A8',
        white: '#F5F5F0',
        gold: '#B8860B',
        amber: '#D97706',
        success: '#16A34A',
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,16,46,0.3)',
        'red-glow': '0 0 20px rgba(200,16,46,0.3)',
      },
      animation: {
        rule: 'expandRule 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        expandRule: {
          from: { width: '0' },
          to: { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
