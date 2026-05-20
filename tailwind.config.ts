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
        orange: '#E8650A',
        'orange-dark': '#C4530A',
        black: '#0A0A0A',
        charcoal: '#111111',
        steel: '#8a9ab0',
        iron: '#1a1a1a',
        silver: '#555555',
        ash: '#888888',
        white: '#f0f0f0',
        success: '#22c55e',
        warning: '#f59e0b',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,101,10,0.3)',
        'orange-glow': '0 0 20px rgba(232,101,10,0.3)',
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
