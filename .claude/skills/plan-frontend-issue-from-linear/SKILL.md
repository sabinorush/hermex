---
name: plan-frontend-issue-from-linear
description: Planeja e executa uma issue de frontend de ponta a ponta a partir do Linear, atualizando o status da issue conforme evolui. Use quando o usuário passar um id ou link de issue do Linear descrevendo trabalho no frontend (telas, componentes, fluxos, design, integrações).
---

# Planejar issue do frontend a partir do Linear

Fluxo completo para buscar uma issue no Linear e entregá-la pronta, testada e verificada contra a spec — **mantendo o status da issue atualizado no Linear a cada fase**.

## 0. Pré-requisitos

- MCP do Linear disponível no projeto (`mcp__linear-server__*`).
- Se a issue apontar para um design, o MCP do Figma também deve estar disponível (`mcp__plugin_figma_figma__*`).
- Antes de mover status, confira os nomes válidos no time com `mcp__linear-server__list_issue_statuses` (ex.: "In Progress", "In Review", "Done").

## 1. Obter a spec

- Use `mcp__linear-server__get_issue` com o id/identifier (ex.: `HER-12`) para buscar a issue.
- Se o usuário passou só um link, extraia o identifier da URL.
- Se houver link do Figma nos anexos/descrição, guarde para o passo 3.

## 2. Ler a spec

Extrair da spec:

- contexto e objetivo de UX
- telas / fluxos / estados (loading, erro, vazio, sucesso)
- componentes envolvidos (reaproveitar × criar novos)
- integrações (queries GraphQL, auth, rotas)
- responsividade e acessibilidade
- critérios de aceite
- plano de verificação (golden path + edge cases)

## 3. Se houver design no Figma

- Use `figma:figma-implement-design` como skill auxiliar.
- Colete tokens, variantes e screenshots necessários antes de codar.
- Mapeie elementos do design para componentes já existentes em `apps/web/src/components/{atoms,molecules,organisms,templates}` antes de criar novos.

## 4. Planejar

- Crie uma ToDo list (TodoWrite) com todas as tarefas necessárias.
- Antes de finalizar, releia a spec e garanta:
  - respeitar **Atomic Design** (`atoms` → `molecules` → `organisms` → `templates`) com barrel `index.ts` em cada pasta
  - reaproveitar componentes existentes antes de criar novos
  - seguir convenções do Next.js 16 (App Router) — **consultar `node_modules/next/dist/docs/` antes de usar APIs do Next**, conforme `apps/web/AGENTS.md`
  - não introduzir regressão em telas vizinhas
- Revise o `CLAUDE.md` do projeto para convenções.

## 5. Marcar como "In Progress" no Linear

Antes de começar a codar, **atualize o status** da issue:

```
mcp__linear-server__save_issue(id: "HER-XX", state: "In Progress")
```

Se o time usa outro nome para esse estado (confirmado no passo 0), use-o.

## 6. Implementar

- Respeite a stack e o planejamento realizado.
- Novo componente? Crie no nível atômico correto e exporte via barrel `index.ts`.
- Use Tailwind e os tokens do design system — evite valores hardcoded quando houver token equivalente.
- Nunca edite `package.json` à mão — use `pnpm add`/`pnpm install`.
- Atualize a ToDo list conforme avança.

## 7. Validar no navegador

**Obrigatório para mudanças de UI:**

- Suba o dev server (`pnpm web:dev`) e abra no navegador.
- Teste o golden path e os edge cases (loading, erro, vazio, responsivo).
- Monitore o console por erros/warnings.
- Se não for possível testar no navegador, diga explicitamente — type-check e lint não substituem verificação visual.

## 8. Conferir contra a spec

- Escreva um checklist com os critérios de aceite e valide um por um.
- Rode lint (`pnpm --filter @hermex/web lint`) e build (`pnpm web:build`).
- Se houver testes, execute-os.

## 9. Marcar como "In Review" no Linear

Quando o código estiver pronto, verificado no navegador e critérios de aceite validados, **mova o status para review**:

```
mcp__linear-server__save_issue(id: "HER-XX", state: "In Review")
```

Adicione um comentário resumindo o que foi entregue:

```
mcp__linear-server__save_comment(issueId: "HER-XX", body: "...")
```

O comentário deve conter:
- resumo curto do que foi implementado
- componentes criados/alterados e rotas afetadas
- checklist dos critérios de aceite marcados
- instruções de verificação (rota pra abrir, dados de teste, como reproduzir edge cases)
- (se houver) screenshots ou nota sobre responsividade

## 10. Commit e próximos passos

- Faça commit seguindo conventional commits em pt-BR (ex.: `feat(web): ...`).
- Se o usuário pedir, abra o PR — o merge move a issue para "Done" automaticamente via integração Linear↔GitHub (se configurada). Sem integração, atualize o status manualmente após o merge.

## Regras de ouro

- **Nunca pule atualizações de status**: in progress no início, in review quando entregar.
- **Nada de "pronto" sem abrir o navegador** quando houve mudança visual.
- **Um status por vez**: se a issue ficar bloqueada (esperando design, endpoint inexistente, dúvida de UX), mova para "Blocked"/"Canceled" com comentário explicando.
- Se a spec for ambígua, **pergunte antes** de assumir — não mude o status pra review com dúvidas em aberto.