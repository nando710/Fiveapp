import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { HomeworkCard } from '@components/features/student/HomeworkCard';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import type { Homework } from '@/types';

const MOCK_HOMEWORKS: Homework[] = [
  { id: 'h1', lessonId: 'l1', title: 'Unit 2 – Vocabulary Practice: Daily Routines', type: 'multiple_choice', dueDate: '2026-03-28', status: 'pending' },
  { id: 'h2', lessonId: 'l1', title: 'Listening Comprehension – Track 12', type: 'audio', dueDate: '2026-03-26', status: 'submitted' },
  { id: 'h3', lessonId: 'l2', title: 'Writing Task: Describe your weekend', type: 'writing', dueDate: '2026-03-24', score: 8.5, status: 'graded' },
  { id: 'h4', lessonId: 'l2', title: 'Grammar Fill-in-the-Blank: Present Perfect', type: 'fill_blank', dueDate: '2026-03-30', status: 'pending' },
  { id: 'h5', lessonId: 'l3', title: 'Unit 1 – Review Quiz', type: 'multiple_choice', dueDate: '2026-03-22', score: 9, status: 'graded' },
];

type FilterKey = 'all' | 'pending' | 'submitted' | 'graded';

const FILTERS: { label: string; key: FilterKey }[] = [
  { label: 'Todos',     key: 'all' },
  { label: 'Pendentes', key: 'pending' },
  { label: 'Enviados',  key: 'submitted' },
  { label: 'Corrigidos',key: 'graded' },
];

function filterHomeworks(list: Homework[], key: FilterKey): Homework[] {
  if (key === 'all') return list;
  return list.filter(h => h.status === key);
}

export default function HomeworksScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  // s(0)=Header  s(1)=Filtros  s(2)=Lista
  const { s } = useStaggeredEntry(3);

  const filtered = filterHomeworks(MOCK_HOMEWORKS, activeFilter);
  const pendingCount = MOCK_HOMEWORKS.filter(h => h.status === 'pending').length;

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        <Animated.View style={s(0)}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Homeworks</Text>
              <Text style={styles.headerSub}>{pendingCount} pendentes</Text>
            </View>
            <Pressable style={styles.filterBtn}>
              <Ionicons name="filter-outline" size={18} color="#7B5CF0" />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={s(1)}>
          <View style={styles.filtersRow}>
            {FILTERS.map(({ label, key }) => {
              const isActive = activeFilter === key;
              const count = key === 'all' ? MOCK_HOMEWORKS.length : MOCK_HOMEWORKS.filter(h => h.status === key).length;
              return (
                <Pressable
                  key={key}
                  onPress={() => setActiveFilter(key)}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {label}
                  </Text>
                  <View style={[styles.filterCount, isActive && styles.filterCountActive]}>
                    <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>
                      {count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View style={[styles.listWrap, s(2)]}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <HomeworkCard
                homework={item}
                onPress={(hw) => router.push(`/(student)/homework/${hw.id}`)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={<View style={{ height: 110 }} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="checkmark-circle-outline" size={48} color="rgba(123,92,240,0.25)" />
                <Text style={styles.emptyText}>Nenhum homework aqui</Text>
              </View>
            }
          />
        </Animated.View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 26, color: '#1a1030' },
  headerSub:   { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#7B5CF0' },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(123,92,240,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  filterChipActive: {
    backgroundColor: '#1a1030',
    borderColor: '#1a1030',
  },
  filterChipText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#888' },
  filterChipTextActive: { color: '#fff' },
  filterCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterCountActive:    { backgroundColor: 'rgba(255,255,255,0.2)' },
  filterCountText:      { fontFamily: 'Nunito_800ExtraBold', fontSize: 10, color: '#888' },
  filterCountTextActive:{ color: '#fff' },
  listWrap: { flex: 1 },
  list: { paddingHorizontal: 16 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#bbb' },
});
