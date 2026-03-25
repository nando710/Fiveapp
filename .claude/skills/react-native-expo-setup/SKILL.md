---
name: react-native-expo-setup
description: >
  Setup, estrutura e arquitetura de projetos React Native com Expo. Use esta skill SEMPRE
  que o usuário quiser iniciar um projeto mobile, configurar navegação, definir estrutura
  de pastas, instalar dependências base, configurar o ambiente Expo, ou perguntar sobre
  boas práticas de arquitetura RN. Acione também para: "como começo um app RN", "estrutura
  de pastas para Expo", "configurar React Navigation", "qual a melhor arquitetura para
  React Native", "como organizo meu projeto mobile", "setup inicial do app", "quais
  dependências instalar", "Expo Router vs React Navigation", "monorepo com Expo".
  Esta skill cobre tanto Expo Go quanto Expo bare workflow e EAS.
---

# React Native + Expo — Setup e Arquitetura

Guia completo para iniciar, estruturar e arquitetar projetos React Native com Expo de forma
profissional, escalável e com boas práticas desde o primeiro commit.

## Referências disponíveis

Leia conforme necessário:
- `references/structure.md` — estrutura de pastas detalhada, convenções de nomenclatura
- `references/navigation.md` — React Navigation vs Expo Router, padrões de stack/tab/drawer
- `references/dependencies.md` — lista curada de dependências por categoria

---

## 1. Criação do projeto

### Expo Router (recomendado para novos projetos)
```bash
npx create-expo-app@latest MyApp --template tabs
cd MyApp && npx expo start
```

### Expo clássico (com React Navigation)
```bash
npx create-expo-app@latest MyApp
cd MyApp
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/native-stack
```

### Bare workflow (acesso nativo completo)
```bash
npx create-expo-app@latest MyApp --template bare-minimum
```

Prefira **Expo Router** para apps novos — file-based routing reduz boilerplate e melhora DX.
Use **bare workflow** apenas se precisar de módulos nativos sem suporte Expo.

---

## 2. Estrutura de pastas

```
MyApp/
├── app/                    # Rotas (Expo Router) OU screens (RN clássico)
│   ├── (tabs)/             # Tab group
│   │   ├── index.tsx       # Home
│   │   └── profile.tsx
│   ├── _layout.tsx         # Root layout
│   └── +not-found.tsx
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/             # Primitivos (Button, Input, Card)
│   │   └── features/       # Compostos por feature
│   ├── hooks/              # Custom hooks
│   ├── stores/             # Estado global (Zustand / Jotai)
│   ├── services/           # Chamadas de API
│   ├── utils/              # Funções utilitárias puras
│   ├── types/              # TypeScript types/interfaces
│   ├── constants/          # Cores, fontes, endpoints
│   └── theme/              # Design system tokens
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── app.json                # Configuração Expo
├── eas.json                # Configuração EAS Build
├── babel.config.js
├── tsconfig.json
└── .env                    # Variáveis de ambiente
```

A lógica de negócio fica em `src/`, nunca misturada com rotas/screens.
Componentes de UI puro ficam em `src/components/ui/`, sem lógica de negócio.

---

## 3. Configurações essenciais

### tsconfig.json (path aliases)
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@stores/*": ["src/stores/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@constants/*": ["src/constants/*"]
    }
  }
}
```

### babel.config.js (com aliases)
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@stores': './src/stores',
        }
      }],
      'react-native-reanimated/plugin', // sempre ÚLTIMO
    ],
  };
};
```

### app.json (configurações essenciais)
```json
{
  "expo": {
    "name": "MyApp",
    "slug": "myapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "splash": { "resizeMode": "contain", "backgroundColor": "#ffffff" },
    "ios": { "supportsTablet": false, "bundleIdentifier": "com.company.myapp" },
    "android": { "adaptiveIcon": {}, "package": "com.company.myapp" },
    "plugins": ["expo-router"],
    "scheme": "myapp"
  }
}
```

---

## 4. Dependências base recomendadas

```bash
# Navegação
npx expo install expo-router react-native-screens react-native-safe-area-context

# Animações e gestos
npx expo install react-native-reanimated react-native-gesture-handler

# UI e efeitos
npx expo install expo-blur expo-linear-gradient expo-constants expo-status-bar

# Fontes
npx expo install expo-font @expo-google-fonts/nunito

# Estado global
npm install zustand

# API
npm install @tanstack/react-query axios

# Async storage
npx expo install @react-native-async-storage/async-storage

# Imagens
npx expo install expo-image

# Dev tools
npm install -D typescript @types/react babel-plugin-module-resolver
```

Para lista completa por categoria, leia `references/dependencies.md`.

---

## 5. Arquitetura de estado

### Filosofia: Estado no nível certo
- **Local** (`useState`): UI state que não sai do componente (modal aberto, input value)
- **Servidor** (React Query / TanStack Query): dados remotos, cache, loading, erro
- **Global** (Zustand): estado compartilhado entre features (user, tema, carrinho)
- **URL** (Expo Router params): estado de navegação e filtros

### Zustand — store típico
```ts
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

---

## 6. Boas práticas de arquitetura

### Nomenclatura
- Componentes: `PascalCase.tsx` (ex: `MenuCard.tsx`)
- Hooks: `camelCase` com prefixo `use` (ex: `useAuth.ts`)
- Stores: `camelCase` com sufixo `Store` (ex: `authStore.ts`)
- Serviços: `camelCase` com sufixo `Service` (ex: `userService.ts`)
- Tipos: `PascalCase` com sufixo de domínio (ex: `UserProfile`, `ApiResponse<T>`)

### Regras de ouro
1. **Componentes burros** — UI components recebem dados via props, não chamam API diretamente
2. **Custom hooks** — lógica de negócio e side effects ficam em hooks, não em componentes
3. **Barrel exports** — use `index.ts` por pasta para exportações limpas
4. **Evite prop drilling** — mais de 2 níveis → use context ou store global
5. **Absolutamente sem `any`** — TypeScript strict mode sempre ativo
6. **Teste a lógica, não a UI** — hooks e utils são mais fáceis de testar que componentes

### Barrel export exemplo
```ts
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// uso limpo:
import { Button, Input, Card } from '@components/ui';
```

---

## 7. Checklist de setup completo

- [ ] Projeto criado com template correto
- [ ] TypeScript configurado com strict e path aliases
- [ ] Babel configurado com module-resolver
- [ ] Dependências base instaladas
- [ ] Estrutura de pastas criada
- [ ] Stores iniciais definidos (auth, theme)
- [ ] React Query / TanStack configurado com QueryClient
- [ ] Fontes carregadas via `expo-font`
- [ ] Variáveis de ambiente configuradas (`.env` + `app.config.ts`)
- [ ] EAS configurado para builds (`eas.json`)
- [ ] Git + `.gitignore` configurados
