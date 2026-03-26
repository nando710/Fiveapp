import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { useAuthStore } from '@stores/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassSchedule {
  id: string;
  name: string;
  time: string;
  timeEnd: string;
  teacher: string;
  teacherAvatar: string;
  room: string;
  enrolled: number;
  capacity: number;
  book: string;
  color: string;
}

interface TeacherNote {
  id: string;
  teacher: string;
  teacherAvatar: string;
  className: string;
  date: string;
  note: string;
  type: 'alert' | 'info' | 'success';
}

interface ClassSlot {
  id: string;
  name: string;
  book: string;
  teacher: string;
  days: string;
  enrolled: number;
  capacity: number;
  color: string;
}

interface AtRiskStudent {
  id: string;
  name: string;
  avatar: string;
  className: string;
  absences: number;
  missedHw: number;
  riskScore: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const UNIT = {
  name: 'Five Idiomas — Pinheiros',
  totalStudents: 142,
  activeClasses: 12,
  openSlots: 18,
  retention: 87,
  teacherCount: 5,
  pendingNotes: 3,
};

const TODAY_CLASSES: ClassSchedule[] = [
  { id: 'c1', name: 'Book 1 — Turma A', time: '08:00', timeEnd: '09:30', teacher: 'Prof. Marina', teacherAvatar: 'https://i.pravatar.cc/150?img=5', room: 'Sala 2', enrolled: 15, capacity: 18, book: 'Book 1', color: '#3B82F6' },
  { id: 'c2', name: 'Book 2 — Turma B', time: '10:30', timeEnd: '12:00', teacher: 'Prof. Carlos', teacherAvatar: 'https://i.pravatar.cc/150?img=12', room: 'Sala 1', enrolled: 10, capacity: 15, book: 'Book 2', color: '#10B981' },
  { id: 'c3', name: 'Book 3 — Turma C', time: '17:00', timeEnd: '18:30', teacher: 'Prof. Marina', teacherAvatar: 'https://i.pravatar.cc/150?img=5', room: 'Sala 3', enrolled: 12, capacity: 12, book: 'Book 3', color: '#7B5CF0' },
  { id: 'c4', name: 'Book 1 — Turma D', time: '19:00', timeEnd: '20:30', teacher: 'Prof. Carlos', teacherAvatar: 'https://i.pravatar.cc/150?img=12', room: 'Sala 1', enrolled: 8, capacity: 15, book: 'Book 1', color: '#3B82F6' },
];

const TEACHER_NOTES: TeacherNote[] = [
  { id: 'n1', teacher: 'Prof. Marina', teacherAvatar: 'https://i.pravatar.cc/150?img=5', className: 'Book 3 — 19h', date: 'Hoje, 10:30', type: 'alert', note: 'Pedro S. com 5ª falta consecutiva. Risco de evasão — solicito contato com responsável.' },
  { id: 'n2', teacher: 'Prof. Carlos', teacherAvatar: 'https://i.pravatar.cc/150?img=12', className: 'Book 2 — 17h', date: 'Hoje, 09:15', type: 'info', note: 'Turma avançou até Unit 3. Apenas 6 de 10 presentes — sugiro reforço de comunicação.' },
  { id: 'n3', teacher: 'Prof. Marina', teacherAvatar: 'https://i.pravatar.cc/150?img=5', className: 'Book 1 — 08h', date: 'Ontem', type: 'success', note: 'Aula excelente. 100% de presença. Todos entregaram homework. Turma muito engajada.' },
  { id: 'n4', teacher: 'Prof. Carlos', teacherAvatar: 'https://i.pravatar.cc/150?img=12', className: 'Book 2 — 17h', date: 'Ontem', type: 'alert', note: 'Camila R. com nota 5.0 em Speaking — muito abaixo. Sugerir reposição de conversação.' },
];

const CLASS_SLOTS: ClassSlot[] = [
  { id: 'sl1', name: 'Book 1 — Turma A', book: 'Book 1', teacher: 'Prof. Marina', days: 'Ter / Qui', enrolled: 15, capacity: 18, color: '#3B82F6' },
  { id: 'sl2', name: 'Book 1 — Turma D', book: 'Book 1', teacher: 'Prof. Carlos', days: 'Seg / Qua', enrolled: 8,  capacity: 15, color: '#3B82F6' },
  { id: 'sl3', name: 'Book 2 — Turma B', book: 'Book 2', teacher: 'Prof. Carlos', days: 'Qua / Sex', enrolled: 10, capacity: 15, color: '#10B981' },
  { id: 'sl4', name: 'Book 3 — Turma C', book: 'Book 3', teacher: 'Prof. Marina', days: 'Seg / Qua / Sex', enrolled: 12, capacity: 12, color: '#7B5CF0' },
];

const AT_RISK: AtRiskStudent[] = [
  { id: 'ar1', name: 'Pedro S.', avatar: 'https://i.pravatar.cc/150?img=15', className: 'Book 3', absences: 5, missedHw: 4, riskScore: 92 },
  { id: 'ar2', name: 'Camila R.', avatar: 'https://i.pravatar.cc/150?img=47', className: 'Book 3', absences: 4, missedHw: 3, riskScore: 78 },
  { id: 'ar3', name: 'Eduardo M.', avatar: 'https://i.pravatar.cc/150?img=53', className: 'Book 2', absences: 3, missedHw: 2, riskScore: 65 },
];

const NOTE_TYPE_CONFIG = {
  alert:   { icon: 'warning-outline' as const, color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  info:    { icon: 'information-circle-outline' as const, color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  success: { icon: 'checkmark-circle-outline' as const, color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FranchiseDashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const [notesExpanded, setNotesExpanded] = useState(true);

  // s(0)=Header s(1)=Stats s(2)=Agenda s(3)=Notes s(4)=Turmas s(5)=Churn
  const { s } = useStaggeredEntry(6);

  const totalOpenSlots = CLASS_SLOTS.reduce((sum, c) => sum + (c.capacity - c.enrolled), 0);
  const criticalStudents = AT_RISK.filter((s) => s.riskScore > 70).length;

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── Header ── */}
          <Animated.View style={[styles.header, s(0)]}>
            <View style={styles.greetWrap}>
              <Text style={styles.greetText}>{greeting()},</Text>
              <Text style={styles.greetName}>{user?.name?.split(' ')[0] ?? 'Franqueado'}!</Text>
              <Text style={styles.unitName}>{UNIT.name}</Text>
            </View>
            <Pressable style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="#7B5CF0" />
              {UNIT.pendingNotes > 0 && (
                <View style={styles.notifDot}>
                  <Text style={styles.notifDotText}>{UNIT.pendingNotes}</Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          {/* ── Stats Cards ── */}
          <Animated.View style={s(1)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
              {[
                { label: 'Alunos', value: UNIT.totalStudents, icon: 'people-outline' as const, color: '#7B5CF0' },
                { label: 'Turmas', value: UNIT.activeClasses, icon: 'school-outline' as const, color: '#3B82F6' },
                { label: 'Vagas', value: totalOpenSlots, icon: 'add-circle-outline' as const, color: '#10B981' },
                { label: 'Retenção', value: `${UNIT.retention}%`, icon: 'trending-up-outline' as const, color: '#10B981' },
                { label: 'Professores', value: UNIT.teacherCount, icon: 'person-outline' as const, color: '#F59E0B' },
              ].map((stat, i) => (
                <View key={i} style={styles.statShadow}>
                  <LinearGradient colors={['#1a1030', '#0d0620']} style={styles.statCard}>
                    <Ionicons name={stat.icon} size={18} color={stat.color} />
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <LinearGradient colors={['rgba(255,255,255,0.18)', 'transparent', 'rgba(0,0,0,0.08)']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} pointerEvents="none" />
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* ── Aulas de Hoje ── */}
          <Animated.View style={s(2)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar-outline" size={18} color="#1a1030" />
                <Text style={styles.sectionTitle}>Aulas de hoje</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{TODAY_CLASSES.length}</Text>
              </View>
            </View>

            {TODAY_CLASSES.map((cls) => {
              const slotsLeft = cls.capacity - cls.enrolled;
              return (
                <View key={cls.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.classCard}>
                    <View style={[styles.classColorBar, { backgroundColor: cls.color }]} />
                    <View style={styles.classBody}>
                      <View style={styles.classTopRow}>
                        <View style={styles.classInfo}>
                          <Text style={styles.className}>{cls.name}</Text>
                          <Text style={styles.classMeta}>{cls.time} – {cls.timeEnd} · {cls.room}</Text>
                        </View>
                        <View style={[styles.slotBadge, slotsLeft === 0 ? styles.slotFull : styles.slotOpen]}>
                          <Text style={[styles.slotBadgeText, slotsLeft === 0 ? styles.slotFullText : styles.slotOpenText]}>
                            {slotsLeft === 0 ? 'Lotada' : `${slotsLeft} vagas`}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.classBottomRow}>
                        <Image source={{ uri: cls.teacherAvatar }} style={styles.teacherAvatar} contentFit="cover" />
                        <Text style={styles.teacherName}>{cls.teacher}</Text>
                        <View style={styles.enrollBadge}>
                          <Ionicons name="people-outline" size={12} color="#7B5CF0" />
                          <Text style={styles.enrollText}>{cls.enrolled}/{cls.capacity}</Text>
                        </View>
                      </View>
                    </View>
                  </BlurView>
                </View>
              );
            })}
          </Animated.View>

          {/* ── Anotações dos Professores ── */}
          <Animated.View style={s(3)}>
            <Pressable style={styles.sectionHeader} onPress={() => setNotesExpanded(!notesExpanded)}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="clipboard-outline" size={18} color="#1a1030" />
                <Text style={styles.sectionTitle}>Anotações dos professores</Text>
              </View>
              <Ionicons name={notesExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#aaa" />
            </Pressable>

            {notesExpanded && TEACHER_NOTES.map((tn) => {
              const cfg = NOTE_TYPE_CONFIG[tn.type];
              return (
                <View key={tn.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.noteCard}>
                    <View style={styles.noteHeader}>
                      <View style={[styles.noteIcon, { backgroundColor: cfg.bg }]}>
                        <Ionicons name={cfg.icon} size={16} color={cfg.color} />
                      </View>
                      <Image source={{ uri: tn.teacherAvatar }} style={styles.noteAvatar} contentFit="cover" />
                      <View style={styles.noteHeaderInfo}>
                        <Text style={styles.noteTeacher}>{tn.teacher}</Text>
                        <Text style={styles.noteClassDate}>{tn.className} · {tn.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.noteText}>{tn.note}</Text>
                  </BlurView>
                </View>
              );
            })}
          </Animated.View>

          {/* ── Turmas e Vagas ── */}
          <Animated.View style={s(4)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="school-outline" size={18} color="#1a1030" />
                <Text style={styles.sectionTitle}>Turmas e vagas</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: '#10B981' }]}>
                <Text style={styles.countBadgeText}>{totalOpenSlots} vagas</Text>
              </View>
            </View>

            {CLASS_SLOTS.map((slot) => {
              const filled = slot.enrolled / slot.capacity;
              const slotsLeft = slot.capacity - slot.enrolled;
              return (
                <View key={slot.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.slotCard}>
                    <View style={[styles.bookIcon, { backgroundColor: slot.color + '18' }]}>
                      <Ionicons name="book-outline" size={20} color={slot.color} />
                    </View>
                    <View style={styles.slotInfo}>
                      <Text style={styles.slotName}>{slot.name}</Text>
                      <Text style={styles.slotMeta}>{slot.teacher} · {slot.days}</Text>
                      <View style={styles.slotBarWrap}>
                        <View style={styles.slotBarTrack}>
                          <View style={[styles.slotBarFill, { width: `${filled * 100}%`, backgroundColor: filled >= 1 ? '#EF4444' : slot.color }]} />
                        </View>
                        <Text style={[styles.slotBarLabel, { color: slotsLeft === 0 ? '#EF4444' : '#1a1030' }]}>
                          {slot.enrolled}/{slot.capacity}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.slotCountBadge, slotsLeft === 0 ? styles.slotCountFull : styles.slotCountOpen]}>
                      <Text style={[styles.slotCountText, slotsLeft === 0 ? styles.slotCountFullText : styles.slotCountOpenText]}>
                        {slotsLeft === 0 ? 'Lotada' : `+${slotsLeft}`}
                      </Text>
                    </View>
                  </BlurView>
                </View>
              );
            })}
          </Animated.View>

          {/* ── Alunos em Risco ── */}
          <Animated.View style={s(5)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="warning-outline" size={18} color="#EF4444" />
                <Text style={styles.sectionTitle}>Alunos em risco</Text>
              </View>
              {criticalStudents > 0 && (
                <View style={[styles.countBadge, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.countBadgeText}>{criticalStudents} críticos</Text>
                </View>
              )}
            </View>

            {AT_RISK.map((student) => {
              const riskColor = student.riskScore > 75 ? '#EF4444' : student.riskScore > 50 ? '#F59E0B' : '#10B981';
              return (
                <View key={student.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.riskCard}>
                    <Image source={{ uri: student.avatar }} style={styles.riskAvatar} contentFit="cover" />
                    <View style={styles.riskInfo}>
                      <Text style={styles.riskName}>{student.name}</Text>
                      <Text style={styles.riskClass}>{student.className}</Text>
                      <View style={styles.riskStatsRow}>
                        <Text style={styles.riskStat}>{student.absences} faltas</Text>
                        <View style={styles.riskStatDot} />
                        <Text style={styles.riskStat}>{student.missedHw} HWs</Text>
                      </View>
                    </View>
                    <View style={[styles.riskCircle, { borderColor: riskColor }]}>
                      <Text style={[styles.riskScore, { color: riskColor }]}>{student.riskScore}</Text>
                    </View>
                  </BlurView>
                </View>
              );
            })}
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 110 },

  // Header
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  greetWrap: { flex: 1 },
  greetText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#888' },
  greetName: { fontFamily: 'Nunito_900Black', fontSize: 22, color: '#1a1030', lineHeight: 28 },
  unitName: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#7B5CF0', marginTop: 2 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(123,92,240,0.10)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: '#F0EFF5' },
  notifDotText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 10, color: '#fff' },

  // Stats
  statsScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
  statShadow: { borderRadius: 18, shadowColor: '#0d0620', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  statCard: { width: 100, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 18, alignItems: 'center', gap: 4, overflow: 'hidden' },
  statValue: { fontFamily: 'Nunito_900Black', fontSize: 24, color: '#fff', lineHeight: 28 },
  statLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.5)' },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 17, color: '#1a1030' },
  countBadge: { backgroundColor: '#7B5CF0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  countBadgeText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 11, color: '#fff' },

  // Card shadow
  cardShadow: { marginHorizontal: 16, marginBottom: 10, borderRadius: 18, shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },

  // Class card (today)
  classCard: { borderRadius: 18, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  classColorBar: { width: 5, alignSelf: 'stretch' },
  classBody: { flex: 1, padding: 14, gap: 10 },
  classTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  classInfo: { flex: 1 },
  className: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  classMeta: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888', marginTop: 2 },
  slotBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50 },
  slotOpen: { backgroundColor: 'rgba(16,185,129,0.12)' },
  slotFull: { backgroundColor: 'rgba(239,68,68,0.12)' },
  slotBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  slotOpenText: { color: '#10B981' },
  slotFullText: { color: '#EF4444' },
  classBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 10 },
  teacherAvatar: { width: 24, height: 24, borderRadius: 12 },
  teacherName: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888', flex: 1 },
  enrollBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(123,92,240,0.08)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
  enrollText: { fontFamily: 'Nunito_700Bold', fontSize: 11, color: '#7B5CF0' },

  // Teacher notes
  noteCard: { borderRadius: 18, overflow: 'hidden', padding: 14, gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  noteHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noteIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  noteAvatar: { width: 28, height: 28, borderRadius: 14 },
  noteHeaderInfo: { flex: 1 },
  noteTeacher: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#1a1030' },
  noteClassDate: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa' },
  noteText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#1a1030', lineHeight: 19 },

  // Turmas e vagas
  slotCard: { borderRadius: 18, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  bookIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  slotInfo: { flex: 1, gap: 3 },
  slotName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  slotMeta: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888' },
  slotBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  slotBarTrack: { flex: 1, height: 6, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' },
  slotBarFill: { height: '100%', borderRadius: 99 },
  slotBarLabel: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  slotCountBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, flexShrink: 0 },
  slotCountOpen: { backgroundColor: 'rgba(16,185,129,0.12)' },
  slotCountFull: { backgroundColor: 'rgba(239,68,68,0.12)' },
  slotCountText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14 },
  slotCountOpenText: { color: '#10B981' },
  slotCountFullText: { color: '#EF4444' },

  // Alunos em risco
  riskCard: { borderRadius: 18, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  riskAvatar: { width: 40, height: 40, borderRadius: 20, flexShrink: 0 },
  riskInfo: { flex: 1, gap: 2 },
  riskName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  riskClass: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  riskStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  riskStat: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa' },
  riskStatDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#ddd' },
  riskCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  riskScore: { fontFamily: 'Nunito_900Black', fontSize: 16 },
});
