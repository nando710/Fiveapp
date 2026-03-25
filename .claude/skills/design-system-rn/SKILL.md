---
name: design-system-rn
description: >
  Tradução de guias visuais e design systems para React Native com Expo. Use esta skill
  SEMPRE que o usuário quiser criar ou implementar um design system, tema global, tokens
  de cor/tipografia/espaçamento, ou traduzir um design do Figma para código RN. Acione
  para: "como implemento o design system no RN", "criar tema global", "tokens de cor em
  React Native", "ThemeProvider para RN", "como uso NativeWind", "styled-components no
  mobile", "traduzir Figma para componentes", "sistema de tipografia mobile", "dark mode
  no React Native", "paleta de cores no app", "design tokens RN", "como padronizo estilos
  no projeto". Também ative quando o usuário mostrar um guia visual ou screenshot de
  design e pedir para implementar — esta skill define como transformar isso em código.
---

# Design System — React Native + Expo

Como transformar guias visuais, paletas e especificações de design em um sistema de tokens
coeso, escalável e de fácil manutenção para projetos React Native.

## Referências disponíveis
- `references/theming.md` — ThemeProvider, dark mode, context de tema
- `references/nativewind.md` — setup e uso do NativeWind (Tailwind para RN)

---

## 1. Filosofia

Um design system em RN resolve três problemas:
1. **Consistência**: mesma cor, fonte e espaçamento em todo o app
2. **Manutenibilidade**: mudar uma cor atualiza o app inteiro
3. **Dark mode**: tema claro/escuro sem `if/else` espalhado pelo código

A abordagem recomendada: **tokens primeiro**, depois componentes.

---

## 2. Estrutura de tokens

```ts
// src/theme/tokens.ts
export const tokens = {
  colors: {
    // Primitivos (não usar diretamente nos componentes)
    purple: {
      50:  '#F3F0FF',
      100: '#E0D9FF',
      200: '#C4B5FD',
      300: '#A78BFA',
      400: '#8B5CF6',  // primary
      500: '#7B3FF6',
      600: '#6D28D9',
      700: '#5B1BE5',
    },
    gray: {
      50:  '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    green: { 400: '#34D399', 500: '#10B981', 600: '#059669' },
    // ... outras primitivas
  },

  spacing: {
    xs:   4,
    sm:   8,
    md:   12,
    lg:   16,
    xl:   20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },

  radii: {
    none: 0,
    sm:   4,
    md:   8,
    lg:   12,
    xl:   16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    full: 9999,
  },

  typography: {
    fontFamily: {
      sans:  'Nunito_400Regular',
      sansMd: 'Nunito_600SemiBold',
      sansBold: 'Nunito_700Bold',
      sansXBold: 'Nunito_800ExtraBold',
      sansBlack: 'Nunito_900Black',
    },
    fontSize: {
      xs:   11,
      sm:   12,
      md:   13,
      base: 14,
      lg:   16,
      xl:   18,
      '2xl': 20,
      '3xl': 22,
      '4xl': 28,
      '5xl': 36,
      '6xl': 40,
    },
    lineHeight: {
      tight:  1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 14,
      elevation: 8,
    },
    purple: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 16,
      elevation: 12,
    },
  },
} as const;
```

---

## 3. Tema semântico (light + dark)

Os tokens semânticos são o que os componentes realmente usam. Eles referenciam primitivos.

```ts
// src/theme/theme.ts
import { tokens } from './tokens';

const { colors, spacing, radii, typography, shadows } = tokens;

const baseTheme = { spacing, radii, typography, shadows };

export const lightTheme = {
  ...baseTheme,
  colors: {
    // Backgrounds
    background:       '#F0EFF5',
    surface:          '#FFFFFF',
    surfaceElevated:  'rgba(255,255,255,0.85)',
    // Texto
    textPrimary:      '#1a1030',
    textSecondary:    '#6B7280',
    textTertiary:     '#9CA3AF',
    textInverse:      '#FFFFFF',
    // Marca
    primary:          colors.purple[400],
    primaryDark:      colors.purple[600],
    primaryLight:     colors.purple[200],
    // Semânticas
    success:          colors.green[500],
    successLight:     colors.green[400],
    // Glass
    glassBg:          'rgba(255,255,255,0.28)',
    glassDarkBg:      'rgba(16,12,40,0.62)',
    glassBorder:      'rgba(255,255,255,0.55)',
    glassBorderDark:  'rgba(255,255,255,0.12)',
    // Borders
    border:           colors.gray[200],
    borderLight:      colors.gray[100],
  },
} as const;

export const darkTheme = {
  ...baseTheme,
  colors: {
    background:       '#0d0b1a',
    surface:          '#1a1730',
    surfaceElevated:  'rgba(255,255,255,0.06)',
    textPrimary:      '#F9FAFB',
    textSecondary:    '#D1D5DB',
    textTertiary:     '#6B7280',
    textInverse:      '#1a1030',
    primary:          colors.purple[300],
    primaryDark:      colors.purple[400],
    primaryLight:     colors.purple[600],
    success:          colors.green[400],
    successLight:     colors.green[300],
    glassBg:          'rgba(255,255,255,0.08)',
    glassDarkBg:      'rgba(0,0,0,0.7)',
    glassBorder:      'rgba(255,255,255,0.15)',
    glassBorderDark:  'rgba(255,255,255,0.08)',
    border:           colors.gray[700],
    borderLight:      colors.gray[800],
  },
} as const;

export type Theme = typeof lightTheme;
```

