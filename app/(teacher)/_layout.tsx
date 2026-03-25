import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FloatingTabBar } from '@components/ui';

export default function TeacherLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Radar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pulse' : 'pulse-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Diário',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'journal' : 'journal-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="evaluate"
        options={{
          title: 'Avaliar',
          tabBarIcon: ({ color }) => (
            <Ionicons name="mic" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="class/[id]" options={{ href: null }} />
    </Tabs>
  );
}
