import { View, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useUiStore } from '@stores/uiStore';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const cameraOpen = useUiStore((s) => s.cameraOpen);
  const exerciseOpen = useUiStore((s) => s.exerciseOpen);
  if (cameraOpen || exerciseOpen) return null;

  // Filter out hidden routes (href: null sets tabBarButton on options)
  const visibleRoutes = state.routes.filter(
    (route) => !descriptors[route.key].options.tabBarButton
  );
  const centerIndex = Math.floor(visibleRoutes.length / 2);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <BlurView intensity={70} tint="dark" style={styles.nav}>
        {visibleRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.indexOf(route);
          const isCenter = index === centerIndex;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params as never);
            }
          };

          if (isCenter) {
            return (
              <Pressable key={route.key} onPress={onPress} style={styles.centerWrap}>
                <LinearGradient
                  colors={['#9B6DFF', '#7B3FF6', '#5B1BE5']}
                  style={styles.centerBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {options.tabBarIcon?.({ color: '#fff', focused: true, size: 24 })}
                </LinearGradient>
              </Pressable>
            );
          }

          const iconColor = isFocused ? '#fff' : 'rgba(255,255,255,0.42)';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.navItem, isFocused && styles.navItemActive]}
            >
              {options.tabBarIcon?.({ color: iconColor, focused: isFocused, size: 22 })}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
  },
  nav: {
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  centerWrap: {
    marginTop: -10,
  },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,170,255,0.4)',
  },
  navItem: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.42,
  },
  navItemActive: {
    opacity: 1,
  },
});
