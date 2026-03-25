import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassItem {
  id: string;
  time: string;
  name: string;
  duration: string;
  room: string;
  students: number;
  isReposicao?: boolean;
}

interface PendingRequest {
  id: string;
  student: string;
  avatar: string;
  class: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
// Today = 2026-03-25 = Wednesday = index 2
const WEEK_DATES = ['23', '24', '25', '26', '27', '28'];

const SCHEDULE: Record<number, ClassItem[]> = {
  0: [],
  1: [
    { id: 'cl1', time: '08:00', name: 'Book 1 — 08h', duration: '90min', room: 'Sala 2', students: 15 },
  ],
  2: [
    { id: 'cl2', time: '17:00', name: 'Book 2 — 17h', duration: '90min', room: 'Sala 1', students: 10 },
    { id: 'cl3', time: '19:00', name: 'Book 3 — 19h', duration: '90min', room: 'Sala 3', students: 12 },
  ],
  3: [
    { id: 'cl4', time: '08:00', name: 'Book 1 — 08h', duration: '90min', room: 'Sala 2', students: 15 },
  ],
  4: [
    { id: 'cl5', time: '17:00', name: 'Book 2 — 17h', duration: '90min', room: 'Sala 1', students: 10 },
    { id: 'cl6', time: '19:00', name: 'Book 3 — 19h', duration: '90min', room: 'Sala 3', students: 12 },
  ],
  5: [
    { id: 'cl7', time: '09:00', name: 'Reposições — Sáb', duration: '60min', room: 'Sala 1', students: 3, isReposicao: true },
  ],
};

const INITIAL_PENDING: PendingRequest[] = [
  {
    id: 'r1',
    student: 'Pedro S.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    class: 'Book 3 — 19h',
    requestedDate: '28/03 — Sáb',
    requestedTime: '09:00',
    reason: 'Viagem de trabalho',
  },
  {
    id: 'r2',
    student: 'Julia M.',
    avatar: 'https://i.pravatar.cc/150?img=25',
    class: 'Book 2 — 17h',
    requestedDate: '29/03 — Dom',
    requestedTime: '10:00',
    reason: 'Consulta médica',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState(2);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(INITIAL_PENDING);

  const { s } = useStaggeredEntry(3);

  const todayIndex = 2;
  const dayClasses = SCHEDULE[activeDay] ?? [];

  const handleApprove = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Header ── */}
          <Animated.View style={s(0)}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Agenda Dinâmica</Text>
              <Text style={styles.headerSub}>Março 2026</Text>
            </View>
          </Animated.View>

          {/* ── Week Day Selector ── */}
          <Animated.View style={s(1)}>
            <View style={styles.weekRow}>
              {WEEK_DAYS.map((day, index) => {
                const isActive = activeDay === index;
                const isToday = index === todayIndex;
                return (
                  <Pressable
                    key={day}
                    onPress={() => setActiveDay(index)}
                    style={[styles.dayChip, isActive && styles.dayChipActive]}
                  >
                    <Text style={[styles.dayChipLabel, isActive && styles.dayChipLabelActive]}>
                      {day}
                    </Text>
                    <Text style={[styles.dayChipDate, isActive && styles.dayChipDateActive]}>
                      {WEEK_DATES[index]}
                    </Text>
                    {isToday && (
                      <View style={[styles.todayDot, isActive && styles.todayDotActive]} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          {/* ── Schedule + Requests ── */}
          <Animated.View style={s(2)}>
            {/* Classes for selected day */}
            {dayClasses.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="#C0BBDD" />
                <Text style={styles.emptyText}>Sem aulas neste dia</Text>
              </View>
            ) : (
              dayClasses.map((cls) => (
                <View key={cls.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.classCard}>
                    <View style={styles.classTimeCol}>
                      <Text style={styles.classTime}>{cls.time}</Text>
                    </View>
                    <View style={styles.classInfo}>
                      <View style={styles.classNameRow}>
                        <Text style={styles.className}>{cls.name}</Text>
                        {cls.isReposicao && (
                          <View style={styles.reposicaoBadge}>
                            <Text style={styles.reposicaoBadgeText}>Reposição</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.classMeta}>{cls.room} · {cls.duration}</Text>
                      <View style={styles.studentsRow}>
                        <Ionicons name="people-outline" size={13} color="#888" />
                        <Text style={styles.studentsText}>{cls.students} alunos</Text>
                      </View>
                    </View>
                  </BlurView>
                </View>
              ))
            )}

            {/* ── Makeup class requests ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Solicitações de Reposição</Text>
              {pendingRequests.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{pendingRequests.length}</Text>
                </View>
              )}
            </View>

            {pendingRequests.length === 0 ? (
              <View style={styles.cardShadow}>
                <BlurView intensity={50} tint="light" style={styles.emptyRequestsCard}>
                  <Ionicons name="checkmark-circle-outline" size={28} color="#10B981" />
                  <Text style={styles.emptyRequestsText}>Nenhuma solicitação pendente</Text>
                </BlurView>
              </View>
            ) : (
              pendingRequests.map((req) => (
                <View key={req.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.requestCard}>
                    <View style={styles.requestTop}>
                      <Image
                        source={{ uri: req.avatar }}
                        style={styles.requestAvatar}
                      />
                      <View style={styles.requestInfo}>
                        <Text style={styles.requestStudent}>{req.student}</Text>
                        <Text style={styles.requestClass}>{req.class}</Text>
                      </View>
                    </View>
                    <View style={styles.requestDetails}>
                      <View style={styles.requestDetailRow}>
                        <Ionicons name="calendar-outline" size={13} color="#7B5CF0" />
                        <Text style={styles.requestDetailText}>
                          {req.requestedDate} às {req.requestedTime}
                        </Text>
                      </View>
                      <View style={styles.requestDetailRow}>
                        <Ionicons name="chatbubble-outline" size={13} color="#888" />
                        <Text style={styles.requestReason}>{req.reason}</Text>
                      </View>
                    </View>
                    <View style={styles.requestActions}>
                      <Pressable
                        onPress={() => handleReject(req.id)}
                        style={styles.rejectBtn}
                      >
                        <Text style={styles.rejectBtnText}>Recusar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleApprove(req.id)}
                        style={styles.approveBtn}
                      >
                        <Text style={styles.approveBtnText}>Aprovar</Text>
                      </Pressable>
                    </View>
                  </BlurView>
                </View>
              ))
            )}
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
    paddingHorizontal: 16,
  },

  // Header
  header: {
    paddingTop: 20,
    paddingBottom: 4,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 26,
    color: '#1a1030',
  },
  headerSub: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },

  // Week selector
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 5,
  },
  dayChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    minHeight: 64,
    justifyContent: 'center',
    position: 'relative',
  },
  dayChipActive: {
    backgroundColor: '#1a1030',
    borderColor: '#1a1030',
  },
  dayChipLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  dayChipLabelActive: {
    color: '#fff',
  },
  dayChipDate: {
    fontFamily: 'Nunito_900Black',
    fontSize: 15,
    color: '#1a1030',
  },
  dayChipDateActive: {
    color: '#fff',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#7B5CF0',
    position: 'absolute',
    bottom: 6,
  },
  todayDotActive: {
    backgroundColor: '#C4B5FD',
  },

  // Empty state (no classes)
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#B0ABCE',
  },

  // Card shadow wrapper
  cardShadow: {
    borderRadius: 18,
    marginBottom: 12,
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
    padding: 16,
    gap: 16,
  },
  classTimeCol: {
    alignItems: 'center',
    minWidth: 54,
  },
  classTime: {
    fontFamily: 'Nunito_900Black',
    fontSize: 22,
    color: '#7B5CF0',
  },
  classInfo: {
    flex: 1,
    gap: 4,
  },
  classNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  className: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
  },
  classMeta: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  studentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentsText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  reposicaoBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reposicaoBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    color: '#D97706',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 17,
    color: '#1a1030',
  },
  countBadge: {
    backgroundColor: '#7B5CF0',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    color: '#fff',
  },

  // Empty requests card
  emptyRequestsCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  emptyRequestsText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#10B981',
  },

  // Request card
  requestCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 16,
    gap: 12,
  },
  requestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0DCEF',
  },
  requestInfo: {
    flex: 1,
    gap: 2,
  },
  requestStudent: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
  },
  requestClass: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#7B5CF0',
  },
  requestDetails: {
    gap: 6,
    paddingLeft: 2,
  },
  requestDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestDetailText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#444',
  },
  requestReason: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rejectBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#EF4444',
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  approveBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#fff',
  },
});
