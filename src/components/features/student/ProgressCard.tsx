import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';

interface ProgressCardProps {
  step: number;
  current: number;
  total: number;
  title: string;
}

export function ProgressCard({ step, current, total, title }: ProgressCardProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: current / total,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [current, total]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const Wrapper = Platform.OS === 'android' ? View : BlurView;
  const wrapperProps = Platform.OS === 'android'
    ? { style: [styles.card, styles.androidFallback] }
    : { intensity: 55, tint: 'light' as const, style: styles.card };

  return (
    <Wrapper {...(wrapperProps as any)}>
      <View style={styles.stepCol}>
        <Text style={styles.stepLbl}>Step</Text>
        <Text style={styles.stepNum}>{step}</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.count}>{current}/{total}</Text>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: barWidth }]} />
        </View>
        <Text style={styles.hint}>
          {Math.round((current / total) * 100)}% concluído
        </Text>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  androidFallback: {
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  stepCol: { flexShrink: 0, alignItems: 'center' },
  stepLbl: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10,
    color: 'rgba(100,80,200,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  stepNum: {
    fontFamily: 'Nunito_900Black',
    fontSize: 48,
    color: '#1a1030',
    lineHeight: 52,
  },
  right:   { flex: 1, gap: 8 },
  topRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7c6faa',
  },
  count: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#9988cc',
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderRadius: 99,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
  },
  fill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: '#10B981',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  hint: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#10B981',
  },
});
