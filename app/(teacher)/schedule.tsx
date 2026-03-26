import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Animated,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

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

interface ClassNote {
  id: string;
  classId: string;
  className: string;
  date: string;
  note: string;
  icon: string;
  color: string;
}

interface StudentNote {
  id: string;
  studentName: string;
  studentAvatar: string;
  className: string;
  date: string;
  type: 'evaluation' | 'observation';
  note: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
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

const CLASS_NOTES: ClassNote[] = [
  {
    id: 'cn1', classId: 'cl3', className: 'Book 3 — 19h',
    date: 'Qua, 25/03', icon: 'document-text-outline', color: '#7B5CF0',
    note: 'Turma avançou até p. 34 (Unit 2). Dificuldade geral com Present Perfect — revisar na próxima aula.',
  },
  {
    id: 'cn2', classId: 'cl2', className: 'Book 2 — 17h',
    date: 'Qua, 25/03', icon: 'alert-circle-outline', color: '#F59E0B',
    note: 'Apenas 6 de 10 alunos presentes. Aplicar atividade extra de recuperação na sexta.',
  },
  {
    id: 'cn3', classId: 'cl1', className: 'Book 1 — 08h',
    date: 'Ter, 24/03', icon: 'checkmark-circle-outline', color: '#10B981',
    note: 'Aula excelente. Todos os alunos entregaram homework. Vocabulário Unit 5 bem assimilado.',
  },
  {
    id: 'cn4', classId: 'cl6', className: 'Book 3 — 19h',
    date: 'Sex, 21/03', icon: 'document-text-outline', color: '#7B5CF0',
    note: 'Realizei simulado oral. Maioria teve dificuldade com question tags. Reforçar na próxima Unit.',
  },
];

const STUDENT_NOTES: StudentNote[] = [
  {
    id: 'sn1', studentName: 'Pedro S.', studentAvatar: 'https://i.pravatar.cc/150?img=15',
    className: 'Book 3 — 19h', date: 'Qua, 25/03', type: 'observation',
    note: '5ª falta consecutiva. Conversar com coordenação sobre risco de evasão.',
  },
  {
    id: 'sn2', studentName: 'Camila R.', studentAvatar: 'https://i.pravatar.cc/150?img=47',
    className: 'Book 3 — 19h', date: 'Qua, 25/03', type: 'evaluation',
    note: 'Speaking nota 5.0 — muito abaixo do esperado. Sugerir aulas de reposição de conversação.',
  },
  {
    id: 'sn3', studentName: 'Lucas A.', studentAvatar: 'https://i.pravatar.cc/150?img=10',
    className: 'Book 1 — 08h', date: 'Ter, 24/03', type: 'evaluation',
    note: 'Writing nota 9.5 — excelente evolução. Parabenizar e desafiar com exercícios avançados.',
  },
  {
    id: 'sn4', studentName: 'Eduardo M.', studentAvatar: 'https://i.pravatar.cc/150?img=53',
    className: 'Book 2 — 17h', date: 'Seg, 23/03', type: 'observation',
    note: 'Aluno disperso durante toda a aula. Não trouxe material. Verificar com responsável.',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState(2);
  const [notesTab, setNotesTab] = useState<'aulas' | 'alunos'>('aulas');

  const { s } = useStaggeredEntry(3);

  const todayIndex = 2;
  const dayClasses = SCHEDULE[activeDay] ?? [];

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
                    <Text style={[styles.dayChipLabel, isActive && styles.dayChipLabelActive]}>{day}</Text>
                    <Text style={[styles.dayChipDate, isActive && styles.dayChipDateActive]}>{WEEK_DATES[index]}</Text>
                    {isToday && <View style={[styles.todayDot, isActive && styles.todayDotActive]} />}
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          {/* ── Schedule + Notes ── */}
          <Animated.View style={s(2)}>
            {/* Aulas do dia */}
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

            {/* ── Resumo / Anotações ── */}
            <View style={styles.sectionHeader}>
              <Ionicons name="clipboard-outline" size={20} color="#1a1030" />
              <Text style={styles.sectionTitle}>Resumo e Anotações</Text>
            </View>

            {/* Tabs: Aulas / Alunos */}
            <View style={styles.notesTabRow}>
              <Pressable
                onPress={() => setNotesTab('aulas')}
                style={[styles.notesTab, notesTab === 'aulas' && styles.notesTabActive]}
              >
                <Ionicons name="book-outline" size={14} color={notesTab === 'aulas' ? '#fff' : '#888'} />
                <Text style={[styles.notesTabText, notesTab === 'aulas' && styles.notesTabTextActive]}>
                  Aulas ({CLASS_NOTES.length})
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setNotesTab('alunos')}
                style={[styles.notesTab, notesTab === 'alunos' && styles.notesTabActive]}
              >
                <Ionicons name="person-outline" size={14} color={notesTab === 'alunos' ? '#fff' : '#888'} />
                <Text style={[styles.notesTabText, notesTab === 'alunos' && styles.notesTabTextActive]}>
                  Alunos ({STUDENT_NOTES.length})
                </Text>
              </Pressable>
            </View>

            {/* ── Tab: Anotações das aulas ── */}
            {notesTab === 'aulas' && CLASS_NOTES.map((cn) => (
              <View key={cn.id} style={styles.cardShadow}>
                <BlurView intensity={50} tint="light" style={styles.noteCard}>
                  <View style={styles.noteHeader}>
                    <View style={[styles.noteIconWrap, { backgroundColor: cn.color + '18' }]}>
                      <Ionicons name={cn.icon as any} size={18} color={cn.color} />
                    </View>
                    <View style={styles.noteHeaderInfo}>
                      <Text style={styles.noteClassName}>{cn.className}</Text>
                      <Text style={styles.noteDate}>{cn.date}</Text>
                    </View>
                  </View>
                  <Text style={styles.noteText}>{cn.note}</Text>
                </BlurView>
              </View>
            ))}

            {/* ── Tab: Anotações sobre alunos ── */}
            {notesTab === 'alunos' && STUDENT_NOTES.map((sn) => (
              <View key={sn.id} style={styles.cardShadow}>
                <BlurView intensity={50} tint="light" style={styles.noteCard}>
                  <View style={styles.noteHeader}>
                    <Image
                      source={{ uri: sn.studentAvatar }}
                      style={styles.noteAvatar}
                      contentFit="cover"
                    />
                    <View style={styles.noteHeaderInfo}>
                      <Text style={styles.noteStudentName}>{sn.studentName}</Text>
                      <Text style={styles.noteDate}>{sn.className} · {sn.date}</Text>
                    </View>
                    <View style={[
                      styles.noteTypeBadge,
                      sn.type === 'evaluation' ? styles.noteTypeEval : styles.noteTypeObs,
                    ]}>
                      <Ionicons
                        name={sn.type === 'evaluation' ? 'star-outline' : 'eye-outline'}
                        size={11}
                        color={sn.type === 'evaluation' ? '#7B5CF0' : '#F59E0B'}
                      />
                      <Text style={[
                        styles.noteTypeBadgeText,
                        sn.type === 'evaluation' ? styles.noteTypeEvalText : styles.noteTypeObsText,
                      ]}>
                        {sn.type === 'evaluation' ? 'Avaliação' : 'Observação'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.noteText}>{sn.note}</Text>
                </BlurView>
              </View>
            ))}

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
  scrollContent: { paddingBottom: 110, paddingHorizontal: 16 },

  header: { paddingTop: 20, paddingBottom: 4, marginBottom: 8 },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 26, color: '#1a1030' },
  headerSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#888', marginTop: 2 },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 5 },
  dayChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', minHeight: 64, justifyContent: 'center', position: 'relative' },
  dayChipActive: { backgroundColor: '#1a1030', borderColor: '#1a1030' },
  dayChipLabel: { fontFamily: 'Nunito_700Bold', fontSize: 10, color: '#888', marginBottom: 2 },
  dayChipLabelActive: { color: '#fff' },
  dayChipDate: { fontFamily: 'Nunito_900Black', fontSize: 15, color: '#1a1030' },
  dayChipDateActive: { color: '#fff' },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#7B5CF0', position: 'absolute', bottom: 6 },
  todayDotActive: { backgroundColor: '#C4B5FD' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#B0ABCE' },

  cardShadow: { borderRadius: 18, marginBottom: 12, shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },

  classCard: { borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  classTimeCol: { alignItems: 'center', minWidth: 54 },
  classTime: { fontFamily: 'Nunito_900Black', fontSize: 22, color: '#7B5CF0' },
  classInfo: { flex: 1, gap: 4 },
  classNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  className: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#1a1030' },
  classMeta: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  studentsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  studentsText: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  reposicaoBadge: { backgroundColor: '#FEF3C7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: '#FDE68A' },
  reposicaoBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 10, color: '#D97706' },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 14 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 17, color: '#1a1030' },

  // Notes tabs
  notesTabRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  notesTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },
  notesTabActive: { backgroundColor: '#1a1030', borderColor: '#1a1030' },
  notesTabText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#888' },
  notesTabTextActive: { color: '#fff' },

  // Note card
  noteCard: {
    borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden', padding: 16, gap: 10,
  },
  noteHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  noteIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  noteHeaderInfo: { flex: 1 },
  noteClassName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  noteDate: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa', marginTop: 1 },
  noteText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#1a1030', lineHeight: 20 },

  // Student note specifics
  noteAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0dde8', flexShrink: 0 },
  noteStudentName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  noteTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50, flexShrink: 0 },
  noteTypeEval: { backgroundColor: 'rgba(123,92,240,0.12)' },
  noteTypeObs: { backgroundColor: 'rgba(245,158,11,0.12)' },
  noteTypeBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 10 },
  noteTypeEvalText: { color: '#7B5CF0' },
  noteTypeObsText: { color: '#F59E0B' },
});
