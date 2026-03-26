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

const CONTENT_TREE = [
  { id: 'l1', level: 'Básico', color: '#3B82F6', books: [
    { id: 'b1', name: 'Book 1', units: 8, lessons: 32, audios: 64, lastUpdate: '20/03/2026' },
    { id: 'b2', name: 'Book 2', units: 8, lessons: 32, audios: 60, lastUpdate: '18/03/2026' },
  ]},
  { id: 'l2', level: 'Intermediário', color: '#10B981', books: [
    { id: 'b3', name: 'Book 3', units: 10, lessons: 40, audios: 80, lastUpdate: '25/03/2026' },
    { id: 'b4', name: 'Book 4', units: 10, lessons: 40, audios: 78, lastUpdate: '15/03/2026' },
  ]},
  { id: 'l3', level: 'Avançado', color: '#F59E0B', books: [
    { id: 'b5', name: 'Book 5', units: 12, lessons: 48, audios: 96, lastUpdate: '10/03/2026' },
    { id: 'b6', name: 'Book 6', units: 12, lessons: 48, audios: 90, lastUpdate: '22/02/2026' },
  ]},
];

const RECENT_UPLOADS = [
  { id: 'up1', file: 'Track_B3_U2_L7.mp3', type: 'audio' as const, book: 'Book 3', date: '25/03', size: '3.2 MB' },
  { id: 'up2', file: 'Gabarito_B3_U2.pdf', type: 'gabarito' as const, book: 'Book 3', date: '25/03', size: '1.1 MB' },
  { id: 'up3', file: 'Simulado_B1_Final.pdf', type: 'simulado' as const, book: 'Book 1', date: '22/03', size: '2.5 MB' },
  { id: 'up4', file: 'AR_Marker_B2_U4.png', type: 'ar' as const, book: 'Book 2', date: '20/03', size: '450 KB' },
];

