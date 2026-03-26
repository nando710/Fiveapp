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

interface AdminStats {
  units: number;
  students: number;
  teachers: number;
  cities: number;
}

interface AdminMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface AdminData {
  name: string;
  role: string;
  email: string;
  avatar: string;
  since: string;
  stats: AdminStats;
  admins: AdminMember[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ADMIN: AdminData = {
  name: 'Five Idiomas Brasil',
  role: 'Administração Central',
  email: 'admin@fiveidiomas.com.br',
  avatar: 'https://i.pravatar.cc/150?img=68',
  since: '2018',
  stats: { units: 24, students: 3420, teachers: 120, cities: 8 },
  admins: [
    { id: 'ad1', name: 'João Silva', role: 'Diretor Geral', avatar: 'https://i.pravatar.cc/150?img=57' },
    { id: 'ad2', name: 'Maria Costa', role: 'Coordenadora Pedagógica', avatar: 'https://i.pravatar.cc/150?img=49' },
    { id: 'ad3', name: 'Carlos Lima', role: 'Diretor Comercial', avatar: 'https://i.pravatar.cc/150?img=56' },
  ],
};

const STAT_ITEMS: {
  key: keyof AdminStats;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { key: 'units', label: 'Unidades', icon: 'business-outline', color: '#7B5CF0' },
  { key: 'students', label: 'Alunos', icon: 'people-outline', color: '#3B82F6' },
  { key: 'teachers', label: 'Professores', icon: 'school-outline', color: '#10B981' },
  { key: 'cities', label: 'Cidades', icon: 'location-outline', color: '#F59E0B' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AdminProfileScreen() {
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

              {/* Crown icon */}
              <View style={styles.crownWrap}>
                <Ionicons name="shield-checkmark" size={36} color="rgba(255,255,255,0.9)" />
              </View>

              {/* Company name */}
              <Text style={styles.profileName}>{ADMIN.name}</Text>
              <Text style={styles.profileRole}>{ADMIN.role}</Text>

              {/* Since badge */}
              <View style={styles.sinceBadge}>
                <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.85)" />
                <Text style={styles.sinceBadgeText}>Desde {ADMIN.since}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Stats Grid 2x2 ── */}
          <Animated.View style={s(1)}>
            <View style={styles.statsGrid}>
              {STAT_ITEMS.map((item) => (
                <View key={item.key} style={[styles.statShadow, styles.statHalf]}>
                  <BlurView intensity={50} tint="light" style={styles.statCard}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                    <Text style={[styles.statNumber, { color: item.color }]}>
                      {ADMIN.stats[item.key].toLocaleString('pt-BR')}
                    </Text>
                    <Text style={styles.statLabel}>{item.label}</Text>
                  </BlurView>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── Administrators Section ── */}
          <Animated.View style={s(2)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Administradores</Text>
              <Pressable style={styles.addBtn}>
                <Ionicons name="add-outline" size={16} color="#7B5CF0" />
                <Text style={styles.addBtnText}>Adicionar</Text>
              </Pressable>
            </View>

            {ADMIN.admins.map((admin) => (
              <View key={admin.id} style={styles.cardShadow}>
                <BlurView intensity={50} tint="light" style={styles.adminCard}>
                  <View style={styles.adminAvatarWrap}>
                    <Image
                      source={{ uri: admin.avatar }}
                      style={styles.adminAvatar}
                      contentFit="cover"
                    />
                  </View>
                  <View style={styles.adminInfo}>
                    <Text style={styles.adminName}>{admin.name}</Text>
                    <Text style={styles.adminRole}>{admin.role}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </BlurView>
              </View>
            ))}

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
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  crownWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  profileName: {
    fontFamily: 'Nunito_900Black',
    fontSize: 22,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileRole: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 14,
  },
  sinceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sinceBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
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

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 17,
    color: '#1a1030',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(123,92,240,0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7B5CF0',
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

  // Admin card
  adminCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  adminAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E0DCEF',
  },
  adminAvatar: {
    width: '100%',
    height: '100%',
  },
  adminInfo: {
    flex: 1,
    gap: 2,
  },
  adminName: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#1a1030',
  },
  adminRole: {
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
    marginTop: 24,
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
