import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { useUiStore } from '@stores/uiStore';

// ── Types ──────────────────────────────────────────────────────────────────────

interface MCQuestion {
  id: string; type: 'multiple_choice';
  instruction: string; question: string;
  options: { key: string; text: string }[];
  correct: string;
}
interface WritingQuestion {
  id: string; type: 'writing';
  instruction: string; prompt: string; answer: string;
}
interface AudioQuestion {
  id: string; type: 'audio';
  instruction: string; sentence: string;
}
interface FillBlankQuestion {
  id: string; type: 'fill_blank';
  instruction: string; sentence: string; answer: string; hint?: string;
}
type Question = MCQuestion | WritingQuestion | AudioQuestion | FillBlankQuestion;

// ── Mock Questions ─────────────────────────────────────────────────────────────

const MOCK_QUESTIONS: Record<string, Question[]> = {
  h1: [
    {
      id: 'q1', type: 'multiple_choice',
      instruction: 'Choose the correct meaning:',
      question: 'What does "wake up" mean in Portuguese?',
      options: [{ key: 'A', text: 'Dormir' }, { key: 'B', text: 'Acordar' }, { key: 'C', text: 'Comer' }, { key: 'D', text: 'Estudar' }],
      correct: 'B',
    },
    {
      id: 'q2', type: 'multiple_choice',
      instruction: 'Choose the correct option:',
      question: 'Which sentence uses "have breakfast" correctly?',
      options: [{ key: 'A', text: 'I have breakfast at midnight.' }, { key: 'B', text: 'I have breakfast the bus.' }, { key: 'C', text: 'I have breakfast at 8 AM.' }, { key: 'D', text: 'I have breakfast a book.' }],
      correct: 'C',
    },
    {
      id: 'q3', type: 'multiple_choice',
      instruction: 'Complete the sentence:',
      question: '"She ___ her teeth every morning."',
      options: [{ key: 'A', text: 'washes' }, { key: 'B', text: 'makes' }, { key: 'C', text: 'brushes' }, { key: 'D', text: 'does' }],
      correct: 'C',
    },
  ],
  h2: [
    { id: 'q1', type: 'audio', instruction: 'Pronounce the following sentence:', sentence: '"She wakes up at seven o\'clock every morning."' },
    { id: 'q2', type: 'audio', instruction: 'Pronounce the following sentence:', sentence: '"After breakfast, he takes the bus to work."' },
    { id: 'q3', type: 'audio', instruction: 'Pronounce the following sentence:', sentence: '"Learning a new language opens up a world of endless opportunities."' },
  ],
  h3: [
    { id: 'q1', type: 'writing', instruction: 'Traduza para o inglês:', prompt: 'Eu gosto de estudar todos os dias.', answer: 'I like to study every day.' },
    { id: 'q2', type: 'writing', instruction: 'Traduza para o inglês:', prompt: 'Nós fomos ao parque no fim de semana.', answer: 'We went to the park on the weekend.' },
    { id: 'q3', type: 'writing', instruction: 'Descreva em inglês:', prompt: 'O que você fez no seu fim de semana? (mínimo 2 frases)', answer: '' },
  ],
  h4: [
    { id: 'q1', type: 'fill_blank', instruction: 'Complete with Present Perfect:', sentence: 'She ___ lived in London for five years.', answer: 'has', hint: 'has / have' },
    { id: 'q2', type: 'fill_blank', instruction: 'Complete with Present Perfect:', sentence: 'They ___ just arrived at the airport.', answer: 'have', hint: 'has / have' },
    { id: 'q3', type: 'fill_blank', instruction: 'Complete with Present Perfect:', sentence: 'I ___ never seen such a beautiful place.', answer: 'have', hint: 'has / have' },
  ],
  h5: [
    {
      id: 'q1', type: 'multiple_choice',
      instruction: 'Choose the correct answer:',
      question: 'What is the plural of "child"?',
      options: [{ key: 'A', text: 'childs' }, { key: 'B', text: 'children' }, { key: 'C', text: 'childen' }, { key: 'D', text: 'childre' }],
      correct: 'B',
    },
    {
      id: 'q2', type: 'multiple_choice',
      instruction: 'Choose the correct sentence:',
      question: 'Which sentence is grammatically correct?',
      options: [{ key: 'A', text: "She don't like coffee." }, { key: 'B', text: "She not like coffee." }, { key: 'C', text: "She doesn't like coffee." }, { key: 'D', text: "She no like coffee." }],
      correct: 'C',
    },
    {
      id: 'q3', type: 'multiple_choice',
      instruction: 'Complete with the correct verb:',
      question: '"He ___ to school every day." (Present Simple)',
      options: [{ key: 'A', text: 'go' }, { key: 'B', text: 'going' }, { key: 'C', text: 'goes' }, { key: 'D', text: 'gone' }],
      correct: 'C',
    },
  ],
};

