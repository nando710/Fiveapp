import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassItem {
  id: string;
  name: string;
  book: string;
  unit: string;
  studentCount: number;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
}

type AttendanceStatus = 'present' | 'absent';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLASSES: ClassItem[] = [
  { id: 'c1', name: 'Book 3 — 19h', book: 'Book 3', unit: 'Unit 2', studentCount: 12 },
  { id: 'c2', name: 'Book 1 — 08h', book: 'Book 1', unit: 'Unit 5', studentCount: 15 },
  { id: 'c3', name: 'Book 2 — 17h', book: 'Book 2', unit: 'Unit 1', studentCount: 10 },
];

const STUDENTS_BY_CLASS: Record<string, Student[]> = {
  c1: [
    { id: 's1',  name: 'Ana C.',      avatar: 'https://i.pravatar.cc/150?img=20' },
    { id: 's2',  name: 'Lucas A.',    avatar: 'https://i.pravatar.cc/150?img=10' },
    { id: 's3',  name: 'Pedro S.',    avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 's4',  name: 'Julia M.',    avatar: 'https://i.pravatar.cc/150?img=25' },
    { id: 's5',  name: 'Marcos T.',   avatar: 'https://i.pravatar.cc/150?img=30' },
    { id: 's6',  name: 'Beatriz F.',  avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: 's7',  name: 'Camila R.',   avatar: 'https://i.pravatar.cc/150?img=47' },
    { id: 's8',  name: 'Rafael B.',   avatar: 'https://i.pravatar.cc/150?img=52' },
    { id: 's9',  name: 'Thiago L.',   avatar: 'https://i.pravatar.cc/150?img=60' },
    { id: 's10', name: 'Fernanda O.', avatar: 'https://i.pravatar.cc/150?img=44' },
    { id: 's11', name: 'Diego M.',    avatar: 'https://i.pravatar.cc/150?img=35' },
    { id: 's12', name: 'Larissa P.',  avatar: 'https://i.pravatar.cc/150?img=41' },
  ],
  c2: [
    { id: 's13', name: 'Isabela N.', avatar: 'https://i.pravatar.cc/150?img=44' },
    { id: 's14', name: 'Bruno K.',   avatar: 'https://i.pravatar.cc/150?img=55' },
    { id: 's15', name: 'Mariana S.', avatar: 'https://i.pravatar.cc/150?img=48' },
  ],
  c3: [
    { id: 's16', name: 'Felipe A.', avatar: 'https://i.pravatar.cc/150?img=61' },
    { id: 's17', name: 'Renata C.', avatar: 'https://i.pravatar.cc/150?img=36' },
    { id: 's18', name: 'Eduardo M.',avatar: 'https://i.pravatar.cc/150?img=53' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialAttendance(students: Student[]): Record<string, AttendanceStatus> {
  const map: Record<string, AttendanceStatus> = {};
  students.forEach((s) => { map[s.id] = 'present'; });
  return map;
}

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ATTENDANCE_OPTIONS: { key: AttendanceStatus; label: string }[] = [
  { key: 'present', label: 'P' },
  { key: 'absent',  label: 'F' },
];

const ATTENDANCE_ACTIVE_COLOR: Record<AttendanceStatus, string> = {
  present: '#10B981',
  absent:  '#EF4444',
};

function StudentRow({
  student,
  status,
  onToggle,
}: {
  student: Student;
  status: AttendanceStatus;
  onToggle: (id: string, status: AttendanceStatus) => void;
}) {
  return (
    <View style={styles.studentRow}>
      <Image
        source={{ uri: student.avatar }}
        style={styles.studentAvatar}
        contentFit="cover"
      />
      <Text style={styles.studentName} numberOfLines={1}>
        {student.name}
      </Text>
      <View style={styles.attendanceBtns}>
        {ATTENDANCE_OPTIONS.map((opt) => {
          const active = status === opt.key;
          const activeColor = ATTENDANCE_ACTIVE_COLOR[opt.key];
          return (
            <Pressable
              key={opt.key}
              onPress={() => onToggle(student.id, opt.key)}
              style={[
                styles.attendanceBtn,
                active
                  ? { backgroundColor: activeColor, borderColor: activeColor }
                  : { borderColor: 'rgba(123,92,240,0.25)' },
              ]}
            >
              <Text
                style={[
                  styles.attendanceBtnText,
                  { color: active ? '#fff' : '#8a82a0' },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DiaryScreen() {
  const [activeClass, setActiveClass] = useState<string>('c1');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    () => buildInitialAttendance(STUDENTS_BY_CLASS['c1'])
  );
  const [lessonPage, setLessonPage] = useState('');
  const [saved, setSaved] = useState(false);

  const { s } = useStaggeredEntry(4);

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const activeClassData = CLASSES.find((c) => c.id === activeClass)!;
  const students = STUDENTS_BY_CLASS[activeClass] ?? [];

  const presentCount = students.filter((s) => attendance[s.id] === 'present').length;

  const handleClassChange = useCallback((classId: string) => {
    setActiveClass(classId);
    setAttendance(buildInitialAttendance(STUDENTS_BY_CLASS[classId] ?? []));
    setLessonPage('');
    setSaved(false);
  }, []);

  const handleToggle = useCallback((studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Header */}
          <Animated.View style={[styles.header, s(0)]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Diário Digital</Text>
              <Text style={styles.headerDate}>{formatDate()}</Text>
              <Text style={styles.headerClass}>Turma: {activeClassData.name}</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="book-outline" size={24} color="#7B5CF0" />
            </View>
          </Animated.View>

          {/* 2. Class selector */}
          <Animated.View style={s(1)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {CLASSES.map((cls) => {
                const active = cls.id === activeClass;
                return (
                  <Pressable
                    key={cls.id}
                    onPress={() => handleClassChange(cls.id)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  >
                    <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                      {cls.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* 3. Lesson log card */}
          <Animated.View style={s(2)}>
            <Text style={styles.sectionTitle}>Conteúdo da Aula</Text>
            <View style={styles.cardShadowWrapper}>
              <BlurView intensity={50} tint="light" style={styles.lessonCard}>
                <View style={styles.lessonMeta}>
                  <View style={styles.lessonMetaItem}>
                    <Ionicons name="library-outline" size={15} color="#7B5CF0" />
                    <Text style={styles.lessonMetaText}>{activeClassData.book}</Text>
                  </View>
                  <View style={styles.lessonMetaDot} />
                  <View style={styles.lessonMetaItem}>
                    <Ionicons name="bookmark-outline" size={15} color="#7B5CF0" />
                    <Text style={styles.lessonMetaText}>{activeClassData.unit}</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.lessonInput}
                  placeholder="Ex: Unit 2 — p. 34-36"
                  placeholderTextColor="#b0aac4"
                  value={lessonPage}
                  onChangeText={setLessonPage}
                  multiline
                />
              </BlurView>
            </View>
          </Animated.View>

          {/* 4. Attendance */}
          <Animated.View style={s(3)}>
            <View style={styles.attendanceHeader}>
              <Text style={styles.sectionTitle}>Chamada</Text>
              <View style={styles.attendanceCounter}>
                <Ionicons name="people-outline" size={14} color="#7B5CF0" />
                <Text style={styles.attendanceCounterText}>
                  {presentCount} presentes / {students.length} total
                </Text>
              </View>
            </View>

            <View style={styles.cardShadowWrapper}>
              <BlurView intensity={50} tint="light" style={styles.attendanceCard}>
                {students.map((student, idx) => (
                  <View key={student.id}>
                    <StudentRow
                      student={student}
                      status={attendance[student.id] ?? 'present'}
                      onToggle={handleToggle}
                    />
                    {idx < students.length - 1 && (
                      <View style={styles.studentDivider} />
                    )}
                  </View>
                ))}
              </BlurView>
            </View>

            {/* 5. Save button */}
            <View style={styles.saveWrapper}>
              {saved ? (
                <View style={styles.savedState}>
                  <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  <Text style={styles.savedText}>Diário salvo!</Text>
                </View>
              ) : (
                <Pressable onPress={handleSave} style={styles.saveBtn}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7B5CF0', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveBtnGradient}
                  >
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Salvar Diário</Text>
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 4,
  },
  headerTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 26,
    color: '#1a1030',
    letterSpacing: -0.5,
  },
  headerDate: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#8a82a0',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  headerClass: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7B5CF0',
    marginTop: 3,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(123,92,240,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  // Chip selector
  chipRow: {
    paddingBottom: 4,
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 50,
  },
  chipActive: {
    backgroundColor: '#1a1030',
  },
  chipInactive: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  chipText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#fff',
  },
  chipTextInactive: {
    color: '#4a3f68',
  },

  // Section title
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#1a1030',
    marginBottom: 12,
    marginTop: 22,
  },

  // Generic card shadow wrapper
  cardShadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderRadius: 22,
  },

  // Lesson card
  lessonCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lessonMetaText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#4a3f68',
  },
  lessonMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(123,92,240,0.3)',
  },
  lessonInput: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#2d2347',
    backgroundColor: 'rgba(123,92,240,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(123,92,240,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    textAlignVertical: 'top',
  },

  // Attendance section
  attendanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attendanceCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(123,92,240,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    marginTop: 22,
  },
  attendanceCounterText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#7B5CF0',
  },
  attendanceCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    paddingVertical: 4,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },

  // Student row
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0dde8',
  },
  studentName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#2d2347',
    flex: 1,
  },
  attendanceBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  attendanceBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
  },
  studentDivider: {
    height: 1,
    backgroundColor: 'rgba(123,92,240,0.07)',
  },

  // Save button
  saveWrapper: {
    marginTop: 24,
  },
  saveBtn: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  saveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 50,
  },
  saveBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.2,
  },
  savedState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: 'rgba(16,185,129,0.10)',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(16,185,129,0.30)',
  },
  savedText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#10B981',
  },
});
