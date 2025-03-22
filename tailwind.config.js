/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#9333EA',
        'deep-purple': '#7E22CE',
        'dark-purple': '#581C87',
        'darkest': '#000000',
        'dark-accent': '#0A0A0A',
      },
      animation: {
        'pulse-purple': 'pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-purple': 'glow-purple 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-purple': {
          '0%, 100%': {
            opacity: 1,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.7), 0 0 40px rgba(147, 51, 234, 0.3)',
          },
          '50%': {
            opacity: 0.5,
            boxShadow: '0 0 10px rgba(147, 51, 234, 0.5), 0 0 20px rgba(147, 51, 234, 0.2)',
          },
        },
        'glow-purple': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.7))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 25px rgba(147, 51, 234, 0.9))',
          },
        },
      },
    },
  },
  plugins: [],
};