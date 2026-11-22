import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          deep: 'var(--brand-deep)',
          soft: 'var(--brand-soft)',
        },
        navy: 'var(--navy)',
        ink: 'var(--ink)',
        line: 'var(--line)',
        surface: 'var(--surface)',
        canvas: 'var(--bg)',
      },
      borderRadius: {
        sheet: '1.5rem',
      },
      maxWidth: {
        shell: '84rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
