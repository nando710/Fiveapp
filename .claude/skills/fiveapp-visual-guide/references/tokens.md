# FiveApp — Design Tokens

## Cores

### Paleta roxa (identidade)
```js
purple = {
  50:  '#F3F0FF',
  100: '#E0D9FF',
  200: '#C4B5FD',
  300: '#A78BFA',
  400: '#8B5CF6',   // primary — anéis, destaques
  500: '#7B3FF6',   // médio
  600: '#6D28D9',   // deep — gradientes
  700: '#5B1BE5',   // escuro
  800: '#4C1D95',
}
```

### Escuros
```js
dark = {
  base:    '#1a1030',  // textos, backgrounds
  nav:     '#10082a',  // bottom nav base
  card:    '#2d2050',  // avatar, elementos escuros
  overlay: 'rgba(16,12,40,0.62)',  // glass escuro
}
```

### Vidro (glass)
```js
glass = {
  white:  'rgba(255,255,255,0.28)',
  light:  'rgba(255,255,255,0.15)',
  purple: 'rgba(110,70,255,0.22)',
  dark:   'rgba(16,12,40,0.62)',
  border: {
    light: 'rgba(255,255,255,0.55)',
    mid:   'rgba(255,255,255,0.4)',
    dark:  'rgba(255,255,255,0.12)',
  }
}
```

### Semânticas
```js
success = { main: '#10B981', light: '#34D399', dark: '#059669' }  // progresso
warning = { main: '#F59E0B' }
background = { app: '#EAEAEA', screen: '#F0EFF5', card: '#DDDCE8' }
```

### Cores dos cards
```js
cards = {
  homeworks:  { from: '#4a9e50', to: '#1a4d20' },
  aiVoice:    { from: '#6a3fa3', to: '#2a0a60' },
  reposicoes: { from: '#388E3C', to: '#1B5E20' },
  notas:      { from: '#1565C0', to: '#062a6e' },
  ar:         { from: '#00897B', to: '#004D40' },
}
```

---

## Tipografia

```js
font = {
  family: 'Nunito',
  weights: { regular: 400, semibold: 600, bold: 700, extrabold: 800, black: 900 },
  sizes: {
    xs:   11,   // story names, labels pequenos
    sm:   12,   // progress label, contadores
    md:   13,   // tab buttons, subtítulos
    base: 14,   // body, search placeholder
    lg:   16,   // card labels
    xl:   20,   // títulos secundários
    '2xl': 22,  // nome do usuário
    '4xl': 40,  // step number
  }
}
```

---

## Espaçamentos

```js
spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  14,
  xl:  16,   // padding lateral padrão
  '2xl': 18,
  '3xl': 24,
}
```

---

## Border Radius

```js
radius = {
  full:   9999,  // pills, círculos
  '4xl':    44,  // phone frame
  '3xl':    28,  // bottom nav
  '2xl':    24,  // menu cards
  xl:       22,  // progress card
  lg:       18,  // search bar
  md:       16,  // glass labels
  sm:       12,  // tab icon, elementos pequenos
  xs:        8,  // botões internos
}
```

---

## Sombras

```js
shadows = {
  card:     '0 8px 28px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)',
  nav:      '0 8px 40px rgba(0,0,0,0.4)',
  purpleGlow: '0 0 0 6px rgba(139,92,246,0.18), 0 0 24px rgba(139,92,246,0.55)',
  avatarRing: '0 0 0 3px rgba(139,92,246,0.2), 0 4px 16px rgba(139,92,246,0.35)',
  progressBar: '0 0 8px rgba(52,211,153,0.5)',
  glass:    '0 8px 32px rgba(80,60,180,0.08)',
}
```

---

## Gradientes

```js
gradients = {
  purpleRing:  'conic-gradient(#8B5CF6, #A78BFA, #7C3AED, #8B5CF6)',
  storyRing:   'conic-gradient(#8B5CF6 0%, #A78BFA 40%, #C4B5FD 60%, #8B5CF6 100%)',
  navButton:   'linear-gradient(135deg, #9B6DFF, #7B3FF6, #5B1BE5)',
  progressBar: 'linear-gradient(90deg, #34D399, #10B981, #059669)',
  cardShine:   'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)',
  screenBg:    'linear-gradient(160deg, #F0EFF5 0%, #E8E7EF 50%, #DDDCE8 100%)',
}
```

---

## Blur (glassmorphism)

```js
blur = {
  sm:   'blur(12px) saturate(160%)',
  md:   'blur(20px) saturate(160%)',
  lg:   'blur(24px) saturate(180%)',
  xl:   'blur(28px) saturate(200%)',
  '2xl': 'blur(32px) saturate(200%)',  // bottom nav
}
```
