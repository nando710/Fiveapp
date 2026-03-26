import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const NETWORK = { units: 24, totalStudents: 3420, totalTeachers: 120, avgRetention: 84, avgEngagement: 72 };

const UNIT_RANKING = [
  { id: 'u1', name: 'Five — Pinheiros', city: 'São Paulo', students: 142, retention: 92, engagement: 88, trend: 'up' as const },
  { id: 'u2', name: 'Five — Moema', city: 'São Paulo', students: 180, retention: 89, engagement: 85, trend: 'up' as const },
  { id: 'u3', name: 'Five — Alphaville', city: 'Barueri', students: 165, retention: 86, engagement: 79, trend: 'stable' as const },
  { id: 'u4', name: 'Five — Campinas Centro', city: 'Campinas', students: 120, retention: 78, engagement: 68, trend: 'down' as const },
  { id: 'u5', name: 'Five — Santos', city: 'Santos', students: 95, retention: 75, engagement: 62, trend: 'down' as const },
  { id: 'u6', name: 'Five — Ribeirão Preto', city: 'Ribeirão Preto', students: 110, retention: 82, engagement: 74, trend: 'stable' as const },
];

const ALERTS = [
  { id: 'al1', unit: 'Five — Santos', message: 'Retenção abaixo de 76% por 2 meses consecutivos', severity: 'critical' as const },
  { id: 'al2', unit: 'Five — Campinas Centro', message: 'Queda de 12% no engajamento do app este mês', severity: 'warning' as const },
  { id: 'al3', unit: 'Five — Alphaville', message: '3 professores sem preencher diário há 5 dias', severity: 'warning' as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MEDAL_COLORS = ['#F59E0B', '#94A3B8', '#CD7F32'];

const TREND_CONFIG = {
  up:     { icon: 'trending-up-outline' as const, color: '#10B981' },
  stable: { icon: 'remove-outline' as const, color: '#94A3B8' },
  down:   { icon: 'trending-down-outline' as const, color: '#EF4444' },
};

const SEVERITY_CONFIG = {
  critical: { borderColor: '#EF4444', badgeBg: 'rgba(239,68,68,0.12)', badgeColor: '#EF4444', label: 'Crítico' },
  warning:  { borderColor: '#F59E0B', badgeBg: 'rgba(245,158,11,0.12)', badgeColor: '#F59E0B', label: 'Atenção' },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AdminDashboardScreen() {
  const [sortBy, setSortBy] = useState<'retention' | 'engagement'>('retention');

  // s(0)=Header s(1)=Stats s(2)=Alerts s(3)=Ranking
  const { s } = useStaggeredEntry(4);

  const sortedUnits = [...UNIT_RANKING].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── Header ── */}
          <Animated.View style={[styles.header, s(0)]}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Dashboard Global</Text>
              <Text style={styles.headerSubtitle}>Five Idiomas</Text>
            </View>
            <View style={styles.crownWrap}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
            </View>
          </Animated.View>

          {/* ── Stats Cards (horizontal) ── */}
          <Animated.View style={s(1)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
              {[
                { label: 'Unidades', value: NETWORK.units, icon: 'business-outline' as const, color: '#7B5CF0' },
                { label: 'Alunos', value: NETWORK.totalStudents.toLocaleString('pt-BR'), icon: 'people-outline' as const, color: '#3B82F6' },
                { label: 'Professores', value: NETWORK.totalTeachers, icon: 'person-outline' as const, color: '#10B981' },
                { label: 'Retenção %', value: `${NETWORK.avgRetention}%`, icon: 'trending-up-outline' as const, color: '#F59E0B' },
                { label: 'Engajamento %', value: `${NETWORK.avgEngagement}%`, icon: 'pulse-outline' as const, color: '#EF4444' },
              ].map((stat, i) => (
                <View key={i} style={styles.statShadow}>
                  <LinearGradient colors={['#1a1030', '#0d0620']} style={styles.statCard}>
                    <Ionicons name={stat.icon} size={18} color={stat.color} />
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.18)', 'transparent', 'rgba(0,0,0,0.08)']}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      pointerEvents="none"
                    />
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* ── Alerts ── */}
          {ALERTS.length > 0 && (
            <Animated.View style={s(2)}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
                  <Text style={styles.sectionTitle}>Alertas da Rede</Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.countBadgeText}>{ALERTS.length}</Text>
                </View>
              </View>

              {ALERTS.map((alert) => {
                const cfg = SEVERITY_CONFIG[alert.severity];
                return (
                  <View key={alert.id} style={styles.cardShadow}>
                    <BlurView intensity={50} tint="light" style={styles.alertCard}>
                      <View style={[styles.alertBorder, { backgroundColor: cfg.borderColor }]} />
                      <View style={styles.alertBody}>
                        <View style={styles.alertTopRow}>
                          <Text style={styles.alertUnit}>{alert.unit}</Text>
                          <View style={[styles.severityBadge, { backgroundColor: cfg.badgeBg }]}>
                            <Text style={[styles.severityBadgeText, { color: cfg.badgeColor }]}>{cfg.label}</Text>
                          </View>
                        </View>
                        <Text style={styles.alertMessage}>{alert.message}</Text>
                      </View>
                    </BlurView>
                  </View>
                );
              })}
            </Animated.View>
          )}

          {/* ── Ranking de Unidades ── */}
          <Animated.View style={s(3)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="podium-outline" size={18} color="#1a1030" />
                <Text style={styles.sectionTitle}>Ranking de Unidades</Text>
              </View>
            </View>

            {/* Sort toggle pills */}
            <View style={styles.sortRow}>
              {([
                { key: 'retention' as const, label: 'Retenção' },
                { key: 'engagement' as const, label: 'Engajamento' },
              ]).map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setSortBy(opt.key)}
                  style={[styles.sortPill, sortBy === opt.key && styles.sortPillActive]}
                >
                  <Text style={[styles.sortPillText, sortBy === opt.key && styles.sortPillTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Unit cards */}
            {sortedUnits.map((unit, index) => {
              const position = index + 1;
              const metricValue = sortBy === 'retention' ? unit.retention : unit.engagement;
              const trend = TREND_CONFIG[unit.trend];
              const isTopThree = position <= 3;
              const medalColor = isTopThree ? MEDAL_COLORS[position - 1] : undefined;

              return (
                <View key={unit.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.unitCard}>
                    {/* Position */}
                    <View style={[styles.positionWrap, isTopThree && { backgroundColor: medalColor + '20' }]}>
                      <Text style={[styles.positionText, isTopThree && { color: medalColor }]}>
                        {position}
                      </Text>
                    </View>

                    {/* Unit info */}
                    <View style={styles.unitInfo}>
                      <Text style={styles.unitName}>{unit.name}</Text>
                      <Text style={styles.unitCity}>{unit.city}</Text>
                    </View>

                    {/* Metric */}
                    <View style={styles.metricWrap}>
                      <Text style={styles.metricValue}>{metricValue}%</Text>
                      <Ionicons name={trend.icon} size={16} color={trend.color} />
                    </View>

                    {/* Students badge */}
                    <View style={styles.studentsBadge}>
                      <Ionicons name="people-outline" size={12} color="#7B5CF0" />
                      <Text style={styles.studentsBadgeText}>{unit.students}</Text>
                    </View>
                  </BlurView>
                </View>
              );
            })}
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 110 },

  // Header
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerLeft: { flex: 1 },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 22, color: '#1a1030', lineHeight: 28 },
  headerSubtitle: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#888', marginTop: 2 },
  crownWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(245,158,11,0.12)', alignItems: 'center', justifyContent: 'center' },

  // Stats
  statsScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
  statShadow: { borderRadius: 18, shadowColor: '#0d0620', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  statCard: { width: 105, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 18, alignItems: 'center', gap: 4, overflow: 'hidden' },
  statValue: { fontFamily: 'Nunito_900Black', fontSize: 22, color: '#fff', lineHeight: 26 },
  statLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 17, color: '#1a1030' },
  countBadge: { backgroundColor: '#7B5CF0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  countBadgeText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 11, color: '#fff' },

  // Card shadow
  cardShadow: { marginHorizontal: 16, marginBottom: 10, borderRadius: 18, shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },

  // Alert card
  alertCard: { borderRadius: 18, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  alertBorder: { width: 5, alignSelf: 'stretch' },
  alertBody: { flex: 1, padding: 14, gap: 6 },
  alertTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  alertUnit: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030', flex: 1 },
  alertMessage: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#666', lineHeight: 19 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  severityBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },

  // Sort pills
  sortRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  sortPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  sortPillActive: { backgroundColor: '#1a1030', borderColor: '#1a1030' },
  sortPillText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#888' },
  sortPillTextActive: { color: '#fff' },

  // Unit card
  unitCard: { borderRadius: 18, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  positionWrap: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  positionText: { fontFamily: 'Nunito_900Black', fontSize: 16, color: '#bbb' },
  unitInfo: { flex: 1, gap: 2 },
  unitName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  unitCity: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888' },
  metricWrap: { alignItems: 'center', gap: 2, flexShrink: 0 },
  metricValue: { fontFamily: 'Nunito_900Black', fontSize: 18, color: '#7B5CF0' },
  studentsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(123,92,240,0.08)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50, flexShrink: 0 },
  studentsBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11, color: '#7B5CF0' },
});
