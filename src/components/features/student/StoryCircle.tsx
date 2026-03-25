import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export interface Story {
  id: string;
  name: string;
  uri: string;
  isMe?: boolean;
  hasNew?: boolean;
}

interface StoryCircleProps {
  story: Story;
  onPress?: (story: Story) => void;
}

export function StoryCircle({ story, onPress }: StoryCircleProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(story);
  };

  return (
    <Pressable style={styles.wrap} onPress={handlePress}>
      <LinearGradient
        colors={
          story.isMe
            ? ['rgba(139,92,246,0.25)', 'rgba(139,92,246,0.1)']
            : story.hasNew
            ? ['#8B5CF6', '#A78BFA', '#C4B5FD', '#8B5CF6']
            : ['rgba(200,200,200,0.6)', 'rgba(150,150,150,0.4)']
        }
        style={[styles.ring, story.isMe && styles.ringMe]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.imgWrap}>
          <Image
            source={{ uri: story.uri }}
            style={styles.img}
            contentFit="cover"
          />
        </View>
        {story.isMe && (
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.addBtn}
          >
            <Text style={styles.plus}>+</Text>
          </LinearGradient>
        )}
      </LinearGradient>
      <Text style={styles.name} numberOfLines={1}>{story.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap:    { alignItems: 'center', gap: 5, width: 66 },
  ring: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringMe: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(139,92,246,0.5)',
  },
  imgWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  img: { width: '100%', height: '100%' },
  addBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F0EFF5',
  },
  plus: { color: '#fff', fontSize: 14, fontWeight: '900', lineHeight: 15 },
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    maxWidth: 62,
  },
});
