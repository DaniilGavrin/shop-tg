// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './[locale]/**/*.{js,ts,jsx,tsx,mdx}', // Важно для твоих роутов с локализацией
  ],
  theme: {
    extend: {
      // Твои кастомные цвета можно продублировать сюда для удобства, 
      // но они и так отлично работают через CSS-переменные в globals.css
      colors: {
        'neon-purple': 'var(--neon-purple)',
        'neon-pink': 'var(--neon-pink)',
        'neon-blue': 'var(--neon-blue)',
        'bg-deep': 'var(--bg-deep)',
        'bg-surface': 'var(--bg-surface)',
        'bg-surface-glass': 'var(--bg-surface-glass)',
      }
    },
  },
  plugins: [],
}