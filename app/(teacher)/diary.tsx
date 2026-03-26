import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  Animated, TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';

// ─── Types ────────────────────────────────────────────────────────────────────

type HomeworkStatus = 'pending_review' | 'graded';
type HomeworkType   = 'writing' | 'multiple_choice' | 'fill_blank' | 'audio';
type FilterKey      = 'all' | 'pending_review' | 'graded';

interface Submission {
  id: string;
  studentName: string;
  studentAvatar: string;
  classId: string;
  title: string;
  type: HomeworkType;
  submittedAt: string;
  status: HomeworkStatus;
  answer?: string;       // texto do aluno (writing/fill_blank)
  score?: number;        // nota dada pelo professor
  feedback?: string;     // comentário do professor
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLASSES = [
  { id: 'all', name: 'Todas as turmas' },
  { id: 'c1',  name: 'Book 3 — 19h'  },
  { id: 'c2',  name: 'Book 1 — 08h'  },
  { id: 'c3',  name: 'Book 2 — 17h'  },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',            label: 'Todos'      },
  { key: 'pending_review', label: 'Pendentes'  },
  { key: 'graded',         label: 'Corrigidos' },
];

const TYPE_CONFIG: Record<HomeworkType, { label: string; icon: string; color: string }> = {
  writing:         { label: 'Escrita',    icon: 'create-outline',    color: '#7B5CF0' },
  multiple_choice: { label: 'Múltipla',   icon: 'list-outline',      color: '#3B82F6' },
  fill_blank:      { label: 'Lacunas',    icon: 'text-outline',      color: '#10B981' },
  audio:           { label: 'Áudio',      icon: 'mic-outline',       color: '#F59E0B' },
};

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1',
    studentName: 'Ana C.',
    studentAvatar: 'https://i.pravatar.cc/150?img=20',
    classId: 'c1',
    title: 'Writing Task: Describe your weekend',
    type: 'writing',
    submittedAt: 'Hoje, 08:14',
    status: 'pending_review',
    answer: 'Last weekend I went to the beach with my family. The weather was really nice and sunny. We swam in the sea and ate at a restaurant near the water. I really enjoyed spending time with them. On Sunday, I stayed home and watched movies.',
  },
  {
    id: 'sub2',
    studentName: 'Lucas A.',
    studentAvatar: 'https://i.pravatar.cc/150?img=10',
    classId: 'c1',
    title: 'Grammar Fill-in-the-Blank: Present Perfect',
    type: 'fill_blank',
    submittedAt: 'Hoje, 07:50',
    status: 'pending_review',
    answer: 'I have lived here for five years. She has never been to Paris. They have already finished the project.',
  },
  {
    id: 'sub3',
    studentName: 'Pedro S.',
    studentAvatar: 'https://i.pravatar.cc/150?img=15',
    classId: 'c1',
    title: 'Unit 2 – Vocabulary Practice',
    type: 'multiple_choice',
    submittedAt: 'Ontem, 22:30',
    status: 'graded',
    score: 8.0,
    feedback: 'Bom trabalho! Atenção às questões 3 e 7 que envolvem verbos irregulares.',
  },
  {
    id: 'sub4',
    studentName: 'Julia M.',
    studentAvatar: 'https://i.pravatar.cc/150?img=25',
    classId: 'c1',
    title: 'Pronunciation Practice — Track 12',
    type: 'audio',
    submittedAt: 'Ontem, 19:45',
    status: 'pending_review',
  },
  {
    id: 'sub5',
    studentName: 'Beatriz F.',
    studentAvatar: 'https://i.pravatar.cc/150?img=32',
    classId: 'c1',
    title: 'Writing Task: Describe your weekend',
    type: 'writing',
    submittedAt: 'Ontem, 18:00',
    status: 'graded',
    score: 9.5,
    feedback: 'Excelente! Ótimo uso do vocabulário e boa estrutura de parágrafos.',
  },
  {
    id: 'sub6',
    studentName: 'Isabela N.',
    studentAvatar: 'https://i.pravatar.cc/150?img=44',
    classId: 'c2',
    title: 'Simple Past — Verbos irregulares',
    type: 'fill_blank',
    submittedAt: 'Hoje, 09:10',
    status: 'pending_review',
    answer: 'Yesterday I went to school. She saw a movie last night. We ate pizza for dinner.',
  },
  {
    id: 'sub7',
    studentName: 'Bruno K.',
    studentAvatar: 'https://i.pravatar.cc/150?img=55',
    classId: 'c2',
    title: 'Vocabulary Quiz — Unit 1',
    type: 'multiple_choice',
    submittedAt: 'Ontem, 21:00',
    status: 'graded',
    score: 7.5,
    feedback: 'Precisa revisar o vocabulário de transportes.',
  },
  {
    id: 'sub8',
    studentName: 'Felipe A.',
    studentAvatar: 'https://i.pravatar.cc/150?img=61',
    classId: 'c3',
    title: 'Writing Task: My daily routine',
    type: 'writing',
    submittedAt: 'Hoje, 06:55',
    status: 'pending_review',
    answer: 'I wake up at 6am every day. I take a shower and have breakfast. Then I go to school by bus. In the afternoon I study English and do my homework. At night I have dinner with my family and read before sleeping.',
  },
];