// ── Animated Circle ────────────────────────────────────────────────────────────

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);
const R = 90;
const CIRC = 2 * Math.PI * R;

// ── Results Screen ─────────────────────────────────────────────────────────────

function ResultsScreen({ correct, total, timeSeconds, onConclude }: {
  correct: number; total: number; timeSeconds: number; onConclude: () => void;
}) {
  const score = Math.round((correct / total) * 100);
  const fpEarned = correct * 10;
  const dashOffset = useRef(new Animated.Value(CIRC)).current;

  useEffect(() => {
    Animated.timing(dashOffset, {
      toValue: CIRC * (1 - score / 100),
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, []);

  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  const scoreColor = score === 100 ? '#10B981' : score >= 70 ? '#7B5CF0' : score >= 50 ? '#F59E0B' : '#EF4444';
  const scoreLabel = score === 100 ? 'Perfect! 🎉' : score >= 70 ? 'Great job! 👏' : score >= 50 ? 'Good effort! 💪' : 'Keep practicing! 📚';

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={StyleSheet.absoluteFill}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.resultsScroll} showsVerticalScrollIndicator={false}>
          <Pressable onPress={onConclude} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1a1030" />
          </Pressable>

          <Text style={styles.resultsSuper}>Quiz completed!</Text>
          <Text style={styles.resultsTitle}>{scoreLabel}</Text>

          {/* Score circle */}
          <View style={styles.circleWrap}>
            <Svg width={200} height={200} viewBox="0 0 200 200">
              <SvgCircle cx={100} cy={100} r={R} stroke="rgba(123,92,240,0.12)" strokeWidth={14} fill="transparent" />
              <AnimatedCircle
                cx={100} cy={100} r={R}
                stroke={scoreColor}
                strokeWidth={14}
                fill="transparent"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </Svg>
            <View style={styles.circleInner}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}%</Text>
            </View>
          </View>

          {/* Rewards */}
          <View style={styles.rewardsRow}>
            <View style={styles.rewardShadow}>
              <LinearGradient colors={['rgba(123,92,240,0.18)', 'rgba(109,40,217,0.08)']} style={styles.rewardChip}>
                <Ionicons name="flash" size={18} color="#7B5CF0" />
                <Text style={styles.rewardVal}>+{fpEarned}</Text>
                <Text style={styles.rewardLabel}>FP EARNED</Text>
              </LinearGradient>
            </View>
            <View style={styles.rewardShadow}>
              <LinearGradient colors={['rgba(245,158,11,0.18)', 'rgba(217,119,6,0.08)']} style={styles.rewardChip}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={[styles.rewardVal, { color: '#D97706' }]}>{correct * 5}</Text>
                <Text style={[styles.rewardLabel, { color: '#D97706' }]}>COINS</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Summary */}
          <Text style={styles.summaryLabel}>Quiz summary</Text>
          <View style={styles.summaryList}>
            <View style={styles.summaryShadow}>
              <BlurView intensity={50} tint="light" style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                </View>
                <Text style={styles.summaryText}>Correct answers</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>{correct}/{total}</Text>
              </BlurView>
            </View>
            <View style={styles.summaryShadow}>
              <BlurView intensity={50} tint="light" style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: 'rgba(123,92,240,0.12)' }]}>
                  <Ionicons name="time" size={20} color="#7B5CF0" />
                </View>
                <Text style={styles.summaryText}>Time taken</Text>
                <Text style={styles.summaryValue}>{timeStr}</Text>
              </BlurView>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.resultActions}>
            <Pressable onPress={onConclude}>
              <LinearGradient colors={['#1a1030', '#7B5CF0']} style={styles.concludeBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.concludeBtnText}>CONCLUIR</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={onConclude} style={styles.reviewBtn}>
              <Text style={styles.reviewBtnText}>Revisar respostas</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────

