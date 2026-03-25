import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';

export default function ArScreen() {
  const { s } = useStaggeredEntry(2);

  return (
    <LinearGradient colors={['#00897B', '#004D40']} style={styles.bg}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        <Animated.View style={s(0)}>
          <View style={styles.header}>
            <Text style={styles.title}>Realidade Aumentada</Text>
            <Text style={styles.sub}>Em breve</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.centerWrap, s(1)]}>
          <BlurView intensity={30} tint="dark" style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name="cube-outline" size={56} color="rgba(255,255,255,0.9)" />
            </View>
            <Text style={styles.cardTitle}>AR em desenvolvimento</Text>
            <Text style={styles.cardDesc}>
              Em breve você poderá usar a câmera do seu celular para explorar conteúdos interativos em 3D.
            </Text>
          </BlurView>
        </Animated.View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  title: { fontFamily: 'Nunito_900Black', fontSize: 26, color: '#fff' },
  sub:   { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    width: '100%',
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 18, color: '#fff', textAlign: 'center' },
  cardDesc:  { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 22 },
});
