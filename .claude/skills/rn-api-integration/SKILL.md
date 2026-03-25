---
name: rn-api-integration
description: >
  Integração de APIs, gerenciamento de estado servidor e tratamento de dados offline
  em React Native com React Query, Axios e padrões mobile-first. Use esta skill SEMPRE
  que o usuário quiser conectar o app a um backend, gerenciar dados remotos, tratar
  loading/erro/cache, ou lidar com conectividade. Acione para: "chamar API no RN",
  "React Query no mobile", "configurar Axios RN", "autenticação JWT mobile",
  "refresh token automático", "cache de dados", "estado offline", "sincronizar dados",
  "otimistic update mobile", "paginação infinita RN", "interceptor Axios", "tratar erro
  de API", "loading state", "skeleton enquanto carrega", "dados em background",
  "WebSocket RN", "upload de arquivo mobile", "multipart form data", "retry automático".
---

# API Integration — React Native + React Query + Axios

Padrões de integração com backends para apps mobile: performático, offline-first,
com tratamento de erros e UX adequada para conexões móveis instáveis.

## Referências disponíveis
- `references/react-query.md` — padrões avançados: infinite scroll, mutations, optimistic updates
- `references/offline.md` — estratégias offline: queue, sync, conflict resolution

---

## 1. Configuração base do Axios

```ts
// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from './secureStorage';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.fiveapp.com.br',
  timeout: 15000,  // 15s — mobile tem latência maior
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: adiciona token em toda requisição
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStorage.get('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: refresh token automático
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: Error) => void }> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.get('refresh_token');
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        await secureStorage.set('auth_token', data.token);
        failedQueue.forEach(p => p.resolve(data.token));
        failedQueue = [];
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch (e) {
        failedQueue.forEach(p => p.reject(e as Error));
        failedQueue = [];
        // Logout automático
        await secureStorage.delete('auth_token');
        await secureStorage.delete('refresh_token');
        // useAuthStore.getState().logout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 2. React Query — configuração global

```tsx
// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager, focusManager } from '@tanstack/react-query';
import { AppState } from 'react-native';
import { useEffect } from 'react';

// React Query detecta quando app volta ao foco (background → foreground)
focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (state) => {
    handleFocus(state === 'active');
  });
  return () => subscription.remove();
});

// React Query detecta quando volta online
onlineManager.setEventListener((setOnline) => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
  return unsubscribe;
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 min — dados "frescos"
      gcTime:    1000 * 60 * 60,     // 1h — manter em cache
      retry: 2,                       // tentar 2x antes de falhar
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      networkMode: 'offlineFirst',    // mobile-first
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

---

## 3. Service layer tipado

```ts
// src/services/homeworkService.ts
import { api } from './api';

export interface Homework {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  subject: string;
}

export interface CreateHomeworkInput {
  title: string;
  dueDate: string;
  subject: string;
}

export const homeworkService = {
  getAll: async (): Promise<Homework[]> => {
    const { data } = await api.get('/homeworks');
    return data;
  },

  getById: async (id: string): Promise<Homework> => {
    const { data } = await api.get(`/homeworks/${id}`);
    return data;
  },

  create: async (input: CreateHomeworkInput): Promise<Homework> => {
    const { data } = await api.post('/homeworks', input);
    return data;
  },

  complete: async (id: string): Promise<Homework> => {
    const { data } = await api.patch(`/homeworks/${id}/complete`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/homeworks/${id}`);
  },
};
```

---

## 4. Custom hooks com React Query

```ts
// src/hooks/useHomeworks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeworkService, CreateHomeworkInput } from '@services/homeworkService';

// Query keys centralizadas — evita typos e facilita invalidação
export const homeworkKeys = {
  all:    ['homeworks'] as const,
  byId:   (id: string) => ['homeworks', id] as const,
};

// Lista
export function useHomeworks() {
  return useQuery({
    queryKey: homeworkKeys.all,
    queryFn:  homeworkService.getAll,
    // Dados ficam disponíveis mesmo offline (se já foram carregados antes)
  });
}

// Detalhe
export function useHomework(id: string) {
  return useQuery({
    queryKey: homeworkKeys.byId(id),
    queryFn:  () => homeworkService.getById(id),
    enabled:  !!id,
  });
}

// Criação com optimistic update
export function useCreateHomework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: homeworkService.create,
    onMutate: async (newHomework: CreateHomeworkInput) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: homeworkKeys.all });
      // Snapshot do estado anterior
      const previous = queryClient.getQueryData(homeworkKeys.all);
      // Atualização otimista
      queryClient.setQueryData(homeworkKeys.all, (old: any) => [
        ...(old ?? []),
        { ...newHomework, id: 'temp-' + Date.now(), completed: false },
      ]);
      return { previous };
    },
    onError: (_, __, context) => {
      // Rollback em caso de erro
      queryClient.setQueryData(homeworkKeys.all, context?.previous);
    },
    onSettled: () => {
      // Revalida após sucesso ou erro
      queryClient.invalidateQueries({ queryKey: homeworkKeys.all });
    },
  });
}

// Uso nos componentes:
// const { data, isLoading, error } = useHomeworks();
// const { mutate: createHomework, isPending } = useCreateHomework();
```

---

## 5. Tratamento de erros tipado

```ts
// src/utils/apiError.ts
import { AxiosError } from 'axios';

interface ApiErrorBody {
  message: string;
  code?: string;
  field?: string;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody;
    if (body?.message) return body.message;
    if (error.response?.status === 404) return 'Conteúdo não encontrado';
    if (error.response?.status === 403) return 'Sem permissão para esta ação';
    if (error.response?.status === 500) return 'Erro interno. Tente novamente.';
    if (!error.response) return 'Sem conexão com a internet';
  }
  return 'Algo deu errado. Tente novamente.';
}
```

---

## 6. Paginação infinita

```ts
// src/hooks/useInfiniteHomeworks.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@services/api';

interface Page { data: Homework[]; nextCursor: string | null; }

export function useInfiniteHomeworks() {
  return useInfiniteQuery({
    queryKey: ['homeworks', 'infinite'],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<Page>('/homeworks', {
        params: { cursor: pageParam, limit: 20 },
      });
      return data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
}

// Com FlashList:
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteHomeworks();
// const allItems = data?.pages.flatMap(p => p.data) ?? [];
// <FlashList onEndReached={() => hasNextPage && fetchNextPage()} estimatedItemSize={80} />
```

---

## 7. Upload de arquivos

```ts
// src/services/uploadService.ts
import * as ImagePicker from 'expo-image-picker';
import { api } from './api';

export async function pickAndUploadImage(endpoint: string): Promise<string> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (result.canceled) throw new Error('Cancelado');

  const asset = result.assets[0];
  const filename = asset.uri.split('/').pop()!;
  const type = `image/${filename.split('.').pop()}`;

  const form = new FormData();
  form.append('file', { uri: asset.uri, name: filename, type } as any);

  const { data } = await api.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.url; // URL pública retornada pelo servidor
}
```

---

## 8. WebSocket com reconexão automática

```ts
// src/services/wsService.ts
import { useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url: string, onMessage: (data: any) => void) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    ws.current = new WebSocket(url);

    ws.current.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data)); }
      catch { /* ignore parse errors */ }
    };

    ws.current.onclose = () => {
      // Reconexão com backoff exponencial
      reconnectTimeout.current = setTimeout(connect, 3000);
    };
  }, [url, onMessage]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [connect]);

  const send = useCallback((data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { send };
}
```
