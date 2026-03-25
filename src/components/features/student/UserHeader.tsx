import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Circle as SvgCircle } from 'react-native-svg';

interface UserHeaderProps {
  name: string;
  avatarUri?: string;
  subtitle?: string;
  points?: number;
}

function AvatarRing({ uri }: { uri: string }) {
  return (
    <View style={styles.ringContainer}>
      <Svg width={72} height={72} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="35%" stopColor="#A78BFA" />
            <Stop offset="65%" stopColor="#C4B5FD" />
            <Stop offset="100%" stopColor="#8B5CF6" />
          </SvgGradient>
        </Defs>
        <SvgCircle
          cx={36} cy={36} r={34}
          stroke="url(#ring)"
          strokeWidth={3.5}
          fill="transparent"
        />
      </Svg>
      <View style={styles.avatarInner}>
        <Image
          source={{ uri: uri || 'https://i.pravatar.cc/150?img=3' }}
          style={styles.avatar}
          contentFit="cover"
        />
      </View>
    </View>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 18) return 'Good afternoon,';
  return 'Good evening,';
}

export function UserHeader({ name, avatarUri, subtitle, points = 0 }: UserHeaderProps) {
  const formatted = points >= 1000
    ? `${(points / 1000).toFixed(1).replace('.0', '')}k`
    : String(points);

  return (
    <View style={styles.row}>
      <AvatarRing uri={avatarUri ?? ''} />
      <View style={styles.textCol}>
        <Text style={styles.sub}>{getGreeting()}</Text>
        <Text style={styles.name} numberOfLines={1}>{name}!</Text>
        {subtitle ? <Text style={styles.unit} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.pointsBadge}>
        <Ionicons name="star" size={12} color="#fff" />
        <Text style={styles.pointsText}>{formatted} FP</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ringContainer: {
    width: 72,
    height: 72,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  textCol: {
    flex: 1,
    gap: 1,
  },
  sub: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#888',
  },
  name: {
    fontFamily: 'Nunito_900Black',
    fontSize: 22,
    color: '#1a1030',
    letterSpacing: -0.5,
  },
  unit: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#7B5CF0',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 50,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  pointsText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#fff',
  },
});
