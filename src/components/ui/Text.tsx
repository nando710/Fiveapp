import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { tokens } from '@theme/tokens';

type TextVariant = 'h1' | 'h2' | 'h3' | 'title' | 'body' | 'caption' | 'label' | 'stepNumber';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
}

const variantStyles: Record<TextVariant, object> = {
  h1:         { fontSize: 32, fontFamily: tokens.typography.fontFamily.black },
  h2:         { fontSize: 24, fontFamily: tokens.typography.fontFamily.black },
  h3:         { fontSize: 20, fontFamily: tokens.typography.fontFamily.extrabold },
  title:      { fontSize: tokens.typography.fontSize['3xl'], fontFamily: tokens.typography.fontFamily.black, letterSpacing: -0.5 },
  body:       { fontSize: tokens.typography.fontSize.base, fontFamily: tokens.typography.fontFamily.regular },
  caption:    { fontSize: tokens.typography.fontSize.sm, fontFamily: tokens.typography.fontFamily.semibold },
  label:      { fontSize: tokens.typography.fontSize.lg, fontFamily: tokens.typography.fontFamily.extrabold },
  stepNumber: { fontSize: tokens.typography.fontSize['6xl'], fontFamily: tokens.typography.fontFamily.black, lineHeight: 42 },
};

export function Text({ variant = 'body', color, style, ...props }: ThemedTextProps) {
  const { theme } = useTheme();
  return (
    <RNText
      style={[variantStyles[variant], { color: color ?? theme.colors.textPrimary }, style]}
      {...props}
    />
  );
}
