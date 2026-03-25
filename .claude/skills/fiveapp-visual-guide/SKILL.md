---
name: fiveapp-visual-guide
description: >
  Guia visual e design system completo do FiveApp — um app educacional React Native + Expo
  com estética liquid glass, glassmorphism pesado e mascotes 3D monstros. Use esta skill
  SEMPRE que o usuário pedir para criar, ajustar ou revisar qualquer tela, componente,
  animação ou elemento visual do FiveApp. Isso inclui pedidos como "cria a tela de X",
  "adiciona o componente Y", "como fica o design de Z no app", "gera o código RN de...",
  "qual a cor/fonte/estilo do FiveApp", ou qualquer tarefa de UI/UX relacionada ao projeto.
  Também ative ao mencionar: liquid glass, glassmorphism, bottom nav flutuante, cards com
  mascotes, stories circulares, progress card, tab switcher, ou qualquer elemento já definido.
---

# FiveApp — Guia Visual e Design System

App educacional mobile (React Native + Expo) com identidade visual forte:
glassmorphism, liquid glass, mascotes 3D monstros coloridos e navegação flutuante.

## Leitura rápida de referências

Antes de gerar código ou mockup de qualquer tela, leia:
- `references/tokens.md` — cores, tipografia, espaçamentos, raios
- `references/components.md` — todos os componentes já definidos com código RN
- `references/effects.md` — receitas de liquid glass e glassmorphism (web e RN)

---

## 1. Identidade Visual

### Personalidade
- **Energia**: jovem, dinâmico, gamificado
- **Estética**: liquid glass + gradientes profundos + mascotes expressivos
- **Público**: estudantes (crianças e jovens adultos)
- **Tom**: divertido mas focado em aprendizado

### Paleta principal

| Token | Hex | Uso |
|---|---|---|
| `purple.primary` | `#7B5CF0` | Destaque, botão central nav, rings de avatar |
| `purple.deep` | `#6D28D9` | Gradientes, sombras roxas |
| `purple.light` | `#A78BFA` | Anéis de story, acentos |
| `dark.base` | `#1a1030` | Background geral, textos escuros |
| `dark.nav` | `#10082a` | Bottom nav, elementos escuros |
| `glass.white` | `rgba(255,255,255,0.28)` | Glass claro (search, cards) |
| `glass.dark` | `rgba(16,12,40,0.62)` | Glass escuro (bottom nav) |
| `glass.purple` | `rgba(110,70,255,0.22)` | Glass com tint roxo |
| `green.progress` | `#10B981` | Barra de progresso |
| `background` | `#EAEAEA` / `#F0EFF5` | Fundo do app |

### Tipografia
- **Fonte**: `Nunito` (Google Fonts)
- **Pesos usados**: 400 (body), 600 (subtítulo), 700 (label), 800 (destaque), 900 (número, nome)
- **Exemplos**:
  - Nome do usuário: `Nunito 900, 22px, #1a1030`
  - Label de card: `Nunito 800, 16px, #fff + text-shadow`
  - Subtítulo: `Nunito 600, 13px, #888`
  - Step number: `Nunito 900, 40px, #1a1030`

---

## 2. Efeitos Principais

### Liquid Glass (receita base web/mockup)
```css
background: rgba(255,255,255,0.28);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255,255,255,0.55);
box-shadow:
  0 8px 32px rgba(80,60,180,0.08),
  inset 0 1px 0 rgba(255,255,255,0.7),
  inset 0 -1px 0 rgba(200,190,255,0.15);
```

### Glass Escuro (bottom nav)
```css
background: rgba(16,12,40,0.62);
backdrop-filter: blur(32px) saturate(200%);
border: 1px solid rgba(255,255,255,0.12);
box-shadow:
  0 8px 40px rgba(0,0,0,0.4),
  inset 0 1px 0 rgba(255,255,255,0.12),
  inset 0 -1px 0 rgba(100,80,255,0.1);
```

### Glass Label (sobre cards/imagens)
```css
background: rgba(255,255,255,0.15);
backdrop-filter: blur(20px) saturate(160%);
border: 1px solid rgba(255,255,255,0.45);
box-shadow:
  0 4px 24px rgba(0,0,0,0.12),
  inset 0 1px 0 rgba(255,255,255,0.6);
border-radius: 16px;
padding: 10px 24px;
```

### Card Shine (reflexo diagonal em cards)
```css
position: absolute; inset: 0;
background: linear-gradient(
  135deg,
  rgba(255,255,255,0.18) 0%,
  transparent 50%,
  rgba(0,0,0,0.08) 100%
);
pointer-events: none;
```

> Para código React Native, leia `references/effects.md` — contém as receitas
> com `expo-blur`, `BlurView` e `react-native-reanimated`.

---

## 3. Componentes da Tela Home

Para código detalhado de cada componente, leia `references/components.md`.

