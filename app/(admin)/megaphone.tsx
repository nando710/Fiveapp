import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  title: string;
  message: string;
  status: 'scheduled' | 'sent';
  scheduledDate: string;
  targetCount: number;
  opens: number;
}

interface GamificationRule {
  action: string;
  points: number;
}

type CampaignFilter = 'all' | 'scheduled' | 'sent';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  { id: 'c1', title: 'English Day Nacional — Abril', message: 'Participe do English Day em todas as unidades Five! Atividades de conversação, jogos e prêmios.', status: 'scheduled', scheduledDate: '01/04/2026', targetCount: 3420, opens: 0 },
  { id: 'c2', title: 'Matrículas Abertas 2026.2', message: 'Indique um amigo e ganhe 1 mês grátis! Vagas limitadas para o segundo semestre.', status: 'sent', scheduledDate: '20/03/2026', targetCount: 3420, opens: 2890 },
  { id: 'c3', title: 'Atualização do App v2.0', message: 'Nova versão do Five App disponível! Módulo de AR e Listen completamente redesenhados.', status: 'sent', scheduledDate: '15/03/2026', targetCount: 3420, opens: 3100 },
  { id: 'c4', title: 'Carnaval — Horário especial', message: 'Durante o carnaval as aulas presenciais serão suspensas. Aulas online mantidas.', status: 'sent', scheduledDate: '28/02/2026', targetCount: 3420, opens: 3200 },
];

const AI_CONFIG = {
  prompt: 'Você é um tutor de inglês socrático. Nunca dê respostas prontas. Guie o raciocínio do aluno com perguntas. Use exemplos do cotidiano.',
  lastUpdate: '20/03/2026',
};

const GAMIFICATION_RULES: GamificationRule[] = [
  { action: 'Homework entregue', points: 30 },
  { action: 'Nota ≥ 9 em Speaking', points: 50 },
  { action: 'Aula assistida', points: 20 },
  { action: 'Streak de 7 dias', points: 100 },
  { action: 'Nota 10 em qualquer skill', points: 75 },
];

