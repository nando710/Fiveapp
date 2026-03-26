# FiveApp — Product Requirements Document

**Produto:** Aplicativo do Ecossistema da Franquia de Inglês
**Plataformas:** iOS e Android (Mobile e Tablet) / Web Desktop (Admin/Franqueado)
**Versão:** 1.0.1
**Status:** Em Desenvolvimento

---

## 1. Visão Geral

O FiveApp é um ecossistema digital unificado que conecta os quatro pilares da franquia de ensino de inglês. O objetivo é:

- **Alunos:** Aumentar retenção através de imersão e gamificação
- **Professores:** Eliminar burocracia e focar no ensino prático
- **Franqueados:** Previsibilidade de receita e gestão proativa de churn
- **Franqueadora:** Controle metodológico centralizado e escalabilidade nacional

---

## 2. Problemas a Resolver

| Perfil | Problema |
|---|---|
| Aluno | Baixo engajamento fora da sala de aula; dificuldade no agendamento de reposições |
| Professor | Excesso de processos manuais (chamada em papel, correção de homeworks) |
| Franqueado | Descoberta tardia de insatisfação do aluno (churn reativo); falta de visão do método |
| Franqueadora | Falta de dados centralizados; lentidão na distribuição de atualizações metodológicas |

---

## 3. Perfis de Acesso (RBAC)

```
student    → app/(student)/
teacher    → app/(teacher)/
franchise  → app/(franchise)/
admin      → app/(admin)/
```

---

## 4. Módulos por Perfil

---

### 👤 MÓDULO 1 — Aluno (`student`)

#### M1.1 — Home & Dashboard
- [ ] Exibição do livro atual e % de conclusão *(ProgressCard existe, dados mock)*
- [x] Stories circulares com visualizador
- [x] Câmera para postagem de stories
- [x] Mural da Turma com recados (turma / escola / marca)
- [x] Cards de módulos com navegação

#### M1.2 — Homeworks
- [x] Listagem de homeworks com filtros (Pendentes / Enviados / Corrigidos)
- [x] Exercício tipo múltipla escolha com feedback visual
- [x] Exercício tipo escrita/tradução
- [x] Exercício tipo áudio/pronúncia
- [x] Exercício tipo fill-in-the-blank
- [x] Tela de resultado com score animado e recompensa de pontos

#### M1.3 — Listen
- [x] Player organizado por livro → unidade → faixa
- [x] Mini player persistente ao tocar uma faixa
- [ ] Controles reais de play/pause/progresso *(UI feita, sem áudio real)*

#### M1.4 — Five AI Tutor
- [x] Rota e tela existem
- [ ] Chat funcional com IA (método socrático — não dá respostas prontas)
- [ ] Histórico de conversas
- [ ] Contexto da aula atual injetado no prompt

#### M1.5 — AR (Realidade Aumentada)
- [x] Rota e tela existem (placeholder)
- [ ] Leitor de marcadores AR vinculados ao material impresso
- [ ] Exibição de conteúdo 3D/animado sobre o marcador

#### M1.6 — Boletim Digital
- [ ] Histórico consolidado de notas (Listening, Speaking, Writing)
- [ ] Registro de faltas por turma
- [ ] Evolução ao longo do tempo (gráfico)

#### M1.7 — Reposições
- [ ] Calendário de horários disponíveis
- [ ] Agendamento autônomo pelo aluno
- [ ] Confirmação e notificação push
- [ ] Histórico de reposições agendadas

#### M1.8 — Gamificação
- [x] Five Points (FP) — exibição no header e card no perfil
- [x] Ranking por unidade e rede
- [ ] Sistema de conquistas e troféus (badges por frequência e entrega)
- [ ] Histórico completo de pontos ganhos e como foram ganhos

#### M1.9 — Clube de Convênios
- [x] Listagem de parceiros locais com desconto (tab "Convênios" no perfil)
- [ ] Detalhe do parceiro em tela dedicada (mapa, como usar)

#### M1.10 — Perfil
- [x] Card de Five Points com streak e barra de progresso de nível
- [x] Abas: Boletim / Troféus / Reposições / Convênios
- [x] Edição de nome via modal
- [ ] Edição de foto de perfil
- [ ] Configurações de notificação

---

### 👨‍🏫 MÓDULO 2 — Professor (`teacher`)

#### M2.1 — Radar Pré-Aula *(Home do professor)*
- [x] Taxa de entrega de homework por turma
- [x] Questões com maior índice de erro (barra proporcional)
- [x] Alunos em alerta com severity badge
- [x] Filtro por turma (chips selecionáveis)

