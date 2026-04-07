/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E85D24',
          dark: '#C94713',
          soft: '#FFF8F0',
        },
        ink: '#1A1A1A',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Trebuchet MS', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 45px rgba(26,26,26,0.08)',
      },
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '100%': { transform: 'scale(1.15)', opacity: '0' },
        },
      },
      animation: {
        popIn: 'popIn 0.35s ease-out',
        pulseRing: 'pulseRing 1.2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
