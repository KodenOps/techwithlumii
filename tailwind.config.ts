import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e8edff',
          500: '#5b6cff',
          600: '#4a5be8',
          700: '#3747bb',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.05), 0 20px 80px rgba(91,108,255,0.28)',
      },
    },
  },
  plugins: [],
} satisfies Config;
