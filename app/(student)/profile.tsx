import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Animated,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Svg, { Defs, LinearGradient as SvgGrad, Stop, Circle as SvgCircle } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@stores/authStore';

const TABS = ['Boletim', 'Troféus', 'Reposições', 'Convênios'];

// ─── Boletim ──────────────────────────────────────────────────────────────────
const GRADES = [
  { subject: 'Listening', score: 8.5, max: 10, color: '#7B5CF0' },
  { subject: 'Speaking',  score: 9.2, max: 10, color: '#10B981' },
  { subject: 'Writing',   score: 7.8, max: 10, color: '#F59E0B' },
];
const ATTENDANCE = { present: 18, total: 22 };

// ─── Troféus ──────────────────────────────────────────────────────────────────
const TROPHIES = [
  { id: 't1', title: '7 Days Streak',    emoji: '🔥', desc: '7 dias seguidos',      unlocked: true  },
  { id: 't2', title: 'Perfect Score',    emoji: '⭐', desc: 'Nota 10 em Writing',   unlocked: true  },
  { id: 't3', title: 'Early Bird',       emoji: '🌅', desc: '5 HWs antes do prazo', unlocked: true  },
  { id: 't4', title: 'Conversation Pro', emoji: '💬', desc: '10 Speaking 9+',       unlocked: false },
  { id: 't5', title: 'Bookworm',         emoji: '📖', desc: 'Complete 1 livro',     unlocked: false },
  { id: 't6', title: 'Champion',         emoji: '🏆', desc: 'Top 3 da turma',       unlocked: false },
];

// ─── Five Points ──────────────────────────────────────────────────────────────
const FP = {
  total: 1250,
  level: 4,
  levelName: 'Explorer',
  current: 250,
  needed: 500,
  streak: 7,
  history: [
    { label: 'Homework enviado',    pts: +30,  time: 'hoje' },
    { label: 'Nota 9+ em Speaking', pts: +50,  time: 'ontem' },
    { label: 'Aula assistida',      pts: +20,  time: 'ontem' },
    { label: '7 Days Streak',       pts: +100, time: '2 dias atrás' },
    { label: 'Homework enviado',    pts: +30,  time: '3 dias atrás' },
  ],
};

// ─── Reposições ───────────────────────────────────────────────────────────────
const SLOTS = [
  { id: 'r1', date: '28/03 — Sáb', time: '09:00', teacher: 'Prof. Marina', available: true  },
  { id: 'r2', date: '29/03 — Dom', time: '10:00', teacher: 'Prof. Carlos', available: true  },
  { id: 'r3', date: '31/03 — Ter', time: '18:30', teacher: 'Prof. Marina', available: false },
];

// ─── Convênios ────────────────────────────────────────────────────────────────
interface Convenio {
  id: string;
  name: string;
  category: string;
  discount: string;
  address: string;
  icon: string;
  color: string;
}

