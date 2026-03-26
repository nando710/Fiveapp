import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FloatingTabBar } from '@components/ui';

export default function StudentLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="homeworks"
        options={{
          title: 'Homeworks',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'Five AI',
          tabBarIcon: ({ color }) => (
            <Ionicons name="sparkles" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          title: 'Listen',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'headset' : 'headset-outline'} size={22} color={color} />
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
      <Tabs.Screen name="ar" options={{ href: null }} />
      <Tabs.Screen name="homework/[id]" options={{ href: null }} />
      <Tabs.Screen name="journey" options={{ href: null }} />
    </Tabs>
  );
}