---

## 4. ThemeProvider e hook useTheme

```tsx
// src/theme/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from './theme';

const ThemeContext = createContext<{
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}>({ theme: lightTheme, isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  const isDark = override ? override === 'dark' : systemScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      toggleTheme: () => setOverride(isDark ? 'light' : 'dark'),
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook de uso
export const useTheme = () => useContext(ThemeContext);

// Uso em componente:
// const { theme, isDark } = useTheme();
// <View style={{ backgroundColor: theme.colors.background }}>
```

---

## 5. Componentes primitivos tipados

```tsx
// src/components/ui/Text.tsx
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { tokens } from '@/theme/tokens';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  weight?: 'regular' | 'semibold' | 'bold' | 'extrabold' | 'black';
}

const variantStyles: Record<TextVariant, object> = {
  h1:      { fontSize: 32, fontFamily: tokens.typography.fontFamily.sansBlack },
  h2:      { fontSize: 24, fontFamily: tokens.typography.fontFamily.sansXBold },
  h3:      { fontSize: 20, fontFamily: tokens.typography.fontFamily.sansBold },
  body:    { fontSize: 14, fontFamily: tokens.typography.fontFamily.sans },
  caption: { fontSize: 12, fontFamily: tokens.typography.fontFamily.sansMd },
  label:   { fontSize: 11, fontFamily: tokens.typography.fontFamily.sansBold },
};

export function Text({
  variant = 'body',
  color,
  style,
  ...props
}: ThemedTextProps) {
  const { theme } = useTheme();
  return (
    <RNText
      style={[
        variantStyles[variant],
        { color: color ?? theme.colors.textPrimary },
        style,
      ]}
      {...props}
    />
  );
}
```

---

## 6. StyleSheet com tema

```tsx
// Padrão recomendado: criar styles dentro do componente com acesso ao tema
import { StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export function MyComponent() {
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  return <View style={styles.container} />;
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.xl,
    ...theme.shadows.md,
  },
});
```

---

## 7. NativeWind (alternativa Tailwind)

Se preferir utility-first, veja `references/nativewind.md`.

NativeWind é ideal quando:
- Time vem do web (familiaridade com Tailwind)
- Prototipagem rápida tem prioridade
- Não há um design system super customizado

ThemeProvider é ideal quando:
- Design system proprietário com tokens específicos
- Dark mode complexo com muitas variações
- Componentes altamente reutilizáveis e tipados

---

## 8. Traduzindo do Figma para tokens

Quando receber um guia visual (Figma, screenshot, etc.):

1. **Extrair primitivos**: listar todas as cores hexadecimais → agrupar em ramps
2. **Nomear semanticamente**: `#7B5CF0` não é "purple-400", é `primary`
3. **Mapear tipografia**: identificar todos os font-size, weight, line-height usados
4. **Documentar espaçamentos**: medir gaps, paddings, margins → criar escala coerente
5. **Identificar componentes**: quais elementos se repetem? → criar componentes
6. **Definir estados**: hover/pressed/disabled/focused para cada componente interativo

Exemplo de análise do FiveApp:
- `#7B5CF0` → `colors.primary` (aparece em rings, botões, destaques)
- `#1a1030` → `colors.textPrimary` e `colors.darkBase`
- Nunito Black 40px → `typography.variants.stepNumber`
- 16px de padding lateral → `spacing.xl` (padrão do app)
