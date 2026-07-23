/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bwc: {
          rose: '#F4A7B9',
          wine: '#7A3B4E',
          dark: '#5E2C3B',
          cream: '#FDF9F6',
          onyx: '#1C1C1E',
          sage: '#96C99A',
          gray: '#8E8E93',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'bwc-soft': '0 2px 24px -4px rgba(122, 59, 78, 0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'bwc-card': '0 8px 40px -8px rgba(122, 59, 78, 0.18), 0 2px 8px rgba(0,0,0,0.06)',
        'bwc-glow': '0 0 32px -4px rgba(122, 59, 78, 0.5), 0 4px 16px rgba(122, 59, 78, 0.3)',
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'float-up': 'float-up 0.4s ease-out',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