### Hierarquia da tela
```
HomeScreen
├── SearchBar          (glass claro, border-radius 50px)
├── UserHeader         (avatar com ring conic-gradient roxo)
├── StoriesRow         (scroll horizontal, rings roxos)
├── ProgressCard       (glass claro, barra verde animada)
├── TabSwitcher        (glass + tab escura ativa)
└── MenuCards[]        (cards com mascote SVG + glass label)

FloatingBottomNav      (glass escuro, posição absoluta/sticky)
```

### Regras de layout
- Padding lateral padrão: `16px`
- Gap entre cards: `13px`
- Gap entre seções: `14–16px`
- Border-radius dos cards: `24px`
- Border-radius da bottom nav: `28px`

---

## 4. Bottom Nav Flutuante

**SEMPRE flutuante** — nunca fixo no rodapé. Fica sobre o conteúdo com glass escuro.

Estrutura de ícones (da esquerda para direita):
1. Home (casa)
2. Livro/Biblioteca
3. **Botão central** — roxo `#7B5CF0`, maior, com glow e halo
4. Busca (lupa)
5. Perfil (pessoa)

O botão central tem:
- `background: linear-gradient(135deg, #9B6DFF, #7B3FF6, #5B1BE5)`
- `box-shadow: 0 0 0 6px rgba(139,92,246,0.18), 0 0 24px rgba(139,92,246,0.55)`
- Tamanho: `52x52px`, `border-radius: 50%`

---

## 5. Cards de Menu

Cada card tem:
- **Altura**: `118px`, `border-radius: 24px`
- **Fundo**: gradiente de cor temática (ver tabela abaixo)
- **Mascote**: SVG inline de monstro 3D colorido (olhos grandes, braços laterais)
- **Label**: glassmorphism centralizado sobre a imagem
- **Shine**: gradiente diagonal sutil de reflexo
- **Sombra**: `0 8px 28px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)`

| Card | Cor primária | Mascote |
|---|---|---|
| Homeworks | `#4a9e50` → `#1a4d20` | Laranja/amarelo |
| Five Ai Voice | `#6a3fa3` → `#2a0a60` | Roxo |
| Reposições | `#388E3C` → `#1B5E20` | Verde |
| Notas | `#1565C0` → `#062a6e` | Azul |
| Realidade Aumentada | `#00897B` → `#004D40` | Teal/verde água |

---

## 6. Avatar e Stories

### Avatar principal
- Ring: `conic-gradient(#8B5CF6, #A78BFA, #7C3AED, #8B5CF6)`
- Sombra do ring: `0 0 0 3px rgba(139,92,246,0.2), 0 4px 16px rgba(139,92,246,0.35)`
- Borda interna: `2.5px solid rgba(255,255,255,0.9)`
- Tamanho: `64x64px`

### Stories circulares
- Ring ativo: `conic-gradient(#8B5CF6 0%, #A78BFA 40%, #C4B5FD 60%, #8B5CF6 100%)`
- Ring "meu story": dashed, `rgba(139,92,246,0.4)`
- Botão `+`: `background: linear-gradient(135deg, #8B5CF6, #6D28D9)`
- Tamanho do ring: `54x54px`
- Nome: `Nunito 700, 11px, #555`

---

## 7. Progresso

- **Step número**: `Nunito 900, 40px, #1a1030`
- **Label "Step"**: `Nunito 800, 10px, uppercase, rgba(100,80,200,0.7)`
- **Barra**: `background: linear-gradient(90deg, #34D399, #10B981, #059669)`
- **Glow da barra**: `box-shadow: 0 0 8px rgba(52,211,153,0.5)`
- **Track**: `rgba(139,92,246,0.12)`, altura `7px`
- Card envolve tudo em glass claro com `border-radius: 22px`

---

## 8. Regras de Consistência

Ao criar qualquer tela ou componente novo:

1. **Sempre usar Nunito** como fonte
2. **Glassmorphism em todos os elementos flutuantes** — nunca fundo sólido opaco em nav/search/cards de destaque
3. **Bottom nav sempre flutuante** — posição `absolute bottom: 14px`, com margens laterais de `16px`
4. **Cards com mascote** seguem padrão SVG inline com gradiente de fundo temático
5. **Roxo `#7B5CF0`** é a cor de identidade — use para highlights, CTAs, anéis, glow
6. **Shine diagonal** em todo card de imagem (não omitir)
7. **Border inset branco** em todos os elementos glass (simula reflexo de luz)
8. **Sombras profundas** nos cards — o app tem profundidade, não é flat

---

## Workflow para novas telas

1. Ler esta skill (`SKILL.md`)
2. Ler `references/tokens.md` para tokens exatos
3. Ler `references/components.md` para componentes reutilizáveis
4. Se houver efeitos especiais: ler `references/effects.md`
5. Gerar mockup visual primeiro (HTML/SVG inline)
6. Depois gerar código React Native + Expo

Sempre perguntar ao usuário: "Quer o mockup visual primeiro ou o código RN direto?"
