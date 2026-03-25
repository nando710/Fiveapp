# Decision Tree — FiveApp Orchestrator

Referência para casos complexos onde múltiplas skills competem ou se sobrepõem.

---

## Pedidos ambíguos — como resolver

### "Cria um componente X"
- Se X é parte do design visual do FiveApp (card, avatar, nav) → **VIS + CMP**
- Se X é genérico (botão, input, modal) → **CMP** apenas
- Se X busca dados → **CMP + API**

### "Implementa a tela de X"
Sempre nesta ordem:
1. **VIS** — mockup visual primeiro, validar com o guia
2. **CMP** — componentes da tela
3. **API** — dados da tela (se houver)
4. **PRF** — otimizações (se houver lista ou muita renderização)

### "Configura X no projeto"
- Configuração de ambiente/ferramentas → **SET**
- Configuração de tema/design → **DSY**
- Configuração de API nativa → **EXP**
- Configuração de performance → **PRF**

---

## Ordem de dependência entre skills

```
SET (base do projeto)
 └── DSY (tema depende da estrutura)
      └── VIS (visual depende dos tokens do tema)
           └── CMP (componentes dependem do visual e do tema)
                ├── API (dados alimentam os componentes)
                └── PRF (otimizar o que foi construído)
                     └── EXP (features nativas no topo de tudo)
```

Regra: nunca pular níveis. Se o usuário pede EXP mas SET não está feito, fazer SET primeiro.

---

## Combinações frequentes

| Pedido | Skills | Ordem |
|---|---|---|
| Feature completa nova | VIS + CMP + API | 1→2→3 |
| Tela com lista de dados | VIS + CMP + API + PRF | 1→2→3→4 |
| Setup do zero | SET + DSY + VIS + CMP + API | 1→2→3→4→5 |
| Componente animado | VIS + CMP | 1→2 |
| Bug de performance | PRF + CMP | 1→2 |
| Push notification | API + EXP + CMP | 1→2→3 |
| Dark mode | DSY + VIS | 1→2 |
| Upload de foto | EXP + API + CMP | 1→2→3 |
| Deep link para tela | EXP + SET | 1→2 |

---

## Quando pedir esclarecimento

Sempre perguntar ao usuário antes de executar quando:

1. **Escopo indefinido**: "faz a tela de perfil" — qual informação aparece?
2. **Backend desconhecido**: funcionalidade depende de API — já existe? qual contrato?
3. **Conflito de decisão**: duas abordagens igualmente válidas com trade-offs diferentes
4. **Feature grande**: mais de 5 tarefas — apresentar plano e confirmar prioridade

Formato de esclarecimento:
```
Antes de começar, preciso de 2 infos rápidas:
1. [pergunta objetiva]
2. [pergunta objetiva]
```
Nunca mais de 3 perguntas de uma vez.

---

## Saídas esperadas por tipo de pedido

| Tipo | Output |
|---|---|
| Design/UI | Mockup visual interativo + código RN do componente |
| Feature | Plano → componentes → hooks → integração |
| Arquitetura | Diagrama de estrutura + código de exemplo |
| Performance | Diagnóstico + código refatorado + métricas esperadas |
| Setup | Checklist executado + código de configuração |
| Bug | Causa raiz + solução + prevenção futura |

---

## Tom e comunicação

- Seja direto: mostre o plano, execute, entregue
- Use numeração para tarefas múltiplas
- Separe claramente o que é código do que é explicação
- Ao entregar, sempre indique: "próximo passo natural seria X"
- Se algo sair do escopo das skills, sinalize abertamente
