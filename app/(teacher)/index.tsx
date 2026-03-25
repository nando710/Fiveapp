import { View, Text, ScrollView, Pressable, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { router } from 'expo-router';
import { useAuthStore } from '@stores/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassCard {
  id: string;
  name: string;
  time: string;
  timeEnd: string;
  room: string;
  studentCount: number;
  type: 'class' | 'replacement';
  color: string;
  borderColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TEACHER = {
  name: 'Marina Costa',
  avatar: 'https://i.pravatar.cc/150?img=5',
  totalStudents: 37,
};

const TODAY_CLASSES: ClassCard[] = [
  {
    id: 'cl1',
    name: 'Book 1 — Turma A',
    time: '08:00',
    timeEnd: '09:30',
    room: 'Sala 2 — Térreo',
    studentCount: 15,
    type: 'class',
    color: '#DDFAF5',
    borderColor: '#10B981',
  },
  {
    id: 'cl2',
    name: 'Book 2 — Reposição',
    time: '10:30',
    timeEnd: '12:00',
    room: 'Sala 1 — Térreo',
    studentCount: 4,
    type: 'replacement',
    color: '#FFF0E8',
    borderColor: '#F59E0B',
  },
  {
    id: 'cl3',
    name: 'Book 2 — Turma B',
    time: '17:00',
    timeEnd: '18:30',
    room: 'Sala 1 — Térreo',
    studentCount: 10,
    type: 'class',
    color: '#EDE8FF',
    borderColor: '#7B5CF0',
  },
  {
    id: 'cl4',
    name: 'Book 3 — Turma C',
    time: '19:00',
    timeEnd: '20:30',
    room: 'Sala 3 — 1º Andar',
    studentCount: 12,
    type: 'class',
    color: '#FFF0E8',
    borderColor: '#F59E0B',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function formatDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TeacherDashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const firstName = (user?.name ?? TEACHER.name).split(' ')[0];

  // s(0)=Header  s(1)=Stats  s(2)=Agenda
  const { s } = useStaggeredEntry(3);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >

          {/* ── Header ── */}
          <Animated.View style={[styles.header, s(0)]}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: user?.avatarUrl ?? TEACHER.avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.avatarRing} />
            </View>

            <View style={styles.greetingWrap}>
              <Text style={styles.greetingText}>{greeting()},</Text>
              <Text style={styles.greetingName}>Prof. {firstName}!</Text>
              <Text style={styles.greetingDate}>{formatDate()}</Text>
            </View>

            <Pressable style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="#7B5CF0" />
              <View style={styles.notifDot} />
            </Pressable>
          </Animated.View>

          {/* ── Stats ── */}
          <Animated.View style={[styles.statsRow, s(1)]}>
            {/* Total alunos */}
            <View style={styles.statCard}>
              <LinearGradient colors={['#1a1030', '#0d0620']} style={styles.statCardGrad}>
                <View style={styles.statIconWrap}>
                  <Ionicons name="people-outline" size={20} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.statNumber}>{TEACHER.totalStudents}</Text>
                <Text style={styles.statLabel}>Total de alunos</Text>
                <View style={styles.statBgIcon}>
                  <Ionicons name="people" size={64} color="rgba(255,255,255,0.06)" />
                </View>
              </LinearGradient>
            </View>

            {/* Aulas hoje */}
            <View style={styles.statCard}>
              <LinearGradient colors={['#1a1030', '#0d0620']} style={styles.statCardGrad}>
                <View style={styles.statIconWrap}>
                  <Ionicons name="school-outline" size={20} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.statNumber}>{TODAY_CLASSES.length}</Text>
                <Text style={styles.statLabel}>Aulas hoje</Text>
                <View style={styles.statBgIcon}>
                  <Ionicons name="school" size={64} color="rgba(255,255,255,0.06)" />
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* ── Agenda do dia ── */}
          <Animated.View style={s(2)}>
            <View style={styles.agendaHeader}>
              <View style={styles.agendaTitleRow}>
                <Ionicons name="calendar-outline" size={20} color="#1a1030" />
                <Text style={styles.agendaTitle}>Agenda do dia</Text>
              </View>
              <Pressable style={styles.verTudoBtn}>
                <Text style={styles.verTudoText}>Ver tudo</Text>
              </Pressable>
            </View>

            {/* Timeline */}
            <View style={styles.timeline}>
              {/* Linha vertical */}
              <View style={styles.timelineLine} />

              {TODAY_CLASSES.map((cls) => (
                <View key={cls.id} style={styles.timelineRow}>
                  {/* Hora */}
                  <View style={styles.timeCol}>
                    <Text style={styles.timeText}>{cls.time}</Text>
                    <View style={[styles.timeDot, { backgroundColor: cls.borderColor }]} />
                  </View>

                  {/* Card */}
                  <View style={[styles.classCard, { backgroundColor: cls.color, borderLeftColor: cls.borderColor }]}>
                    {/* Badge */}
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardName} numberOfLines={1}>{cls.name}</Text>
                      <View style={[
                        styles.typeBadge,
                        cls.type === 'replacement' ? styles.typeBadgeReplacement : styles.typeBadgeClass,
                      ]}>
                        <Text style={[
                          styles.typeBadgeText,
                          cls.type === 'replacement' ? styles.typeBadgeTextReplacement : styles.typeBadgeTextClass,
                        ]}>
                          {cls.type === 'replacement' ? 'Reposição' : 'Aula'}
                        </Text>
                      </View>
                    </View>

                    {/* Horário */}
                    <Text style={styles.cardTime}>{cls.time} – {cls.timeEnd}</Text>

                    {/* Sala */}
                    <View style={styles.cardLocationRow}>
                      <Ionicons name="location-outline" size={13} color="#888" />
                      <Text style={styles.cardLocation}>{cls.room}</Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                      {/* Avatares empilhados */}
                      <View style={styles.avatarsRow}>
                        {[20, 10, 15].map((img, i) => (
                          <Image
                            key={i}
                            source={{ uri: `https://i.pravatar.cc/150?img=${img}` }}
                            style={[styles.miniAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }]}
                            contentFit="cover"
                          />
                        ))}
                        {cls.studentCount > 3 && (
                          <View style={styles.moreCount}>
                            <Text style={styles.moreCountText}>+{cls.studentCount - 3}</Text>
                          </View>
                        )}
                      </View>

                      {/* Botão */}
                      <Pressable
                        style={styles.iniciarBtn}
                        onPress={() => router.push(`/(teacher)/class/${cls.id}`)}
                      >
                        <Text style={styles.iniciarText}>Iniciar aula</Text>
                        <Ionicons name="arrow-forward" size={14} color="#fff" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg:     { flex: 1 },
  safe:   { flex: 1 },
  scroll: { paddingBottom: 110 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 14,
  },
  avatarWrap: {
    width: 60,
    height: 60,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#7B5CF0',
  },
  greetingWrap: { flex: 1 },
  greetingText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#888' },
  greetingName: { fontFamily: 'Nunito_900Black', fontSize: 20, color: '#1a1030', lineHeight: 26 },
  greetingDate: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa', textTransform: 'capitalize', marginTop: 1 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(123,92,240,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#F0EFF5',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#0d0620',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  statCardGrad: {
    padding: 18,
    borderRadius: 22,
    overflow: 'hidden',
    minHeight: 120,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontFamily: 'Nunito_900Black',
    fontSize: 36,
    color: '#fff',
    lineHeight: 40,
  },
  statLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  statBgIcon: {
    position: 'absolute',
    bottom: -8,
    right: -4,
  },

  // Agenda
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  agendaTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  agendaTitle: { fontFamily: 'Nunito_900Black', fontSize: 20, color: '#1a1030' },
  verTudoBtn: {
    backgroundColor: '#1a1030',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 50,
  },
  verTudoText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff' },

  // Timeline
  timeline: {
    paddingHorizontal: 20,
    gap: 20,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 52,
    top: 10,
    bottom: 10,
    width: 1,
    backgroundColor: 'rgba(123,92,240,0.12)',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  timeCol: {
    width: 36,
    alignItems: 'flex-end',
    paddingTop: 14,
    gap: 6,
    flexShrink: 0,
  },
  timeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#999',
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: -20,
  },

  // Class card
  classCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 4,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardName: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 50,
    flexShrink: 0,
  },
  typeBadgeClass: { backgroundColor: 'rgba(123,92,240,0.12)' },
  typeBadgeReplacement: { backgroundColor: 'rgba(245,158,11,0.15)' },
  typeBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  typeBadgeTextClass: { color: '#7B5CF0' },
  typeBadgeTextReplacement: { color: '#D97706' },
  cardTime: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#555',
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLocation: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreCountText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10,
    color: '#555',
  },
  iniciarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1a1030',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
  },
  iniciarText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#fff',
  },
});
