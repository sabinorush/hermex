---
name: plan-backend-issue-from-linear
description: Planeja e executa uma issue de backend de ponta a ponta a partir do Linear, atualizando o status da issue conforme evolui. Use quando o usuário passar um id ou link de issue do Linear descrevendo trabalho no backend (endpoints, regras, stack, critérios de aceite).
---

# Planejar issue do backend a partir do Linear

Fluxo completo para buscar uma issue no Linear e entregá-la pronta, testada e verificada contra a spec — **mantendo o status da issue atualizado no Linear a cada fase**.

## 0. Pré-requisitos

- MCP do Linear disponível no projeto (`mcp__linear-server__*`)
- Antes de mover status, confira os nomes válidos no time com `mcp__linear-server__list_issue_statuses`. Os nomes podem variar (ex.: "In Progress", "Em andamento", "In Review", "Code Review", "Done").

## 1. Obter a spec

- Use `mcp__linear-server__get_issue` com o id/identifier (ex.: `HER-12`) para buscar a issue.
- Se o usuário passou apenas um link, extraia o identifier da URL.

## 2. Ler a spec

Extrair da spec:

- contexto
- query / endpoints / contratos
- regras de negócio
- restrições
- stack e padrões
- critérios de aceite
- plano de verificação

## 3. Planejar

- Crie uma ToDo list (TodoWrite) com todas as tarefas necessárias.
- Antes de finalizar o planejamento, releia as specs e garanta:
  - não criar regressão
  - não criar pattern / design / estilo desalinhado com o projeto
  - procure exemplos parecidos (ex.: módulo `vehicles`) para manter coesão
- Revise o `CLAUDE.md` para convenções específicas do backend (NestJS code-first, Prisma em `src/generated/prisma/`, `nest generate`, etc).

## 4. Marcar como "In Progress" no Linear

Antes de começar a codar, **atualize o status** da issue:

```
mcp__linear-server__save_issue(id: "HER-XX", state: "In Progress")
```

Se o time usa outro nome para esse estado (confirmado no passo 0), use-o.

## 5. Implementar

- Respeite a stack e o planejamento realizado.
- Use `nest generate` (rodado a partir de `apps/api`) para novos módulos/resolvers/services — nunca crie manualmente.
- Nunca edite `package.json` à mão — use `pnpm add`/`pnpm install`.
- Atualize a ToDo list conforme avança.

## 6. Testar

- Escreva e execute os testes relacionados (`pnpm --filter @hermex/api test`).
- Se um teste existente quebrar, verifique se foi causado por esse desenvolvimento. Se sim, analise possíveis causas e **PERGUNTE** antes de resolver — talvez uma regra de negócio não prevista precise ser adicionada.

## 7. Conferir contra a spec

- Escreva um checklist com os critérios de aceite e valide um por um.
- Rode lint (`pnpm --filter @hermex/api lint`) e build (`pnpm api:build`) antes de seguir.

## 8. Marcar como "In Review" no Linear

Quando o código estiver pronto, testes passando e critérios de aceite validados, **mova o status para review**:

```
mcp__linear-server__save_issue(id: "HER-XX", state: "In Review")
```

Adicione um comentário resumindo o que foi entregue:

```
mcp__linear-server__save_comment(issueId: "HER-XX", body: "...")
```

O comentário deve conter:
- resumo curto do que foi implementado
- arquivos principais tocados
- checklist dos critérios de aceite marcados
- instruções de verificação (comando pra rodar, endpoint pra testar)

## 9. Commit e próximos passos

- Faça commit seguindo conventional commits em pt-BR (ex.: `feat(api): ...`).
- Se o usuário pedir, abra o PR — o merge move a issue para "Done" automaticamente via integração Linear↔GitHub (se configurada). Caso não tenha integração, atualize o status manualmente após o merge.

## Regras de ouro

- **Nunca pule atualizações de status**: in progress no início, in review quando entregar.
- **Um status por vez**: se descobrir que a issue está bloqueada, mova para "Blocked"/"Canceled" com comentário explicando.
- Se algo na spec for ambíguo, **pergunte antes** de assumir — não mude o status pra review com dúvidas em aberto.