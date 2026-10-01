import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Direct Semantic Role Aliases
        'edu-primary': 'var(--edu-primary)',
        'edu-interactive': 'var(--edu-interactive)',
        'edu-bg': 'var(--edu-bg)',
        'edu-text': 'var(--edu-text)',

        // Educational Blue Palette (#1E3A8A primary, #2563EB interactive)
        'edu-blue': {
          50: 'var(--edu-blue-50)',
          100: 'var(--edu-blue-100)',
          200: 'var(--edu-blue-200)',
          300: 'var(--edu-blue-300)',
          400: 'var(--edu-blue-400)',
          500: 'var(--edu-blue-500)',
          600: 'var(--edu-blue-600)', // Interactive
          700: 'var(--edu-blue-700)',
          800: 'var(--edu-blue-800)',
          900: 'var(--edu-blue-900)', // Primary
          950: 'var(--edu-blue-950)',
        },

        // Educational Slate Palette (#F8FAFC background, #0F172A slate text)
        'edu-slate': {
          50: 'var(--edu-slate-50)', // Background
          100: 'var(--edu-slate-100)',
          200: 'var(--edu-slate-200)',
          300: 'var(--edu-slate-300)',
          400: 'var(--edu-slate-400)',
          500: 'var(--edu-slate-500)',
          600: 'var(--edu-slate-600)',
          700: 'var(--edu-slate-700)',
          800: 'var(--edu-slate-800)',
          900: 'var(--edu-slate-900)', // Slate Text
          950: 'var(--edu-slate-950)',
        },

        // Diagnostic Semantics
        reassurance: {
          50: 'var(--reassurance-50)',
          100: 'var(--reassurance-100)',
          500: 'var(--reassurance-500)',
          700: 'var(--reassurance-700)',
        },
        friction: {
          50: 'var(--friction-50)',
          100: 'var(--friction-100)',
          500: 'var(--friction-500)',
          700: 'var(--friction-700)',
        },
        growth: {
          50: 'var(--growth-50)',
          100: 'var(--growth-100)',
          500: 'var(--growth-500)',
          700: 'var(--growth-700)',
        },
      },
      borderRadius: {
        'edu-sm': 'var(--radius-sm)',
        'edu-md': 'var(--radius-md)',
        'edu-lg': 'var(--radius-lg)',
        'edu-xl': 'var(--radius-xl)',
        'edu-2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
