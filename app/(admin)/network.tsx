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
import { Image } from 'expo-image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Unit {
  id: string;
  name: string;
  city: string;
  owner: string;
  avatar: string;
  students: number;
  teachers: number;
  status: 'active' | 'suspended';
  since: string;
  lastPayment: string;
}

type FilterOption = 'all' | 'active' | 'suspended';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const UNITS: Unit[] = [
  { id: 'u1', name: 'Five — Pinheiros', city: 'São Paulo, SP', owner: 'Roberto Mendes', avatar: 'https://i.pravatar.cc/150?img=68', students: 142, teachers: 5, status: 'active', since: '2021', lastPayment: '15/03/2026' },
  { id: 'u2', name: 'Five — Moema', city: 'São Paulo, SP', owner: 'Carolina Dias', avatar: 'https://i.pravatar.cc/150?img=45', students: 180, teachers: 7, status: 'active', since: '2019', lastPayment: '14/03/2026' },
  { id: 'u3', name: 'Five — Alphaville', city: 'Barueri, SP', owner: 'Fernando Lima', avatar: 'https://i.pravatar.cc/150?img=59', students: 165, teachers: 6, status: 'active', since: '2020', lastPayment: '10/03/2026' },
  { id: 'u4', name: 'Five — Campinas Centro', city: 'Campinas, SP', owner: 'Mariana Borges', avatar: 'https://i.pravatar.cc/150?img=43', students: 120, teachers: 4, status: 'active', since: '2022', lastPayment: '16/03/2026' },
  { id: 'u5', name: 'Five — Santos', city: 'Santos, SP', owner: 'Paulo Vieira', avatar: 'https://i.pravatar.cc/150?img=33', students: 95, teachers: 3, status: 'suspended', since: '2023', lastPayment: '10/01/2026' },
  { id: 'u6', name: 'Five — Ribeirão Preto', city: 'Ribeirão Preto, SP', owner: 'Ana Rodrigues', avatar: 'https://i.pravatar.cc/150?img=29', students: 110, teachers: 4, status: 'active', since: '2021', lastPayment: '12/03/2026' },
];

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Ativas' },
  { key: 'suspended', label: 'Suspensas' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NetworkScreen() {
  const [filter, setFilter] = useState<FilterOption>('all');
  const { s } = useStaggeredEntry(2);

  const filtered = UNITS.filter((u) => {
    if (filter === 'all') return true;
    return u.status === filter;
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
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Gestão de Rede</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{UNITS.length} unidades</Text>
                </View>
              </View>
              <Pressable style={styles.newUnitBtn}>
                <Ionicons name="add-outline" size={18} color="#fff" />
                <Text style={styles.newUnitBtnText}>Nova Unidade</Text>
              </Pressable>
            </View>

            {/* ── Filter Tabs ── */}
            <View style={styles.filterRow}>
              {FILTER_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setFilter(opt.key)}
                  style={[
                    styles.filterTab,
                    filter === opt.key && styles.filterTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      filter === opt.key && styles.filterTabTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* ── Unit List ── */}
          <Animated.View style={s(1)}>
            {filtered.map((unit) => {
              const isActive = unit.status === 'active';
              const isAdimplente = isActive;
              return (
                <View key={unit.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.unitCard}>
                    {/* Top row: avatar + name + status */}
                    <View style={styles.unitTopRow}>
                      <View style={styles.unitAvatarWrap}>
                        <Image
                          source={{ uri: unit.avatar }}
                          style={styles.unitAvatar}
                          contentFit="cover"
                        />
                      </View>
                      <View style={styles.unitInfo}>
                        <Text style={styles.unitName}>{unit.name}</Text>
                        <Text style={styles.unitCity}>{unit.city}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)' },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: isActive ? '#10B981' : '#EF4444' },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: isActive ? '#10B981' : '#EF4444' },
                          ]}
                        >
                          {isActive ? 'Ativa' : 'Suspensa'}
                        </Text>
                      </View>
                    </View>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Ionicons name="people-outline" size={14} color="#7B5CF0" />
                        <Text style={styles.statValue}>{unit.students}</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Ionicons name="school-outline" size={14} color="#3B82F6" />
                        <Text style={styles.statValue}>{unit.teachers}</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Ionicons name="calendar-outline" size={14} color="#888" />
                        <Text style={styles.statSince}>Desde {unit.since}</Text>
                      </View>
                    </View>

                    {/* Payment row */}
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>
                        Último pagamento: {unit.lastPayment}
                      </Text>
                      <View
                        style={[
                          styles.paymentBadge,
                          {
                            backgroundColor: isAdimplente
                              ? 'rgba(16,185,129,0.12)'
                              : 'rgba(239,68,68,0.12)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.paymentBadgeText,
                            { color: isAdimplente ? '#10B981' : '#EF4444' },
                          ]}
                        >
                          {isAdimplente ? 'Adimplente' : 'Inadimplente'}
                        </Text>
                      </View>
                    </View>

                    {/* Action link */}
                    <Pressable style={styles.viewAsLink}>
                      <Ionicons name="eye-outline" size={16} color="#7B5CF0" />
                      <Text style={styles.viewAsText}>Visualizar como franqueado</Text>
                    </Pressable>
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
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 24,
    color: '#1a1030',
  },
  countBadge: {
    backgroundColor: 'rgba(123,92,240,0.12)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#7B5CF0',
  },
  newUnitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#7B5CF0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newUnitBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#fff',
  },

  // Filter tabs
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
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

  // Unit card
  unitCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
    gap: 12,
  },

  // Top row
  unitTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unitAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E0DCEF',
  },
  unitAvatar: {
    width: '100%',
    height: '100%',
  },
  unitInfo: {
    flex: 1,
    gap: 2,
  },
  unitName: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
  },
  unitCity: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },

  // Status badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#1a1030',
  },
  statSince: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },

  // Payment row
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#888',
  },
  paymentBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  paymentBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },

  // View as link
  viewAsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewAsText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7B5CF0',
  },
});
