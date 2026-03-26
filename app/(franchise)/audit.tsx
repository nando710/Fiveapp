import {
  View,
  Text,
  ScrollView,
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
import Svg, { Circle as SvgCircle } from 'react-native-svg';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassAudit {
  name: string;
  diariesFilled: number;
  diariesTotal: number;
  lastFilled: string;
}

interface TeacherAudit {
  id: string;
  name: string;
  avatar: string;
  classes: ClassAudit[];
}

interface OverallStats {
  filled: number;
  total: number;
  percentage: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TEACHERS_AUDIT: TeacherAudit[] = [
  {
    id: 'p1',
    name: 'Prof. Marina Costa',
    avatar: 'https://i.pravatar.cc/150?img=5',
    classes: [
      { name: 'Book 3 — 19h', diariesFilled: 18, diariesTotal: 20, lastFilled: 'Hoje' },
      { name: 'Book 1 — 08h', diariesFilled: 16, diariesTotal: 20, lastFilled: 'Ontem' },
    ],
  },
  {
    id: 'p2',
    name: 'Prof. Carlos Souza',
    avatar: 'https://i.pravatar.cc/150?img=12',
    classes: [
      { name: 'Book 2 — 17h', diariesFilled: 12, diariesTotal: 20, lastFilled: '3 dias atrás' },
    ],
  },
];

const OVERALL: OverallStats = { filled: 46, total: 60, percentage: 77 };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const R = 50;
const STROKE_W = 10;
const CIRC = 2 * Math.PI * R;
const SVG_SIZE = (R + STROKE_W) * 2;

const getStatusColor = (pct: number): string => {
  if (pct >= 80) return '#10B981';
  if (pct >= 60) return '#F59E0B';
  return '#EF4444';
};

const getClassColor = (pct: number): string => {
  if (pct >= 90) return '#10B981';
  if (pct >= 70) return '#F59E0B';
  return '#EF4444';
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AuditScreen() {
  const { s } = useStaggeredEntry(3);
  const overallColor = getStatusColor(OVERALL.percentage);

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
            <Text style={styles.headerTitle}>Auditoria Pedagógica</Text>
            <Text style={styles.headerSubtitle}>Março 2026</Text>
          </Animated.View>

          {/* ── Overall Stats Card ── */}
          <Animated.View style={s(1)}>
            <View style={styles.overallShadow}>
              <BlurView intensity={50} tint="light" style={styles.overallCard}>
                <View style={styles.overallContent}>
                  {/* Circular Progress */}
                  <View style={styles.ringContainer}>
                    <Svg
                      width={SVG_SIZE}
                      height={SVG_SIZE}
                      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                    >
                      {/* Background track */}
                      <SvgCircle
                        cx={SVG_SIZE / 2}
                        cy={SVG_SIZE / 2}
                        r={R}
                        stroke="rgba(0,0,0,0.06)"
                        strokeWidth={STROKE_W}
                        fill="none"
                      />
                      {/* Filled arc */}
                      <SvgCircle
                        cx={SVG_SIZE / 2}
                        cy={SVG_SIZE / 2}
                        r={R}
                        stroke={overallColor}
                        strokeWidth={STROKE_W}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        strokeDashoffset={CIRC * (1 - OVERALL.percentage / 100)}
                        rotation="-90"
                        origin={`${SVG_SIZE / 2}, ${SVG_SIZE / 2}`}
                      />
                    </Svg>
                    <View style={styles.ringLabel}>
                      <Text style={[styles.ringPercentage, { color: overallColor }]}>
                        {OVERALL.percentage}%
                      </Text>
                    </View>
                  </View>

                  {/* Text info */}
                  <View style={styles.overallTextBlock}>
                    <Text style={styles.overallTitle}>Preenchimento geral</Text>
                    <Text style={styles.overallDescription}>
                      {OVERALL.filled} de {OVERALL.total} diários preenchidos
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: overallColor + '1A' }]}>
                      <Ionicons
                        name={
                          OVERALL.percentage >= 80
                            ? 'checkmark-circle'
                            : OVERALL.percentage >= 60
                            ? 'alert-circle'
                            : 'close-circle'
                        }
                        size={14}
                        color={overallColor}
                      />
                      <Text style={[styles.statusBadgeText, { color: overallColor }]}>
                        {OVERALL.percentage >= 80
                          ? 'Bom'
                          : OVERALL.percentage >= 60
                          ? 'Atenção'
                          : 'Crítico'}
                      </Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </View>
          </Animated.View>

          {/* ── Per-Teacher Breakdown ── */}
          <Animated.View style={s(2)}>
            <Text style={styles.sectionTitle}>Por Professor</Text>

            {TEACHERS_AUDIT.map((teacher) => (
              <View key={teacher.id} style={styles.cardShadow}>
                <BlurView intensity={50} tint="light" style={styles.teacherCard}>
                  {/* Teacher header */}
                  <View style={styles.teacherHeader}>
                    <Image
                      source={{ uri: teacher.avatar }}
                      style={styles.teacherAvatar}
                      contentFit="cover"
                    />
                    <Text style={styles.teacherName}>{teacher.name}</Text>
                  </View>

                  {/* Classes */}
                  {teacher.classes.map((cls, idx) => {
                    const pct = Math.round((cls.diariesFilled / cls.diariesTotal) * 100);
                    const clsColor = getClassColor(pct);
                    return (
                      <View
                        key={cls.name}
                        style={[
                          styles.classRow,
                          idx < teacher.classes.length - 1 && styles.classRowBorder,
                        ]}
                      >
                        <View style={styles.classRowTop}>
                          <Text style={styles.classRowName}>{cls.name}</Text>
                          <Text style={[styles.classRowPct, { color: clsColor }]}>
                            {pct}%
                          </Text>
                        </View>

                        {/* Progress bar */}
                        <View style={styles.progressBarBg}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${pct}%`,
                                backgroundColor: clsColor,
                              },
                            ]}
                          />
                        </View>

                        <View style={styles.classRowBottom}>
                          <Text style={styles.classRowCount}>
                            {cls.diariesFilled}/{cls.diariesTotal} diários
                          </Text>
                          <Text style={styles.classRowLast}>
                            Último: {cls.lastFilled}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
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
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  // Header
  headerTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 26,
    color: '#1a1030',
    marginHorizontal: 16,
    marginTop: 20,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#888',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },

  // Overall stats card
  overallShadow: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  overallCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 20,
  },
  overallContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  ringContainer: {
    width: SVG_SIZE,
    height: SVG_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercentage: {
    fontFamily: 'Nunito_900Black',
    fontSize: 24,
  },
  overallTextBlock: {
    flex: 1,
    gap: 6,
  },
  overallTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
  },
  overallDescription: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  statusBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
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
    marginBottom: 12,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Teacher card
  teacherCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 16,
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0DCEF',
  },
  teacherName: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
    flex: 1,
  },

  // Class row
  classRow: {
    paddingVertical: 10,
    gap: 6,
  },
  classRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  classRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  classRowName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#1a1030',
  },
  classRowPct: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  classRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  classRowCount: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
  classRowLast: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
});
