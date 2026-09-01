# Hermex — Scaffold inicial do projeto

Data: 2026-09-01
Status: Aprovado para planejamento

## Contexto

Hermex é uma locadora de veículos. Este spec cobre **apenas o scaffolding
técnico inicial** do monorepo — não modela nenhuma entidade de negócio
(veículo, cliente, reserva, etc.). O objetivo é ter front-end e back-end
rodando, conectados ao banco de dados, com a estrutura pronta para receber
features de negócio em specs futuros.

Fonte: `PRD.md` na raiz do repositório.

## Decisões já fechadas com o usuário

| Tema                 | Decisão                                                               |
| -------------------- | --------------------------------------------------------------------- |
| Escopo               | Apenas scaffolding técnico, sem modelo de domínio                     |
| Autenticação         | Só estrutura preparada (pastas/placeholders), sem lib nem lógica real |
| GraphQL              | Code-first (decorators TypeScript)                                    |
| Nomes dos apps       | `apps/web` (Next.js) e `apps/api` (Nest.js)                           |
| Prova de conexão E2E | Query GraphQL `health` que roda `SELECT 1` via Prisma                 |
| Docker-compose       | Só Postgres (sem pgAdmin)                                             |
| Lint/format          | Config compartilhada na raiz do monorepo                              |

## Arquitetura

```
hermex/
├── apps/
│   ├── web/                  # Next.js (App Router, TS, Tailwind)
│   └── api/                  # Nest.js (GraphQL code-first, Prisma)
├── docs/
│   └── superpowers/specs/    # specs de design
├── docker-compose.yaml       # Postgres com volume nomeado
├── eslint.config.mjs         # config raiz compartilhada (flat config)
├── prettier.config.js
├── pnpm-workspace.yaml
├── .gitignore
└── package.json              # scripts raiz com --filter
```

Sem pasta `packages/` nesta fase — não há código compartilhado entre
`web` e `api` ainda.

## Componentes

### 1. Monorepo (raiz)

- `pnpm-workspace.yaml` listando `apps/*`.
- `package.json` raiz (`private: true`) com scripts usando `--filter`:
  - `dev:web` → `pnpm --filter web dev`
  - `dev:api` → `pnpm --filter api dev` (alias criado em `apps/api` para
    `start:dev`, para permitir `pnpm -r --parallel dev` rodando os dois)
  - `build:web`, `build:api`
  - `lint`, `format` (cobrindo os dois apps a partir da config raiz)
  - `db:up` → `docker compose up -d`
  - `db:down` → `docker compose down`
  - `prisma:generate`, `prisma:migrate` → `pnpm --filter api exec prisma ...`
- ESLint (flat config, `eslint.config.mjs`) e Prettier configurados uma vez
  na raiz; `apps/web` e `apps/api` estendem/importam essa config em vez de
  duplicá-la. Ajustar caso o `create-next-app` ou `nest new` gerem formatos
  incompatíveis (ex: `.eslintrc.js` legado) — nesse caso, migrar para o
  formato flat na hora da implementação.
- `.gitignore` cobrindo `node_modules`, `.next`, `dist`, `.env`, client
  gerado do Prisma, artefatos de build.

### 2. Front-end (`apps/web`)

- Criado via `npx create-next-app@latest` — TypeScript, Tailwind, App
  Router, ESLint, diretório `src/`.
- Atomic design dentro de `src/components/`: `atoms/`, `molecules/`,
  `organisms/`, `templates/` (as "pages" do atomic design são as próprias
  rotas do App Router em `src/app/`).
- Preparação para autenticação (estrutura apenas, sem lib/lógica real):
  - Grupo de rotas `src/app/(auth)/login/page.tsx` como placeholder.
  - `src/lib/auth/` com um arquivo README/stub documentando onde a lógica
    de autenticação deve ser plugada futuramente.
  - Nenhuma dependência de auth (NextAuth, Clerk, etc.) instalada — essa é
    uma decisão de spec futuro.

### 3. Back-end (`apps/api`)

- Criado via `nest new apps/api --package-manager pnpm --skip-git`
  (`--skip-git` evita um repositório git aninhado dentro do monorepo).
