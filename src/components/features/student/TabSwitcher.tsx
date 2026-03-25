import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface TabSwitcherProps {
  tabs: string[];
  active: number;
  onChange: (index: number) => void;
}

export function TabSwitcher({ tabs, active, onChange }: TabSwitcherProps) {
  const handlePress = (i: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(i);
  };

  const Wrapper = Platform.OS === 'android' ? View : BlurView;
  const wrapperProps = Platform.OS === 'android'
    ? { style: [styles.container, styles.androidFallback] }
    : { intensity: 55, tint: 'light' as const, style: styles.container };

  return (
    <Wrapper {...(wrapperProps as any)}>
      {tabs.map((tab, i) => (
        <Pressable
          key={tab}
          onPress={() => handlePress(i)}
          style={[styles.tab, active === i && styles.tabActive]}
        >
          <Text style={[styles.label, active === i && styles.labelActive]}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    padding: 4,
    flexDirection: 'row',
    gap: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  androidFallback: {
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#1a1030',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#9985cc',
  },
  labelActive: {
    color: '#fff',
  },
});
