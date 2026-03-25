import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';

interface Track {
  id: string;
  lesson: string;
  duration: string;
}

interface Unit {
  id: string;
  name: string;
  tracks: Track[];
}

interface Book {
  id: string;
  name: string;
  color: string;
  units: Unit[];
}

const BOOKS: Book[] = [
  {
    id: 'b1',
    name: 'Book 1',
    color: '#7B5CF0',
    units: [
      {
        id: 'u1',
        name: 'Unit 1 — Hello World',
        tracks: [
          { id: 'b1u1t1', lesson: 'Lesson 1 – Greetings',          duration: '2:34' },
          { id: 'b1u1t2', lesson: 'Lesson 2 – Numbers & Colors',    duration: '3:10' },
          { id: 'b1u1t3', lesson: 'Lesson 3 – The Alphabet',        duration: '2:20' },
        ],
      },
      {
        id: 'u2',
        name: 'Unit 2 — Daily Life',
        tracks: [
          { id: 'b1u2t1', lesson: 'Lesson 1 – Daily Routines',      duration: '3:05' },
          { id: 'b1u2t2', lesson: 'Lesson 2 – At Home',             duration: '2:50' },
          { id: 'b1u2t3', lesson: 'Lesson 3 – Food & Drinks',       duration: '3:22' },
        ],
      },
    ],
  },
  {
    id: 'b2',
    name: 'Book 2',
    color: '#10B981',
    units: [
      {
        id: 'u3',
        name: 'Unit 1 — Going Out',
        tracks: [
          { id: 'b2u1t1', lesson: 'Lesson 1 – At the Restaurant',   duration: '2:55' },
          { id: 'b2u1t2', lesson: 'Lesson 2 – Shopping',            duration: '3:18' },
          { id: 'b2u1t3', lesson: 'Lesson 3 – At the Cinema',       duration: '2:44' },
        ],
      },
      {
        id: 'u4',
        name: 'Unit 2 — Travel',
        tracks: [
          { id: 'b2u2t1', lesson: 'Lesson 1 – Travel Vocabulary',   duration: '3:44' },
          { id: 'b2u2t2', lesson: 'Lesson 2 – Asking Directions',   duration: '2:20' },
          { id: 'b2u2t3', lesson: 'Lesson 3 – At the Hotel',        duration: '3:05' },
        ],
      },
    ],
  },
  {
    id: 'b3',
    name: 'Book 3',
    color: '#F59E0B',
    units: [
      {
        id: 'u5',
        name: 'Unit 1 — Work & Career',
        tracks: [
          { id: 'b3u1t1', lesson: 'Lesson 1 – Job Interviews',      duration: '3:30' },
          { id: 'b3u1t2', lesson: 'Lesson 2 – Office Life',         duration: '2:58' },
          { id: 'b3u1t3', lesson: 'Lesson 3 – Emails & Reports',    duration: '3:12' },
        ],
      },
      {
        id: 'u6',
        name: 'Unit 2 — Technology',
        tracks: [
          { id: 'b3u2t1', lesson: 'Lesson 1 – Social Media',        duration: '2:40' },
          { id: 'b3u2t2', lesson: 'Lesson 2 – Online Shopping',     duration: '3:02' },
          { id: 'b3u2t3', lesson: 'Lesson 3 – Digital Security',    duration: '3:25' },
        ],
      },
    ],
  },
];