#### M2.2 — Diário Digital
- [x] Seletor de turma
- [x] Lançamento de chamada (P / F / J com toggle por aluno)
- [x] Registro da página/lição avançada (TextInput)
- [x] Confirmação de salvamento com feedback visual
- [ ] Histórico de diários anteriores

#### M2.3 — Agenda Dinâmica
- [x] Grade semanal de horários (Seg–Sáb, navegável)
- [x] Classes por dia com sala, duração e alunos
- [x] Resumo e anotações de aulas (notas do professor por turma)
- [x] Anotações sobre alunos (avaliações e observações)

#### M2.4 — Avaliação
- [x] Seletor de turma + lista de alunos
- [x] Notas de Speaking e Writing por aluno (expandable)
- [x] Quick-score chips (6–10)
- [x] Simulação de gravação de feedback em áudio
- [ ] Envio real de áudio ao aluno (requer backend)

#### M2.5 — Comunidade
- [x] Stories dos alunos no dashboard do professor
- [x] Curtir stories (botão coração animado no StoryViewer)

#### M2.6 — Perfil
- [x] Dados do professor (nome, unidade, desde)
- [x] Stats: total alunos, diários, média, avaliações pendentes
- [x] Lista de turmas vinculadas com horários

---

### 🏢 MÓDULO 3 — Franqueado (`franchise`)

#### M3.1 — Termômetro de Churn *(Home do franqueado)*
- [x] Stats da unidade (alunos, turmas, retenção)
- [x] Lista de alunos em risco com score colorido (vermelho/âmbar/verde)
- [x] Mini stats por aluno (faltas, HWs perdidos, último contato)
- [x] Ações rápidas: Ligar + Registrar contato
- [x] Banner de alerta para risco crítico

#### M3.2 — Gestão da Unidade
- [x] Lista de alunos com status (ativo/inativo) e busca
- [x] Lista de professores com stats (turmas, alunos, desde)
- [x] Lista de turmas com professor, dias, sala e alunos
- [x] Tabs navegáveis (Alunos / Professores / Turmas)
- [ ] Formulários de cadastro/edição (requer backend)

#### M3.3 — Auditoria Pedagógica
- [x] Card de progresso geral com ring SVG animado
- [x] Breakdown por professor com barras de progresso por turma
- [x] Coloração por threshold (verde ≥90%, âmbar ≥70%, vermelho <70%)
- [ ] Relatório exportável (requer backend)

#### M3.4 — Controle Operacional
- [x] Fila de reposições com aprovar/recusar e contadores por status
- [x] Cadastro de parceiros com toggle ativo/inativo e botão "Novo Parceiro"

#### M3.5 — Comunicação
- [x] Botão "Novo Push" + histórico de pushes enviados com taxa de abertura
- [x] Moderação de stories com aprovar/remover
- [x] Caixa de entrada da franqueadora com indicador de não lido

#### M3.6 — Perfil
- [x] Header com dados da unidade, proprietário, endereço
- [x] Stats 2x2 (alunos, professores, turmas, retenção)
- [x] Ações rápidas (configurações, suporte)
- [x] Logout

---

### 👑 MÓDULO 4 — Admin / Franqueadora (`admin`)

#### M4.1 — Dashboard Global *(Home do admin)*
- [x] Stats scroll horizontal (unidades, alunos, professores, retenção, engajamento)
- [x] Alertas por unidade com severity (crítico/atenção)
- [x] Ranking de franquias com sort por retenção/engajamento
- [x] Trend arrows (up/stable/down) e medalhas top 3

#### M4.2 — CMS Pedagógico
- [x] Árvore de conteúdo colapsável: Nível → Livro (units, lessons, audios)
- [x] Uploads recentes com tipo (áudio, gabarito, simulado, AR)
- [x] Botão de upload + editar por livro
- [ ] Upload real de arquivos (requer backend)

#### M4.3 — Gestão de Rede
- [x] Lista de unidades com filtro (Todas / Ativas / Suspensas)
- [x] Card por unidade: owner, city, students, teachers, status, pagamento
- [x] Botão "Nova Unidade" + "Visualizar como franqueado"
- [ ] Abertura real de unidades (requer backend)

#### M4.4 — Guardião do Método
- [x] Visualização do prompt do Tutor de IA + "Editar Prompt"
- [x] Regras de pontuação da gamificação + "Editar Regras"
- [ ] Controle de versão (requer backend)

