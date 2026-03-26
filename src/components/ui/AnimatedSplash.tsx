import { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, Easing, PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from './Logo';

const { width: W, height: H } = Dimensions.get('window');
const SWIPE_THRESHOLD = H * 0.15;

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const shineX = useRef(new Animated.Value(-W)).current;

  // Swipe up hint
  const hintOpacity = useRef(new Animated.Value(0)).current;
  const hintY = useRef(new Animated.Value(0)).current;
  const chevronY = useRef(new Animated.Value(0)).current;

  // Swipe dismiss
  const slideY = useRef(new Animated.Value(0)).current;
  const dismissed = useRef(false);

  useEffect(() => {
    // 1. Logo fade in
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
        Animated.timing(logoScale, { toValue: 1, duration: 1000, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      ]),
    ]).start();

    // 2. Shine sweep
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(shineX, { toValue: W, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
    ]).start();

    // 3. Hint appears after shine
    Animated.sequence([
      Animated.delay(2000),
      Animated.timing(hintOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // 4. Chevron bouncing loop
    Animated.sequence([
      Animated.delay(2000),
      Animated.loop(
        Animated.sequence([
          Animated.timing(chevronY, { toValue: -8, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(chevronY, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ]),
      ),
    ]).start();
  }, []);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    Animated.timing(slideY, {
      toValue: -H,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => onFinish());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy < -10,
      onPanResponderMove: (_, { dy }) => {
        if (dy < 0) slideY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy < -SWIPE_THRESHOLD || vy < -0.5) {
          dismiss();
        } else {
          Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 100, friction: 14 }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideY }] }]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={['#0d0620', '#1a1030']}
        style={StyleSheet.absoluteFill}
      />

      {/* Logo */}
      <Animated.View style={{
        opacity: logoOpacity,
        transform: [{ scale: logoScale }],
      }}>
        <Logo width={W * 0.55} color="#fff" />
      </Animated.View>

      {/* Shine sweep */}
      <Animated.View
        style={[styles.shine, { transform: [{ translateX: shineX }] }]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.15)', 'transparent']}
          style={styles.shineGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Swipe up hint */}
      <Animated.View style={[styles.hintWrap, { opacity: hintOpacity }]}>
        <Animated.View style={{ transform: [{ translateY: chevronY }] }}>
          <Ionicons name="chevron-up" size={22} color="rgba(255,255,255,0.4)" />
        </Animated.View>
        <Text style={styles.hintText}>Deslize para começar</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  shine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: W * 0.6,
  },
  shineGrad: {
    flex: 1,
  },
  hintWrap: {
    position: 'absolute',
    bottom: H * 0.1,
    alignItems: 'center',
    gap: 4,
  },
  hintText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.5,
  },
});