const QUICK_SCORES = [5, 6, 7, 7.5, 8, 8.5, 9, 9.5, 10];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeworkReviewScreen() {
  const [activeClass, setActiveClass]       = useState('all');
  const [activeFilter, setActiveFilter]     = useState<FilterKey>('all');
  const [submissions, setSubmissions]       = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [selected, setSelected]             = useState<Submission | null>(null);
  const [scoreInput, setScoreInput]         = useState('');
  const [feedbackInput, setFeedbackInput]   = useState('');
  const [saved, setSaved]                   = useState(false);

  const { s } = useStaggeredEntry(3);

  const filtered = submissions.filter((sub) => {
    const classMatch  = activeClass === 'all' || sub.classId === activeClass;
    const statusMatch = activeFilter === 'all' || sub.status === activeFilter;
    return classMatch && statusMatch;
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;

  const openReview = (sub: Submission) => {
    setSelected(sub);
    setScoreInput(sub.score?.toString() ?? '');
    setFeedbackInput(sub.feedback ?? '');
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > 10) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? { ...s, status: 'graded', score, feedback: feedbackInput }
          : s
      )
    );
    setSaved(true);
    setTimeout(() => setSelected(null), 1200);
  };

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* ── Header ── */}
        <Animated.View style={s(0)}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Correções</Text>
              <Text style={styles.headerSub}>
                {pendingCount > 0 ? `${pendingCount} pendentes de correção` : 'Tudo em dia!'}
              </Text>
            </View>
            <View style={[styles.pendingBadge, pendingCount === 0 && { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
              <Text style={[styles.pendingBadgeText, pendingCount === 0 && { color: '#10B981' }]}>
                {pendingCount}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Class filter ── */}
        <Animated.View style={s(1)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {CLASSES.map((cls) => {
              const active = activeClass === cls.id;
              return (
                <Pressable
                  key={cls.id}
                  onPress={() => setActiveClass(cls.id)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {cls.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Status filter */}
          <View style={styles.filterRow}>
            {FILTERS.map(({ key, label }) => {
              const active = activeFilter === key;
              const count = key === 'all'
                ? submissions.length
                : submissions.filter((s) => s.status === key).length;
              return (
                <Pressable
                  key={key}
                  onPress={() => setActiveFilter(key)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {label}
                  </Text>
                  <View style={[styles.filterCount, active && styles.filterCountActive]}>
                    <Text style={[styles.filterCountText, active && styles.filterCountTextActive]}>
                      {count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── List ── */}
        <Animated.View style={[{ flex: 1 }, s(2)]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="checkmark-circle-outline" size={48} color="rgba(123,92,240,0.2)" />
                <Text style={styles.emptyText}>Nenhum homework aqui</Text>
              </View>
            ) : (
              filtered.map((sub) => {
                const typeCfg = TYPE_CONFIG[sub.type];
                return (
                  <Pressable key={sub.id} onPress={() => openReview(sub)} style={styles.cardWrap}>
                    <BlurView intensity={50} tint="light" style={styles.card}>
                      {/* Barra lateral colorida */}
                      <View style={[styles.cardBar, {
                        backgroundColor: sub.status === 'graded' ? '#10B981' : '#F59E0B',
                      }]} />

                      <View style={styles.cardBody}>
                        {/* Topo */}
                        <View style={styles.cardTop}>
                          <Image
                            source={{ uri: sub.studentAvatar }}
                            style={styles.cardAvatar}
                            contentFit="cover"
                          />
                          <View style={styles.cardInfo}>
                            <Text style={styles.cardStudent}>{sub.studentName}</Text>
                            <Text style={styles.cardTitle} numberOfLines={1}>{sub.title}</Text>
                          </View>
                          {sub.status === 'graded' ? (
                            <View style={styles.scoreBadge}>
                              <Text style={styles.scoreText}>{sub.score}</Text>
                            </View>
                          ) : (
                            <View style={styles.pendingIcon}>
                              <Ionicons name="time-outline" size={18} color="#F59E0B" />
                            </View>
                          )}
                        </View>

                        {/* Rodapé */}
                        <View style={styles.cardFooter}>
                          <View style={[styles.typePill, { backgroundColor: typeCfg.color + '18' }]}>
                            <Ionicons name={typeCfg.icon as any} size={12} color={typeCfg.color} />
                            <Text style={[styles.typePillText, { color: typeCfg.color }]}>{typeCfg.label}</Text>
                          </View>
                          <Text style={styles.cardTime}>{sub.submittedAt}</Text>
                          <View style={[
                            styles.statusPill,
                            sub.status === 'graded' ? styles.statusGraded : styles.statusPending,
                          ]}>
                            <Text style={[
                              styles.statusText,
                              sub.status === 'graded' ? styles.statusGradedText : styles.statusPendingText,
                            ]}>
                              {sub.status === 'graded' ? 'Corrigido' : 'Pendente'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </BlurView>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      {/* ── Modal de Correção ── */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelected(null)} />

          {selected && (
            <BlurView intensity={55} tint="light" style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              {/* Header do modal */}
              <View style={styles.modalHeader}>
                <Image
                  source={{ uri: selected.studentAvatar }}
                  style={styles.modalAvatar}
                  contentFit="cover"
                />
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalStudent}>{selected.studentName}</Text>
                  <Text style={styles.modalTitle} numberOfLines={2}>{selected.title}</Text>
                </View>
                <View style={[styles.typePill, { backgroundColor: TYPE_CONFIG[selected.type].color + '18' }]}>
                  <Ionicons name={TYPE_CONFIG[selected.type].icon as any} size={12} color={TYPE_CONFIG[selected.type].color} />
                  <Text style={[styles.typePillText, { color: TYPE_CONFIG[selected.type].color }]}>
                    {TYPE_CONFIG[selected.type].label}
                  </Text>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 8 }}>
                {/* Resposta do aluno */}
                {selected.answer ? (
                  <View style={styles.answerCard}>
                    <Text style={styles.answerLabel}>Resposta do aluno</Text>
                    <Text style={styles.answerText}>{selected.answer}</Text>
                  </View>
                ) : selected.type === 'audio' ? (
                  <View style={styles.answerCard}>
                    <Text style={styles.answerLabel}>Resposta do aluno</Text>
                    <View style={styles.audioPreview}>
                      <View style={styles.audioPlayBtn}>
                        <Ionicons name="play" size={20} color="#fff" />
                      </View>
                      <View style={styles.audioWave}>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <View
                            key={i}
                            style={[styles.audioBar, { height: 8 + Math.sin(i * 0.8) * 12 }]}
                          />
                        ))}
                      </View>
                      <Text style={styles.audioDuration}>0:42</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.answerCard}>
                    <Text style={styles.answerLabel}>Resposta automática</Text>
                    <Text style={styles.answerText}>Exercício de múltipla escolha — resultado gerado automaticamente pelo sistema.</Text>
                  </View>
                )}

                {/* Nota */}
                <View>
                  <Text style={styles.sectionLabel}>Nota (0 – 10)</Text>
                  <View style={styles.scoreRow}>
                    {QUICK_SCORES.map((q) => (
                      <Pressable
                        key={q}
                        onPress={() => setScoreInput(q.toString())}
                        style={[
                          styles.quickScore,
                          scoreInput === q.toString() && styles.quickScoreActive,
                        ]}
                      >
                        <Text style={[
                          styles.quickScoreText,
                          scoreInput === q.toString() && styles.quickScoreTextActive,
                        ]}>
                          {q}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <TextInput
                    style={styles.scoreInput}
                    value={scoreInput}
                    onChangeText={setScoreInput}
                    placeholder="Ou digite a nota..."
                    placeholderTextColor="#bbb"
                    keyboardType="decimal-pad"
                  />
                </View>

                {/* Feedback */}
                <View>
                  <Text style={styles.sectionLabel}>Feedback para o aluno</Text>
                  <TextInput
                    style={styles.feedbackInput}
                    value={feedbackInput}
                    onChangeText={setFeedbackInput}
                    placeholder="Ex: Ótima estrutura! Atenção ao uso do Present Perfect..."
                    placeholderTextColor="#bbb"
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {/* Botão */}
                {saved ? (
                  <View style={styles.savedBanner}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.savedText}>Correção salva!</Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={handleSave}
                    disabled={!scoreInput.trim()}
                    style={[styles.saveBtn, !scoreInput.trim() && { opacity: 0.4 }]}
                  >
                    <LinearGradient
                      colors={['#8B5CF6', '#6D28D9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.saveBtnGrad}
                    >
                      <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                      <Text style={styles.saveBtnText}>Salvar Correção</Text>
                    </LinearGradient>
                  </Pressable>
                )}
              </ScrollView>
            </BlurView>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 26, color: '#1a1030' },
  headerSub:   { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#7B5CF0', marginTop: 2 },
  pendingBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(245,158,11,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  pendingBadgeText: { fontFamily: 'Nunito_900Black', fontSize: 18, color: '#F59E0B' },

  chipRow: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },
  chipActive: { backgroundColor: '#1a1030', borderColor: '#1a1030' },
  chipText:       { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#888' },
  chipTextActive: { color: '#fff' },

  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },
  filterChipActive:    { backgroundColor: '#1a1030', borderColor: '#1a1030' },
  filterChipText:      { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#888' },
  filterChipTextActive:{ color: '#fff' },
  filterCount: {
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  filterCountActive:    { backgroundColor: 'rgba(255,255,255,0.2)' },
  filterCountText:      { fontFamily: 'Nunito_800ExtraBold', fontSize: 10, color: '#888' },
  filterCountTextActive:{ color: '#fff' },

  list: { paddingHorizontal: 16, paddingBottom: 110, gap: 10 },

  cardWrap: {
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    borderRadius: 18, overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
  },
  cardBar: { width: 5, alignSelf: 'stretch' },
  cardBody: { flex: 1, padding: 14, gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0dde8', flexShrink: 0 },
  cardInfo: { flex: 1 },
  cardStudent: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  cardTitle:   { fontFamily: 'Nunito_600SemiBold',  fontSize: 12, color: '#888', marginTop: 2 },
  scoreBadge: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50,
  },
  scoreText: { fontFamily: 'Nunito_900Black', fontSize: 16, color: '#10B981' },
  pendingIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(245,158,11,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50,
  },
  typePillText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  cardTime: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa', flex: 1 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
  statusGraded:  { backgroundColor: 'rgba(16,185,129,0.10)' },
  statusPending: { backgroundColor: 'rgba(245,158,11,0.10)' },
  statusText:        { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  statusGradedText:  { color: '#10B981' },
  statusPendingText: { color: '#F59E0B' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#bbb' },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalSheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
    maxHeight: '90%',
    gap: 16,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'center' },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  modalAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#e0dde8', flexShrink: 0 },
  modalHeaderInfo: { flex: 1 },
  modalStudent: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#1a1030' },
  modalTitle:   { fontFamily: 'Nunito_600SemiBold',  fontSize: 13, color: '#888', marginTop: 2 },

  answerCard: {
    backgroundColor: 'rgba(123,92,240,0.05)',
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(123,92,240,0.12)',
    gap: 8,
  },
  answerLabel: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#7B5CF0' },
  answerText:  { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#1a1030', lineHeight: 21 },

  audioPreview: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  audioPlayBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#7B5CF0',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  audioWave: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2 },
  audioBar: { width: 3, borderRadius: 2, backgroundColor: 'rgba(123,92,240,0.4)' },
  audioDuration: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },

  sectionLabel: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#555', marginBottom: 8 },
  scoreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  quickScore: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  quickScoreActive:     { backgroundColor: '#7B5CF0', borderColor: '#7B5CF0' },
  quickScoreText:       { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#555' },
  quickScoreTextActive: { color: '#fff' },
  scoreInput: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#1a1030',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
  },
  feedbackInput: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#1a1030',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    minHeight: 100,
  },
  savedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 16, backgroundColor: 'rgba(16,185,129,0.10)',
    borderRadius: 50, borderWidth: 1.5, borderColor: 'rgba(16,185,129,0.25)',
  },
  savedText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#10B981' },
  saveBtn: { borderRadius: 50, overflow: 'hidden' },
  saveBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  saveBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff' },
});
