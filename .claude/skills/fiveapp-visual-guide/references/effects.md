# FiveApp — Receitas de Efeitos Glass

## Visão geral

O FiveApp usa 4 variantes de glassmorphism. Cada uma tem receita para:
- **Web/mockup** (CSS puro)
- **React Native** (expo-blur + StyleSheet)

---

## 1. Glass Claro (`glass-white`)

Usado em: SearchBar, ProgressCard, TabSwitcher, labels sobre fundo claro

### CSS
```css
background: rgba(255,255,255,0.28);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255,255,255,0.55);
box-shadow:
  0 8px 32px rgba(80,60,180,0.08),
  inset 0 1px 0 rgba(255,255,255,0.7),
  inset 0 -1px 0 rgba(200,190,255,0.15);
```

### React Native
```tsx
<BlurView intensity={55} tint="light" style={{
  borderRadius: 22,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.55)',
}}>
  {children}
</BlurView>
```

---

## 2. Glass Escuro (`glass-dark`)

Usado em: FloatingBottomNav

### CSS
```css
background: rgba(16,12,40,0.62);
backdrop-filter: blur(32px) saturate(200%);
-webkit-backdrop-filter: blur(32px) saturate(200%);
border: 1px solid rgba(255,255,255,0.12);
box-shadow:
  0 8px 40px rgba(0,0,0,0.4),
  inset 0 1px 0 rgba(255,255,255,0.12),
  inset 0 -2px 0 rgba(100,80,255,0.1);
```

### React Native
```tsx
<BlurView intensity={70} tint="dark" style={{
  borderRadius: 28,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.12)',
}}>
  {children}
</BlurView>
```

---

## 3. Glass Label (sobre imagens/cards)

Usado em: labels dos MenuCards centralizados sobre os mascotes

### CSS
```css
background: rgba(255,255,255,0.15);
backdrop-filter: blur(20px) saturate(160%);
-webkit-backdrop-filter: blur(20px) saturate(160%);
border: 1px solid rgba(255,255,255,0.45);
border-radius: 16px;
padding: 10px 24px;
box-shadow:
  0 4px 24px rgba(0,0,0,0.12),
  inset 0 1px 0 rgba(255,255,255,0.6),
  inset 0 -1px 0 rgba(255,255,255,0.2);
```

### React Native
```tsx
<BlurView intensity={50} tint="light" style={{
  borderRadius: 16,
  paddingHorizontal: 24,
  paddingVertical: 10,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.45)',
}}>
  <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: {width:0,height:1}, textShadowRadius: 6 }}>
    {label}
  </Text>
</BlurView>
```

---

## 4. Glass Purple (`glass-purple`)

Usado em: ícone do TabSwitcher, acentos roxos sobre glass

### CSS
```css
background: rgba(110,70,255,0.22);
backdrop-filter: blur(20px) saturate(200%);
-webkit-backdrop-filter: blur(20px) saturate(200%);
border: 1px solid rgba(180,150,255,0.4);
box-shadow:
  0 4px 24px rgba(110,70,255,0.25),
  inset 0 1px 0 rgba(255,255,255,0.35);
```

### React Native
```tsx
<BlurView intensity={50} tint="light" style={{
  backgroundColor: 'rgba(110,70,255,0.22)',
  borderRadius: 12,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: 'rgba(180,150,255,0.4)',
}}>
  {children}
</BlurView>
```

---

## 5. Card Shine (efeito de reflexo diagonal)

Aplicado em todo MenuCard como camada sobre o gradiente de fundo.

### CSS
```css
position: absolute;
inset: 0;
background: linear-gradient(
  135deg,
  rgba(255,255,255,0.18) 0%,
  transparent 50%,
  rgba(0,0,0,0.08) 100%
);
pointer-events: none;
```

### React Native
```tsx
<LinearGradient
  colors={['rgba(255,255,255,0.18)', 'transparent', 'rgba(0,0,0,0.08)']}
  style={StyleSheet.absoluteFill}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  pointerEvents="none"
/>
```

---

## 6. Purple Glow (botão central nav)

### CSS
```css
background: linear-gradient(135deg, #9B6DFF, #7B3FF6, #5B1BE5);
box-shadow:
  0 0 0 6px rgba(139,92,246,0.18),
  0 0 24px rgba(139,92,246,0.55),
  0 4px 16px rgba(0,0,0,0.3);
border: 1px solid rgba(200,170,255,0.4);
border-radius: 50%;
```

### React Native (com Reanimated pulsante)
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

function PulsingGlow() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.12, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1, true
    );
  }, []);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 2 - scale.value,
  }));

  return (
    <View style={{ position: 'relative', width: 52, height: 52 }}>
      <Animated.View style={[StyleSheet.absoluteFill, {
        borderRadius: 26,
        backgroundColor: 'rgba(139,92,246,0.25)',
      }, haloStyle]} />
      <LinearGradient
        colors={['#9B6DFF', '#7B3FF6', '#5B1BE5']}
        style={{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
      >
        <StarIcon size={22} color="#fff" />
      </LinearGradient>
    </View>
  );
}
```

---

## 7. Avatar Ring (conic gradient)

React Native não suporta `conic-gradient` nativamente.
Solução: usar `react-native-svg` com segmentos de arco.

```tsx
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

function AvatarRing({ size = 64, children }) {
  // Simula conic-gradient com múltiplos arcos coloridos via SVG
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="40%" stopColor="#A78BFA" />
            <Stop offset="70%" stopColor="#C4B5FD" />
            <Stop offset="100%" stopColor="#8B5CF6" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size/2} cy={size/2} r={size/2 - 1}
          stroke="url(#ring)" strokeWidth={3}
          fill="transparent"
        />
      </Svg>
      <View style={{ margin: 3, flex: 1 }}>{children}</View>
    </View>
  );
}
```

---

## Notas de compatibilidade

| Efeito | iOS | Android | Web |
|---|---|---|---|
| `BlurView` expo-blur | ✅ nativo | ✅ (limitado) | ✅ |
| `backdrop-filter` CSS | ✅ | ❌ (usar BlurView) | ✅ |
| `conic-gradient` | ❌ (usar SVG) | ❌ (usar SVG) | ✅ |
| `react-native-reanimated` | ✅ | ✅ | ✅ |
| `expo-linear-gradient` | ✅ | ✅ | ✅ |

No Android, quando `BlurView` não renderizar bem, fallback:
```tsx
const isAndroid = Platform.OS === 'android';
// Usar View com backgroundColor semi-transparente no Android
```
