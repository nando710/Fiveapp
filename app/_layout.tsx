import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@theme/ThemeContext';
import { useAuthStore } from '@stores/authStore';
import { AnimatedSplash } from '@components/ui/AnimatedSplash';
import type { UserRole } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

const ROLE_ROUTES: Record<UserRole, string> = {
  student:        '/(student)',
  teacher:        '/(teacher)',
  franchise_owner: '/(franchise)',
  admin:          '/(admin)',
};

function AuthGuard() {
  const user = useAuthStore((s) => s.user);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (user && inAuthGroup) {
      router.replace(ROLE_ROUTES[user.role] as never);
    }
  }, [user, segments]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const [splashDone, setSplashDone] = useState(false);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthGuard />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
          {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
