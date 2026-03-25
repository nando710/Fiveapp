import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from 'expo-router';

/**
 * Fade-in toda vez que a tela recebe foco (troca de tab ou navegação).
 * Use o `fadeStyle` no Animated.View raiz da tela.
 *
 * @example
 * const { fadeStyle } = useFadeIn();
 * <Animated.View style={[{ flex: 1 }, fadeStyle]}>…</Animated.View>
 */
export function useFadeIn(duration = 260) {
  const opacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, [])
  );

  return { fadeStyle: { opacity } };
}
