---
name: react-native-components
description: >
  Criação de componentes React Native reutilizáveis, acessíveis e animados. Use esta
  skill SEMPRE que o usuário quiser criar um componente RN, adicionar animações com
  Reanimated, implementar gestos com Gesture Handler, ou garantir acessibilidade mobile.
  Acione para: "criar componente RN", "animar com Reanimated", "componente com swipe",
  "bottom sheet", "skeleton loader", "toast notification", "componente acessível",
  "pressable com feedback", "shimmer effect", "parallax scroll", "drag and drop mobile",
  "componente com gesto de pinch/pan", "accordion animado", "tab bar customizada",
  "carousel de cards", "floating action button", "chips/tags", "badge animado",
  "componente de progresso circular", ou qualquer pedido de UI component mobile.
---

# Componentes React Native — Reutilizáveis, Animados e Acessíveis

Guia para criar componentes de qualidade de produção: encapsulados, tipados, acessíveis
e com animações que respeitam as preferências do usuário.

## Referências disponíveis
- `references/animations.md` — padrões Reanimated 3 (worklets, shared values, derived)
- `references/gestures.md` — Gesture Handler 2 (pan, swipe, pinch, composição)
- `references/accessibility.md` — accessibilityRole, labels, focus management

---

## 1. Anatomia de um bom componente

Todo componente de qualidade tem:

```tsx
// Checklist de qualidade:
// ✅ Props tipadas com TypeScript
// ✅ Valor default para props opcionais
// ✅ Suporte a style prop (StyleProp<ViewStyle>)
// ✅ accessibilityLabel / accessibilityRole
// ✅ Feedback de press (scale, opacity)
// ✅ Animação respeitando reduceMotion
// ✅ Forwarded ref quando necessário
// ✅ Nenhuma lógica de negócio dentro

import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, useReducedMotion
} from 'react-native-reanimated';
```

---

## 2. Pressable com feedback animado

Base para todos os elementos tocáveis do app:

```tsx
// src/components/ui/PressableScale.tsx
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, useReducedMotion
} from 'react-native-reanimated';

interface Props extends PressableProps {
  scale?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function PressableScale({ scale = 0.96, style, children, ...props }: Props) {
  const pressed = useSharedValue(false);
  const reduceMotion = useReducedMotion();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: reduceMotion ? 1 :
        withSpring(pressed.value ? scale : 1, { damping: 15, stiffness: 200 })
    }],
  }));

  return (
    <Pressable
      onPressIn={() => { pressed.value = true; }}
      onPressOut={() => { pressed.value = false; }}
      {...props}
    >
      <Animated.View style={[animStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
```

---

## 3. Skeleton / Shimmer Loader

```tsx
// src/components/ui/Skeleton.tsx
import { useEffect } from 'react';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolateColor
} from 'react-native-reanimated';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: Props) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      shimmer.value,
      [0, 1],
      ['#E5E7EB', '#F3F4F6']
    ),
  }));

  return (
    <Animated.View style={[{ width, height, borderRadius }, animStyle, style]} />
  );
}

// Uso:
// <Skeleton width="80%" height={16} />
// <Skeleton width={60} height={60} borderRadius={30} /> {/* avatar */}
```

---

## 4. Toast / Snackbar animado

```tsx
// src/components/ui/Toast.tsx
import { useEffect } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const colors: Record<ToastType, string> = {
  success: '#10B981',
  error:   '#EF4444',
  info:    '#8B5CF6',
};

export function Toast({ message, type = 'info', duration = 3000, onHide }: ToastProps) {
  const { top } = useSafeAreaInsets();
  const translateY = useSharedValue(-100);

  useEffect(() => {
    translateY.value = withSequence(
      withTiming(0, { duration: 300 }),
      withTiming(0, { duration: duration }),
      withTiming(-100, { duration: 300 }, (finished) => {
        if (finished) runOnJS(onHide)();
      })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[
      styles.container,
      { top: top + 16, backgroundColor: colors[type] },
      animStyle,
    ]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 16, right: 16,
    borderRadius: 12, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6, zIndex: 999,
  },
  text: { color: '#fff', fontSize: 14, fontFamily: 'Nunito_700Bold', textAlign: 'center' },
});
```

---

## 5. Swipeable Card (com Gesture Handler)

```tsx
// src/components/ui/SwipeableCard.tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS
} from 'react-native-reanimated';
import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

interface Props {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight }: Props) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      rotate.value = e.translationX / SCREEN_WIDTH * 15; // max 15deg
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD && onSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeRight)();
      } else if (e.translationX < -SWIPE_THRESHOLD && onSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeLeft)();
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%' },
});
```

---

## 6. Accordion animado

```tsx
// src/components/ui/Accordion.tsx
import { useState } from 'react';
import { Pressable, Text, View, LayoutAnimation, Platform, UIManager } from 'react-native';

// Habilitar LayoutAnimation no Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Props {
  title: string;
  children: React.ReactNode;
}

export function Accordion({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text>{title} {open ? '▲' : '▼'}</Text>
      </Pressable>
      {open && <View>{children}</View>}
    </View>
  );
}
```

---

## 7. Progress circular

```tsx
// src/components/ui/CircularProgress.tsx
import { useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedProps, withTiming
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  size?: number;
  progress: number;   // 0 a 1
  color?: string;
  trackColor?: string;
  strokeWidth?: number;
}

export function CircularProgress({
  size = 60, progress, color = '#8B5CF6', trackColor = '#E5E7EB', strokeWidth = 5
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animProgress = useSharedValue(0);

  useEffect(() => {
    animProgress.value = withTiming(progress, { duration: 800 });
  }, [progress]);

  const animProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animProgress.value),
  }));

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={size/2} cy={size/2} r={radius}
        stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <AnimatedCircle cx={size/2} cy={size/2} r={radius}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circumference}
        strokeLinecap="round"
        animatedProps={animProps} />
    </Svg>
  );
}
```

---

## 8. Regras de acessibilidade

Todo componente interativo precisa de:

```tsx
<Pressable
  accessibilityRole="button"           // button, link, checkbox, etc.
  accessibilityLabel="Abrir homework"  // lido pelo screen reader
  accessibilityHint="Navega para lista de tarefas" // contexto extra
  accessibilityState={{ disabled: false, selected: isActive }}
>
```

Para imagens:
```tsx
<Image accessibilityLabel="Foto de perfil do Gabriel" />
// Imagem decorativa: accessible={false}
```

Para inputs:
```tsx
<TextInput
  accessibilityLabel="Campo de busca"
  accessibilityHint="Digite para buscar conteúdo no app"
  returnKeyType="search"
  autoCapitalize="none"
/>
```
