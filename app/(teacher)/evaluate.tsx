import { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  TextInput,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassInfo {
  id: string;
  name: string;
  book: string;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  speaking: number | null;
  writing: number | null;
}

interface GradeEntry {
  speaking: string;
  writing: string;
}

type ActiveField = 'speaking' | 'writing' | null;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLASSES: ClassInfo[] = [
  { id: 'c1', name: 'Book 3 — 19h', book: 'Book 3' },
  { id: 'c2', name: 'Book 1 — 08h', book: 'Book 1' },
  { id: 'c3', name: 'Book 2 — 17h', book: 'Book 2' },
];

const STUDENTS_C1: Student[] = [
  { id: 's1', name: 'Ana C.',     avatar: 'https://i.pravatar.cc/150?img=20', speaking: null, writing: null },
  { id: 's2', name: 'Lucas A.',   avatar: 'https://i.pravatar.cc/150?img=10', speaking: 9.0,  writing: 8.5  },
  { id: 's3', name: 'Pedro S.',   avatar: 'https://i.pravatar.cc/150?img=15', speaking: null, writing: null },
  { id: 's4', name: 'Julia M.',   avatar: 'https://i.pravatar.cc/150?img=25', speaking: 8.0,  writing: 7.5  },
  { id: 's5', name: 'Marcos T.',  avatar: 'https://i.pravatar.cc/150?img=30', speaking: null, writing: null },
  { id: 's6', name: 'Beatriz F.', avatar: 'https://i.pravatar.cc/150?img=32', speaking: 9.5,  writing: 9.0  },
];

const QUICK_SCORES = ['6', '7', '7.5', '8', '8.5', '9', '9.5', '10'];

function getStudentsForClass(classId: string): Student[] {
  if (classId === 'c1') return STUDENTS_C1;
  // Return empty for demo purposes for other classes
  return [];
}

function scoreColor(val: number): string {
  if (val >= 9) return '#10B981';
  if (val >= 7) return '#F59E0B';
  return '#EF4444';
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EvaluateScreen() {
  const [activeClass, setActiveClass] = useState('c1');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, GradeEntry>>({});
  const [activeField, setActiveField] = useState<Record<string, ActiveField>>({});
  const [recordingFor, setRecordingFor] = useState<string | null>(null);
  const [recordingActive, setRecordingActive] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const { s } = useStaggeredEntry(3);

  const currentClassInfo = CLASSES.find((c) => c.id === activeClass);
  const students = getStudentsForClass(activeClass);

  const toggleExpand = (studentId: string) => {
    setExpandedStudent((prev) => (prev === studentId ? null : studentId));
  };

  const getGrade = (student: Student, field: 'speaking' | 'writing'): string => {
    const saved = grades[student.id];
    if (saved && saved[field] !== undefined) return saved[field];
    const raw = student[field];
    return raw !== null ? String(raw) : '';
  };

  const setGradeField = (studentId: string, field: 'speaking' | 'writing', value: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        speaking: prev[studentId]?.speaking ?? '',
        writing: prev[studentId]?.writing ?? '',
        [field]: value,
      },
    }));
  };

  const applyQuickScore = (studentId: string, score: string) => {
    const field = activeField[studentId] ?? 'speaking';
    setGradeField(studentId, field, score);
  };

  const handleSave = (student: Student) => {
    const entry = grades[student.id];
    if (!entry) return;
    // In a real app this would persist; here we just collapse
    setExpandedStudent(null);
  };

  const startRecording = (studentId: string) => {
    setRecordingFor(studentId);
    setRecordingActive(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopRecording = () => {
    setRecordingFor(null);
    setRecordingActive(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <Animated.View style={s(0)}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Avaliação</Text>
              <Text style={styles.headerSub}>{currentClassInfo?.name ?? ''}</Text>
            </View>
          </Animated.View>

          {/* ── Class selector ── */}
          <Animated.View style={s(1)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.classChipsRow}
            >
              {CLASSES.map((cls) => {
                const isActive = activeClass === cls.id;
                return (
                  <Pressable
                    key={cls.id}
                    onPress={() => {
                      setActiveClass(cls.id);
                      setExpandedStudent(null);
                    }}
                    style={[styles.classChip, isActive && styles.classChipActive]}
                  >
                    <Text style={[styles.classChipText, isActive && styles.classChipTextActive]}>
                      {cls.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* ── Student list ── */}
          <Animated.View style={s(2)}>
            {students.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={44} color="#C0BBDD" />
                <Text style={styles.emptyText}>Nenhum aluno nesta turma</Text>
              </View>
            ) : (
              students.map((student) => {
                const isExpanded = expandedStudent === student.id;
                const spVal = getGrade(student, 'speaking');
                const wrVal = getGrade(student, 'writing');
                const isRecording = recordingFor === student.id && recordingActive;
                const curActiveField = activeField[student.id] ?? 'speaking';

                return (
                  <View key={student.id} style={styles.cardShadow}>
                    <BlurView intensity={50} tint="light" style={styles.studentCard}>
                      {/* Collapsed header row */}
                      <Pressable
                        onPress={() => toggleExpand(student.id)}
                        style={styles.studentRow}
                      >
                        <Image
                          source={{ uri: student.avatar }}
                          style={styles.studentAvatar}
                          contentFit="cover"
                        />
                        <Text style={styles.studentName}>{student.name}</Text>
                        <View style={styles.scorePills}>
                          {spVal ? (
                            <View style={[styles.scorePill, { borderColor: scoreColor(parseFloat(spVal)) + '55', backgroundColor: scoreColor(parseFloat(spVal)) + '18' }]}>
                              <Text style={[styles.scorePillLabel, { color: scoreColor(parseFloat(spVal)) }]}>
                                Sp {spVal}
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.noGradeText}>Sem nota</Text>
                          )}
                          {wrVal && (
                            <View style={[styles.scorePill, { borderColor: scoreColor(parseFloat(wrVal)) + '55', backgroundColor: scoreColor(parseFloat(wrVal)) + '18' }]}>
                              <Text style={[styles.scorePillLabel, { color: scoreColor(parseFloat(wrVal)) }]}>
                                Wr {wrVal}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color="#888"
                        />
                      </Pressable>

                      {/* Expanded section */}
                      {isExpanded && (
                        <View style={styles.expandedSection}>
                          <View style={styles.divider} />

                          {/* Speaking input */}
                          <View style={styles.gradeInputRow}>
                            <Text style={styles.gradeInputLabel}>Speaking</Text>
                            <Pressable
                              onPress={() => setActiveField((prev) => ({ ...prev, [student.id]: 'speaking' }))}
                              style={[
                                styles.gradeInputWrap,
                                curActiveField === 'speaking' && styles.gradeInputWrapActive,
                              ]}
                            >
                              <TextInput
                                style={styles.gradeInput}
                                value={spVal}
                                onChangeText={(v) => setGradeField(student.id, 'speaking', v)}
                                keyboardType="numeric"
                                placeholder="—"
                                placeholderTextColor="#C0BBDD"
                                onFocus={() => setActiveField((prev) => ({ ...prev, [student.id]: 'speaking' }))}
                              />
                            </Pressable>
                          </View>

                          {/* Writing input */}
                          <View style={styles.gradeInputRow}>
                            <Text style={styles.gradeInputLabel}>Writing</Text>
                            <Pressable
                              onPress={() => setActiveField((prev) => ({ ...prev, [student.id]: 'writing' }))}
                              style={[
                                styles.gradeInputWrap,
                                curActiveField === 'writing' && styles.gradeInputWrapActive,
                              ]}
                            >
                              <TextInput
                                style={styles.gradeInput}
                                value={wrVal}
                                onChangeText={(v) => setGradeField(student.id, 'writing', v)}
                                keyboardType="numeric"
                                placeholder="—"
                                placeholderTextColor="#C0BBDD"
                                onFocus={() => setActiveField((prev) => ({ ...prev, [student.id]: 'writing' }))}
                              />
                            </Pressable>
                          </View>

                          {/* Quick score chips */}
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.quickScoresRow}
                          >
                            {QUICK_SCORES.map((sc) => (
                              <Pressable
                                key={sc}
                                onPress={() => applyQuickScore(student.id, sc)}
                                style={styles.quickScoreChip}
                              >
                                <Text style={styles.quickScoreText}>{sc}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>

                          {/* Audio feedback */}
                          {isRecording ? (
                            <View style={styles.recordingRow}>
                              <Animated.View style={[styles.recordingDot, { transform: [{ scale: pulseAnim }] }]} />
                              <Text style={styles.recordingLabel}>Gravando...</Text>
                              <Pressable onPress={stopRecording} style={styles.stopBtn}>
                                <Text style={styles.stopBtnText}>Parar</Text>
                              </Pressable>
                            </View>
                          ) : (
                            <Pressable
                              onPress={() => startRecording(student.id)}
                              style={styles.recordBtn}
                            >
                              <Ionicons name="mic-outline" size={18} color="#7B5CF0" />
                              <Text style={styles.recordBtnText}>Gravar Feedback</Text>
                            </Pressable>
                          )}

                          {/* Save button */}
                          <Pressable
                            onPress={() => handleSave(student)}
                            style={styles.saveBtn}
                          >
                            <Text style={styles.saveBtnText}>Salvar</Text>
                          </Pressable>
                        </View>
                      )}
                    </BlurView>
                  </View>
                );
              })
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
    color: '#7B5CF0',
    marginTop: 2,
  },

  // Class selector chips
  classChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },
  classChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  classChipActive: {
    backgroundColor: '#7B5CF0',
    borderColor: '#7B5CF0',
  },
  classChipText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#555',
  },
  classChipTextActive: {
    color: '#fff',
  },

  // Empty state
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

  // Card shadow
  cardShadow: {
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Student card
  studentCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  studentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0DCEF',
  },
  studentName: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
    flex: 1,
  },
  scorePills: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  scorePill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  scorePillLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },
  noGradeText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#C0BBDD',
  },

  // Expanded section
  expandedSection: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(123,92,240,0.1)',
    marginBottom: 4,
  },

  // Grade input
  gradeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  gradeInputLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#555',
    width: 68,
  },
  gradeInputWrap: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(123,92,240,0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  gradeInputWrapActive: {
    borderColor: '#7B5CF0',
    backgroundColor: 'rgba(123,92,240,0.06)',
  },
  gradeInput: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#1a1030',
  },

  // Quick score chips
  quickScoresRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  quickScoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(123,92,240,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(123,92,240,0.2)',
  },
  quickScoreText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7B5CF0',
  },

  // Recording
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(123,92,240,0.3)',
    backgroundColor: 'rgba(123,92,240,0.06)',
    alignSelf: 'flex-start',
  },
  recordBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7B5CF0',
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  recordingLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#EF4444',
    flex: 1,
  },
  stopBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#EF4444',
  },
  stopBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#fff',
  },

  // Save button
  saveBtn: {
    backgroundColor: '#7B5CF0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#fff',
  },
});
