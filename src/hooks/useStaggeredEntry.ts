import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from 'expo-router';

interface Options {
  delay?: number;      // ms entre cada elemento
  duration?: number;   // duração de cada animação
  offsetY?: number;    // distância vertical de entrada (px)
  initialDelay?: number; // delay antes de iniciar a sequência
}

/**
 * Anima elementos em cascata ao montar o componente.
 * Cada elemento entra com fade + slide-up.
 *
 * @example
 * const { s } = useStaggeredEntry(6);
 * <Animated.View style={s(0)}>…</Animated.View>
 * <Animated.View style={s(1)}>…</Animated.View>
 */
export function useStaggeredEntry(
  count: number,
  { delay = 75, duration = 420, offsetY = 22, initialDelay = 60 }: Options = {}
) {
  const anims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  useFocusEffect(
    useCallback(() => {
      // Reseta todos para 0 antes de reanimar
      anims.forEach((a) => a.setValue(0));

      const timer = setTimeout(() => {
        Animated.stagger(
          delay,
          anims.map((a) =>
            Animated.timing(a, {
              toValue: 1,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            })
          )
        ).start();
      }, initialDelay);

      return () => clearTimeout(timer);
    }, [])
  );

  /** Retorna o style animado para o índice i */
  const s = (i: number) => ({
    opacity: anims[i],
    transform: [
      {
        translateY: anims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [offsetY, 0],
        }),
      },
    ],
  });

  return { s };
}
