import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuthStore } from '@stores/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FranchiseStats {
  students: number;
  teachers: number;
  classes: number;
  retention: number;
}

interface FranchiseData {
  name: string;
  owner: string;
  email: string;
  avatar: string;
  since: string;
  address: string;
  phone: string;
  stats: FranchiseStats;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FRANCHISE: FranchiseData = {
  name: 'Five Idiomas — Pinheiros',
  owner: 'Roberto Mendes',
  email: 'pinheiros@fiveidiomas.com.br',
  avatar: 'https://i.pravatar.cc/150?img=68',
  since: '2021',
  address: 'Rua dos Pinheiros, 450 — São Paulo, SP',
  phone: '(11) 99876-5432',
  stats: { students: 142, teachers: 5, classes: 12, retention: 87 },
};

const STAT_ITEMS: {
  key: keyof FranchiseStats;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  suffix?: string;
}[] = [
  { key: 'students', label: 'Alunos', icon: 'people-outline', color: '#7B5CF0' },
  { key: 'teachers', label: 'Professores', icon: 'school-outline', color: '#3B82F6' },
  { key: 'classes', label: 'Turmas', icon: 'book-outline', color: '#10B981' },
  { key: 'retention', label: 'Retenção', icon: 'trending-up-outline', color: '#F59E0B', suffix: '%' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FranchiseProfileScreen() {
  const logout = useAuthStore((s) => s.logout);
  const { s } = useStaggeredEntry(3);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Profile Header ── */}
          <Animated.View style={s(0)}>
            <LinearGradient colors={['#7B5CF0', '#4C1D95']} style={styles.profileHeader}>
              {/* Shine diagonal */}
              <LinearGradient
                colors={['rgba(255,255,255,0.18)', 'transparent', 'rgba(0,0,0,0.08)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                pointerEvents="none"
              />

              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: FRANCHISE.avatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>

              {/* Name & owner */}
              <Text style={styles.profileName}>{FRANCHISE.name}</Text>
              <Text style={styles.profileOwner}>{FRANCHISE.owner}</Text>

              {/* Since badge */}
              <View style={styles.sinceBadge}>
                <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.85)" />
                <Text style={styles.sinceBadgeText}>Desde {FRANCHISE.since}</Text>
              </View>

              {/* Address */}
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.addressText}>{FRANCHISE.address}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Stats Grid ── */}
          <Animated.View style={s(1)}>
            <View style={styles.statsGrid}>
              {STAT_ITEMS.map((item) => (
                <View key={item.key} style={[styles.statShadow, styles.statHalf]}>
                  <BlurView intensity={50} tint="light" style={styles.statCard}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                    <Text style={[styles.statNumber, { color: item.color }]}>
                      {FRANCHISE.stats[item.key]}{item.suffix ?? ''}
                    </Text>
                    <Text style={styles.statLabel}>{item.label}</Text>
                  </BlurView>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── Quick Actions ── */}
          <Animated.View style={s(2)}>
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>

            {/* Unit Settings */}
            <Pressable style={styles.cardShadow}>
              <BlurView intensity={50} tint="light" style={styles.actionCard}>
                <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(123,92,240,0.1)' }]}>
                  <Ionicons name="settings-outline" size={22} color="#7B5CF0" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Configurações da Unidade</Text>
                  <Text style={styles.actionSubtitle}>Horários, dados e preferências</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#888" />
              </BlurView>
            </Pressable>

            {/* Support */}
            <Pressable style={styles.cardShadow}>
              <BlurView intensity={50} tint="light" style={styles.actionCard}>
                <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                  <Ionicons name="help-circle-outline" size={22} color="#3B82F6" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Suporte Five</Text>
                  <Text style={styles.actionSubtitle}>Fale com a equipe da franqueadora</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#888" />
              </BlurView>
            </Pressable>

            {/* Logout */}
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  // Profile header gradient card
  profileHeader: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#E0DCEF',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontFamily: 'Nunito_900Black',
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileOwner: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  sinceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  sinceBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  addressText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
    textAlign: 'center',
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  statHalf: {
    width: '47%',
  },
  statShadow: {
    borderRadius: 18,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontFamily: 'Nunito_900Black',
    fontSize: 28,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },

  // Section title
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 17,
    color: '#1a1030',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },

  // Card shadow
  cardShadow: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Action card
  actionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
    gap: 3,
  },
  actionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#1a1030',
  },
  actionSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.06)',
  },
  logoutText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#EF4444',
  },
});
