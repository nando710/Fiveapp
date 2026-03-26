import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  Dimensions, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Svg, { Path as SvgPath, Circle as SvgCircle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';

const { width: W } = Dimensions.get('window');
const NODE_SIZE = 58;
const CENTER_X = W / 2;
const AMPLITUDE = W * 0.28;
const ROW_HEIGHT = 110;

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonType = 'vocabulary' | 'listening' | 'speaking' | 'writing' | 'reading' | 'review' | 'quiz';
type LessonStatus = 'completed' | 'active' | 'locked';

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  status: LessonStatus;
  stars?: number;
  summary?: string;
  objectives?: string[];
  duration?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const LESSON_CONFIG: Record<LessonType, { icon: string; label: string }> = {
  vocabulary: { icon: 'book-outline',         label: 'Vocabulário' },
  listening:  { icon: 'headset-outline',      label: 'Listening' },
  speaking:   { icon: 'mic-outline',          label: 'Speaking' },
  writing:    { icon: 'create-outline',       label: 'Writing' },
  reading:    { icon: 'document-text-outline', label: 'Reading' },
  review:     { icon: 'star-outline',         label: 'Revisão' },
  quiz:       { icon: 'trophy-outline',       label: 'Quiz' },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BOOK = {
  name: 'Discover One',
  cover: require('../../assets/book-discover-one.png'),
};

const LESSONS: Lesson[] = [
  // Unit 1
  { id: 'l1',  title: 'Hello & Goodbye',          type: 'vocabulary', status: 'completed', stars: 3, summary: 'Expressões básicas de saudação e despedida. Formal vs informal greetings.', objectives: ['Cumprimentar em diferentes contextos', 'Usar expressões formais e informais', 'Apresentar-se em inglês'], duration: '15 min' },
  { id: 'l2',  title: 'What\'s your name?',        type: 'listening',  status: 'completed', stars: 2, summary: 'Diálogos de apresentação pessoal. Compreensão auditiva com sotaques variados.', objectives: ['Entender apresentações em áudio', 'Identificar nomes e informações'], duration: '12 min' },
  { id: 'l3',  title: 'Introduce yourself',        type: 'speaking',   status: 'completed', stars: 3, summary: 'Prática de pronúncia e fluência ao se apresentar.', objectives: ['Praticar pronúncia de saudações', 'Falar sobre si mesmo'], duration: '10 min' },
  { id: 'l4',  title: 'Nice to meet you',          type: 'writing',    status: 'completed', stars: 2, summary: 'Escrita de diálogos simples de apresentação.', objectives: ['Escrever diálogos de apresentação', 'Usar pontuação correta'], duration: '15 min' },
  { id: 'l5',  title: 'Meeting people',            type: 'reading',    status: 'completed', stars: 3, summary: 'Texto sobre costumes de apresentação em diferentes países.', objectives: ['Ler texto sobre culturas', 'Comparar costumes'], duration: '12 min' },
  { id: 'l6',  title: 'Unit 1 Review',             type: 'review',     status: 'completed', stars: 2, summary: 'Revisão completa de vocabulário, estruturas e expressões da unidade.', objectives: ['Revisar todo vocabulário', 'Identificar pontos fracos'], duration: '20 min' },
  // Unit 2
  { id: 'l7',  title: 'My morning routine',        type: 'vocabulary', status: 'completed', stars: 3, summary: 'Vocabulário de atividades matinais e rotina diária.', objectives: ['Aprender verbos de rotina', 'Usar Simple Present'], duration: '15 min' },
  { id: 'l8',  title: 'Daily activities',          type: 'listening',  status: 'completed', stars: 2, summary: 'Áudios descrevendo rotinas de diferentes pessoas.', objectives: ['Identificar atividades no áudio', 'Associar horários'], duration: '12 min' },
  { id: 'l9',  title: 'Tell me about your day',    type: 'speaking',   status: 'active',    summary: 'Descreva sua rotina diária usando Simple Present.', objectives: ['Falar sobre sua rotina', 'Usar verbos no presente', 'Conectar frases com advérbios'], duration: '10 min' },
  { id: 'l10', title: 'A day in my life',          type: 'writing',    status: 'locked',    summary: 'Escreva um parágrafo descrevendo seu dia típico.', objectives: ['Escrever sobre rotina', 'Usar conectivos'], duration: '15 min' },
  { id: 'l11', title: 'Routines around the world', type: 'reading',    status: 'locked',    summary: 'Texto comparando rotinas de pessoas de diferentes países.', objectives: ['Ler textos comparativos', 'Expandir vocabulário'], duration: '12 min' },
  { id: 'l12', title: 'Unit 2 Quiz',               type: 'quiz',       status: 'locked',    summary: 'Avaliação da unidade com questões de todos os tipos.', objectives: ['Vocabulary + Grammar + Listening', 'Ganhar pontos bônus'], duration: '25 min' },
  // Unit 3
  { id: 'l13', title: 'Family members',            type: 'vocabulary', status: 'locked', summary: 'Vocabulário de membros da família.', objectives: ['Aprender nomes de parentesco'], duration: '15 min' },
  { id: 'l14', title: 'My best friend',            type: 'listening',  status: 'locked', summary: 'Áudios sobre amizades e descrição de pessoas.', objectives: ['Entender descrições'], duration: '12 min' },
  { id: 'l15', title: 'Describe someone',          type: 'speaking',   status: 'locked', summary: 'Descrever pessoas física e emocionalmente.', objectives: ['Usar adjetivos corretamente'], duration: '10 min' },
];

// ─── Unit milestones (appear as banners between lessons) ──────────────────────

const MILESTONES: Record<number, { name: string; subtitle: string; color: string }> = {
  0: { name: 'Unit 1', subtitle: 'Greetings & Introductions', color: '#7B5CF0' },
  6: { name: 'Unit 2', subtitle: 'Daily Routines', color: '#10B981' },
  12: { name: 'Unit 3', subtitle: 'Family & Friends', color: '#F59E0B' },
};

// ─── Sinusoidal path positions ────────────────────────────────────────────────

function getNodePos(i: number): { x: number; y: number } {
  const angle = (i / 2.5) * Math.PI;
  const x = CENTER_X + Math.sin(angle) * AMPLITUDE - NODE_SIZE / 2;
  const y = i * ROW_HEIGHT + 20;
  return { x, y };
}

function buildSvgPath(): string {
  if (LESSONS.length === 0) return '';
  const points = LESSONS.map((_, i) => {
    const p = getNodePos(i);
    return { x: p.x + NODE_SIZE / 2, y: p.y + NODE_SIZE / 2 };
  });
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${cpY}, ${curr.x} ${cpY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function JourneyScreen() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const pathHeight = LESSONS.length * ROW_HEIGHT + 80;
  const svgPath = buildSvgPath();

  // Find where path switches from completed to locked
  const lastCompletedIdx = LESSONS.reduce((acc, l, i) => l.status === 'completed' ? i : acc, -1);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1a1030" />
          </Pressable>
          <Image source={BOOK.cover} style={styles.headerBook} contentFit="cover" />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{BOOK.name}</Text>
            <Text style={styles.headerSub}>{lastCompletedIdx + 1} de {LESSONS.length} lições</Text>
          </View>
          <View style={styles.headerProgress}>
            <Text style={styles.headerProgressText}>{Math.round(((lastCompletedIdx + 1) / LESSONS.length) * 100)}%</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}>
          <View style={{ height: pathHeight, position: 'relative' }}>

            {/* SVG trail path */}
            <Svg width={W} height={pathHeight} style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgGrad id="trailDone" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#C4B5FD" />
                  <Stop offset="100%" stopColor="#E0D9FF" />
                </SvgGrad>
              </Defs>
              {/* Background trail (full, gray dashed) */}
              <SvgPath
                d={svgPath}
                stroke="rgba(0,0,0,0.06)"
                strokeWidth={6}
                fill="none"
                strokeDasharray="12,8"
                strokeLinecap="round"
              />
              {/* Completed trail (solid, gradient) */}
              <SvgPath
                d={svgPath}
                stroke="url(#trailDone)"
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(lastCompletedIdx + 1.5) * ROW_HEIGHT}, ${pathHeight}`}
              />
            </Svg>

            {/* Milestone banners */}
            {Object.entries(MILESTONES).map(([idxStr, ms]) => {
              const idx = Number(idxStr);
              const pos = getNodePos(idx);
              const isLeft = pos.x + NODE_SIZE / 2 > CENTER_X;
              return (
                <View key={ms.name} style={[styles.milestone, {
                  top: pos.y + NODE_SIZE / 2 - 14,
                  [isLeft ? 'right' : 'left']: 20,
                }]}>
                  <LinearGradient colors={[ms.color, ms.color + 'CC']} style={styles.milestoneGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.milestoneName}>{ms.name}</Text>
                    <Text style={styles.milestoneSub}>{ms.subtitle}</Text>
                  </LinearGradient>
                </View>
              );
            })}

            {/* Lesson nodes */}
            {LESSONS.map((lesson, i) => {
              const pos = getNodePos(i);
              const cfg = LESSON_CONFIG[lesson.type];
              const isCompleted = lesson.status === 'completed';
              const isActive = lesson.status === 'active';
              const isLocked = lesson.status === 'locked';

              return (
                <Pressable
                  key={lesson.id}
                  style={[styles.nodeOuter, { left: pos.x, top: pos.y }]}
                  onPress={() => !isLocked && setSelectedLesson(lesson)}
                  disabled={isLocked}
                >
                  {/* Active ring pulse */}
                  {isActive && <View style={styles.pulseRing} />}

                  {/* Shadow circle behind */}
                  <View style={[
                    styles.nodeShadow,
                    isCompleted && { shadowColor: '#7B5CF0' },
                    isActive && { shadowColor: '#10B981' },
                  ]}>
                    {isLocked ? (
                      <View style={styles.nodeLocked}>
                        <Ionicons name={cfg.icon as any} size={22} color="rgba(0,0,0,0.15)" />
                      </View>
                    ) : (
                      <LinearGradient
                        colors={isCompleted ? ['#8B5CF6', '#6D28D9'] : ['#10B981', '#059669']}
                        style={styles.nodeCircle}
                      >
                        <Ionicons name={cfg.icon as any} size={24} color="#fff" />
                      </LinearGradient>
                    )}
                  </View>

                  {/* Stars */}
                  {isCompleted && lesson.stars != null && (
                    <View style={styles.starsRow}>
                      {[1, 2, 3].map((s) => (
                        <Ionicons key={s} name={s <= (lesson.stars ?? 0) ? 'star' : 'star-outline'} size={11} color={s <= (lesson.stars ?? 0) ? '#F59E0B' : 'rgba(0,0,0,0.12)'} />
                      ))}
                    </View>
                  )}

                  {/* Lock */}
                  {isLocked && (
                    <View style={styles.lockIcon}>
                      <Ionicons name="lock-closed" size={10} color="#bbb" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Modal ── */}
      <Modal visible={!!selectedLesson} transparent animationType="slide" onRequestClose={() => setSelectedLesson(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedLesson(null)} />
        {selectedLesson && (
          <BlurView intensity={55} tint="light" style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Header */}
              <View style={styles.mHeader}>
                <View style={[styles.mIcon, { backgroundColor: selectedLesson.status === 'completed' ? '#7B5CF0' : '#10B981' }]}>
                  <Ionicons name={LESSON_CONFIG[selectedLesson.type].icon as any} size={24} color="#fff" />
                </View>
                <View style={styles.mHeaderInfo}>
                  <Text style={styles.mTitle}>{selectedLesson.title}</Text>
                  <View style={styles.mMeta}>
                    <View style={[styles.mBadge, { backgroundColor: (selectedLesson.status === 'completed' ? '#7B5CF0' : '#10B981') + '18' }]}>
                      <Text style={[styles.mBadgeText, { color: selectedLesson.status === 'completed' ? '#7B5CF0' : '#10B981' }]}>
                        {LESSON_CONFIG[selectedLesson.type].label}
                      </Text>
                    </View>
                    {selectedLesson.duration && (
                      <View style={styles.mDur}>
                        <Ionicons name="time-outline" size={12} color="#888" />
                        <Text style={styles.mDurText}>{selectedLesson.duration}</Text>
                      </View>
                    )}
                  </View>
                </View>
                {selectedLesson.status === 'completed' && selectedLesson.stars != null && (
                  <View style={styles.mStars}>
                    {[1, 2, 3].map((s) => (
                      <Ionicons key={s} name={s <= (selectedLesson.stars ?? 0) ? 'star' : 'star-outline'} size={18} color={s <= (selectedLesson.stars ?? 0) ? '#F59E0B' : '#ddd'} />
                    ))}
                  </View>
                )}
              </View>

              {/* Summary */}
              {selectedLesson.summary && (
                <View style={styles.mCard}>
                  <Text style={styles.mCardLabel}>Resumo da aula</Text>
                  <Text style={styles.mCardText}>{selectedLesson.summary}</Text>
                </View>
              )}

              {/* Objectives */}
              {selectedLesson.objectives && (
                <View style={[styles.mCard, { backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.1)' }]}>
                  <Text style={[styles.mCardLabel, { color: '#10B981' }]}>Objetivos</Text>
                  {selectedLesson.objectives.map((obj, i) => (
                    <View key={i} style={styles.mObjRow}>
                      <Ionicons name={selectedLesson.status === 'completed' ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={selectedLesson.status === 'completed' ? '#10B981' : '#ccc'} />
                      <Text style={styles.mObjText}>{obj}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action */}
              <Pressable style={styles.mBtn} onPress={() => setSelectedLesson(null)}>
                <LinearGradient
                  colors={selectedLesson.status === 'completed' ? ['#8B5CF6', '#6D28D9'] : ['#10B981', '#059669']}
                  style={styles.mBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                  <Ionicons name={selectedLesson.status === 'completed' ? 'refresh-outline' : 'play'} size={20} color="#fff" />
                  <Text style={styles.mBtnText}>{selectedLesson.status === 'completed' ? 'Refazer aula' : 'Iniciar aula'}</Text>
                </LinearGradient>
              </Pressable>
            </ScrollView>
          </BlurView>
        )}
      </Modal>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  scroll: {},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerBook: { width: 38, height: 50, borderRadius: 6 },
  headerInfo: { flex: 1 },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 17, color: '#1a1030' },
  headerSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888', marginTop: 1 },
  headerProgress: { backgroundColor: 'rgba(123,92,240,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 },
  headerProgressText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#7B5CF0' },

  // Milestones
  milestone: { position: 'absolute', zIndex: 10 },
  milestoneGrad: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, overflow: 'hidden' },
  milestoneName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: '#fff' },
  milestoneSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.75)' },

  // Nodes
  nodeOuter: { position: 'absolute', width: NODE_SIZE, alignItems: 'center' },
  pulseRing: {
    position: 'absolute', width: NODE_SIZE + 18, height: NODE_SIZE + 18,
    borderRadius: (NODE_SIZE + 18) / 2, top: -9, left: -9,
    borderWidth: 2, borderColor: 'rgba(16,185,129,0.3)',
    backgroundColor: 'rgba(16,185,129,0.08)',
  },
  nodeShadow: {
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
    borderRadius: NODE_SIZE / 2,
  },
  nodeCircle: {
    width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  nodeLocked: {
    width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2, borderColor: 'rgba(0,0,0,0.06)',
  },
  starsRow: { flexDirection: 'row', gap: 1, marginTop: 4 },
  lockIcon: { marginTop: 4 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  modalSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '75%', overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'center', marginBottom: 16 },

  mHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  mIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  mHeaderInfo: { flex: 1 },
  mTitle: { fontFamily: 'Nunito_900Black', fontSize: 18, color: '#1a1030' },
  mMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  mBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
  mBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  mDur: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  mDurText: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888' },
  mStars: { flexDirection: 'row', gap: 2, marginTop: 4 },

  mCard: {
    backgroundColor: 'rgba(123,92,240,0.06)', borderRadius: 18, padding: 16, gap: 8, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(123,92,240,0.1)',
  },
  mCardLabel: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#7B5CF0' },
  mCardText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#1a1030', lineHeight: 21 },

  mObjRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  mObjText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#1a1030', flex: 1, lineHeight: 19 },

  mBtn: { borderRadius: 50, overflow: 'hidden', marginTop: 4 },
  mBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  mBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#fff' },
});