const FILTER_OPTIONS: { key: CampaignFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'scheduled', label: 'Agendadas' },
  { key: 'sent', label: 'Enviadas' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MegaphoneScreen() {
  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>('all');
  const { s } = useStaggeredEntry(4);

  const filtered = CAMPAIGNS.filter((c) => {
    if (campaignFilter === 'all') return true;
    return c.status === campaignFilter;
  });

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
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Megafone</Text>
              <View style={styles.reachBadge}>
                <Ionicons name="megaphone-outline" size={14} color="#7B5CF0" />
                <Text style={styles.reachBadgeText}>Alcance: 3.420 alunos</Text>
              </View>
            </View>
          </Animated.View>

          {/* ── New Campaign Button ── */}
          <Animated.View style={s(1)}>
            <Pressable style={styles.newCampaignShadow}>
              <LinearGradient
                colors={['#7B5CF0', '#4C1D95']}
                style={styles.newCampaignBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.18)', 'transparent', 'rgba(0,0,0,0.08)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  pointerEvents="none"
                />
                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                <Text style={styles.newCampaignText}>Nova Campanha</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* ── Campaigns List ── */}
          <Animated.View style={s(2)}>
            <Text style={styles.sectionTitle}>Campanhas</Text>

            {/* Filter tabs */}
            <View style={styles.filterRow}>
              {FILTER_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setCampaignFilter(opt.key)}
                  style={[
                    styles.filterTab,
                    campaignFilter === opt.key && styles.filterTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      campaignFilter === opt.key && styles.filterTabTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {filtered.map((campaign) => {
              const isSent = campaign.status === 'sent';
              const openRate = isSent
                ? Math.round((campaign.opens / campaign.targetCount) * 100)
                : 0;
              return (
                <View key={campaign.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.campaignCard}>
                    {/* Title + status */}
                    <View style={styles.campaignTopRow}>
                      <Text style={styles.campaignTitle} numberOfLines={1}>
                        {campaign.title}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isSent
                              ? 'rgba(16,185,129,0.12)'
                              : 'rgba(245,158,11,0.12)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: isSent ? '#10B981' : '#F59E0B' },
                          ]}
                        >
                          {isSent ? 'Enviada' : 'Agendada'}
                        </Text>
                      </View>
                    </View>

                    {/* Message preview */}
                    <Text style={styles.campaignMessage} numberOfLines={2}>
                      {campaign.message}
                    </Text>

                    {/* Stats row */}
                    <View style={styles.campaignStatsRow}>
                      <View style={styles.campaignStat}>
                        <Ionicons name="people-outline" size={14} color="#7B5CF0" />
                        <Text style={styles.campaignStatText}>
                          {campaign.targetCount.toLocaleString('pt-BR')}
                        </Text>
                      </View>
                      {isSent && (
                        <>
                          <View style={styles.statDivider} />
                          <View style={styles.campaignStat}>
                            <Ionicons name="open-outline" size={14} color="#10B981" />
                            <Text style={styles.campaignStatText}>
                              {openRate}% abertos
                            </Text>
                          </View>
                        </>
                      )}
                      <View style={styles.statDivider} />
                      <View style={styles.campaignStat}>
                        <Ionicons name="calendar-outline" size={14} color="#888" />
                        <Text style={styles.campaignStatDate}>
                          {campaign.scheduledDate}
                        </Text>
                      </View>
                    </View>

                    {/* Cancel button for scheduled */}
                    {!isSent && (
                      <Pressable style={styles.cancelBtn}>
                        <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                      </Pressable>
                    )}
                  </BlurView>
                </View>
              );
            })}
          </Animated.View>

          {/* ── Guardião do Método ── */}
          <Animated.View style={s(3)}>
            <Text style={styles.sectionTitle}>Guardião do Método</Text>

            {/* AI Prompt Card */}
            <View style={styles.cardShadow}>
              <BlurView intensity={50} tint="light" style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <View style={styles.promptIconWrap}>
                    <Ionicons name="sparkles-outline" size={20} color="#7B5CF0" />
                  </View>
                  <View style={styles.promptHeaderInfo}>
                    <Text style={styles.promptLabel}>Prompt da IA</Text>
                    <Text style={styles.promptLastUpdate}>
                      Atualizado em {AI_CONFIG.lastUpdate}
                    </Text>
                  </View>
                </View>
                <Text style={styles.promptText}>{AI_CONFIG.prompt}</Text>
                <Pressable style={styles.editBtn}>
                  <Ionicons name="create-outline" size={16} color="#7B5CF0" />
                  <Text style={styles.editBtnText}>Editar Prompt</Text>
                </Pressable>
              </BlurView>
            </View>

            {/* Gamification Rules Card */}
            <View style={styles.cardShadow}>
              <BlurView intensity={50} tint="light" style={styles.rulesCard}>
                <View style={styles.rulesHeader}>
                  <View style={styles.promptIconWrap}>
                    <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.rulesLabel}>Regras de Gamificação</Text>
                </View>

                {GAMIFICATION_RULES.map((rule, index) => (
                  <View
                    key={index}
                    style={[
                      styles.ruleRow,
                      index < GAMIFICATION_RULES.length - 1 && styles.ruleRowBorder,
                    ]}
                  >
                    <Text style={styles.ruleAction}>{rule.action}</Text>
                    <View style={styles.pointsBadge}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.pointsText}>{rule.points} pts</Text>
                    </View>
                  </View>
                ))}

                <Pressable style={styles.editBtn}>
                  <Ionicons name="create-outline" size={16} color="#7B5CF0" />
                  <Text style={styles.editBtnText}>Editar Regras</Text>
                </Pressable>
              </BlurView>
            </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 24,
    color: '#1a1030',
  },
  reachBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(123,92,240,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reachBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#7B5CF0',
  },

  // New Campaign
  newCampaignShadow: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  newCampaignBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  newCampaignText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#fff',
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

  // Filter tabs
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  filterTabActive: {
    backgroundColor: '#7B5CF0',
    borderColor: '#7B5CF0',
  },
  filterTabText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#888',
  },
  filterTabTextActive: {
    color: '#fff',
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

  // Campaign card
  campaignCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
    gap: 10,
  },
  campaignTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  campaignTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },
  campaignMessage: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#888',
    lineHeight: 19,
  },
  campaignStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  campaignStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  campaignStatText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#1a1030',
  },
  campaignStatDate: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  cancelBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#EF4444',
  },

  // Prompt card
  promptCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
    gap: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  promptIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(123,92,240,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptHeaderInfo: {
    flex: 1,
    gap: 2,
  },
  promptLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#1a1030',
  },
  promptLastUpdate: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
  promptText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#1a1030',
    lineHeight: 20,
    backgroundColor: 'rgba(123,92,240,0.05)',
    borderRadius: 10,
    padding: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  editBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7B5CF0',
  },

  // Rules card
  rulesCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
    gap: 10,
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  rulesLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#1a1030',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  ruleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  ruleAction: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#1a1030',
    flex: 1,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#F59E0B',
  },
});