const CONVENIOS: Convenio[] = [
  { id: 'c1', name: 'Farmácia Drogafort',       category: 'Saúde',       discount: '15%', address: 'Rua das Flores, 123',     icon: 'medkit',      color: '#10B981' },
  { id: 'c2', name: 'Academia FitLife',          category: 'Bem-estar',   discount: '20%', address: 'Av. Principal, 456',      icon: 'barbell',     color: '#7B5CF0' },
  { id: 'c3', name: 'Restaurante Sabor & Arte',  category: 'Alimentação', discount: '10%', address: 'Praça Central, 78',       icon: 'restaurant',  color: '#F59E0B' },
  { id: 'c4', name: 'Livraria Cultura Local',    category: 'Educação',    discount: '12%', address: 'Rua do Livro, 55',        icon: 'book',        color: '#3B82F6' },
  { id: 'c5', name: 'Ótica VisionMax',           category: 'Saúde',       discount: '25%', address: 'Shopping Norte, L45',     icon: 'glasses',     color: '#10B981' },
  { id: 'c6', name: 'Studio Photo Click',        category: 'Serviços',    discount: '30%', address: 'Rua das Artes, 89',       icon: 'camera',      color: '#EC4899' },
  { id: 'c7', name: 'Pet Shop Animal Friends',   category: 'Pet',         discount: '18%', address: 'Rua dos Pets, 210',       icon: 'paw',         color: '#F59E0B' },
  { id: 'c8', name: 'Clínica Odonto Smile',      category: 'Saúde',       discount: '20%', address: 'Rua da Saúde, 300',       icon: 'happy',       color: '#06B6D4' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function StudentProfileScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState(() => {
    const t = Number(tab);
    return Number.isFinite(t) && t >= 0 && t < TABS.length ? t : 0;
  });
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    const t = Number(tab);
    if (Number.isFinite(t) && t >= 0 && t < TABS.length) setActiveTab(t);
  }, [tab]);

  // s(0)=ProfileHeader  s(1)=FivePoints  s(2)=Tabs  s(3)=Conteúdo
  const { s } = useStaggeredEntry(4);

  const handleBook = (slotId: string) => {
    setBookedSlots((prev) =>
      prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]
    );
  };

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* ── Header do perfil ── */}
          <Animated.View style={s(0)}>
            <LinearGradient colors={['#7B5CF0', '#4C1D95']} style={styles.profileHeader}>
              <View style={styles.avatarWrap}>
                <Svg width={84} height={84} style={StyleSheet.absoluteFill}>
                  <Defs>
                    <SvgGrad id="r" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#C4B5FD" />
                      <Stop offset="100%" stopColor="#8B5CF6" />
                    </SvgGrad>
                  </Defs>
                  <SvgCircle cx={42} cy={42} r={40} stroke="url(#r)" strokeWidth={3} fill="transparent" />
                </Svg>
                <View style={styles.avatarInner}>
                  <Image
                    source={{ uri: user?.avatarUrl || 'https://i.pravatar.cc/150?img=3' }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                </View>
              </View>
              <Text style={styles.profileName}>{editName || user?.name}</Text>
              <Text style={styles.profileUnit}>{user?.unitName}</Text>
              <View style={styles.headerActions}>
                <Pressable onPress={() => setEditModal(true)} style={styles.editBtn}>
                  <Ionicons name="pencil-outline" size={14} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.editBtnText}>Editar perfil</Text>
                </Pressable>
                <Pressable onPress={logout} style={styles.logoutBtn}>
                  <Ionicons name="log-out-outline" size={14} color="rgba(255,255,255,0.55)" />
                  <Text style={styles.logoutText}>Sair</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Five Points ── */}
          <Animated.View style={s(1)}>
            <View style={styles.fpShadow}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.fpCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.22)', 'transparent', 'rgba(0,0,0,0.06)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  pointerEvents="none"
                />
                <View style={styles.fpTop}>
                  <View style={styles.fpTotalWrap}>
                    <Ionicons name="star" size={20} color="#fff" />
                    <Text style={styles.fpTotal}>{FP.total.toLocaleString('pt-BR')}</Text>
                    <Text style={styles.fpLabel}>Five Points</Text>
                  </View>
                  <View style={styles.fpStreakWrap}>
                    <Text style={styles.fpStreakEmoji}>🔥</Text>
                    <Text style={styles.fpStreakNum}>{FP.streak}</Text>
                    <Text style={styles.fpStreakLabel}>dias</Text>
                  </View>
                </View>
                <View style={styles.fpLevelRow}>
                  <Text style={styles.fpLevelText}>Nível {FP.level} — {FP.levelName}</Text>
                  <Text style={styles.fpNextText}>{FP.needed - FP.current} FP para o próximo</Text>
                </View>
                <View style={styles.fpTrack}>
                  <View style={[styles.fpFill, { width: `${(FP.current / FP.needed) * 100}%` }]} />
                </View>
                <View style={styles.fpHistory}>
                  {FP.history.map((item, i) => (
                    <View key={i} style={styles.fpHistoryRow}>
                      <Text style={styles.fpHistoryLabel} numberOfLines={1}>{item.label}</Text>
                      <Text style={styles.fpHistoryTime}>{item.time}</Text>
                      <Text style={styles.fpHistoryPts}>+{item.pts} FP</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* ── Tabs ── */}
          <Animated.View style={s(2)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabRow}
            >
              {TABS.map((t, i) => (
                <Pressable key={t} onPress={() => setActiveTab(i)} style={[styles.tab, activeTab === i && styles.tabActive]}>
                  <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* ── Conteúdo ── */}
          <Animated.View style={s(3)}>
            <View style={styles.content}>

              {/* Boletim */}
              {activeTab === 0 && (
                <>
                  <BlurView intensity={50} tint="light" style={styles.card}>
                    <Text style={styles.cardTitle}>Frequência</Text>
                    <View style={styles.attendanceRow}>
                      <Text style={styles.attendanceBig}>
                        {Math.round((ATTENDANCE.present / ATTENDANCE.total) * 100)}%
                      </Text>
                      <Text style={styles.attendanceSub}>
                        {ATTENDANCE.present} de {ATTENDANCE.total} aulas
                      </Text>
                    </View>
                  </BlurView>
                  {GRADES.map((g) => (
                    <BlurView key={g.subject} intensity={50} tint="light" style={styles.card}>
                      <View style={styles.gradeRow}>
                        <Text style={styles.gradeSubject}>{g.subject}</Text>
                        <Text style={[styles.gradeScore, { color: g.color }]}>{g.score}</Text>
                      </View>
                      <View style={styles.gradeTrack}>
                        <View style={[styles.gradeFill, { width: `${(g.score / g.max) * 100}%`, backgroundColor: g.color }]} />
                      </View>
                    </BlurView>
                  ))}
                </>
              )}

              {/* Troféus */}
              {activeTab === 1 && (
                <>
                  <View style={styles.trophyStats}>
                    <BlurView intensity={50} tint="light" style={styles.trophyStatCard}>
                      <Text style={styles.trophyStatNum}>{TROPHIES.filter(t => t.unlocked).length}</Text>
                      <Text style={styles.trophyStatLabel}>Conquistados</Text>
                    </BlurView>
                    <BlurView intensity={50} tint="light" style={styles.trophyStatCard}>
                      <Text style={styles.trophyStatNum}>{TROPHIES.filter(t => !t.unlocked).length}</Text>
                      <Text style={styles.trophyStatLabel}>Bloqueados</Text>
                    </BlurView>
                  </View>
                  <View style={styles.trophyGrid}>
                    {TROPHIES.map((t) => (
                      <BlurView
                        key={t.id}
                        intensity={50}
                        tint="light"
                        style={[styles.trophy, !t.unlocked && styles.trophyLocked]}
                      >
                        <Text style={[styles.trophyEmoji, !t.unlocked && { opacity: 0.3 }]}>{t.emoji}</Text>
                        <Text style={[styles.trophyTitle, !t.unlocked && { color: '#bbb' }]}>{t.title}</Text>
                        <Text style={styles.trophyDesc}>{t.desc}</Text>
                        {t.unlocked
                          ? <View style={styles.trophyUnlockedBadge}><Text style={styles.trophyUnlockedText}>✓ Conquistado</Text></View>
                          : <Ionicons name="lock-closed" size={14} color="#ccc" style={{ marginTop: 4 }} />
                        }
                      </BlurView>
                    ))}
                  </View>
                </>
              )}

              {/* Reposições */}
              {activeTab === 2 && (
                <>
                  <BlurView intensity={50} tint="light" style={styles.repoInfoCard}>
                    <Ionicons name="information-circle-outline" size={18} color="#7B5CF0" />
                    <Text style={styles.repoInfoText}>
                      Selecione um horário disponível para agendar sua reposição. Você pode cancelar com até 2h de antecedência.
                    </Text>
                  </BlurView>
                  <Text style={styles.sectionTitle}>Horários disponíveis</Text>
                  {SLOTS.map((slot) => {
                    const booked = bookedSlots.includes(slot.id);
                    return (
                      <BlurView
                        key={slot.id}
                        intensity={50}
                        tint="light"
                        style={[styles.slot, (!slot.available && !booked) && styles.slotUnavail]}
                      >
                        <View style={styles.slotLeft}>
                          <Text style={styles.slotDate}>{slot.date}</Text>
                          <Text style={styles.slotTime}>{slot.time} · {slot.teacher}</Text>
                        </View>
                        <Pressable
                          disabled={!slot.available && !booked}
                          onPress={() => slot.available && handleBook(slot.id)}
                          style={[
                            styles.slotBtn,
                            booked && styles.slotBtnBooked,
                            (!slot.available && !booked) && styles.slotBtnDisabled,
                          ]}
                        >
                          <Text style={styles.slotBtnText}>
                            {booked ? 'Cancelar' : slot.available ? 'Agendar' : 'Lotado'}
                          </Text>
                        </Pressable>
                      </BlurView>
                    );
                  })}
                  {bookedSlots.length > 0 && (
                    <BlurView intensity={50} tint="light" style={styles.bookedBanner}>
                      <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                      <Text style={styles.bookedBannerText}>
                        {bookedSlots.length} reposição{bookedSlots.length > 1 ? 'ões' : ''} agendada{bookedSlots.length > 1 ? 's' : ''}
                      </Text>
                    </BlurView>
                  )}
                </>
              )}

              {/* Convênios */}
              {activeTab === 3 && (
                <>
                  <BlurView intensity={50} tint="light" style={styles.repoInfoCard}>
                    <Ionicons name="pricetag-outline" size={18} color="#7B5CF0" />
                    <Text style={styles.repoInfoText}>
                      Parceiros exclusivos da Five Idiomas. Apresente seu app na hora do atendimento para garantir o desconto.
                    </Text>
                  </BlurView>
                  {CONVENIOS.map((conv) => (
                    <BlurView key={conv.id} intensity={50} tint="light" style={styles.convenioCard}>
                      <View style={[styles.convenioIconWrap, { backgroundColor: conv.color + '18' }]}>
                        <Ionicons name={conv.icon as any} size={22} color={conv.color} />
                      </View>
                      <View style={styles.convenioInfo}>
                        <Text style={styles.convenioName}>{conv.name}</Text>
                        <Text style={styles.convenioCategory}>{conv.category}</Text>
                        <View style={styles.convenioAddressRow}>
                          <Ionicons name="location-outline" size={12} color="#999" />
                          <Text style={styles.convenioAddress}>{conv.address}</Text>
                        </View>
                      </View>
                      <View style={[styles.convenioBadge, { backgroundColor: conv.color + '18', borderColor: conv.color + '40' }]}>
                        <Text style={[styles.convenioBadgeText, { color: conv.color }]}>{conv.discount}</Text>
                        <Text style={[styles.convenioBadgeSub, { color: conv.color }]}>OFF</Text>
                      </View>
                    </BlurView>
                  ))}
                </>
              )}

            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Modal Editar Perfil ── */}
      <Modal visible={editModal} transparent animationType="slide" onRequestClose={() => setEditModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setEditModal(false)} />
          <BlurView intensity={80} tint="light" style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <Text style={styles.modalLabel}>Nome</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Seu nome completo"
              placeholderTextColor="#bbb"
              autoFocus
            />

            <Text style={styles.modalLabel}>E-mail</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputDisabled]}
              value={user?.email ?? 'aluno@fiveapp.com.br'}
              editable={false}
              placeholderTextColor="#bbb"
            />
            <Text style={styles.modalHint}>O e-mail só pode ser alterado pelo suporte.</Text>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setEditModal(false)} style={styles.modalBtnCancel}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={() => setEditModal(false)}
                style={styles.modalBtnSave}
              >
                <LinearGradient colors={['#9B6DFF', '#7B3FF6']} style={styles.modalBtnSaveGrad}>
                  <Text style={styles.modalBtnSaveText}>Salvar</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },

  // ── Header ──
  profileHeader: { alignItems: 'center', paddingTop: 24, paddingBottom: 28, gap: 6 },
  avatarWrap: { width: 84, height: 84, position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarInner: { width: 74, height: 74, borderRadius: 37, overflow: 'hidden', borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' },
  profileName: { fontFamily: 'Nunito_900Black', fontSize: 20, color: '#fff' },
  profileUnit: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  headerActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 50 },
  editBtnText: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.6 },
  logoutText: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: 'rgba(255,255,255,0.6)' },

  // ── Five Points ──
  fpShadow: { marginHorizontal: 16, marginBottom: 4, borderRadius: 22, shadowColor: '#D97706', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  fpCard: { borderRadius: 22, padding: 18, gap: 12, overflow: 'hidden' },
  fpTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fpTotalWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fpTotal: { fontFamily: 'Nunito_900Black', fontSize: 28, color: '#fff' },
  fpLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  fpStreakWrap: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  fpStreakEmoji: { fontSize: 20 },
  fpStreakNum: { fontFamily: 'Nunito_900Black', fontSize: 20, color: '#fff', lineHeight: 24 },
  fpStreakLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  fpLevelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fpLevelText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#fff' },
  fpNextText: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  fpTrack: { height: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 99, overflow: 'hidden' },
  fpFill: { height: '100%', backgroundColor: '#fff', borderRadius: 99 },
  fpHistory: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12, gap: 8 },
  fpHistoryRow: { flexDirection: 'row', alignItems: 'center' },
  fpHistoryLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: 'rgba(255,255,255,0.85)', flex: 1 },
  fpHistoryTime: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginRight: 10 },
  fpHistoryPts: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: '#fff' },

  // ── Tabs ──
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  tab: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 50, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  tabActive: { backgroundColor: '#1a1030' },
  tabText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#888' },
  tabTextActive: { color: '#fff' },

  // ── Content ──
  content: { paddingHorizontal: 16, gap: 12 },
  card: { borderRadius: 18, padding: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', gap: 10 },
  cardTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#7B5CF0' },

  // Boletim
  attendanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  attendanceBig: { fontFamily: 'Nunito_900Black', fontSize: 36, color: '#1a1030' },
  attendanceSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#888' },
  gradeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gradeSubject: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#1a1030' },
  gradeScore: { fontFamily: 'Nunito_900Black', fontSize: 22 },
  gradeTrack: { height: 8, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' },
  gradeFill: { height: '100%', borderRadius: 99 },

  // Troféus
  trophyStats: { flexDirection: 'row', gap: 10 },
  trophyStatCard: { flex: 1, borderRadius: 16, padding: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', alignItems: 'center', gap: 2 },
  trophyStatNum: { fontFamily: 'Nunito_900Black', fontSize: 28, color: '#1a1030' },
  trophyStatLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  trophyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trophy: { width: '47%', borderRadius: 18, padding: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', alignItems: 'center', gap: 4 },
  trophyLocked: { opacity: 0.7 },
  trophyEmoji: { fontSize: 32 },
  trophyTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#1a1030', textAlign: 'center' },
  trophyDesc: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888', textAlign: 'center' },
  trophyUnlockedBadge: { backgroundColor: 'rgba(16,185,129,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50, marginTop: 4 },
  trophyUnlockedText: { fontFamily: 'Nunito_700Bold', fontSize: 10, color: '#10B981' },

  // Reposições
  repoInfoCard: { borderRadius: 14, padding: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  repoInfoText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#555', flex: 1, lineHeight: 18 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#1a1030' },
  slot: { borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  slotUnavail: { opacity: 0.6 },
  slotLeft: { gap: 2 },
  slotDate: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#1a1030' },
  slotTime: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  slotBtn: { backgroundColor: '#7B5CF0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50 },
  slotBtnBooked: { backgroundColor: '#EF4444' },
  slotBtnDisabled: { backgroundColor: '#ccc' },
  slotBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff' },
  bookedBanner: { borderRadius: 14, padding: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', flexDirection: 'row', gap: 8, alignItems: 'center' },
  bookedBannerText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#10B981' },

  // Convênios
  convenioCard: { borderRadius: 18, padding: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  convenioIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  convenioInfo: { flex: 1, gap: 2 },
  convenioName: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#1a1030' },
  convenioCategory: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  convenioAddressRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  convenioAddress: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa' },
  convenioBadge: { alignItems: 'center', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, flexShrink: 0 },
  convenioBadgeText: { fontFamily: 'Nunito_900Black', fontSize: 16, lineHeight: 18 },
  convenioBadgeSub: { fontFamily: 'Nunito_700Bold', fontSize: 9 },

  // ── Modal ──
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    gap: 12,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'center', marginBottom: 8 },
  modalTitle: { fontFamily: 'Nunito_900Black', fontSize: 20, color: '#1a1030' },
  modalLabel: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#555' },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#1a1030',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  modalInputDisabled: { opacity: 0.5 },
  modalHint: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa', marginTop: -6 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalBtnCancel: { flex: 1, paddingVertical: 14, borderRadius: 50, backgroundColor: 'rgba(0,0,0,0.06)', alignItems: 'center' },
  modalBtnCancelText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#555' },
  modalBtnSave: { flex: 1, borderRadius: 50, overflow: 'hidden' },
  modalBtnSaveGrad: { paddingVertical: 14, alignItems: 'center' },
  modalBtnSaveText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#fff' },
});
