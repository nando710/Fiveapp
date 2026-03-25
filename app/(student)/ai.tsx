import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    text: "Hey! I'm your Five AI Tutor 👋 I'm here to help you learn — but I won't give you direct answers. Instead, I'll guide you to think and discover on your own. What would you like to practice today?",
  },
];

const SUGGESTIONS = [
  'Explain Present Perfect',
  'Help with Lesson 7',
  'Practice Conversation',
];

export default function AiScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  // s(0)=Header  s(1)=Mensagens  s(2)=Suggestions+Input
  const { s } = useStaggeredEntry(3);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: "That's a great question! Let me guide you to the answer. What do you already know about this topic? Let's start from what you're familiar with 🤔",
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <LinearGradient colors={['#1a0a3a', '#0d0620', '#1a1030']} style={styles.bg}>
      <StatusBar style="light" />
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          {/* Header */}
          <Animated.View style={s(0)}>
            <View style={styles.header}>
              <LinearGradient colors={['#9B6DFF', '#5B1BE5']} style={styles.aiIcon}>
                <Ionicons name="sparkles" size={18} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={styles.aiName}>Five AI Tutor</Text>
                <Text style={styles.aiStatus}>● Online · Modo socrático</Text>
              </View>
            </View>
          </Animated.View>

          {/* Messages */}
          <Animated.View style={[{ flex: 1 }, s(1)]}>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
                  {item.role === 'ai' && (
                    <LinearGradient colors={['#9B6DFF', '#5B1BE5']} style={styles.aiBubbleIcon}>
                      <Ionicons name="sparkles" size={10} color="#fff" />
                    </LinearGradient>
                  )}
                  <BlurView
                    intensity={item.role === 'ai' ? 40 : 0}
                    tint="dark"
                    style={[
                      styles.bubbleContent,
                      item.role === 'user' ? styles.bubbleContentUser : styles.bubbleContentAi,
                    ]}
                  >
                    <Text style={[styles.bubbleText, item.role === 'user' && styles.bubbleTextUser]}>
                      {item.text}
                    </Text>
                  </BlurView>
                </View>
              )}
            />
          </Animated.View>

          {/* Suggestions + Input */}
          <Animated.View style={s(2)}>
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((sg) => (
                <Pressable key={sg} onPress={() => setInput(sg)} style={styles.suggestion}>
                  <Text style={styles.suggestionText}>{sg}</Text>
                </Pressable>
              ))}
            </View>
            <BlurView intensity={60} tint="dark" style={styles.inputBar}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Ask me anything..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                onSubmitEditing={sendMessage}
              />
              <Pressable
                onPress={sendMessage}
                style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
                disabled={!input.trim()}
              >
                <LinearGradient colors={['#9B6DFF', '#5B1BE5']} style={styles.sendBtnGrad}>
                  <Ionicons name="arrow-up" size={18} color="#fff" />
                </LinearGradient>
              </Pressable>
            </BlurView>
          </Animated.View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:   { flex: 1 },
  safe: { flex: 1 },
  kav:  { flex: 1 },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.2 },
  orb1: { width: 250, height: 250, backgroundColor: '#7B5CF0', top: -80, right: -60 },
  orb2: { width: 180, height: 180, backgroundColor: '#4a9e50', bottom: 100, left: -50 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiName:   { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#fff' },
  aiStatus: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#10B981' },

  messageList: { paddingHorizontal: 16, paddingBottom: 8, gap: 12 },

  bubble: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  bubbleUser: { justifyContent: 'flex-end' },
  bubbleAi:   { justifyContent: 'flex-start' },
  aiBubbleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 4,
  },
  bubbleContent: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
    overflow: 'hidden',
  },
  bubbleContentAi: {
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  bubbleContentUser: {
    borderTopRightRadius: 4,
    backgroundColor: '#7B5CF0',
  },
  bubbleText:     { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 21 },
  bubbleTextUser: { color: '#fff' },

  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestion: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  suggestionText: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 100 : 90,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#fff',
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendBtn:         {},
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnGrad: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