const FILE_TYPE_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  audio:    { icon: 'musical-notes-outline', color: '#7B5CF6' },
  gabarito: { icon: 'document-text-outline', color: '#10B981' },
  simulado: { icon: 'clipboard-outline', color: '#F59E0B' },
  ar:       { icon: 'cube-outline', color: '#3B82F6' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const totalBooks = CONTENT_TREE.reduce((sum, lvl) => sum + lvl.books.length, 0);
const totalLessons = CONTENT_TREE.reduce((sum, lvl) => sum + lvl.books.reduce((s, b) => s + b.lessons, 0), 0);
const totalAudios = CONTENT_TREE.reduce((sum, lvl) => sum + lvl.books.reduce((s, b) => s + b.audios, 0), 0);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CmsScreen() {
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CONTENT_TREE.map((lvl) => [lvl.id, true]))
  );

  // s(0)=Header s(1)=ContentTree s(2)=Uploads
  const { s } = useStaggeredEntry(3);

  const toggleLevel = (id: string) => {
    setExpandedLevels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── Header ── */}
          <Animated.View style={[styles.header, s(0)]}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>CMS Pedagógico</Text>
              <View style={styles.headerStats}>
                <View style={styles.headerStatItem}>
                  <Ionicons name="book-outline" size={13} color="#7B5CF0" />
                  <Text style={styles.headerStatText}>{totalBooks} livros</Text>
                </View>
                <View style={styles.headerStatDot} />
                <View style={styles.headerStatItem}>
                  <Ionicons name="document-outline" size={13} color="#7B5CF0" />
                  <Text style={styles.headerStatText}>{totalLessons} lições</Text>
                </View>
                <View style={styles.headerStatDot} />
                <View style={styles.headerStatItem}>
                  <Ionicons name="musical-notes-outline" size={13} color="#7B5CF0" />
                  <Text style={styles.headerStatText}>{totalAudios} áudios</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ── Content Tree ── */}
          <Animated.View style={s(1)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="git-branch-outline" size={18} color="#1a1030" />
                <Text style={styles.sectionTitle}>Árvore de Conteúdo</Text>
              </View>
            </View>

            {CONTENT_TREE.map((level) => {
              const isExpanded = expandedLevels[level.id];
              return (
                <View key={level.id} style={styles.levelWrap}>
                  {/* Level header */}
                  <Pressable style={styles.levelHeader} onPress={() => toggleLevel(level.id)}>
                    <View style={[styles.levelDot, { backgroundColor: level.color }]} />
                    <Text style={styles.levelName}>{level.level}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: level.color + '18' }]}>
                      <Text style={[styles.levelBadgeText, { color: level.color }]}>
                        {level.books.length} livros
                      </Text>
                    </View>
                    <View style={styles.levelSpacer} />
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#aaa" />
                  </Pressable>

                  {/* Books */}
                  {isExpanded && level.books.map((book) => (
                    <View key={book.id} style={styles.cardShadow}>
                      <BlurView intensity={50} tint="light" style={styles.bookCard}>
                        <View style={[styles.bookColorBar, { backgroundColor: level.color }]} />
                        <View style={styles.bookBody}>
                          <View style={styles.bookTopRow}>
                            <View style={[styles.bookIconWrap, { backgroundColor: level.color + '18' }]}>
                              <Ionicons name="book-outline" size={20} color={level.color} />
                            </View>
                            <View style={styles.bookInfo}>
                              <Text style={styles.bookName}>{book.name}</Text>
                              <Text style={styles.bookMeta}>
                                {book.units} unidades · {book.lessons} lições · {book.audios} áudios
                              </Text>
                            </View>
                          </View>

                          <View style={styles.bookBottomRow}>
                            <View style={styles.bookDateWrap}>
                              <Ionicons name="time-outline" size={12} color="#aaa" />
                              <Text style={styles.bookDate}>Atualizado em {book.lastUpdate}</Text>
                            </View>
                            <Pressable style={styles.editBtn}>
                              <Text style={styles.editBtnText}>Editar</Text>
                              <Ionicons name="pencil-outline" size={13} color="#7B5CF0" />
                            </Pressable>
                          </View>
                        </View>
                      </BlurView>
                    </View>
                  ))}
                </View>
              );
            })}
          </Animated.View>

          {/* ── Uploads Recentes ── */}
          <Animated.View style={s(2)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="cloud-upload-outline" size={18} color="#1a1030" />
                <Text style={styles.sectionTitle}>Uploads Recentes</Text>
              </View>
            </View>

            {/* Upload button */}
            <View style={styles.uploadBtnWrap}>
              <Pressable style={styles.uploadBtnPressable}>
                <LinearGradient
                  colors={['#7B5CF0', '#5A3DC8']}
                  style={styles.uploadBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                  <Text style={styles.uploadBtnText}>Upload</Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* Upload list */}
            {RECENT_UPLOADS.map((upload) => {
              const cfg = FILE_TYPE_CONFIG[upload.type];
              return (
                <View key={upload.id} style={styles.cardShadow}>
                  <BlurView intensity={50} tint="light" style={styles.uploadCard}>
                    <View style={[styles.uploadIconWrap, { backgroundColor: cfg.color + '18' }]}>
                      <Ionicons name={cfg.icon} size={20} color={cfg.color} />
                    </View>
                    <View style={styles.uploadInfo}>
                      <Text style={styles.uploadFile} numberOfLines={1}>{upload.file}</Text>
                      <Text style={styles.uploadMeta}>{upload.book} · {upload.date}</Text>
                    </View>
                    <View style={styles.uploadSizeWrap}>
                      <Text style={styles.uploadSize}>{upload.size}</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerLeft: { gap: 6 },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 22, color: '#1a1030', lineHeight: 28 },
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerStatText: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  headerStatDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#ccc' },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 17, color: '#1a1030' },

  // Card shadow
  cardShadow: { marginHorizontal: 16, marginBottom: 10, borderRadius: 18, shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },

  // Level
  levelWrap: { marginBottom: 6 },
  levelHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, gap: 10 },
  levelDot: { width: 12, height: 12, borderRadius: 6 },
  levelName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#1a1030' },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 50 },
  levelBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  levelSpacer: { flex: 1 },

  // Book card
  bookCard: { borderRadius: 18, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  bookColorBar: { width: 5, alignSelf: 'stretch' },
  bookBody: { flex: 1, padding: 14, gap: 10 },
  bookTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bookInfo: { flex: 1, gap: 2 },
  bookName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#1a1030' },
  bookMeta: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  bookBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 10 },
  bookDateWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookDate: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(123,92,240,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 50 },
  editBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#7B5CF0' },

  // Upload button
  uploadBtnWrap: { paddingHorizontal: 16, marginBottom: 14 },
  uploadBtnPressable: { borderRadius: 14, overflow: 'hidden' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  uploadBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff' },

  // Upload card
  uploadCard: { borderRadius: 18, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  uploadIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  uploadInfo: { flex: 1, gap: 2 },
  uploadFile: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#1a1030' },
  uploadMeta: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888' },
  uploadSizeWrap: { backgroundColor: 'rgba(0,0,0,0.04)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, flexShrink: 0 },
  uploadSize: { fontFamily: 'Nunito_700Bold', fontSize: 11, color: '#888' },
});
