# Dependências React Native + Expo — Lista Curada

## Navegação
| Pacote | Uso | Instalar com |
|---|---|---|
| `expo-router` | File-based routing (recomendado) | `npx expo install` |
| `@react-navigation/native` | Navegação clássica | `npx expo install` |
| `@react-navigation/native-stack` | Stack navigator | `npm install` |
| `@react-navigation/bottom-tabs` | Tab navigator | `npm install` |
| `@react-navigation/drawer` | Drawer navigator | `npm install` |
| `react-native-screens` | Otimização de telas | `npx expo install` |
| `react-native-safe-area-context` | Safe area | `npx expo install` |

## Animações e Gestos
| Pacote | Uso |
|---|---|
| `react-native-reanimated` | Animações performáticas (worklets) |
| `react-native-gesture-handler` | Gestos avançados (swipe, pinch, pan) |
| `moti` | Animações declarativas sobre Reanimated |
| `react-native-skia` | Gráficos 2D e efeitos visuais avançados |

## UI e Visual
| Pacote | Uso |
|---|---|
| `expo-blur` | BlurView para glassmorphism |
| `expo-linear-gradient` | Gradientes |
| `expo-image` | Imagens otimizadas (substitui Image do RN) |
| `expo-symbols` | SF Symbols (iOS) |
| `@expo/vector-icons` | Ícones (Ionicons, MaterialIcons, etc.) |
| `react-native-svg` | SVG inline |

## Fontes
| Pacote | Uso |
|---|---|
| `expo-font` | Carregamento de fontes customizadas |
| `@expo-google-fonts/nunito` | Família Nunito completa |
| `@expo-google-fonts/inter` | Família Inter |

## Estado Global
| Pacote | Uso |
|---|---|
| `zustand` | Estado global simples e performático ✅ recomendado |
| `jotai` | Estado atômico (alternativa ao Zustand) |
| `@reduxjs/toolkit` | Redux moderno (para apps grandes) |

## Data Fetching e Cache
| Pacote | Uso |
|---|---|
| `@tanstack/react-query` | Server state, cache, loading/error ✅ recomendado |
| `axios` | HTTP client com interceptors |
| `swr` | Alternativa ao React Query |

## Armazenamento Local
| Pacote | Uso |
|---|---|
| `@react-native-async-storage/async-storage` | Key-value persistência |
| `expo-secure-store` | Armazenamento seguro (tokens, senhas) |
| `expo-file-system` | Acesso ao sistema de arquivos |

## Formulários
| Pacote | Uso |
|---|---|
| `react-hook-form` | Gerenciamento de forms ✅ recomendado |
| `zod` | Validação de schema TypeScript-first |

## Utilitários
| Pacote | Uso |
|---|---|
| `expo-constants` | Constantes do app (version, deviceId) |
| `expo-device` | Informações do dispositivo |
| `expo-haptics` | Feedback háptico (vibração) |
| `expo-clipboard` | Copiar/colar |
| `dayjs` | Manipulação de datas (substitui moment) |
| `lodash` | Utilitários JS |

## Internacionalização
| Pacote | Uso |
|---|---|
| `i18next` | Framework i18n |
| `react-i18next` | Hooks para i18next |
| `expo-localization` | Locale do dispositivo |

## Dev Tools
| Pacote | Uso |
|---|---|
| `typescript` | TypeScript |
| `babel-plugin-module-resolver` | Path aliases |
| `eslint` + `eslint-config-expo` | Linting |
| `prettier` | Formatação |
| `jest` + `jest-expo` | Testes |
| `@testing-library/react-native` | Testes de componentes |

## EAS (Build e Deploy)
```bash
npm install -g eas-cli
eas login
eas build:configure
```

## eas.json básico
```json
{
  "cli": { "version": ">= 5.9.1" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": { "distribution": "internal" },
    "production": { "autoIncrement": true }
  },
  "submit": {
    "production": {}
  }
}
```