export default function ListenScreen() {
  const [selectedBook, setSelectedBook] = useState('b1');
  const [playing, setPlaying]           = useState<string | null>(null);
  const [openUnits, setOpenUnits]       = useState<Record<string, boolean>>({ u1: true });
  const { s } = useStaggeredEntry(3);

  const book = BOOKS.find(b => b.id === selectedBook)!;

  const toggleUnit = (uid: string) =>
    setOpenUnits(prev => ({ ...prev, [uid]: !prev[uid] }));

  const playingTrack = BOOKS.flatMap(b => b.units.flatMap(u => u.tracks)).find(t => t.id === playing);
  const totalTracks  = book.units.reduce((n, u) => n + u.tracks.length, 0);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <Animated.View style={s(0)}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Listen</Text>
              <Text style={styles.sub}>{book.name} · {totalTracks} faixas</Text>
            </View>
          </View>

          {/* Mini player */}
          {playing && (
            <BlurView intensity={70} tint="dark" style={styles.miniPlayer}>
              <LinearGradient colors={['#9B6DFF', '#5B1BE5']} style={styles.miniThumb}>
                <Ionicons name="musical-notes" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.miniInfo}>
                <Text style={styles.miniTitle} numberOfLines={1}>{playingTrack?.lesson}</Text>
                <Text style={styles.miniUnit}>{book.name}</Text>
              </View>
              <Pressable onPress={() => setPlaying(null)} style={styles.miniBtn}>
                <Ionicons name="stop-circle" size={36} color="#fff" />
              </Pressable>
            </BlurView>
          )}
        </Animated.View>

        {/* Book selector */}
        <Animated.View style={s(1)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookRow}
          >
            {BOOKS.map(b => (
              <Pressable
                key={b.id}
                onPress={() => setSelectedBook(b.id)}
                style={[styles.bookChip, selectedBook === b.id && { backgroundColor: b.color, borderColor: b.color }]}
              >
                <Text style={[styles.bookChipText, selectedBook === b.id && styles.bookChipTextActive]}>
                  {b.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Units + tracks */}
        <Animated.View style={[styles.listWrap, s(2)]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {book.units.map(unit => (
              <View key={unit.id} style={styles.unitBlock}>
                {/* Unit header */}
                <Pressable style={styles.unitHeader} onPress={() => toggleUnit(unit.id)}>
                  <View style={[styles.unitDot, { backgroundColor: book.color }]} />
                  <Text style={styles.unitName}>{unit.name}</Text>
                  <Ionicons
                    name={openUnits[unit.id] ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#888"
                  />
                </Pressable>

                {/* Tracks */}
                {openUnits[unit.id] && unit.tracks.map(track => (
                  <View key={track.id} style={styles.trackShadowWrap}>
                    <Pressable
                      style={[styles.track, playing === track.id && styles.trackActive]}
                      onPress={() => setPlaying(playing === track.id ? null : track.id)}
                    >
                      <LinearGradient
                        colors={playing === track.id
                          ? [book.color, book.color + 'CC']
                          : [`${book.color}28`, `${book.color}18`]}
                        style={styles.playBtn}
                      >
                        <Ionicons
                          name={playing === track.id ? 'pause' : 'play'}
                          size={16}
                          color={playing === track.id ? '#fff' : book.color}
                        />
                      </LinearGradient>
                      <Text style={styles.trackLesson} numberOfLines={1}>{track.lesson}</Text>
                      <Text style={styles.duration}>{track.duration}</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ))}
            <View style={{ height: 110 }} />
          </ScrollView>
        </Animated.View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title:  { fontFamily: 'Nunito_900Black', fontSize: 26, color: '#1a1030' },
  sub:    { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#7B5CF0', marginTop: 2 },

  miniPlayer: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  miniThumb: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniInfo:  { flex: 1 },
  miniTitle: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff' },
  miniUnit:  { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  miniBtn:   { padding: 2 },

  bookRow: { paddingHorizontal: 16, paddingBottom: 14, gap: 8, flexDirection: 'row' },
  bookChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  bookChipText:       { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#888' },
  bookChipTextActive: { color: '#fff' },

  listWrap: { flex: 1 },
  list:     { paddingHorizontal: 16, paddingBottom: 110 },

  unitBlock: { marginBottom: 8 },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  unitDot:  { width: 8, height: 8, borderRadius: 4 },
  unitName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#1a1030', flex: 1 },

  track: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    shadowColor: '#503CB4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  trackShadowWrap: {
    marginBottom: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  trackActive: {
    borderWidth: 1.5,
    borderColor: 'rgba(139,92,246,0.4)',
    backgroundColor: 'rgba(255,255,255,0.98)',
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trackLesson: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#1a1030', flex: 1 },
  duration:    { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#aaa' },
});
