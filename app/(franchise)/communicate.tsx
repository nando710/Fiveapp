import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PushItem {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  recipients: number;
  opens: number;
}

interface StoryItem {
  id: string;
  student: string;
  avatar: string;
  class: string;
  postedAt: string;
  thumbnail: string;
}

interface InboxItem {
  id: string;
  from: string;
  subject: string;
  date: string;
  read: boolean;
  message: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TABS = ['Push', 'Stories', 'Caixa de Entrada'];

const PUSH_HISTORY: PushItem[] = [
  { id: 'p1', title: 'Lembrete de matrícula', message: 'Não esqueça de renovar sua matrícula para o próximo semestre!', sentAt: 'Hoje, 10:30', recipients: 142, opens: 89 },
  { id: 'p2', title: 'English Day — 12/04', message: 'Venha participar do English Day com atividades de conversação.', sentAt: 'Ontem, 14:00', recipients: 142, opens: 112 },
  { id: 'p3', title: 'Horário especial feriado', message: 'Feriado 31/03 — aulas online mantidas normalmente.', sentAt: '23/03, 09:00', recipients: 142, opens: 134 },
];

const INITIAL_STORIES: StoryItem[] = [
  { id: 's1', student: 'Lucas A.', avatar: 'https://i.pravatar.cc/150?img=10', class: 'Book 1', postedAt: 'Hoje, 08:45', thumbnail: 'https://i.pravatar.cc/300?img=10' },
  { id: 's2', student: 'Beatriz F.', avatar: 'https://i.pravatar.cc/150?img=32', class: 'Book 3', postedAt: 'Hoje, 07:20', thumbnail: 'https://i.pravatar.cc/300?img=32' },
  { id: 's3', student: 'Julia M.', avatar: 'https://i.pravatar.cc/150?img=25', class: 'Book 2', postedAt: 'Ontem, 19:00', thumbnail: 'https://i.pravatar.cc/300?img=25' },
];

const INBOX: InboxItem[] = [
  { id: 'i1', from: 'Franqueadora Five', subject: 'Atualização metodológica — Book 3 Unit 4', date: '25/03', read: false, message: 'Nova versão dos exercícios de listening disponível no CMS.' },
  { id: 'i2', from: 'Franqueadora Five', subject: 'Campanha Abril — English Day', date: '22/03', read: true, message: 'Material de divulgação e script de push notification para o English Day.' },
  { id: 'i3', from: 'Franqueadora Five', subject: 'Relatório mensal — Fevereiro', date: '05/03', read: true, message: 'Relatório de engajamento e retenção do mês anterior disponível.' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CommunicateScreen() {
  const { s } = useStaggeredEntry(3);
  const [activeTab, setActiveTab] = useState(0);
  const [pendingStories, setPendingStories] = useState<StoryItem[]>(INITIAL_STORIES);
  const [expandedInbox, setExpandedInbox] = useState<string | null>(null);

  const removeStory = (id: string) => {
    setPendingStories((prev) => prev.filter((st) => st.id !== id));
  };

  const toggleInbox = (id: string) => {
    setExpandedInbox((prev) => (prev === id ? null : id));
  };

  const openRate = (opens: number, recipients: number) =>
    Math.round((opens / recipients) * 100);

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={styles.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Header ── */}
          <Animated.View style={s(0)}>
            <Text style={styles.headerTitle}>Comunicação</Text>
            <Text style={styles.headerSubtitle}>
              Push notifications, stories e mensagens da franqueadora
            </Text>
          </Animated.View>

          {/* ── Tabs ── */}
          <Animated.View style={s(1)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
            >
              {TABS.map((tab, idx) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(idx)}
                  style={[
                    styles.tabChip,
                    activeTab === idx && styles.tabChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabChipText,
                      activeTab === idx && styles.tabChipTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* ── Tab Content ── */}
          <Animated.View style={s(2)}>
            {activeTab === 0 && (
              <View>
                {/* New Push Button */}
                <Pressable style={styles.newPushShadow}>
                  <LinearGradient
                    colors={['#7B5CF0', '#5B3FD0']}
                    style={styles.newPushBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="notifications-outline" size={18} color="#fff" />
                    <Text style={styles.newPushText}>Novo Push</Text>
                  </LinearGradient>
                </Pressable>

                {/* Push History */}
                <Text style={styles.sectionTitle}>Histórico</Text>
                {PUSH_HISTORY.map((push) => (
                  <View key={push.id} style={styles.cardShadow}>
                    <BlurView intensity={50} tint="light" style={styles.pushCard}>
                      <View style={styles.pushHeader}>
                        <Text style={styles.pushTitle} numberOfLines={1}>
                          {push.title}
                        </Text>
                        <Text style={styles.pushDate}>{push.sentAt}</Text>
                      </View>
                      <Text style={styles.pushMessage} numberOfLines={1}>
                        {push.message}
                      </Text>
                      <View style={styles.pushFooter}>
                        <View style={styles.pushStat}>
                          <Ionicons name="people-outline" size={13} color="#888" />
                          <Text style={styles.pushStatText}>
                            {push.recipients} destinatários
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.openRateBadge,
                            {
                              backgroundColor:
                                openRate(push.opens, push.recipients) > 75
                                  ? 'rgba(16,185,129,0.12)'
                                  : openRate(push.opens, push.recipients) > 50
                                  ? 'rgba(245,158,11,0.12)'
                                  : 'rgba(239,68,68,0.12)',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.openRateText,
                              {
                                color:
                                  openRate(push.opens, push.recipients) > 75
                                    ? '#10B981'
                                    : openRate(push.opens, push.recipients) > 50
                                    ? '#F59E0B'
                                    : '#EF4444',
                              },
                            ]}
                          >
                            {openRate(push.opens, push.recipients)}% abertos
                          </Text>
                        </View>
                      </View>
                    </BlurView>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 1 && (
              <View>
                {pendingStories.length === 0 && (
                  <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle-outline" size={48} color="#10B981" />
                    <Text style={styles.emptyText}>Nenhum story pendente</Text>
                  </View>
                )}
                {pendingStories.map((story) => (
                  <View key={story.id} style={styles.cardShadow}>
                    <BlurView intensity={50} tint="light" style={styles.storyCard}>
                      <View style={styles.storyLeft}>
                        <Image
                          source={{ uri: story.avatar }}
                          style={styles.storyAvatar}
                          contentFit="cover"
                        />
                        <View style={styles.storyInfo}>
                          <Text style={styles.storyStudent}>{story.student}</Text>
                          <Text style={styles.storyClass}>{story.class}</Text>
                          <Text style={styles.storyDate}>{story.postedAt}</Text>
                        </View>
                      </View>
                      <Image
                        source={{ uri: story.thumbnail }}
                        style={styles.storyThumbnail}
                        contentFit="cover"
                      />
                    </BlurView>
                    <View style={styles.storyActions}>
                      <Pressable
                        onPress={() => removeStory(story.id)}
                        style={styles.removeBtn}
                      >
                        <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                        <Text style={styles.removeBtnText}>Remover</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => removeStory(story.id)}
                        style={styles.approveBtn}
                      >
                        <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                        <Text style={styles.approveBtnText}>Aprovar</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 2 && (
              <View>
                {INBOX.map((msg) => (
                  <Pressable
                    key={msg.id}
                    onPress={() => toggleInbox(msg.id)}
                  >
                    <View style={styles.cardShadow}>
                      <BlurView
                        intensity={50}
                        tint="light"
                        style={[
                          styles.inboxCard,
                          !msg.read && styles.inboxCardUnread,
                        ]}
                      >
                        <View style={styles.inboxHeader}>
                          {!msg.read && <View style={styles.unreadDot} />}
                          <View style={styles.inboxHeaderText}>
                            <Text
                              style={[
                                styles.inboxSubject,
                                !msg.read && styles.inboxSubjectUnread,
                              ]}
                              numberOfLines={1}
                            >
                              {msg.subject}
                            </Text>
                            <View style={styles.inboxMeta}>
                              <Text style={styles.inboxFrom}>{msg.from}</Text>
                              <Text style={styles.inboxDate}>{msg.date}</Text>
                            </View>
                          </View>
                          <Ionicons
                            name={expandedInbox === msg.id ? 'chevron-up' : 'chevron-down'}
                            size={18}
                            color="#888"
                          />
                        </View>
                        {expandedInbox === msg.id && (
                          <Text style={styles.inboxMessage}>{msg.message}</Text>
                        )}
                      </BlurView>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  // Header
  headerTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 26,
    color: '#1a1030',
    marginHorizontal: 16,
    marginTop: 20,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#888',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },

  // Tabs
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tabChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 50,
    backgroundColor: 'rgba(123,92,240,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(123,92,240,0.15)',
  },
  tabChipActive: {
    backgroundColor: '#7B5CF0',
    borderColor: '#7B5CF0',
  },
  tabChipText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#7B5CF0',
  },
  tabChipTextActive: {
    color: '#fff',
  },

  // Section title
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1a1030',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },

  // Card shadow
  cardShadow: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // New Push button
  newPushShadow: {
    marginHorizontal: 16,
    borderRadius: 50,
    shadowColor: '#7B5CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  newPushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 50,
  },
  newPushText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#fff',
  },

  // Push card
  pushCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
    gap: 8,
  },
  pushHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pushTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#1a1030',
    flex: 1,
    marginRight: 8,
  },
  pushDate: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
  pushMessage: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#666',
  },
  pushFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  pushStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pushStatText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
  openRateBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  openRateText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },

  // Story card
  storyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  storyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0DCEF',
  },
  storyInfo: {
    flex: 1,
    gap: 2,
  },
  storyStudent: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#1a1030',
  },
  storyClass: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#7B5CF0',
  },
  storyDate: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
  storyThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E0DCEF',
    marginLeft: 10,
  },
  storyActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  removeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.06)',
  },
  removeBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#EF4444',
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
  approveBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#fff',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#888',
  },

  // Inbox card
  inboxCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
    padding: 14,
  },
  inboxCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#7B5CF0',
  },
  inboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7B5CF0',
  },
  inboxHeaderText: {
    flex: 1,
    gap: 4,
  },
  inboxSubject: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#1a1030',
  },
  inboxSubjectUnread: {
    fontFamily: 'Nunito_800ExtraBold',
  },
  inboxMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inboxFrom: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
  inboxDate: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#888',
  },
  inboxMessage: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#555',
    marginTop: 10,
    lineHeight: 19,
  },
});
