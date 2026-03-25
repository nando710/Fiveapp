import { View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useAuthStore } from '@stores/authStore';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  emoji?: string;
}

export function PlaceholderScreen({ title, subtitle, emoji = '🚧' }: PlaceholderScreenProps) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <BlurView intensity={55} tint="light" style={styles.card}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text variant="h3" style={styles.title}>{title}</Text>
            {subtitle ? (
              <Text variant="caption" color="#888" style={styles.subtitle}>{subtitle}</Text>
            ) : null}
            <View style={styles.badge}>
              <Text variant="label" color="#7B5CF0" style={styles.badgeText}>
                Em construção
              </Text>
            </View>
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={14} color="#EF4444" />
              <Text style={styles.logoutText}>Trocar perfil</Text>
            </Pressable>
          </BlurView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:       { flex: 1 },
  safe:     { flex: 1 },
  center:   { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    minWidth: 280,
    gap: 8,
  },
  emoji:    { fontSize: 48, marginBottom: 8 },
  title:    { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  badge: {
    marginTop: 8,
    backgroundColor: 'rgba(123,92,240,0.12)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(123,92,240,0.25)',
  },
  badgeText: { fontSize: 12 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  logoutText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#EF4444',
  },
});
