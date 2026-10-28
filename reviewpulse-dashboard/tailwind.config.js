/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B1020',
        card: '#141B2D',
        'card-hover': '#1B243B',
        border: '#263149',
        'border-light': '#364463',
        purple: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
          glow: 'rgba(139, 92, 246, 0.25)',
        },
        cyan: {
          DEFAULT: '#22D3EE',
          light: '#67E8F9',
          dark: '#06B6D4',
          glow: 'rgba(34, 211, 238, 0.25)',
        },
        positive: {
          DEFAULT: '#34D399',
          light: '#6EE7B7',
          dark: '#059669',
          glow: 'rgba(52, 211, 153, 0.2)',
        },
        neutral: {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
          dark: '#D97706',
          glow: 'rgba(251, 191, 36, 0.2)',
        },
        negative: {
          DEFAULT: '#FB7185',
          light: '#FDA4AF',
          dark: '#E11D48',
          glow: 'rgba(251, 113, 133, 0.2)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'card-lg': '16px',
        'card-sm': '12px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.35)',
        'glow-positive': '0 0 25px -5px rgba(52, 211, 153, 0.3)',
        'glow-negative': '0 0 25px -5px rgba(251, 113, 133, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
