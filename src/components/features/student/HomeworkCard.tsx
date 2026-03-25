import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Homework } from '@/types';

const STATUS_CONFIG = {
  pending:   { label: 'Pendente',  color: '#F59E0B', icon: 'time-outline'        as const },
  submitted: { label: 'Enviado',   color: '#8B5CF6', icon: 'checkmark-circle-outline' as const },
  graded:    { label: 'Corrigido', color: '#10B981', icon: 'star-outline'         as const },
};

interface HomeworkCardProps {
  homework: Homework;
  onPress?: (hw: Homework) => void;
}

export function HomeworkCard({ homework, onPress }: HomeworkCardProps) {
  const cfg = STATUS_CONFIG[homework.status];

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(homework)}>
      {/* Barra colorida lateral */}
      <View style={[styles.bar, { backgroundColor: cfg.color }]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>{homework.title}</Text>
          <View style={[styles.badge, { borderColor: cfg.color, backgroundColor: cfg.color + '18' }]}>
            <Ionicons name={cfg.icon} size={12} color={cfg.color} />
            <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Ionicons name="calendar-outline" size={12} color="#aaa" />
          <Text style={styles.date}>Até {formatDate(homework.dueDate)}</Text>
          {homework.score != null && (
            <View style={styles.score}>
              <Text style={styles.scoreText}>{homework.score}/10</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#ccc" />
    </Pressable>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
    paddingRight: 14,
  },
  bar:   { width: 5, alignSelf: 'stretch' },
  body:  { flex: 1, paddingVertical: 14, gap: 8 },
  topRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#1a1030',
    lineHeight: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 1,
    flexShrink: 0,
  },
  badgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  date: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#999' },
  score: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(16,185,129,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
  },
  scoreText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: '#10B981' },
});