- GraphQL code-first: `@nestjs/graphql` + `@nestjs/apollo` +
  `graphql`, `GraphQLModule.forRoot` com `autoSchemaFile` (schema gerado
  automaticamente a partir de decorators).
- Módulo `Prisma`: `PrismaService` estendendo `PrismaClient`, implementando
  `OnModuleInit` para conectar ao banco na inicialização do módulo.
- `HealthModule` com `HealthResolver`: uma `Query('health')` que executa
  `` prisma.$queryRaw`SELECT 1` `` e retorna um objeto simples (ex: `{ status: 'ok', database: 'connected' }`), confirmando que
  Nest → Prisma → Postgres estão conectados ponta a ponta. Nenhum outro
  model ou resolver de negócio é criado nesta fase.

### 4. Banco de dados

- `docker-compose.yaml` na raiz: um serviço `postgres` (imagem
  `postgres:16-alpine`), variáveis de ambiente com credenciais de
  desenvolvimento, porta `5432:5432`, volume nomeado (ex: `hermex_pgdata`)
  montado em `/var/lib/postgresql/data` para persistência entre restarts.
- `apps/api/prisma/schema.prisma`: `datasource db` (provider `postgresql`,
  `url = env("DATABASE_URL")`) e `generator client` configurados.
  **Zero models** — a query de health usa SQL raw e não depende de
  nenhuma tabela, então não há necessidade de migration nesta fase.
- `apps/api/.env.example` com `DATABASE_URL` apontando para o Postgres do
  compose (credenciais consistentes com o `docker-compose.yaml`).
  `apps/api/.env` real fica no `.gitignore`.

## Critérios de aceite

- `pnpm install` na raiz resolve as dependências de `apps/web` e
  `apps/api` sem erros.
- `docker compose up -d` sobe o container do Postgres, com o volume
  persistindo dados entre `docker compose down` / `up` (dado que
  não removemos o volume).
- `pnpm dev:api` sobe o Nest.js; o GraphQL sandbox (`/graphql`) responde
  à query `health` confirmando conexão bem-sucedida com o Postgres.
- `pnpm dev:web` sobe o Next.js; a home carrega com Tailwind aplicado e a
  estrutura de pastas de atomic design está presente em
  `src/components/`.
- `pnpm lint` e `pnpm format` rodam a partir da raiz e cobrem os dois
  apps usando a config compartilhada.
- Repositório git inicializado (branch `main`), com commits organizados
  por checkpoint lógico (monorepo → web → api → docker/prisma →
  lint/format).

## Fora de escopo (specs futuros)

- Qualquer entidade de domínio (veículo, cliente, reserva, contrato,
  pagamento, etc.) e seus resolvers/CRUDs.
- Implementação real de autenticação (provider, estratégia JWT, proteção
  de rotas).
- CI/CD, deploy, observabilidade.
- Testes automatizados além dos gerados por padrão pelos CLIs
  (`create-next-app` / `nest new`).

## Decisões tomadas durante a implementação

1. Postgres do docker-compose vinculado a `127.0.0.1` (não `0.0.0.0`) por
   segurança.
2. Imports relativos em `apps/api` usam extensão `.js` (projeto ESM/NodeNext
   gerado pelo Nest CLI atual).
3. Prisma fixado na versão `6.19.3` (CLI e client) — as tags `latest` do npm
   estavam com majors incompatíveis no momento da execução.
4. `@as-integrations/express5` adicionado como dependência direta —
   necessário para o `GraphQLModule` mapear a rota `/graphql` no adapter
   Express 5.
5. `apps/api` usa oxlint (padrão atual do Nest CLI) em vez de ESLint — a
   config compartilhada da raiz é estendida só por `apps/web`; as mesmas
   regras (eqeqeq/no-console/prefer-const) foram espelhadas manualmente no
   `oxlint.json` do `apps/api`.
6. `create-next-app --use-pnpm` gera um workspace pnpm aninhado dentro de
   `apps/web` — removido antes de rodar o `pnpm install` da raiz, para
   `apps/web` entrar como membro comum do workspace.
