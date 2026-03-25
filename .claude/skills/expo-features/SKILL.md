---
name: expo-features
description: >
  APIs e funcionalidades do ecossistema Expo: câmera, notificações, armazenamento,
  deep linking, EAS Build e Submit. Use esta skill SEMPRE que o usuário quiser usar
  recursos nativos do dispositivo via Expo ou configurar o pipeline de build/deploy.
  Acione para: "câmera no Expo", "push notifications", "notificações locais",
  "armazenar dados localmente", "deep link no app", "universal links", "EAS Build",
  "publicar na App Store", "publicar no Google Play", "OTA updates", "expo-camera",
  "expo-notifications", "expo-secure-store", "expo-file-system", "expo-location",
  "permissões no Expo", "acesso à galeria", "gravação de áudio", "sensor do dispositivo",
  "biometria", "compartilhar conteúdo", "abrir URL externa", "configurar EAS".
---

# Expo Features — APIs Nativas e Pipeline de Build

Guia de uso das principais APIs do Expo SDK e configuração do EAS para build e distribuição.

## Referências disponíveis
- `references/eas.md` — EAS Build, Submit e Update (OTA) em detalhe
- `references/permissions.md` — padrão de requisição de permissões

---

## 1. Câmera (`expo-camera`)

```bash
npx expo install expo-camera
```

```tsx
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos de acesso à câmera</Text>
        <Button onPress={requestPermission} title="Permitir" />
      </View>
    );
  }

  return (
    <CameraView style={styles.camera} facing={facing}>
      <View style={styles.controls}>
        <Button title="Girar" onPress={() =>
          setFacing(f => f === 'back' ? 'front' : 'back')
        } />
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1 },
  controls: { position: 'absolute', bottom: 40, alignSelf: 'center' },
});
```

---

## 2. Notificações Push (`expo-notifications`)

```bash
npx expo install expo-notifications expo-device
```

### Setup de token (enviar para seu backend)
```ts
// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications só funcionam em dispositivo físico');
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}
```

### Notificação local agendada
```ts
export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds = 60
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { type: 'timeInterval', seconds, repeats: false },
  });
}

// Cancelar todas:
await Notifications.cancelAllScheduledNotificationsAsync();
```

### Listener de notificação recebida
```tsx
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export function useNotificationListener(onReceive: (n: Notifications.Notification) => void) {
  const listenerRef = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    listenerRef.current = Notifications.addNotificationReceivedListener(onReceive);
    return () => listenerRef.current?.remove();
  }, []);
}
```

---

## 3. Armazenamento Seguro (`expo-secure-store`)

Para tokens de autenticação e dados sensíveis:

```bash
npx expo install expo-secure-store
```

```ts
// src/services/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },
  async delete(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};

// Uso:
// await secureStorage.set('auth_token', token);
// const token = await secureStorage.get('auth_token');
```

---

## 4. Deep Linking e Universal Links

### Configuração em `app.json`
```json
{
  "expo": {
    "scheme": "fiveapp",
    "ios": {
      "associatedDomains": ["applinks:fiveapp.com.br"]
    },
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "autoVerify": true,
        "data": [{ "scheme": "https", "host": "fiveapp.com.br" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }]
    }
  }
}
```

### Handler com Expo Router
```tsx
// app/_layout.tsx — Expo Router já lida com deep links automaticamente
// URL: fiveapp://homework/123 → app/homework/[id].tsx

// Para links universais https://fiveapp.com.br/homework/123
// Precisa de configuração no servidor (apple-app-site-association / assetlinks.json)
```

### Handler manual (React Navigation)
```ts
const linking = {
  prefixes: ['fiveapp://', 'https://fiveapp.com.br'],
  config: {
    screens: {
      Home: '',
      Homework: 'homework/:id',
      Profile: 'profile',
    },
  },
};
// <NavigationContainer linking={linking}>
```

---

## 5. Localização (`expo-location`)

```bash
npx expo install expo-location
```

```ts
import * as Location from 'expo-location';

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Permissão negada');

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
}
```

---

## 6. Biometria (`expo-local-authentication`)

```bash
npx expo install expo-local-authentication
```

```ts
import * as LocalAuthentication from 'expo-local-authentication';

export async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirme sua identidade',
    fallbackLabel: 'Usar senha',
    cancelLabel: 'Cancelar',
  });

  return result.success;
}
```

---

## 7. Compartilhamento (`expo-sharing`)

```bash
npx expo install expo-sharing expo-file-system
```

```ts
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export async function shareFile(remoteUrl: string, filename: string) {
  const localUri = FileSystem.cacheDirectory + filename;
  await FileSystem.downloadAsync(remoteUrl, localUri);
  await Sharing.shareAsync(localUri);
}
```

---

## 8. EAS Build — Comandos essenciais

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure

# Build de desenvolvimento (com dev client)
eas build --profile development --platform ios
eas build --profile development --platform android

# Build de preview (APK/IPA para testers)
eas build --profile preview --platform all

# Build de produção
eas build --profile production --platform all

# Submit para lojas
eas submit --platform ios
eas submit --platform android

# OTA Update (sem passar pelas lojas)
eas update --branch production --message "Fix crítico"
```

Para eas.json detalhado, leia `references/eas.md`.

---

## 9. Padrão de permissões

Sempre seguir este padrão para qualquer permissão:

```tsx
// 1. Verificar status antes de requisitar
// 2. Mostrar explicação ANTES de pedir
// 3. Tratar negação graciosamente
// 4. Nunca bloquear o app por falta de permissão

function usePermission(hook: () => [PermissionResponse | null, () => Promise<PermissionResponse>]) {
  const [permission, request] = hook();

  const requestWithContext = async (reason: string): Promise<boolean> => {
    if (permission?.granted) return true;
    if (permission?.canAskAgain === false) {
      // Usuário negou permanentemente — redirecionar para settings
      Linking.openSettings();
      return false;
    }
    // Mostrar explicação ao usuário antes de chamar request()
    const result = await request();
    return result.granted;
  };

  return { granted: permission?.granted ?? false, request: requestWithContext };
}
```
