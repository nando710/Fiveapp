import { useState, useCallback, useRef } from 'react';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { useAuthStore } from '@stores/authStore';
import { useUiStore } from '@stores/uiStore';
import {
  SearchBar,
  UserHeader,
  StoriesRow,
  StoryViewer,
  CameraPanel,
  ProgressCard,
  TabSwitcher,
  MenuCard,
  HomeworksMascot,
  AiMascot,
  ReposicoesMascot,
  NotasMascot,
  ArMascot,
  ListenMascot,
} from '@components/features/student';
import type { Story } from '@components/features/student';

const { width: W } = Dimensions.get('window');
const SWIPE_THRESHOLD = W * 0.35;
const VELOCITY_THRESHOLD = 0.6;

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STORIES: Story[] = [
  { id: 'me',  name: 'Você',         uri: 'https://i.pravatar.cc/150?img=3',  isMe: true },
  { id: 's2',  name: 'Prof. Marina', uri: 'https://i.pravatar.cc/150?img=5',  hasNew: true },
  { id: 's3',  name: 'Lucas A.',     uri: 'https://i.pravatar.cc/150?img=10', hasNew: true },
  { id: 's4',  name: 'Ana C.',       uri: 'https://i.pravatar.cc/150?img=20', hasNew: false },
  { id: 's5',  name: 'Pedro S.',     uri: 'https://i.pravatar.cc/150?img=15', hasNew: true },
  { id: 's6',  name: 'Julia M.',     uri: 'https://i.pravatar.cc/150?img=25', hasNew: false },
];

const TABS = ['Módulos', 'Turma'];

// ─── Ranking ──────────────────────────────────────────────────────────────────
interface RankEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  isMe?: boolean;
}

const RANK_UNIT: RankEntry[] = [
  { id: 'u1', name: 'Lucas A.',   avatar: 'https://i.pravatar.cc/150?img=10', points: 1850, isMe: true },
  { id: 'u2', name: 'Ana C.',     avatar: 'https://i.pravatar.cc/150?img=20', points: 1720 },
  { id: 'u3', name: 'Pedro S.',   avatar: 'https://i.pravatar.cc/150?img=15', points: 1540 },
  { id: 'u4', name: 'Julia M.',   avatar: 'https://i.pravatar.cc/150?img=25', points: 1320 },
  { id: 'u5', name: 'Marcos T.',  avatar: 'https://i.pravatar.cc/150?img=30', points: 1180 },
];

const RANK_REDE: RankEntry[] = [
  { id: 'r1', name: 'Camila R.',  avatar: 'https://i.pravatar.cc/150?img=47', points: 3920 },
  { id: 'r2', name: 'Rafael B.',  avatar: 'https://i.pravatar.cc/150?img=52', points: 3750 },
  { id: 'r3', name: 'Isabella N.',avatar: 'https://i.pravatar.cc/150?img=44', points: 3480 },
  { id: 'r4', name: 'Lucas A.',   avatar: 'https://i.pravatar.cc/150?img=10', points: 1850, isMe: true },
  { id: 'r5', name: 'Beatriz F.', avatar: 'https://i.pravatar.cc/150?img=32', points: 1790 },
];

const MEDAL = ['#F59E0B', '#94A3B8', '#CD7F32'];

type RecadoCategory = 'turma' | 'escola' | 'five';

interface Recado {
  id: string;
  category: RecadoCategory;
  author: string;
  role: string;
  message: string;
  time: string;
  icon: string;
}

