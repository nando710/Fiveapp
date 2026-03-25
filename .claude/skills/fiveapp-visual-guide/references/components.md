# FiveApp — Componentes React Native + Expo

Todos os componentes usam:
- `expo-blur` para efeitos de vidro
- `react-native-reanimated` para animações
- `Nunito` via `expo-google-fonts`

---

## SearchBar

```tsx
import { BlurView } from 'expo-blur';
import { View, TextInput, StyleSheet } from 'react-native';

export function SearchBar() {
  return (
    <BlurView intensity={60} tint="light" style={styles.container}>
      <SearchIcon size={15} color="#aaa" />
      <TextInput
        placeholder="Buscar no FiveApp"
        placeholderTextColor="#aaa"
        style={styles.input}
      />
      <BlurView intensity={40} tint="light" style={styles.micBtn}>
        <MicIcon size={13} color="#7B5CF0" />
      </BlurView>
      <View style={styles.bellBtn}>
        <BellIcon size={14} color="#fff" />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#666',
  },
  micBtn: {
    width: 34, height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  bellBtn: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(26,16,48,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

## UserHeader

```tsx
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet } from 'react-native';

export function UserHeader({ name, avatarUri }: { name: string; avatarUri: string }) {
  return (
    <View style={styles.row}>
      <LinearGradient
        colors={['#8B5CF6', '#A78BFA', '#7C3AED', '#8B5CF6']}
        style={styles.avatarRing}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      </LinearGradient>
      <View>
        <Text style={styles.sub}>Good Morning,</Text>
        <Text style={styles.name}>{name}!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, paddingBottom: 4 },
  avatarRing: {
    width: 64, height: 64, borderRadius: 32, padding: 2.5,
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 30, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.9)' },
  sub: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#888' },
  name: { fontFamily: 'Nunito_900Black', fontSize: 22, color: '#1a1030', letterSpacing: -0.5 },
});
```

---

## StoryCircle

```tsx
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

export function StoryCircle({
  uri, name, isMe = false
}: { uri: string; name: string; isMe?: boolean }) {
  return (
    <Pressable style={styles.wrap}>
      <LinearGradient
        colors={isMe
          ? ['rgba(139,92,246,0.3)', 'rgba(139,92,246,0.1)']
          : ['#8B5CF6', '#A78BFA', '#C4B5FD', '#8B5CF6']
        }
        style={[styles.ring, isMe && styles.ringMe]}
      >
        <Image source={{ uri }} style={styles.img} />
        {isMe && (
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.addBtn}
          >
            <Text style={styles.plus}>+</Text>
          </LinearGradient>
        )}
      </LinearGradient>
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 5 },
  ring: { width: 54, height: 54, borderRadius: 27, padding: 2.5 },
  ringMe: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(139,92,246,0.4)' },
  img: { width: '100%', height: '100%', borderRadius: 24, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.95)' },
  addBtn: { position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F0EFF5' },
  plus: { color: '#fff', fontSize: 13, fontWeight: '900', lineHeight: 14 },
  name: { fontFamily: 'Nunito_700Bold', fontSize: 11, color: '#555' },
});
```

---

## ProgressCard

```tsx
import { BlurView } from 'expo-blur';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export function ProgressCard({ step, current, total, title }: {
  step: number; current: number; total: number; title: string;
}) {
  const progress = useSharedValue(0);
  useEffect(() => { progress.value = withTiming(current / total, { duration: 800 }); }, [current, total]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <BlurView intensity={55} tint="light" style={styles.card}>
      <View style={styles.stepCol}>
        <Text style={styles.stepLbl}>Step</Text>
        <Text style={styles.stepNum}>{step}</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.count}>{current} / {total}</Text>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, barStyle]} />
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22, padding: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', overflow: 'hidden',
  },
  stepCol: { flexShrink: 0 },
  stepLbl: { fontFamily: 'Nunito_800ExtraBold', fontSize: 10, color: 'rgba(100,80,200,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  stepNum: { fontFamily: 'Nunito_900Black', fontSize: 40, color: '#1a1030', lineHeight: 42 },
  right: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#7c6faa' },
  count: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: '#9988cc' },
  track: { height: 7, backgroundColor: 'rgba(139,92,246,0.12)', borderRadius: 99, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(139,92,246,0.1)' },
  fill: {
    height: '100%', borderRadius: 99,
    backgroundColor: '#10B981',
    shadowColor: '#34D399', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6,
  },
});
```

---

## MenuCard

```tsx
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export function MenuCard({
  label, gradient, onPress, mascot
}: {
  label: string | React.ReactNode;
  gradient: string[];
  onPress: () => void;
  mascot: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <LinearGradient colors={gradient} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {mascot}
      </LinearGradient>
      {/* Shine diagonal */}
      <LinearGradient
        colors={['rgba(255,255,255,0.18)', 'transparent', 'rgba(0,0,0,0.08)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        pointerEvents="none"
      />
      {/* Glass label centralizado */}
      <BlurView intensity={50} tint="light" style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 118, borderRadius: 24, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 14, elevation: 8,
  },
  labelWrap: {
    position: 'absolute', alignSelf: 'center', top: '50%',
    transform: [{ translateY: -22 }],
    borderRadius: 16, paddingHorizontal: 24, paddingVertical: 10,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)',
  },
  label: {
    fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
});
```

---

## FloatingBottomNav

```tsx
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Pressable, StyleSheet } from 'react-native';

