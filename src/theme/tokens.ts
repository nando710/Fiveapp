export const tokens = {
  colors: {
    purple: {
      50:  '#F3F0FF',
      100: '#E0D9FF',
      200: '#C4B5FD',
      300: '#A78BFA',
      400: '#8B5CF6',   // primary — anéis, destaques
      500: '#7B3FF6',   // médio
      600: '#6D28D9',   // deep — gradientes
      700: '#5B1BE5',   // escuro
      800: '#4C1D95',
    },
    dark: {
      base:    '#1a1030',
      nav:     '#10082a',
      card:    '#2d2050',
      overlay: 'rgba(16,12,40,0.62)',
    },
    glass: {
      white:  'rgba(255,255,255,0.28)',
      light:  'rgba(255,255,255,0.15)',
      purple: 'rgba(110,70,255,0.22)',
      dark:   'rgba(16,12,40,0.62)',
      border: {
        light: 'rgba(255,255,255,0.55)',
        mid:   'rgba(255,255,255,0.4)',
        dark:  'rgba(255,255,255,0.12)',
      },
    },
    green:   { 300: '#6EE7B7', 400: '#34D399', 500: '#10B981', 600: '#059669' },
    warning: { 500: '#F59E0B' },
    error:   { 500: '#EF4444' },
    background: {
      app:    '#EAEAEA',
      screen: '#F0EFF5',
      card:   '#DDDCE8',
    },
    cards: {
      homeworks:  { from: '#4a9e50', to: '#1a4d20' },
      aiVoice:    { from: '#6a3fa3', to: '#2a0a60' },
      reposicoes: { from: '#388E3C', to: '#1B5E20' },
      notas:      { from: '#1565C0', to: '#062a6e' },
      ar:         { from: '#00897B', to: '#004D40' },
    },
  },

  spacing: {
    xs:    4,
    sm:    8,
    md:    12,
    lg:    14,
    xl:    16,
    '2xl': 18,
    '3xl': 24,
    '4xl': 32,
    '5xl': 48,
  },

  radii: {
    full:  9999,
    '4xl':   44,
    '3xl':   28,  // bottom nav
    '2xl':   24,  // menu cards
    xl:      22,  // progress card
    lg:      18,  // search bar
    md:      16,  // glass labels
    sm:      12,
    xs:       8,
  },

  typography: {
    fontFamily: {
      regular:   'Nunito_400Regular',
      semibold:  'Nunito_600SemiBold',
      bold:      'Nunito_700Bold',
      extrabold: 'Nunito_800ExtraBold',
      black:     'Nunito_900Black',
    },
    fontSize: {
      xs:    11,
      sm:    12,
      md:    13,
      base:  14,
      lg:    16,
      xl:    18,
      '2xl': 20,
      '3xl': 22,
      '4xl': 28,
      '5xl': 36,
      '6xl': 40,
    },
  },

  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 14,
      elevation: 8,
    },
    nav: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 16,
    },
    purple: {
      shadowColor: '#7B5CF0',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 16,
      elevation: 12,
    },
    avatarRing: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  gradients: {
    navButton:   ['#9B6DFF', '#7B3FF6', '#5B1BE5'] as string[],
    progressBar: ['#34D399', '#10B981', '#059669'] as string[],
    screenBg:    ['#F0EFF5', '#E8E7EF', '#DDDCE8'] as string[],
    darkBg:      ['#1a0a3a', '#0d0620', '#1a1030'] as string[],
    purpleRing:  ['#8B5CF6', '#A78BFA', '#7C3AED', '#8B5CF6'] as string[],
  },
} as const;

export type Tokens = typeof tokens;
