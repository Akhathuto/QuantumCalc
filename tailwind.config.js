/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': 'var(--color-bg)',
        'brand-surface': 'var(--color-surface)',
        'brand-primary': 'var(--color-primary)',
        'brand-secondary': 'var(--color-secondary)',
        'brand-accent': 'var(--color-accent)',
        'brand-text': 'var(--color-text)',
        'brand-text-secondary': 'var(--color-text-secondary)',
        'brand-border': 'var(--color-border)',
        'brand-danger': 'var(--color-danger)',
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.2s ease-out',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      }
    },
  },
  plugins: [],
}