export function FloatingBottomNav({ active = 0, onChange }: {
  active?: number; onChange?: (i: number) => void;
}) {
  const icons = ['home', 'book', null, 'search', 'user']; // null = botão central

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={70} tint="dark" style={styles.nav}>
        {icons.map((icon, i) => {
          if (icon === null) {
            return (
              <Pressable key={i} onPress={() => onChange?.(i)}>
                <LinearGradient
                  colors={['#9B6DFF', '#7B3FF6', '#5B1BE5']}
                  style={styles.centerBtn}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  <StarIcon size={22} color="#fff" />
                </LinearGradient>
              </Pressable>
            );
          }
          return (
            <Pressable key={i} onPress={() => onChange?.(i)} style={[styles.navItem, active === i && styles.navItemActive]}>
              {/* ícone correspondente */}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute', bottom: 14, left: 16, right: 16,
  },
  nav: {
    borderRadius: 28, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-around', paddingVertical: 14, paddingHorizontal: 8,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  centerBtn: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55, shadowRadius: 16, elevation: 12,
    borderWidth: 1, borderColor: 'rgba(200,170,255,0.4)',
  },
  navItem: { opacity: 0.42, padding: 4 },
  navItemActive: { opacity: 1 },
});
```

---

## TabSwitcher

```tsx
import { BlurView } from 'expo-blur';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export function TabSwitcher({ tabs, active, onChange }: {
  tabs: string[]; active: number; onChange: (i: number) => void;
}) {
  return (
    <BlurView intensity={55} tint="light" style={styles.container}>
      {tabs.map((tab, i) => (
        <Pressable
          key={tab}
          onPress={() => onChange(i)}
          style={[styles.tab, active === i && styles.tabActive]}
        >
          <Text style={[styles.label, active === i && styles.labelActive]}>{tab}</Text>
        </Pressable>
      ))}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50, padding: 4, flexDirection: 'row', gap: 3,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 50, alignItems: 'center' },
  tabActive: {
    backgroundColor: '#1a1030',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  label: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#9985cc' },
  labelActive: { color: '#fff' },
});
```

---

## Setup de fontes (App.tsx)

```tsx
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded) return <SplashScreen />;
  return <NavigationContainer>...</NavigationContainer>;
}
```

## Dependências necessárias

```bash
npx expo install expo-blur expo-linear-gradient
npx expo install @expo-google-fonts/nunito
npx expo install react-native-reanimated
npx expo install react-native-gesture-handler
```
