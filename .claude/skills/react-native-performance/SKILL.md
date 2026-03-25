---
name: react-native-performance
description: >
  Otimização de performance em React Native: FlatList, memo, lazy loading, prevenção
  de re-renders, profiling e análise de bundle. Use esta skill SEMPRE que o usuário
  quiser melhorar a performance do app, identificar gargalos, ou seguir boas práticas
  de otimização. Acione para: "app lento", "scroll lagando", "FlatList performática",
  "evitar re-renders", "memo e useCallback RN", "profiling React Native", "bundle size",
  "lazy loading de telas", "imagens otimizadas mobile", "lista com muitos itens",
  "animação travando", "hermes engine", "RAM usage alto", "flip debug performance",
  "Flashlist vs FlatList", "virtualização de lista", "React.memo quando usar",
  "useCallback quando usar", "otimizar context", "evitar inline functions RN".
---

# Performance React Native — Otimizações e Boas Práticas

Performance em RN é diferente do web: o bridge JS↔Native é o principal gargalo.
O objetivo é minimizar comunicações cross-bridge e manter o JS thread livre.

## Referências disponíveis
- `references/profiling.md` — como usar Flipper, Perf Monitor e React DevTools
- `references/flashlist.md` — migração e uso do FlashList (substituto do FlatList)

---

## 1. Regra de ouro: threads em RN

```
JS Thread     → lógica do app, React, state updates
UI Thread     → renderização nativa
Render Thread → animações (Reanimated roda aqui, não no JS)
```

Animações lentas = JS Thread sobrecarregado.
Scroll lagando = renderização de células custosa.
App "congelando" = operação pesada no JS Thread.

---

## 2. FlatList performática

```tsx
import { FlatList, ListRenderItem } from 'react-native';
import { memo, useCallback } from 'react';

interface Item { id: string; title: string; }

// 1. Componente de item memoizado FORA do componente pai
const ListItem = memo(({ item }: { item: Item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));

// 2. keyExtractor estável e memoizado
const keyExtractor = (item: Item) => item.id;

// 3. Componente pai com renderItem memoizado
export function MyList({ data }: { data: Item[] }) {
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <ListItem item={item} />,
    []
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      // Performance props essenciais:
      removeClippedSubviews={true}        // remove itens fora da tela da memória
      maxToRenderPerBatch={10}            // items renderizados por batch
      updateCellsBatchingPeriod={30}      // ms entre batches
      initialNumToRender={10}             // itens renderizados no mount
      windowSize={10}                     // janela de renderização (5 acima + 5 abaixo)
      getItemLayout={(_, index) => ({     // CRUCIAL se itens têm altura fixa
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
}
```

### FlashList (substituto recomendado para listas longas)
```bash
npx expo install @shopify/flash-list
```

```tsx
import { FlashList } from '@shopify/flash-list';

// Mesma API do FlatList, mas muito mais rápido
<FlashList
  data={data}
  renderItem={renderItem}
  estimatedItemSize={80}  // altura estimada dos itens — obrigatório
  keyExtractor={keyExtractor}
/>
```

---

## 3. React.memo — quando usar

```tsx
// ✅ USE memo quando:
// - Componente é filho de um componente que re-renderiza frequentemente
// - Props raramente mudam
// - Componente é "pesado" (tem lógica ou filhos complexos)

const HeavyCard = memo(({ data, onPress }: CardProps) => {
  // componente custoso
}, (prevProps, nextProps) => {
  // comparação customizada — retorna true se props são iguais (skip re-render)
  return prevProps.data.id === nextProps.data.id;
});

// ❌ NÃO use memo quando:
// - Componente é simples (uma linha de texto)
// - Props mudam quase sempre
// - Componente é a raiz de uma árvore pequena
```

---

## 4. useCallback e useMemo

```tsx
// useCallback: memoiza funções passadas como props para componentes memoizados
const handlePress = useCallback((id: string) => {
  navigation.navigate('Detail', { id });
}, [navigation]); // só recria se navigation mudar

// useMemo: memoiza computações caras
const filteredData = useMemo(() =>
  data.filter(item => item.active && item.category === selectedCategory),
  [data, selectedCategory] // só recomputa quando estes mudam
);

// ❌ Anti-pattern: inline function em renderItem SEMPRE recria a função
// <FlatList renderItem={({ item }) => <Item item={item} />} />
//   ↑ nova função a cada render = FlatList re-renderiza todos os itens

// ✅ Correto:
// const renderItem = useCallback(({ item }) => <Item item={item} />, []);
// <FlatList renderItem={renderItem} />
```

---

## 5. Context sem re-renders desnecessários

```tsx
// ❌ Problema: qualquer mudança no Context re-renderiza TODOS os consumers
const AppContext = createContext({ user: null, theme: 'light', counter: 0 });

// ✅ Solução 1: separar contextos por domínio
const UserContext = createContext<User | null>(null);
const ThemeContext = createContext<'light' | 'dark'>('light');

// ✅ Solução 2: usar Zustand (recomendado) — componentes subscrevem só ao que usam
const useUser = () => useStore(state => state.user); // só re-renderiza se user mudar
const useTheme = () => useStore(state => state.theme); // independente de user
```

---

## 6. Imagens otimizadas

```tsx
import { Image } from 'expo-image'; // não usar Image do RN para produção

<Image
  source={{ uri: 'https://...' }}
  style={{ width: 100, height: 100 }}
  // Caching automático, blurhash placeholder, formatos modernos (WebP/AVIF)
  placeholder={{ blurhash: 'L6Pj0^jE.AyE_3t7t7R**0o#DgR4' }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"  // cache em memória + disco
/>
```

Para listas: definir `width` e `height` fixos sempre — evita layout shifts e recálculos.

---

## 7. Lazy loading de telas

```tsx
// Com Expo Router — automático (cada arquivo é um chunk)

// Com React Navigation — lazy manual:
import { lazy, Suspense } from 'react';
const HeavyScreen = lazy(() => import('./HeavyScreen'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HeavyScreen />
    </Suspense>
  );
}
```

---

## 8. Hermes Engine

Hermes é o engine JS otimizado para RN — ativo por padrão no Expo SDK 48+.

```json
// app.json — verificar se está ativo
{
  "expo": {
    "jsEngine": "hermes"  // padrão, não precisa adicionar
  }
}
```

Benefícios do Hermes:
- Bytecode pré-compilado → startup ~30% mais rápido
- Menor uso de memória
- Better GC (garbage collection)

---

## 9. Checklist de performance antes de release

### Profiling
- [ ] Abrir Flipper → React DevTools → gravar interação lenta
- [ ] Identificar componentes com re-renders desnecessários (highlight updates)
- [ ] Verificar JS thread no Performance Monitor (deve ficar < 16ms por frame)

### Listas
- [ ] Todos os `renderItem` em `useCallback`
- [ ] Itens de lista em `memo`
- [ ] `getItemLayout` definido se altura fixa
- [ ] `keyExtractor` usando ID único (nunca índice)

### Imagens
- [ ] `expo-image` ao invés de `Image` do RN
- [ ] Dimensões explícitas em todas as imagens
- [ ] Blurhash placeholder para imagens remotas

### Estado
- [ ] Sem computações pesadas no render
- [ ] `useMemo` para filtros/ordenações sobre arrays grandes
- [ ] Context separado por domínio ou Zustand

### Bundle
- [ ] `console.log` removidos em produção
- [ ] Imports específicos (não `import _ from 'lodash'`, use `import debounce from 'lodash/debounce'`)
