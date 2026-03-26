import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  TextInput, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = 'present' | 'absent';

interface Student {
  id: string;
  name: string;
  avatar: string;
  absences: number;
}

interface Difficulty {
  topic: string;
  errorRate: number;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLASS_DATA: Record<string, {
  name: string;
  book: string;
  unit: string;
  time: string;
  timeEnd: string;
  room: string;
  students: Student[];
  difficulties: Difficulty[];
}> = {
  cl1: {
    name: 'Book 1 — Turma A',
    book: 'Book 1',
    unit: 'Unit 5',
    time: '08:00',
    timeEnd: '09:30',
    room: 'Sala 2 — Térreo',
    students: [
      { id: 's1',  name: 'Ana C.',       avatar: 'https://i.pravatar.cc/150?img=20', absences: 0 },
      { id: 's2',  name: 'Lucas A.',     avatar: 'https://i.pravatar.cc/150?img=10', absences: 1 },
      { id: 's3',  name: 'Pedro S.',     avatar: 'https://i.pravatar.cc/150?img=15', absences: 4 },
      { id: 's4',  name: 'Julia M.',     avatar: 'https://i.pravatar.cc/150?img=25', absences: 3 },
      { id: 's5',  name: 'Marcos T.',    avatar: 'https://i.pravatar.cc/150?img=30', absences: 0 },
      { id: 's6',  name: 'Beatriz F.',   avatar: 'https://i.pravatar.cc/150?img=32', absences: 1 },
      { id: 's7',  name: 'Camila R.',    avatar: 'https://i.pravatar.cc/150?img=47', absences: 5 },
      { id: 's8',  name: 'Rafael B.',    avatar: 'https://i.pravatar.cc/150?img=52', absences: 0 },
      { id: 's9',  name: 'Thiago L.',    avatar: 'https://i.pravatar.cc/150?img=60', absences: 2 },
      { id: 's10', name: 'Fernanda O.',  avatar: 'https://i.pravatar.cc/150?img=44', absences: 0 },
      { id: 's11', name: 'Diego M.',     avatar: 'https://i.pravatar.cc/150?img=35', absences: 2 },
      { id: 's12', name: 'Larissa P.',   avatar: 'https://i.pravatar.cc/150?img=41', absences: 1 },
    ],
    difficulties: [
      { topic: 'Present Perfect — Formação',       errorRate: 0.72, color: '#EF4444' },
      { topic: 'Vocabulário Unit 5 — Travel',      errorRate: 0.55, color: '#F59E0B' },
      { topic: 'Listening Comprehension — Track 8',errorRate: 0.44, color: '#F59E0B' },
      { topic: 'Preposições de lugar',             errorRate: 0.30, color: '#10B981' },
    ],
  },
  cl2: {
    name: 'Book 2 — Reposição',
    book: 'Book 2',
    unit: 'Unit 1',
    time: '10:30',
    timeEnd: '12:00',
    room: 'Sala 1 — Térreo',
    students: [
      { id: 's13', name: 'Isabela N.', avatar: 'https://i.pravatar.cc/150?img=44', absences: 2 },
      { id: 's14', name: 'Bruno K.',   avatar: 'https://i.pravatar.cc/150?img=55', absences: 0 },
      { id: 's15', name: 'Mariana S.', avatar: 'https://i.pravatar.cc/150?img=48', absences: 1 },
      { id: 's16', name: 'Felipe A.',  avatar: 'https://i.pravatar.cc/150?img=61', absences: 3 },
    ],
    difficulties: [
      { topic: 'Simple Past — Verbos irregulares', errorRate: 0.65, color: '#EF4444' },
      { topic: 'Comparativos e superlativos',      errorRate: 0.48, color: '#F59E0B' },
    ],
  },
  cl3: {
    name: 'Book 2 — Turma B',
    book: 'Book 2',
    unit: 'Unit 1',
    time: '17:00',
    timeEnd: '18:30',
    room: 'Sala 1 — Térreo',
    students: [
      { id: 's16', name: 'Felipe A.',   avatar: 'https://i.pravatar.cc/150?img=61', absences: 1 },
      { id: 's17', name: 'Renata C.',   avatar: 'https://i.pravatar.cc/150?img=36', absences: 0 },
      { id: 's18', name: 'Eduardo M.',  avatar: 'https://i.pravatar.cc/150?img=53', absences: 4 },
      { id: 's19', name: 'Priscila T.', avatar: 'https://i.pravatar.cc/150?img=38', absences: 0 },
      { id: 's20', name: 'Victor H.',   avatar: 'https://i.pravatar.cc/150?img=57', absences: 2 },
    ],
    difficulties: [
      { topic: 'Simple Past — Verbos irregulares', errorRate: 0.58, color: '#EF4444' },
      { topic: 'Vocabulário Unit 1 — Daily life',  errorRate: 0.40, color: '#F59E0B' },
      { topic: 'Pronomes possessivos',             errorRate: 0.25, color: '#10B981' },
    ],
  },
  cl4: {
    name: 'Book 3 — Turma C',
    book: 'Book 3',
    unit: 'Unit 2',
    time: '19:00',
    timeEnd: '20:30',
    room: 'Sala 3 — 1º Andar',
    students: [
      { id: 's21', name: 'Lucas A.',    avatar: 'https://i.pravatar.cc/150?img=10', absences: 1 },
      { id: 's22', name: 'Ana C.',      avatar: 'https://i.pravatar.cc/150?img=20', absences: 0 },
      { id: 's23', name: 'Pedro S.',    avatar: 'https://i.pravatar.cc/150?img=15', absences: 5 },
      { id: 's24', name: 'Julia M.',    avatar: 'https://i.pravatar.cc/150?img=25', absences: 3 },
      { id: 's25', name: 'Marcos T.',   avatar: 'https://i.pravatar.cc/150?img=30', absences: 0 },
      { id: 's26', name: 'Beatriz F.',  avatar: 'https://i.pravatar.cc/150?img=32', absences: 2 },
      { id: 's27', name: 'Camila R.',   avatar: 'https://i.pravatar.cc/150?img=47', absences: 4 },
      { id: 's28', name: 'Rafael B.',   avatar: 'https://i.pravatar.cc/150?img=52', absences: 0 },
      { id: 's29', name: 'Thiago L.',   avatar: 'https://i.pravatar.cc/150?img=60', absences: 1 },
      { id: 's30', name: 'Fernanda O.', avatar: 'https://i.pravatar.cc/150?img=44', absences: 0 },
      { id: 's31', name: 'Diego M.',    avatar: 'https://i.pravatar.cc/150?img=35', absences: 2 },
      { id: 's32', name: 'Larissa P.',  avatar: 'https://i.pravatar.cc/150?img=41', absences: 1 },
    ],
    difficulties: [
      { topic: 'Present Perfect — Since/For',      errorRate: 0.68, color: '#EF4444' },
      { topic: 'Vocabulário Unit 2 — Routines',    errorRate: 0.52, color: '#F59E0B' },
      { topic: 'Listening — Track 12',             errorRate: 0.44, color: '#F59E0B' },
      { topic: 'Question tags',                    errorRate: 0.35, color: '#10B981' },
    ],
  },
};

const TABS = ['Chamada', 'Dificuldades', 'Notas'];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClassSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const classInfo = CLASS_DATA[id] ?? CLASS_DATA['cl4'];