const CATEGORY_META: Record<RecadoCategory, { label: string; color: string; bg: string }> = {
  turma:  { label: 'Turma',  color: '#7B5CF0', bg: 'rgba(123,92,240,0.12)' },
  escola: { label: 'Escola', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  five:   { label: 'Five',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
};

const MOCK_RECADOS: Recado[] = [
  {
    id: 'r1',
    category: 'five',
    author: 'Five App',
    role: 'Novidade',
    message: '🎉 O módulo de Realidade Aumentada está quase pronto! Em breve você poderá explorar vocabulário em 3D direto pelo app.',
    time: 'agora',
    icon: 'sparkles',
  },
  {
    id: 'r2',
    category: 'turma',
    author: 'Prof. Marina',
    role: 'Professora · Book 3',
    message: 'Lembrete: a aula de reposição da semana passada está disponível para agendamento. Aproveitem os horários antes que lotem! 📅',
    time: '2h atrás',
    icon: 'person-circle',
  },
  {
    id: 'r3',
    category: 'escola',
    author: 'Five Idiomas',
    role: 'Comunicado Geral',
    message: 'Feriado na próxima segunda-feira (31/03). Não haverá aulas presenciais. As aulas online seguem normalmente. Bons estudos! 🏫',
    time: '5h atrás',
    icon: 'business',
  },
  {
    id: 'r4',
    category: 'turma',
    author: 'Prof. Carlos',
    role: 'Professor · Book 3',
    message: 'Pessoal, o homework de Writing da Unit 2 foi corrigido! Confiram as notas no perfil. Quem quiser feedback adicional é só falar. ✍️',
    time: 'ontem',
    icon: 'person-circle',
  },
  {
    id: 'r5',
    category: 'five',
    author: 'Five App',
    role: 'Dica do dia',
    message: '💡 Sabia que ouvir áudio por 10 minutos por dia acelera em até 40% a absorção de vocabulário? Experimente o módulo Listen hoje!',
    time: 'ontem',
    icon: 'bulb',
  },
  {
    id: 'r6',
    category: 'escola',
    author: 'Five Idiomas',
    role: 'Evento',
    message: 'English Day em 12/04! Venha praticar conversação com alunos de todas as turmas em um ambiente descontraído. Inscrições em breve. 🌎',
    time: '2 dias atrás',
    icon: 'calendar',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function StudentHomeScreen() {
  const user = useAuthStore((s) => s.user);
  const setCameraOpen = useUiStore((s) => s.setCameraOpen);
  const [activeTab, setActiveTab] = useState(0);
  const [rankTab, setRankTab] = useState<'unidade' | 'rede'>('unidade');
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [cameraOpen, setCameraOpenLocal] = useState(false);

  // slideX: 0 = home visível | W = câmera visível
  const slideX = useRef(new Animated.Value(0)).current;
  const cameraOpenRef = useRef(false);

  const openCamera = useCallback(() => {
    setCameraOpenLocal(true);
    setCameraOpen(true);
    cameraOpenRef.current = true;
    Animated.spring(slideX, {
      toValue: W,
      useNativeDriver: true,
      tension: 80,
      friction: 14,
    }).start();
  }, [slideX, setCameraOpen]);

  const closeCamera = useCallback(() => {
    Animated.spring(slideX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 14,
    }).start(() => {
      setCameraOpenLocal(false);
      setCameraOpen(false);
      cameraOpenRef.current = false;
    });
  }, [slideX, setCameraOpen]);

  const panResponder = useRef(
    PanResponder.create({
      // Captura apenas gestos claramente horizontais
      onMoveShouldSetPanResponder: (_, { dx, dy }) => {
        if (cameraOpenRef.current) {
          // câmera aberta: captura swipe para esquerda
          return dx < -12 && Math.abs(dx) > Math.abs(dy) * 1.5;
        }
        // home visível: captura swipe para direita
        return dx > 12 && Math.abs(dx) > Math.abs(dy) * 1.5;
      },
      onPanResponderMove: (_, { dx }) => {
        const base = cameraOpenRef.current ? W : 0;
        const next = Math.max(0, Math.min(W, base + dx));
        slideX.setValue(next);
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        const base = cameraOpenRef.current ? W : 0;
        const finalX = base + dx;

        if (!cameraOpenRef.current) {
          if (finalX > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
            openCamera();
          } else {
            Animated.spring(slideX, { toValue: 0, useNativeDriver: true, tension: 100, friction: 16 }).start();
          }
        } else {
          if (finalX < W - SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
            closeCamera();
          } else {
            Animated.spring(slideX, { toValue: W, useNativeDriver: true, tension: 100, friction: 16 }).start();
          }
        }
      },
    })
  ).current;

  // s(0)=SearchBar s(1)=UserHeader s(2)=Stories s(3)=Progress s(4)=Tabs s(5)=Cards s(6)=Ranking
  const { s } = useStaggeredEntry(7);

  const handleStoryPress = useCallback((story: Story) => {
    const idx = MOCK_STORIES.findIndex((s) => s.id === story.id);
    setViewerIndex(idx >= 0 ? idx : 0);
    setViewerVisible(true);
  }, []);

  // Câmera: translateX vai de -W (fora à esquerda) até 0 (visível)
  const cameraTranslate = slideX.interpolate({
    inputRange: [0, W],
    outputRange: [-W, 0],
  });

  // Home: translateX vai de 0 (visível) até W (fora à direita)
  const homeTranslate = slideX.interpolate({
    inputRange: [0, W],
    outputRange: [0, W],
  });

  // Escurece home conforme câmera aparece
  const homeOverlayOpacity = slideX.interpolate({
    inputRange: [0, W],
    outputRange: [0, 0.45],
  });

  return (
    <View style={styles.root} {...panResponder.panHandlers}>
      <StatusBar style="dark" />

      {/* ── Painel da câmera (esquerda) ── */}
      <Animated.View style={[styles.panel, { transform: [{ translateX: cameraTranslate }] }]}>
        {(cameraOpen || true) && (
          <CameraPanel onClose={closeCamera} />
        )}
      </Animated.View>

      {/* ── Painel da home (direita) ── */}
      <Animated.View style={[styles.panel, { transform: [{ translateX: homeTranslate }] }]}>
        <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
          <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
              scrollEventThrottle={16}
            >
              <Animated.View style={s(0)}><SearchBar /></Animated.View>
              <Animated.View style={s(1)}>
                <UserHeader
                  name={user?.name?.split(' ')[0] ?? 'Aluno'}
                  avatarUri={user?.avatarUrl}
                  subtitle={user?.unitName}
                  points={1250}
                />
              </Animated.View>

              <Animated.View style={s(2)}>
                <StoriesRow stories={MOCK_STORIES} onStoryPress={handleStoryPress} />
              </Animated.View>

              <View style={styles.content}>
                <Animated.View style={s(3)}>
                  <ProgressCard
                    step={3}
                    current={7}
                    total={12}
                    title="Book 3 — Unit 2 · Lesson 7"
                  />
                </Animated.View>

                <Animated.View style={s(4)}>
                  <TabSwitcher tabs={TABS} active={activeTab} onChange={setActiveTab} />
                </Animated.View>

                {activeTab === 0 ? (
                  <Animated.View style={[styles.cardsGrid, s(5)]}>
                    <View style={styles.cardRow}>
                      <MenuCard
                        label="Homeworks"
                        gradient={['#4a9e50', '#1a4d20']}
                        mascot={<HomeworksMascot size={85} />}
                        onPress={() => router.push('/(student)/homeworks')}
                      />
                      <MenuCard
                        label="Five AI"
                        gradient={['#6a3fa3', '#2a0a60']}
                        mascot={<AiMascot size={85} />}
                        onPress={() => router.push('/(student)/ai')}
                      />
                    </View>
                    <View style={styles.cardRow}>
                      <MenuCard
                        label="Reposições"
                        gradient={['#388E3C', '#1B5E20']}
                        mascot={<ReposicoesMascot size={85} />}
                        onPress={() => router.push('/(student)/profile?tab=2')}
                      />
                      <MenuCard
                        label="Notas"
                        gradient={['#1565C0', '#062a6e']}
                        mascot={<NotasMascot size={85} />}
                        onPress={() => router.push('/(student)/profile?tab=0')}
                      />
                    </View>
                    <View style={styles.cardRow}>
                      <MenuCard
                        label="Listen"
                        gradient={['#C2185B', '#880E4F']}
                        mascot={<ListenMascot size={85} />}
                        onPress={() => router.push('/(student)/listen')}
                      />
                      <MenuCard
                        label="Realidade Aumentada"
                        gradient={['#00897B', '#004D40']}
                        mascot={<ArMascot size={85} />}
                        onPress={() => router.push('/(student)/ar')}
                      />
                    </View>
                  </Animated.View>
                ) : (
                  <View style={styles.recadosList}>
                    {MOCK_RECADOS.map((recado) => {
                      const meta = CATEGORY_META[recado.category];
                      return (
                        <BlurView key={recado.id} intensity={50} tint="light" style={styles.recadoCard}>
                          {/* Header */}
                          <View style={styles.recadoHeader}>
                            <View style={[styles.recadoIconWrap, { backgroundColor: meta.bg }]}>
                              <Ionicons name={recado.icon as any} size={18} color={meta.color} />
                            </View>
                            <View style={styles.recadoAuthorWrap}>
                              <Text style={styles.recadoAuthor}>{recado.author}</Text>
                              <Text style={styles.recadoRole}>{recado.role}</Text>
                            </View>
                            <View style={styles.recadoMeta}>
                              <View style={[styles.recadoBadge, { backgroundColor: meta.bg }]}>
                                <Text style={[styles.recadoBadgeText, { color: meta.color }]}>{meta.label}</Text>
                              </View>
                              <Text style={styles.recadoTime}>{recado.time}</Text>
                            </View>
                          </View>
                          {/* Mensagem */}
                          <Text style={styles.recadoMsg}>{recado.message}</Text>
                        </BlurView>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* ── Ranking ── */}
              <Animated.View style={[styles.rankingSection, s(6)]}>
                {/* Header */}
                <View style={styles.rankingHeader}>
                  <Text style={styles.rankingTitle}>Ranking</Text>
                  <View style={styles.rankingTabs}>
                    {(['unidade', 'rede'] as const).map((t) => (
                      <Pressable
                        key={t}
                        onPress={() => setRankTab(t)}
                        style={[styles.rankingTab, rankTab === t && styles.rankingTabActive]}
                      >
                        <Text style={[styles.rankingTabText, rankTab === t && styles.rankingTabTextActive]}>
                          {t === 'unidade' ? 'Unidade' : 'Rede'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Pódio top-3 */}
                {(() => {
                  const list = rankTab === 'unidade' ? RANK_UNIT : RANK_REDE;
                  const top3 = list.slice(0, 3);
                  const rest = list.slice(3);
                  return (
                    <>
                      <BlurView intensity={50} tint="light" style={styles.podiumCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.18)', 'transparent']}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        pointerEvents="none"
                      />
                      <View style={styles.podium}>
                        {/* 2nd */}
                        <View style={[styles.podiumItem, styles.podiumSide]}>
                          <View style={[styles.podiumAvatarWrap, { borderColor: MEDAL[1] }]}>
                            <Image source={{ uri: top3[1]?.avatar }} style={styles.podiumAvatar} contentFit="cover" />
                          </View>
                          <View style={[styles.podiumMedal, { backgroundColor: MEDAL[1] }]}>
                            <Text style={styles.podiumMedalText}>2</Text>
                          </View>
                          <Text style={styles.podiumName} numberOfLines={1}>{top3[1]?.name}</Text>
                          <Text style={styles.podiumPts}>{top3[1]?.points.toLocaleString('pt-BR')} FP</Text>
                          <View style={[styles.podiumPillar, { height: 56, backgroundColor: MEDAL[1] + '55' }]} />
                        </View>
                        {/* 1st */}
                        <View style={[styles.podiumItem, styles.podiumCenter]}>
                          <View style={[styles.podiumAvatarWrap, styles.podiumAvatarLg, { borderColor: MEDAL[0] }]}>
                            <Image source={{ uri: top3[0]?.avatar }} style={styles.podiumAvatar} contentFit="cover" />
                          </View>
                          <View style={[styles.podiumMedal, { backgroundColor: MEDAL[0] }]}>
                            <Text style={styles.podiumMedalText}>1</Text>
                          </View>
                          <Text style={[styles.podiumName, { fontFamily: 'Nunito_900Black' }]} numberOfLines={1}>{top3[0]?.name}</Text>
                          <Text style={[styles.podiumPts, { color: MEDAL[0] }]}>{top3[0]?.points.toLocaleString('pt-BR')} FP</Text>
                          <View style={[styles.podiumPillar, { height: 80, backgroundColor: MEDAL[0] + '44' }]} />
                        </View>
                        {/* 3rd */}
                        <View style={[styles.podiumItem, styles.podiumSide]}>
                          <View style={[styles.podiumAvatarWrap, { borderColor: MEDAL[2] }]}>
                            <Image source={{ uri: top3[2]?.avatar }} style={styles.podiumAvatar} contentFit="cover" />
                          </View>
                          <View style={[styles.podiumMedal, { backgroundColor: MEDAL[2] }]}>
                            <Text style={styles.podiumMedalText}>3</Text>
                          </View>
                          <Text style={styles.podiumName} numberOfLines={1}>{top3[2]?.name}</Text>
                          <Text style={styles.podiumPts}>{top3[2]?.points.toLocaleString('pt-BR')} FP</Text>
                          <View style={[styles.podiumPillar, { height: 40, backgroundColor: MEDAL[2] + '55' }]} />
                        </View>
                      </View>
                      </BlurView>

                      {/* Restante */}
                      {rest.map((entry, i) => (
                        <View key={entry.id} style={[styles.rankShadowWrap, entry.isMe && styles.rankShadowWrapMe]}>
                        <BlurView
                          intensity={50}
                          tint="light"
                          style={[styles.rankRow, entry.isMe && styles.rankRowMe]}
                        >
                          <Text style={styles.rankPos}>{i + 4}</Text>
                          <Image source={{ uri: entry.avatar }} style={styles.rankAvatar} contentFit="cover" />
                          <Text style={[styles.rankName, entry.isMe && styles.rankNameMe]} numberOfLines={1}>
                            {entry.name}{entry.isMe ? ' (você)' : ''}
                          </Text>
                          <Text style={[styles.rankPts, entry.isMe && styles.rankPtsMe]}>
                            {entry.points.toLocaleString('pt-BR')} FP
                          </Text>
                        </BlurView>
                        </View>
                      ))}
                    </>
                  );
                })()}
              </Animated.View>

            </ScrollView>
          </SafeAreaView>
        </LinearGradient>

        {/* Overlay escuro ao abrir câmera */}
        <Animated.View
          style={[styles.homeOverlay, { opacity: homeOverlayOpacity }]}
          pointerEvents="none"
        />
      </Animated.View>

      {/* Story viewer (modal) */}
      <StoryViewer
        stories={MOCK_STORIES}
        initialIndex={viewerIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  panel: { ...StyleSheet.absoluteFillObject },
  bg:   { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 110 },
  content: { paddingHorizontal: 16, gap: 14 },
  cardsGrid: { gap: 13 },
  cardRow: { flexDirection: 'row', gap: 13 },

  homeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },

  recadosList: { gap: 12 },
  recadoCard: {
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: 10,
  },
  recadoHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recadoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recadoAuthorWrap: { flex: 1 },
  recadoAuthor: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#1a1030' },
  recadoRole:   { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888', marginTop: 1 },
  recadoMeta:   { alignItems: 'flex-end', gap: 4 },
  recadoBadge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
  recadoBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 10 },
  recadoTime:   { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: '#bbb' },
  recadoMsg:    { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#444', lineHeight: 20 },

  // ── Ranking ──
  rankingSection: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  rankingHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rankingTitle:   { fontFamily: 'Nunito_900Black', fontSize: 20, color: '#1a1030' },
  rankingTabs:    { flexDirection: 'row', gap: 6 },
  rankingTab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
  },
  rankingTabActive:     { backgroundColor: '#1a1030', borderColor: '#1a1030' },
  rankingTabText:       { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#888' },
  rankingTabTextActive: { color: '#fff' },

  podiumCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#503CB4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
    marginBottom: 4,
  },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 8 },
  podiumItem:   { alignItems: 'center', flex: 1, gap: 4 },
  podiumSide:   { paddingBottom: 0 },
  podiumCenter: { paddingBottom: 0 },

  podiumAvatarWrap: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2.5, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  podiumAvatarLg: { width: 66, height: 66, borderRadius: 33 },
  podiumAvatar:   { width: '100%', height: '100%' },
  podiumMedal: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', marginTop: -10,
  },
  podiumMedalText: { fontFamily: 'Nunito_900Black', fontSize: 11, color: '#fff' },
  podiumName: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#1a1030', textAlign: 'center' },
  podiumPts:  { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888' },
  podiumPillar: { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },

  rankShadowWrap: {
    borderRadius: 16,
    shadowColor: '#503CB4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  rankShadowWrapMe: {
    shadowColor: '#7B5CF0',
    shadowOpacity: 0.18,
    elevation: 5,
  },
  rankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, padding: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
  },
  rankRowMe: { borderColor: '#7B5CF0', borderWidth: 1.5 },
  rankPos:   { fontFamily: 'Nunito_900Black', fontSize: 16, color: '#bbb', width: 24, textAlign: 'center' },
  rankAvatar:{ width: 40, height: 40, borderRadius: 20 },
  rankName:  { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#1a1030', flex: 1 },
  rankNameMe:{ color: '#7B5CF0' },
  rankPts:   { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#888' },
  rankPtsMe: { color: '#7B5CF0' },
});
