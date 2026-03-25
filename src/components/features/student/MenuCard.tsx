import { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';

interface MenuCardProps {
  label: string;
  gradient: [string, string, ...string[]];
  mascot: ReactNode;
  onPress: () => void;
  fullWidth?: boolean;
}

export function MenuCard({ label, gradient, mascot, onPress, fullWidth }: MenuCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 30, bounciness: 0 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
  };

  return (
    <Animated.View style={[styles.card, fullWidth && styles.fullWidth, { transform: [{ scale }] }]}>
      {/* Fundo gradiente */}
      <LinearGradient
        colors={gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Shine diagonal */}
      <LinearGradient
        colors={['rgba(255,255,255,0.18)', 'transparent', 'rgba(0,0,0,0.08)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
      />
      {/* Mascote */}
      <View style={styles.mascotWrap} pointerEvents="none">
        {mascot}
      </View>
      {/* Label glass */}
      <BlurView intensity={50} tint="light" style={styles.labelWrap} pointerEvents="none">
        <Text style={styles.label}>{label}</Text>
      </BlurView>
      {/* Pressable por cima de tudo para capturar os toques */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 118,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  fullWidth: {
    flex: 0,
    width: '100%',
  },
  mascotWrap: {
    position: 'absolute',
    right: -10,
    bottom: -4,
  },
  labelWrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -22 }],
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  label: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
