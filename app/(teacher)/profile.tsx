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

interface TeacherClass {
  id: string;
  name: string;
  students: number;
  book: string;
  days: string;
}

interface TeacherStats {
  totalStudents: number;
  diariesThisMonth: number;
  avgClassScore: number;
  pendingEvals: number;
}

interface TeacherData {
  name: string;
  email: string;
  avatar: string;
  unit: string;
  since: string;
  classes: TeacherClass[];
  stats: TeacherStats;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TEACHER: TeacherData = {
  name: 'Prof. Marina Costa',
  email: 'marina.costa@fiveidiomas.com.br',
  avatar: 'https://i.pravatar.cc/150?img=5',
  unit: 'Five Idiomas — Pinheiros',
  since: '2022',
  classes: [
    { id: 'c1', name: 'Book 3 — 19h', students: 12, book: 'Book 3', days: 'Seg / Qua / Sex' },
    { id: 'c2', name: 'Book 1 — 08h', students: 15, book: 'Book 1', days: 'Ter / Qui' },
    { id: 'c3', name: 'Book 2 — 17h', students: 10, book: 'Book 2', days: 'Qua / Sex' },
  ],
  stats: {
    totalStudents: 37,
    diariesThisMonth: 18,
    avgClassScore: 8.2,
    pendingEvals: 3,
  },
};

const BOOK_COLORS: Record<string, string> = {
  'Book 1': '#3B82F6',
  'Book 2': '#10B981',
  'Book 3': '#7B5CF0',
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TeacherProfileScreen() {
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
              {/* Logout button top-right */}
              <Pressable onPress={logout} style={styles.logoutTopBtn}>
                <Ionicons name="log-out-outline" size={18} color="rgba(255,255,255,0.7)" />
                <Text style={styles.logoutTopText}>Sair</Text>
              </Pressable>

              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: TEACHER.avatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>

              {/* Name & unit */}
              <Text style={styles.profileName}>{TEACHER.name}</Text>
              <Text style={styles.profileUnit}>{TEACHER.unit}</Text>

              {/* Since badge */}
              <View style={styles.sinceBadge}>
                <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.85)" />
                <Text style={styles.sinceBadgeText}>Desde {TEACHER.since}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Stats grid ── */}
          <Animated.View style={s(1)}>
            <View style={styles.statsGrid}>
              {/* Total students */}
              <View style={[styles.statShadow, styles.statHalf]}>
                <BlurView intensity={50} tint="light" style={styles.statCard}>
                  <Ionicons name="people-outline" size={22} color="#7B5CF0" />
                  <Text style={styles.statNumber}>{TEACHER.stats.totalStudents}</Text>
                  <Text style={styles.statLabel}>Alunos</Text>
                </BlurView>
              </View>

              {/* Diaries this month */}
              <View style={[styles.statShadow, styles.statHalf]}>
                <BlurView intensity={50} tint="light" style={styles.statCard}>
                  <Ionicons name="journal-outline" size={22} color="#7B5CF0" />
                  <Text style={styles.statNumber}>{TEACHER.stats.diariesThisMonth}</Text>
                  <Text style={styles.statLabel}>Diários no mês</Text>
                </BlurView>
              </View>

              {/* Avg class score */}
              <View style={[styles.statShadow, styles.statHalf]}>
                <BlurView intensity={50} tint="light" style={styles.statCard}>
                  <Ionicons name="star-outline" size={22} color="#10B981" />
                  <Text style={[styles.statNumber, { color: '#10B981' }]}>
                    {TEACHER.stats.avgClassScore.toFixed(1)}
                  </Text>
                  <Text style={styles.statLabel}>Média das turmas</Text>
                </BlurView>
              </View>

              {/* Pending evals */}
              <View style={[styles.statShadow, styles.statHalf]}>
                <BlurView intensity={50} tint="light" style={styles.statCard}>
                  <Ionicons name="alert-circle-outline" size={22} color="#F59E0B" />
                  <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
                    {TEACHER.stats.pendingEvals}
                  </Text>
                  <Text style={styles.statLabel}>Avaliações pend.</Text>
                </BlurView>
              </View>
            </View>
          </Animated.View>

          {/* ── Classes ── */}
          <Animated.View style={s(2)}>
            <Text style={styles.sectionTitle}>Minhas Turmas</Text>

            {TEACHER.classes.map((cls) => {
              const bookColor = BOOK_COLORS[cls.book] ?? '#7B5CF0';
              return (
                <View key={cls.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.classCard}>
                    {/* Left: book icon + info */}
                    <View style={[styles.classIconWrap, { backgroundColor: bookColor + '1A' }]}>
                      <Ionicons name="book-outline" size={22} color={bookColor} />
                    </View>
                    <View style={styles.classInfo}>
                      <Text style={styles.className}>{cls.name}</Text>
                      <View style={styles.classDaysRow}>
                        <Ionicons name="calendar-outline" size={12} color="#888" />
                        <Text style={styles.classDays}>{cls.days}</Text>
                      </View>
                    </View>

                    {/* Right: student count + book badge */}
                    <View style={styles.classRight}>
                      <View style={styles.studentCountBadge}>
                        <Ionicons name="people-outline" size={12} color="#7B5CF0" />
                        <Text style={styles.studentCountText}>{cls.students}</Text>
                      </View>
                      <View style={[styles.bookBadge, { backgroundColor: bookColor + '1A', borderColor: bookColor + '40' }]}>
                        <Text style={[styles.bookBadgeText, { color: bookColor }]}>{cls.book}</Text>
                      </View>
                    </View>
                  </BlurView>
                </View>
              );
            })}

            {/* Bottom logout */}
            <Pressable onPress={logout} style={styles.logoutBottomBtn}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.logoutBottomText}>Sair da conta</Text>
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
  logoutTopBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logoutTopText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
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
  },
  profileUnit: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    textAlign: 'center',
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
    borderRadius: 16,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statCard: {
    borderRadius: 16,
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
    color: '#1a1030',
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

  // Class card
  classCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  classIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classInfo: {
    flex: 1,
    gap: 4,
  },
  className: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#1a1030',
  },
  classDaysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classDays: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  classRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  studentCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(123,92,240,0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  studentCountText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#7B5CF0',
  },
  bookBadge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bookBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },

  // Bottom logout
  logoutBottomBtn: {
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
  logoutBottomText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#EF4444',
  },
});
