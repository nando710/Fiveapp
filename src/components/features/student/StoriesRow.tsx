import { FlatList, StyleSheet, View } from 'react-native';
import { StoryCircle, type Story } from './StoryCircle';

interface StoriesRowProps {
  stories: Story[];
  onStoryPress?: (story: Story) => void;
}

export function StoriesRow({ stories, onStoryPress }: StoriesRowProps) {
  return (
    <View style={styles.wrapper}>
      <FlatList
        data={stories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <StoryCircle story={item} onPress={onStoryPress} />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 8 },
  content: { paddingHorizontal: 16, paddingVertical: 4 },
  sep: { width: 8 },
});
