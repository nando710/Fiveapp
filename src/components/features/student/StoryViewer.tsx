import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@components/ui';
import type { Story } from './StoryCircle';

const { width: W, height: H } = Dimensions.get('window');
const STORY_DURATION = 4000;

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
}

export function StoryViewer({ stories, initialIndex = 0, visible, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const progress = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  // Reset index when modal opens
  useEffect(() => {
    if (visible) setCurrentIndex(initialIndex);
  }, [visible, initialIndex]);

  // Start/restart animation whenever current story changes
  useEffect(() => {
    if (!visible) return;

    animRef.current?.stop();
    progress.setValue(0);

    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animRef.current.start(({ finished }) => {
      if (finished) advanceNext();
    });

    return () => animRef.current?.stop();
  }, [currentIndex, visible]);

  const advanceNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const handleTapLeft = () => {
    animRef.current?.stop();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      // Reinicia o story atual
      progress.setValue(0);
      animRef.current = Animated.timing(progress, {
        toValue: 1,
        duration: STORY_DURATION,
        useNativeDriver: false,
      });
      animRef.current.start(({ finished }) => {
        if (finished) advanceNext();
      });
    }
  };

  const handleTapRight = () => {
    animRef.current?.stop();
    advanceNext();
  };

  const handleLike = () => {
    const id = stories[currentIndex]?.id;
    if (!id) return;
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.4, useNativeDriver: true, speed: 50, bounciness: 15 }),
      Animated.spring(likeScale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 10 }),
    ]).start();
  };

  const story = stories[currentIndex];
  if (!story) return null;
  const isLiked = liked.has(story.id);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <StatusBar style="light" />
      <View style={styles.container}>

        {/* Imagem de fundo */}
        <Image
          source={{ uri: story.uri }}
          style={styles.image}
          contentFit="cover"
        />

        {/* Overlay escuro no topo para legibilidade */}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.15)', 'transparent']}
          style={styles.topOverlay}
          pointerEvents="none"
        />

        {/* Overlay escuro no rodapé */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.35)']}
          style={styles.bottomOverlay}
          pointerEvents="none"
        />

        {/* Barras de progresso */}
        <View style={styles.progressRow}>
          {stories.map((s, i) => (
            <View key={s.id} style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      i < currentIndex
                        ? '100%'
                        : i === currentIndex
                        ? progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header: avatar + nome + fechar */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: story.uri }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          <Text style={styles.name} numberOfLines={1}>{story.name}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>
        </View>

        {/* Zonas de toque (esquerda / direita) */}
        <View style={styles.tapZones} pointerEvents="box-none">
          <Pressable style={styles.tapLeft} onPress={handleTapLeft} />
          <Pressable style={styles.tapRight} onPress={handleTapRight} />
        </View>

        {/* Botão curtir */}
        <View style={styles.likeRow}>
          <Pressable onPress={handleLike} hitSlop={12}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? '#EF4444' : '#fff'}
              />
            </Animated.View>
          </Pressable>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },

  // Barras de progresso
  progressRow: {
    position: 'absolute',
    top: 52,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
  },
  progressTrack: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 99,
  },

  // Header
  header: {
    position: 'absolute',
    top: 66,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar: { width: '100%', height: '100%' },
  name: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  closeBtn: {
    padding: 4,
  },

  // Tap zones
  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    marginTop: 110, // abaixo do header
  },
  tapLeft: { flex: 1 },
  tapRight: { flex: 2 },

  likeRow: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    alignItems: 'center',
  },
});
