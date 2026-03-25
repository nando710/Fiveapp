import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onNotificationPress?: () => void;
}

export function SearchBar({ onNotificationPress }: SearchBarProps) {
  const Wrapper = Platform.OS === 'android' ? View : BlurView;
  const wrapperProps = Platform.OS === 'android'
    ? { style: [styles.container, styles.androidFallback] }
    : { intensity: 60, tint: 'light' as const, style: styles.container };

  return (
    <Wrapper {...(wrapperProps as any)}>
      <Ionicons name="search-outline" size={16} color="#aaa" />
      <TextInput
        placeholder="Buscar no FiveApp"
        placeholderTextColor="#aaa"
        style={styles.input}
      />
      <Pressable style={styles.micBtn}>
        <Ionicons name="mic-outline" size={14} color="#7B5CF0" />
      </Pressable>
      <Pressable style={styles.bellBtn} onPress={onNotificationPress}>
        <Ionicons name="notifications-outline" size={15} color="#fff" />
      </Pressable>
    </Wrapper>
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
    marginHorizontal: 16,
    marginBottom: 4,
  },
  androidFallback: {
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#555',
    paddingVertical: 0,
  },
  micBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  bellBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(26,16,48,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
