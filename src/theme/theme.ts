import { tokens } from './tokens';

const { colors, spacing, radii, typography, shadows, gradients } = tokens;

const base = { spacing, radii, typography, shadows, gradients };

export const lightTheme = {
  ...base,
  colors: {
    background:       colors.background.screen,
    surface:          '#FFFFFF',
    surfaceElevated:  'rgba(255,255,255,0.85)',
    textPrimary:      colors.dark.base,
    textSecondary:    '#6B7280',
    textTertiary:     '#9CA3AF',
    textInverse:      '#FFFFFF',
    primary:          colors.purple[400],
    primaryDark:      colors.purple[600],
    primaryLight:     colors.purple[200],
    success:          colors.green[500],
    successLight:     colors.green[400],
    warning:          colors.warning[500],
    error:            colors.error[500],
    glassBg:          colors.glass.white,
    glassDarkBg:      colors.glass.dark,
    glassBorder:      colors.glass.border.light,
    glassBorderDark:  colors.glass.border.dark,
    border:           'rgba(0,0,0,0.08)',
    cardHomeworks:    colors.cards.homeworks,
    cardAiVoice:      colors.cards.aiVoice,
    cardReposicoes:   colors.cards.reposicoes,
    cardNotas:        colors.cards.notas,
    cardAr:           colors.cards.ar,
  },
} as const;

export const darkTheme = {
  ...base,
  colors: {
    background:       '#0d0b1a',
    surface:          '#1a1730',
    surfaceElevated:  'rgba(255,255,255,0.06)',
    textPrimary:      '#F9FAFB',
    textSecondary:    '#D1D5DB',
    textTertiary:     '#6B7280',
    textInverse:      colors.dark.base,
    primary:          colors.purple[300],
    primaryDark:      colors.purple[400],
    primaryLight:     colors.purple[600],
    success:          colors.green[400],
    successLight:     colors.green[300],
    warning:          colors.warning[500],
    error:            colors.error[500],
    glassBg:          'rgba(255,255,255,0.08)',
    glassDarkBg:      'rgba(0,0,0,0.7)',
    glassBorder:      'rgba(255,255,255,0.15)',
    glassBorderDark:  'rgba(255,255,255,0.08)',
    border:           'rgba(255,255,255,0.1)',
    cardHomeworks:    colors.cards.homeworks,
    cardAiVoice:      colors.cards.aiVoice,
    cardReposicoes:   colors.cards.reposicoes,
    cardNotas:        colors.cards.notas,
    cardAr:           colors.cards.ar,
  },
} as const;

export type Theme = typeof base & {
  colors: {
    [K in keyof typeof lightTheme.colors]: typeof lightTheme.colors[K] extends string 
      ? string 
      : { from: string; to: string }
  }
};