#### M4.5 — Megafone
- [x] Botão "Nova Campanha" com alcance total
- [x] Lista de campanhas com filtro (Todas / Agendadas / Enviadas)
- [x] Open rate por campanha + cancelar agendadas
- [x] Histórico completo

#### M4.6 — Perfil
- [x] Header com dados da franqueadora + badge "Desde"
- [x] Stats 2x2 (unidades, alunos, professores, cidades)
- [x] Lista de administradores + "Adicionar"
- [x] Logout

---

### 🔐 MÓDULO 5 — Auth & Sistema

#### M5.1 — Autenticação
- [x] Tela de login com seleção de perfil (mock)
- [x] RBAC — roteamento automático por role
- [ ] Autenticação real com JWT + refresh token
- [ ] Recuperação de senha
- [ ] Biometria (FaceID / TouchID)

#### M5.2 — Integração com API
- [ ] Substituição de todos os mocks por chamadas reais
- [ ] React Query configurado com cache e offline support
- [ ] Axios com interceptors de auth (token injection + auto-refresh)
- [ ] Upload de arquivos (áudios de feedback, fotos de stories)

#### M5.3 — Notificações Push
- [ ] Configuração do expo-notifications
- [ ] Permissão e registro de token por dispositivo
- [ ] Handler de notificação em foreground (toast)
- [ ] Deep link ao tocar na notificação

---

## 5. Estado Atual do Desenvolvimento

### Por perfil

| Perfil | Progresso |
|---|---|
| 👤 Aluno | ~55% — Home, Homeworks, Listen, Stories completos; AI/AR placeholders; Boletim/Reposições/Conquistas faltam |
| 👨‍🏫 Professor | ~5% — Rotas criadas, todas as telas são placeholder |
| 🏢 Franqueado | ~5% — Rotas criadas, todas as telas são placeholder |
| 👑 Admin | ~5% — Rotas criadas, todas as telas são placeholder |
| 🔐 Auth/Sistema | ~20% — Login funcional com mock; sem integração real |

### Telas concluídas

```
app/(auth)/login.tsx                  ✅ Completo
app/(student)/index.tsx               ✅ Completo (Home + módulos + turma + ranking)
app/(student)/homeworks.tsx           ✅ Completo (lista + filtros)
app/(student)/homework/[id].tsx       ✅ Completo (4 tipos de exercício + resultado)
app/(student)/listen.tsx              ✅ Completo (player por livro/unidade)
app/(student)/ai.tsx                  🟡 Placeholder
app/(student)/ar.tsx                  🟡 Placeholder
app/(student)/profile.tsx             🟡 Parcial (Five Points feito; edição falta)
app/(teacher)/*                       🟡 Todos placeholder
app/(franchise)/*                     🟡 Todos placeholder
app/(admin)/*                         🟡 Todos placeholder
```

---

## 6. Ordem de Prioridade Sugerida

### Sprint 1 — Completar Aluno
1. `M1.6` Boletim Digital
2. `M1.7` Reposições (agendamento)
3. `M1.8` Conquistas e troféus
4. `M1.4` Five AI Tutor (chat)

### Sprint 2 — Professor
1. `M2.1` Radar Pré-Aula
2. `M2.2` Diário Digital
3. `M2.3` Agenda + Aprovação de Reposições
4. `M2.4` Avaliação

### Sprint 3 — Franqueado
1. `M3.1` Termômetro de Churn
2. `M3.2` Gestão da Unidade
3. `M3.5` Comunicação (push + moderação)

### Sprint 4 — Admin
1. `M4.2` CMS Pedagógico
2. `M4.1` Dashboard Global
3. `M4.5` Megafone

### Sprint 5 — Integração Real
1. `M5.1` Auth com JWT
2. `M5.2` Substituição dos mocks por API real
3. `M5.3` Push Notifications

---

## 7. Design System

Todas as telas seguem o guia em `.claude/skills/fiveapp-visual-guide/SKILL.md`:

- **Fonte:** Nunito (400 / 600 / 700 / 800 / 900)
- **Cor primária:** `#7B5CF0` (roxo)
- **Background:** `#F0EFF5` (telas de aluno) / `#1a1030` (telas escuras)
- **Efeito:** Glassmorphism + liquid glass em todos os elementos flutuantes
- **Cards:** gradiente temático + shine diagonal + sombra profunda + mascote SVG
- **Nav:** FloatingTabBar com BlurView, botão central roxo com glow
