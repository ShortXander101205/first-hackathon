export const tokens = {
  semantic: {
    primary: '#1E3A8A',
    interactive: '#2563EB',
    background: '#F8FAFC',
    text: '#0F172A',
  },
  colors: {
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb', // Interactive
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a', // Primary
      950: '#172554',
    },
    slate: {
      50: '#f8fafc', // Background
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a', // Slate Text
      950: '#020617',
    },
    reassurance: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      700: '#0369a1',
    },
    friction: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      700: '#b45309',
    },
    growth: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      700: '#047857',
    },
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
} as const;

export type SemanticTokens = typeof tokens.semantic;
export type ColorTokens = typeof tokens.colors;
export type RadiiTokens = typeof tokens.radii;