export default function HomeworkExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const setExerciseOpen = useUiStore((s) => s.setExerciseOpen);
  const questions = MOCK_QUESTIONS[id as string] ?? MOCK_QUESTIONS.h1;
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey]   = useState<string | null>(null);
  const [textAnswer, setTextAnswer]     = useState('');
  const [feedback, setFeedback]         = useState<'none' | 'correct' | 'wrong'>('none');
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults]   = useState(false);
  const [recordPhase, setRecordPhase]   = useState<'idle' | 'recording' | 'done'>('idle');

  const startTime   = useRef(Date.now());
  const recordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1 / total)).current;

  // Hide tab bar while exercise is open
  useEffect(() => {
    setExerciseOpen(true);
    return () => setExerciseOpen(false);
  }, []);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / total,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  // Reset per-question state
  useEffect(() => {
    setSelectedKey(null);
    setTextAnswer('');
    setFeedback('none');
    setRecordPhase('idle');
    if (recordTimer.current) clearTimeout(recordTimer.current);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  }, [currentIndex]);

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleRecord = useCallback(() => {
    if (recordPhase === 'idle') {
      setRecordPhase('recording');
      startPulse();
      recordTimer.current = setTimeout(() => {
        setRecordPhase('done');
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
      }, 3000);
    } else if (recordPhase === 'recording') {
      if (recordTimer.current) clearTimeout(recordTimer.current);
      setRecordPhase('done');
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [recordPhase, startPulse]);

  const q = questions[currentIndex];

  const canConfirm =
    (q.type === 'multiple_choice' && selectedKey !== null && feedback === 'none') ||
    (q.type === 'audio'           && recordPhase === 'done') ||
    ((q.type === 'writing' || q.type === 'fill_blank') && textAnswer.trim().length > 0);

  const advance = useCallback(() => {
    if (currentIndex + 1 >= total) {
      setShowResults(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, total]);

  const handleConfirm = useCallback(() => {
    if (!canConfirm) return;
    if (q.type === 'multiple_choice') {
      const ok = selectedKey === q.correct;
      if (ok) setCorrectCount(c => c + 1);
      setFeedback(ok ? 'correct' : 'wrong');
      setTimeout(advance, 800);
    } else if (q.type === 'fill_blank') {
      const ok = textAnswer.trim().toLowerCase() === q.answer.toLowerCase();
      if (ok) setCorrectCount(c => c + 1);
      setFeedback(ok ? 'correct' : 'wrong');
      setTimeout(advance, 800);
    } else {
      // audio & writing: always award full points
      setCorrectCount(c => c + 1);
      advance();
    }
  }, [canConfirm, q, selectedKey, textAnswer, advance]);

  if (showResults) {
    return (
      <ResultsScreen
        correct={correctCount}
        total={total}
        timeSeconds={Math.round((Date.now() - startTime.current) / 1000)}
        onConclude={() => router.back()}
      />
    );
  }

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={20}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#1a1030" />
            </Pressable>
            <View style={styles.progressWrap}>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, {
                  width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                }]} />
              </View>
              <Text style={styles.progressFraction}>{currentIndex + 1}/{total}</Text>
            </View>
          </View>

          {/* ── Question ── */}
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.instruction}>{q.instruction}</Text>

            {/* Multiple Choice */}
            {q.type === 'multiple_choice' && (
              <>
                <Text style={styles.mcQuestion}>{q.question}</Text>
                <View style={styles.optionsList}>
                  {q.options.map(opt => {
                    const isSelected = selectedKey === opt.key;
                    const isCorrect  = feedback !== 'none' && opt.key === q.correct;
                    const isWrong    = feedback === 'wrong' && isSelected;
                    const isDark     = isSelected && feedback === 'none';
                    return (
                      <View key={opt.key} style={[styles.optionShadow, isCorrect && styles.optionShadowCorrect, isWrong && styles.optionShadowWrong]}>
                        <BlurView
                          intensity={isDark ? 20 : 50}
                          tint={isDark ? 'dark' : 'light'}
                          style={[styles.option, isDark && styles.optionSelected, isCorrect && styles.optionCorrect, isWrong && styles.optionWrong]}
                        >
                          <Pressable
                            style={styles.optionPressArea}
                            onPress={() => feedback === 'none' && setSelectedKey(opt.key)}
                          >
                            <View style={[styles.optionKey, isDark && styles.optionKeyDark, isCorrect && styles.optionKeyCorrect, isWrong && styles.optionKeyWrong]}>
                              <Text style={[styles.optionKeyText, (isDark || isCorrect || isWrong) && styles.optionKeyTextLight]}>{opt.key}</Text>
                            </View>
                            <Text style={[styles.optionText, isDark && styles.optionTextDark, isCorrect && styles.optionTextCorrect, isWrong && styles.optionTextWrong]} numberOfLines={2}>
                              {opt.text}
                            </Text>
                            {isCorrect && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
                            {isWrong   && <Ionicons name="close-circle"    size={20} color="#EF4444" />}
                          </Pressable>
                        </BlurView>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* Writing */}
            {q.type === 'writing' && (
              <View style={styles.inputSection}>
                <View style={styles.promptShadow}>
                  <BlurView intensity={50} tint="light" style={styles.promptCard}>
                    <View style={styles.promptIconWrap}>
                      <Ionicons name="language" size={20} color="#7B5CF0" />
                    </View>
                    <Text style={styles.promptText}>{q.prompt}</Text>
                  </BlurView>
                </View>
                <View style={styles.inputShadow}>
                  <BlurView intensity={50} tint="light" style={styles.textInputCard}>
                    <TextInput
                      style={styles.textInput}
                      value={textAnswer}
                      onChangeText={setTextAnswer}
                      placeholder="Type your answer here..."
                      placeholderTextColor="rgba(26,16,48,0.3)"
                      multiline
                      textAlignVertical="top"
                      autoCorrect={false}
                    />
                  </BlurView>
                </View>
              </View>
            )}

            {/* Fill Blank */}
            {q.type === 'fill_blank' && (
              <View style={styles.inputSection}>
                <View style={styles.promptShadow}>
                  <BlurView intensity={50} tint="light" style={styles.fillCard}>
                    <Text style={styles.fillSentence}>
                      {q.sentence.split('___').reduce<React.ReactNode[]>((acc, part, i, arr) => {
                        acc.push(part);
                        if (i < arr.length - 1) {
                          acc.push(
                            <Text
                              key={i}
                              style={[
                                styles.fillBlank,
                                feedback === 'correct' && styles.fillBlankCorrect,
                                feedback === 'wrong'   && styles.fillBlankWrong,
                              ]}
                            >
                              {textAnswer || '___'}
                            </Text>
                          );
                        }
                        return acc;
                      }, [])}
                    </Text>
                  </BlurView>
                </View>
                {q.hint && <Text style={styles.hintText}>💡 Dica: {q.hint}</Text>}
                <View style={styles.inputShadow}>
                  <BlurView intensity={50} tint="light" style={styles.textInputCard}>
                    <TextInput
                      style={[styles.textInput, { minHeight: 52 }]}
                      value={textAnswer}
                      onChangeText={setTextAnswer}
                      placeholder="Type the missing word..."
                      placeholderTextColor="rgba(26,16,48,0.3)"
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                  </BlurView>
                </View>
              </View>
            )}

            {/* Audio */}
            {q.type === 'audio' && (
              <View style={styles.audioWrap}>
                <View style={styles.promptShadow}>
                  <BlurView intensity={50} tint="light" style={styles.audioSentenceCard}>
                    <Text style={styles.audioSentence}>{q.sentence}</Text>
                  </BlurView>
                </View>
                <View style={styles.audioMicArea}>
                  <Animated.View style={[styles.audioPulse, { transform: [{ scale: pulseAnim }] },
                    recordPhase === 'recording' && styles.audioPulseActive,
                    recordPhase === 'done'      && styles.audioPulseDone,
                  ]} />
                  <Pressable onPress={handleRecord}>
                    <LinearGradient
                      colors={
                        recordPhase === 'recording' ? ['#EF4444', '#DC2626'] :
                        recordPhase === 'done'      ? ['#10B981', '#059669'] :
                                                      ['#7B5CF0', '#4C1D95']
                      }
                      style={styles.audioMicBtn}
                    >
                      <Ionicons
                        name={recordPhase === 'done' ? 'checkmark' : 'mic'}
                        size={34}
                        color="#fff"
                      />
                    </LinearGradient>
                  </Pressable>
                </View>
                <Text style={styles.audioLabel}>
                  {recordPhase === 'idle'      ? 'Tap to record' :
                   recordPhase === 'recording' ? 'Recording...'  : 'Recording complete ✓'}
                </Text>
                {recordPhase === 'idle' && (
                  <Text style={styles.audioSublabel}>Make sure you are in a quiet place</Text>
                )}
              </View>
            )}
          </ScrollView>

          {/* ── Bottom ── */}
          <View style={styles.bottomActions}>
            <View style={styles.confirmShadow}>
              <Pressable onPress={handleConfirm} disabled={!canConfirm}>
                <LinearGradient
                  colors={canConfirm ? ['#1a1030', '#7B5CF0'] : ['#d0d0d0', '#c0c0c0']}
                  style={styles.confirmBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.confirmBtnText}>CONFIRM ›</Text>
                </LinearGradient>
              </Pressable>
            </View>
            {q.type === 'audio' && (
              <Pressable onPress={advance} style={styles.skipBtn}>
                <Text style={styles.skipBtnText}>Skip for now</Text>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  progressWrap:     { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack:    { flex: 1, height: 8, borderRadius: 99, backgroundColor: 'rgba(123,92,240,0.12)', overflow: 'hidden' },
  progressFill:     { height: '100%', borderRadius: 99, backgroundColor: '#7B5CF0' },
  progressFraction: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#7B5CF0', minWidth: 36, textAlign: 'right' },

  scroll:      { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 },
  instruction: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },

  // MC
  mcQuestion:  { fontFamily: 'Nunito_900Black', fontSize: 21, color: '#1a1030', lineHeight: 32, marginBottom: 24 },
  optionsList: { gap: 10 },
  optionShadow: {
    borderRadius: 18,
    shadowColor: '#503CB4', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  optionShadowCorrect: { shadowColor: '#10B981', shadowOpacity: 0.2 },
  optionShadowWrong:   { shadowColor: '#EF4444', shadowOpacity: 0.2 },
  option: {
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
  },
  optionSelected: { borderColor: 'rgba(255,255,255,0.12)' },
  optionCorrect:  { borderColor: 'rgba(16,185,129,0.45)' },
  optionWrong:    { borderColor: 'rgba(239,68,68,0.45)' },
  optionPressArea: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  optionKey: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optionKeyDark:    { backgroundColor: 'rgba(255,255,255,0.18)' },
  optionKeyCorrect: { backgroundColor: 'rgba(16,185,129,0.2)' },
  optionKeyWrong:   { backgroundColor: 'rgba(239,68,68,0.2)' },
  optionKeyText:      { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#666' },
  optionKeyTextLight: { color: '#fff' },
  optionText:        { flex: 1, fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#1a1030' },
  optionTextDark:    { color: '#fff' },
  optionTextCorrect: { color: '#10B981' },
  optionTextWrong:   { color: '#EF4444' },

  // Writing / Fill blank
  inputSection: { gap: 14 },
  promptShadow: {
    borderRadius: 18,
    shadowColor: '#503CB4', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  promptCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 18, padding: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
  },
  promptIconWrap: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: 'rgba(123,92,240,0.12)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  promptText: { flex: 1, fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#1a1030', lineHeight: 24 },
  inputShadow: {
    borderRadius: 18,
    shadowColor: '#503CB4', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  textInputCard: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  textInput: {
    fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#1a1030',
    padding: 16, minHeight: 110,
  },

  // Fill blank
  fillCard: { borderRadius: 18, padding: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  fillSentence:      { fontFamily: 'Nunito_800ExtraBold', fontSize: 19, color: '#1a1030', lineHeight: 32 },
  fillBlank:         { color: '#7B5CF0', textDecorationLine: 'underline' },
  fillBlankCorrect:  { color: '#10B981' },
  fillBlankWrong:    { color: '#EF4444' },
  hintText: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#aaa', paddingLeft: 2 },

  // Audio
  audioWrap:        { alignItems: 'center', gap: 24, paddingTop: 8 },
  audioSentenceCard: {
    borderRadius: 20, padding: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
    width: '100%',
  },
  audioSentence: { fontFamily: 'Nunito_900Black', fontSize: 20, color: '#1a1030', textAlign: 'center', lineHeight: 32 },
  audioMicArea:  { alignItems: 'center', justifyContent: 'center', width: 130, height: 130 },
  audioPulse: {
    position: 'absolute', width: 116, height: 116, borderRadius: 58,
    backgroundColor: 'rgba(123,92,240,0.12)',
  },
  audioPulseActive: { backgroundColor: 'rgba(239,68,68,0.15)' },
  audioPulseDone:   { backgroundColor: 'rgba(16,185,129,0.12)' },
  audioMicBtn: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  audioLabel:    { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#1a1030' },
  audioSublabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#aaa' },

  // Bottom
  bottomActions: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8, gap: 8 },
  confirmShadow: {
    borderRadius: 50,
    shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
  },
  confirmBtn:     { borderRadius: 50, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  confirmBtnText: { fontFamily: 'Nunito_900Black', fontSize: 15, color: '#fff', letterSpacing: 2 },
  skipBtn:        { alignItems: 'center', paddingVertical: 6 },
  skipBtnText:    { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#aaa' },

  // Results
  resultsScroll: { paddingHorizontal: 24, paddingBottom: 48 },
  resultsSuper:  { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#888', textAlign: 'center', marginTop: 8 },
  resultsTitle:  { fontFamily: 'Nunito_900Black', fontSize: 26, color: '#1a1030', textAlign: 'center', marginBottom: 4 },
  circleWrap:    { alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  circleInner:   { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  scoreNum:      { fontFamily: 'Nunito_900Black', fontSize: 44 },

  rewardsRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  rewardShadow: {
    flex: 1, borderRadius: 18,
    shadowColor: '#503CB4', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  rewardChip: {
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 12,
    alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.65)',
  },
  rewardVal:   { fontFamily: 'Nunito_900Black', fontSize: 24, color: '#7B5CF0' },
  rewardLabel: { fontFamily: 'Nunito_700Bold', fontSize: 10, color: '#7B5CF0', letterSpacing: 1 },

  summaryLabel: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#888', marginTop: 8, marginBottom: 10 },
  summaryList:  { gap: 8, marginBottom: 28 },
  summaryShadow: {
    borderRadius: 16,
    shadowColor: '#503CB4', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
  },
  summaryIcon:  { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  summaryText:  { flex: 1, fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#1a1030' },
  summaryValue: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#7B5CF0' },

  resultActions: { gap: 10 },
  concludeBtn: {
    borderRadius: 50, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
  },
  concludeBtnText: { fontFamily: 'Nunito_900Black', fontSize: 15, color: '#fff', letterSpacing: 2 },
  reviewBtn: {
    borderRadius: 50, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(123,92,240,0.3)',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  reviewBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#7B5CF0' },
});