  const [activeTab, setActiveTab] = useState(0);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const map: Record<string, AttendanceStatus> = {};
    classInfo.students.forEach((s) => { map[s.id] = 'present'; });
    return map;
  });
  const [notes, setNotes] = useState('');
  const [noteSent, setNoteSent] = useState(false);
  const tabAnim = useRef(new Animated.Value(0)).current;

  const presentCount = classInfo.students.filter((s) => attendance[s.id] === 'present').length;
  const absentCount  = classInfo.students.length - presentCount;
  const highRiskStudents = [...classInfo.students]
    .filter((s) => s.absences >= 3)
    .sort((a, b) => b.absences - a.absences);

  const handleToggle = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleSendNote = () => {
    if (!notes.trim()) return;
    setNoteSent(true);
    setTimeout(() => setNoteSent(false), 3000);
  };

  const switchTab = (i: number) => {
    setActiveTab(i);
    Animated.spring(tabAnim, {
      toValue: i,
      useNativeDriver: false,
      tension: 120,
      friction: 14,
    }).start();
  };

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* ── Header ── */}
        <LinearGradient colors={['#7B5CF0', '#4C1D95']} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>{classInfo.name}</Text>
            <Text style={styles.headerSub}>{classInfo.time} – {classInfo.timeEnd} · {classInfo.room}</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{classInfo.book}</Text>
          </View>
        </LinearGradient>

        {/* ── Tabs ── */}
        <View style={styles.tabBar}>
          {TABS.map((tab, i) => (
            <Pressable key={tab} onPress={() => switchTab(i)} style={styles.tabItem}>
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
              {activeTab === i && <View style={styles.tabIndicator} />}
            </Pressable>
          ))}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >

            {/* ── TAB 0: Chamada ── */}
            {activeTab === 0 && (
              <>
                {/* Sumário */}
                <View style={styles.summaryRow}>
                  <BlurView intensity={50} tint="light" style={[styles.summaryCard, { borderLeftColor: '#10B981' }]}>
                    <Text style={[styles.summaryNum, { color: '#10B981' }]}>{presentCount}</Text>
                    <Text style={styles.summaryLabel}>Presentes</Text>
                  </BlurView>
                  <BlurView intensity={50} tint="light" style={[styles.summaryCard, { borderLeftColor: '#EF4444' }]}>
                    <Text style={[styles.summaryNum, { color: '#EF4444' }]}>{absentCount}</Text>
                    <Text style={styles.summaryLabel}>Faltas</Text>
                  </BlurView>
                  <BlurView intensity={50} tint="light" style={[styles.summaryCard, { borderLeftColor: '#7B5CF0' }]}>
                    <Text style={[styles.summaryNum, { color: '#7B5CF0' }]}>{classInfo.students.length}</Text>
                    <Text style={styles.summaryLabel}>Total</Text>
                  </BlurView>
                </View>

                {/* Lista */}
                <View style={styles.sectionWrap}>
                  {classInfo.students.map((student, idx) => {
                    const present = attendance[student.id] === 'present';
                    return (
                      <View key={student.id}>
                        <Pressable
                          style={styles.studentRow}
                          onPress={() => handleToggle(student.id)}
                        >
                          <Image
                            source={{ uri: student.avatar }}
                            style={styles.avatar}
                            contentFit="cover"
                          />
                          <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                          {student.absences >= 3 && (
                            <View style={styles.riskBadge}>
                              <Ionicons name="warning-outline" size={11} color="#F59E0B" />
                              <Text style={styles.riskBadgeText}>{student.absences}F</Text>
                            </View>
                          )}
                          <Pressable
                            onPress={() => handleToggle(student.id)}
                            style={[
                              styles.toggleBtn,
                              present ? styles.togglePresent : styles.toggleAbsent,
                            ]}
                          >
                            <Text style={styles.toggleText}>{present ? 'P' : 'F'}</Text>
                          </Pressable>
                        </Pressable>
                        {idx < classInfo.students.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Botão salvar chamada */}
                <Pressable style={styles.saveBtn}>
                  <LinearGradient
                    colors={['#8B5CF6', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveBtnGrad}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Salvar Chamada</Text>
                  </LinearGradient>
                </Pressable>
              </>
            )}

            {/* ── TAB 1: Dificuldades ── */}
            {activeTab === 1 && (
              <>
                {/* Principais dificuldades */}
                <Text style={styles.sectionTitle}>Principais dificuldades</Text>
                <BlurView intensity={50} tint="light" style={styles.difficultiesCard}>
                  {classInfo.difficulties.map((d, i) => (
                    <View key={i} style={styles.diffRow}>
                      <View style={styles.diffLeft}>
                        <View style={[styles.diffDot, { backgroundColor: d.color }]} />
                        <Text style={styles.diffTopic} numberOfLines={2}>{d.topic}</Text>
                      </View>
                      <Text style={[styles.diffRate, { color: d.color }]}>
                        {Math.round(d.errorRate * 100)}%
                      </Text>
                    </View>
                  ))}
                  {/* Barras */}
                  <View style={styles.barsSection}>
                    {classInfo.difficulties.map((d, i) => (
                      <View key={i} style={styles.barRow}>
                        <Text style={styles.barLabel} numberOfLines={1}>{d.topic.split('—')[0].trim()}</Text>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                width: `${d.errorRate * 100}%`,
                                backgroundColor: d.color,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.barPct, { color: d.color }]}>
                          {Math.round(d.errorRate * 100)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                </BlurView>

                {/* Alunos em risco */}
                {highRiskStudents.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Alunos com mais faltas</Text>
                    {highRiskStudents.map((student) => (
                      <BlurView key={student.id} intensity={50} tint="light" style={styles.riskCard}>
                        <Image
                          source={{ uri: student.avatar }}
                          style={styles.riskAvatar}
                          contentFit="cover"
                        />
                        <View style={styles.riskInfo}>
                          <Text style={styles.riskName}>{student.name}</Text>
                          <Text style={styles.riskSub}>
                            {student.absences} {student.absences === 1 ? 'falta' : 'faltas'} acumuladas
                          </Text>
                        </View>
                        <View style={[
                          styles.riskLevel,
                          student.absences >= 5 ? styles.riskHigh : styles.riskMedium,
                        ]}>
                          <Text style={[
                            styles.riskLevelText,
                            student.absences >= 5 ? styles.riskHighText : styles.riskMediumText,
                          ]}>
                            {student.absences >= 5 ? 'Crítico' : 'Atenção'}
                          </Text>
                        </View>
                      </BlurView>
                    ))}
                  </>
                )}
              </>
            )}

            {/* ── TAB 2: Notas ── */}
            {activeTab === 2 && (
              <>
                <BlurView intensity={50} tint="light" style={styles.noteInfoCard}>
                  <Ionicons name="information-circle-outline" size={18} color="#7B5CF0" />
                  <Text style={styles.noteInfoText}>
                    As notas da aula são enviadas para o coordenador pedagógico ao final da sessão.
                  </Text>
                </BlurView>

                <Text style={styles.sectionTitle}>Observações da aula</Text>
                <View style={styles.noteCardWrap}>
                  <BlurView intensity={50} tint="light" style={styles.noteCard}>
                    <TextInput
                      style={styles.noteInput}
                      value={notes}
                      onChangeText={setNotes}
                      placeholder={
                        `Ex: Turma apresentou dificuldade com Present Perfect...\n` +
                        `Pedro e Camila precisam de atenção extra.\n` +
                        `Avançamos até p. 34.`
                      }
                      placeholderTextColor="rgba(0,0,0,0.25)"
                      multiline
                      textAlignVertical="top"
                    />
                  </BlurView>
                </View>

                <Text style={styles.charCount}>{notes.length} caracteres</Text>

                {noteSent ? (
                  <View style={styles.sentBanner}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.sentText}>Nota enviada ao administrativo!</Text>
                  </View>
                ) : (
                  <Pressable
                    style={[styles.saveBtn, !notes.trim() && { opacity: 0.5 }]}
                    onPress={handleSendNote}
                    disabled={!notes.trim()}
                  >
                    <LinearGradient
                      colors={['#8B5CF6', '#6D28D9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.saveBtnGrad}
                    >
                      <Ionicons name="send-outline" size={18} color="#fff" />
                      <Text style={styles.saveBtnText}>Enviar para o Administrativo</Text>
                    </LinearGradient>
                  </Pressable>
                )}
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 120 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 17, color: '#fff' },
  headerSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    flexShrink: 0,
  },
  headerBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#fff' },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#aaa' },
  tabTextActive: { color: '#7B5CF0' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#7B5CF0',
  },

  // Summary
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    borderLeftWidth: 4,
    alignItems: 'center',
    gap: 2,
  },
  summaryNum: { fontFamily: 'Nunito_900Black', fontSize: 28 },
  summaryLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888' },

  // Student list
  sectionWrap: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0dde8',
    flexShrink: 0,
  },
  studentName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#1a1030',
    flex: 1,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245,158,11,0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 50,
  },
  riskBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11, color: '#F59E0B' },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  togglePresent: { backgroundColor: '#10B981' },
  toggleAbsent:  { backgroundColor: '#EF4444' },
  toggleText: { fontFamily: 'Nunito_900Black', fontSize: 14, color: '#fff' },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)' },

  // Difficulties
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#1a1030',
    marginBottom: 12,
    marginTop: 4,
  },
  difficultiesCard: {
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: 10,
    marginBottom: 20,
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  diffLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, flex: 1 },
  diffDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  diffTopic: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#1a1030', flex: 1 },
  diffRate: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, flexShrink: 0 },
  barsSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 12,
    gap: 10,
  },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888', width: 90 },
  barTrack: { flex: 1, height: 7, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },
  barPct: { fontFamily: 'Nunito_700Bold', fontSize: 11, width: 32, textAlign: 'right' },

  // Risk students
  riskCard: {
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  riskAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0dde8' },
  riskInfo: { flex: 1 },
  riskName: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#1a1030' },
  riskSub:  { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888', marginTop: 2 },
  riskLevel: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 },
  riskHigh:  { backgroundColor: 'rgba(239,68,68,0.12)' },
  riskMedium:{ backgroundColor: 'rgba(245,158,11,0.12)' },
  riskLevelText: { fontFamily: 'Nunito_700Bold', fontSize: 12 },
  riskHighText:  { color: '#EF4444' },
  riskMediumText:{ color: '#F59E0B' },

  // Notes
  noteInfoCard: {
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noteInfoText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#555', flex: 1, lineHeight: 18 },
  noteCardWrap: {
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 6,
  },
  noteCard: {
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  noteInput: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#1a1030',
    minHeight: 160,
    lineHeight: 22,
  },
  charCount: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#bbb',
    textAlign: 'right',
    marginBottom: 16,
  },
  sentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(16,185,129,0.10)',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(16,185,129,0.25)',
  },
  sentText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#10B981' },

  // Save button
  saveBtn: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  saveBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff' },
});
