# Hermex Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Hermex monorepo end-to-end — Next.js front-end, Nest.js + GraphQL + Prisma back-end, and a Dockerized Postgres — with zero business/domain logic, verified by a live GraphQL health check that proves front→back→DB wiring works.

**Architecture:** A pnpm-workspace monorepo (`apps/web`, `apps/api`) with root-level scripts (`--filter`), a root Docker Compose file for Postgres, and shared ESLint/Prettier config at the root that each app extends. The only "feature" code is a GraphQL `health` query that round-trips through Prisma to Postgres.

**Tech Stack:** pnpm workspaces, Next.js (App Router, TypeScript, Tailwind), Nest.js, `@nestjs/graphql` + `@nestjs/apollo` (code-first), Prisma, PostgreSQL 16 (Docker Compose), ESLint 9 (flat config), Prettier.

**Spec:** `docs/superpowers/specs/2026-09-01-hermex-scaffold-design.md`

## Global Constraints

- Node.js >= 22 (verified locally: v22.18.0), pnpm 11.21.0 (`packageManager` pinned in root `package.json`).
- App directory names are exactly `apps/web` and `apps/api`.
- GraphQL schema is **code-first** (`autoSchemaFile`), no `.graphql` SDL files written by hand.
- **No business/domain entities** anywhere in this plan (no Veiculo/Cliente/Reserva/etc.) — the only Prisma-touching code is the `health` query.
- **No auth libraries installed** — only placeholder folders/routes for where auth will go later.
- Postgres runs via the root `docker-compose.yaml` with a named volume (`hermex_pgdata`) so data survives `docker compose down` / `up`.
- Nest.js listens on port **3001** (not 3000) so it can run concurrently with Next.js's default port 3000.
- Every task ends in its own git commit.
- `pnpm-lock.yaml` is committed starting with Task 3 (see ledger ruling) — every task that changes it stages it alongside its other files.

> Updated during Task 3 execution (see ledger): the installed `@nestjs/cli`
> scaffolds an ESM/NodeNext project (`"type": "module"`, `moduleResolution:
"nodenext"`), which requires explicit `.js` extensions on relative
> imports even in `.ts` source (e.g. `import { Foo } from './foo.service.js'`).
> All relative-import code blocks below for `apps/api` already carry the
> `.js` extension to match.

---

### Task 1: Monorepo skeleton

**Files:**

- Create: `pnpm-workspace.yaml`
- Create: `package.json` (root)
- Create: `.gitignore` (root)

**Interfaces:**

- Produces: `pnpm-workspace.yaml` declaring `apps/*` as workspace packages — every later task's `pnpm --filter <name> ...` command depends on this. Root `package.json` has an empty `scripts` object that later tasks append to (never replace).

- [ ] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
```

- [ ] **Step 2: Create root `package.json`**

```json
{
  "name": "hermex",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@11.21.0",
  "engines": {
    "node": ">=22"
  },
  "scripts": {}
}
```

- [ ] **Step 3: Create root `.gitignore`**

```
node_modules/
dist/
.next/
build/
coverage/
*.log
.env
.env.local
.env.*.local
.DS_Store
```

- [ ] **Step 4: Verify workspace tooling works**

Run: `pnpm install`
Expected: completes with exit code 0 and creates `pnpm-lock.yaml` (no workspaces resolved yet — that's fine, there are none).

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml package.json .gitignore
git commit -m "chore: initialize pnpm workspace skeleton"
```

---

### Task 2: Postgres via Docker Compose

**Files:**

- Create: `docker-compose.yaml` (root)
- Modify: `package.json` (root) — add `db:up`, `db:down` scripts

**Interfaces:**

- Consumes: root `package.json` `scripts` object from Task 1.
- Produces: a running Postgres reachable at `localhost:5432`, user `hermex`, password `hermex`, database `hermex` — Task 4's `DATABASE_URL` and Task 5's health check depend on these exact credentials. Named volume `hermex_pgdata` persists data.

- [ ] **Step 1: Create `docker-compose.yaml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: hermex
      POSTGRES_PASSWORD: hermex
      POSTGRES_DB: hermex
    ports:
      - '127.0.0.1:5432:5432'
    volumes:
      - hermex_pgdata:/var/lib/postgresql/data

volumes:
  hermex_pgdata:
```

> Updated during execution (see ledger): bound to `127.0.0.1` instead of
> `0.0.0.0` per a background security review — dev Postgres has no reason
> to be reachable from the LAN.

- [ ] **Step 2: Add `db:up` / `db:down` scripts to root `package.json`**

Edit the `scripts` object to:

```json
{
  "db:up": "docker compose up -d",
  "db:down": "docker compose down"
}
```

- [ ] **Step 3: Bring Postgres up and verify**

Run: `pnpm db:up`
Expected: `docker compose up -d` reports the `postgres` service as `Started` or `Running`.

Run: `docker compose exec -T postgres pg_isready -U hermex -d hermex`
Expected: output contains `accepting connections`.

Leave the container running — later tasks (4, 5) need it.

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yaml package.json
git commit -m "feat: add Postgres via Docker Compose"
```

---

### Task 3: Backend scaffold — Nest.js + GraphQL (code-first)

**Files:**

- Create: `apps/api/` (generated by `@nestjs/cli`)
- Modify: `apps/api/src/app.module.ts` — register `GraphQLModule`
- Modify: `apps/api/src/main.ts` — listen on port 3001
- Modify: `apps/api/package.json` — add `dev` alias script
- Modify: `package.json` (root) — add `dev:api`, `build:api` scripts
- Modify: `.gitignore` (root) — ignore generated schema file

**Interfaces:**

- Consumes: `pnpm-workspace.yaml` from Task 1 (so `apps/api` is auto-discovered once created).
- Produces: `apps/api` as a workspace member; `AppModule` importing a working `GraphQLModule` (code-first, `autoSchemaFile`); Nest listens on `http://localhost:3001`. Tasks 4 and 5 add modules to this same `AppModule`.

- [ ] **Step 1: Scaffold the Nest app**

```bash
mkdir -p apps
cd apps
npx --yes @nestjs/cli@latest new api --package-manager pnpm --skip-git
cd ..
```

Expected: `apps/api` now contains a standard Nest project (`src/`, `package.json`, `tsconfig.json`, etc.).

- [ ] **Step 2: Link the new workspace member**

Run: `pnpm install`
Expected: exit code 0; `apps/api` now resolves as a workspace package.

- [ ] **Step 3: Install GraphQL dependencies**

Run: `pnpm --filter api add @nestjs/graphql @nestjs/apollo @apollo/server graphql`
Expected: exit code 0, dependencies added to `apps/api/package.json`.

- [ ] **Step 4: Register `GraphQLModule` (code-first) in `AppModule`**

Edit `apps/api/src/app.module.ts` to:

```ts
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 5: Move the API to port 3001**

Edit `apps/api/src/main.ts` — change the `app.listen(...)` call to:

```ts
await app.listen(process.env.PORT ?? 3001);
```

- [ ] **Step 6: Add a `dev` alias in `apps/api/package.json`**

In `apps/api/package.json`'s `scripts`, add (next to the existing `start:dev`):

```json
"dev": "nest start --watch"
```

- [ ] **Step 7: Ignore the generated GraphQL schema file**

Append to root `.gitignore`:

```
apps/api/src/schema.gql
```

- [ ] **Step 8: Add root scripts**

Edit root `package.json` `scripts` to add:

```json
{
  "dev:api": "pnpm --filter api dev",
  "build:api": "pnpm --filter api build"
}
```

> Updated during Task 5 execution (see ledger): `ApolloDriver` also needs
> `@as-integrations/express5` to actually map the `/graphql` route on this
> project's Express 5 adapter — it's an _optional_ peer dependency of
> `@nestjs/apollo`, so `pnpm add` here doesn't pull it in automatically.
> Nothing in Task 3 exercises a live GraphQL request (no `@Query()` exists
> yet), so this only surfaces once Task 5 adds one. If reproducing this
> plan from scratch, add it in Task 3 for a cleaner sequence:
> `pnpm --filter api add @as-integrations/express5`.

- [ ] **Step 9: Verify it compiles**

Run: `pnpm build:api`
Expected: exit code 0, `apps/api/dist/` created. (The app isn't started yet — `GraphQLModule` needs at least one `@Query()` resolver to boot successfully at runtime; that lands in Task 5. `nest build` only transpiles, so it doesn't hit that check.)

- [ ] **Step 10: Commit**

```bash
git add apps/api package.json .gitignore
git commit -m "feat: scaffold Nest.js API with code-first GraphQL"
```

---

### Task 4: Prisma module + schema

**Files:**

- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/.env.example`
- Create: `apps/api/.env` (local only — gitignored)
- Create: `apps/api/src/prisma/prisma.service.ts`
- Create: `apps/api/src/prisma/prisma.module.ts`
- Modify: `apps/api/src/app.module.ts` — import `PrismaModule`
- Modify: `package.json` (root) — add `prisma:generate`, `prisma:migrate` scripts

**Interfaces:**

- Consumes: `AppModule` from Task 3; Postgres credentials from Task 2 (`hermex`/`hermex`/`hermex` on `localhost:5432`).
- Produces: `PrismaService` (extends `PrismaClient`, connects in `onModuleInit`) exported by a `@Global()` `PrismaModule` — Task 5's `HealthResolver` injects this exact class from `../prisma/prisma.service`.

- [ ] **Step 1: Install Prisma**

> Updated during execution (see ledger): npm's `latest` dist-tags for
> `prisma` and `@prisma/client` were mismatched majors at execution time
> (an `8.x` prerelease vs. a `7.x` stable), which breaks Prisma (CLI and
> client must match) and breaks this brief's exact commands/schema content
> (Prisma 7/8 removed `url = env(...)` from `schema.prisma`). Pin both to
> the last matched stable pre-v7 pair instead:

Run: `pnpm --filter api add -D prisma@6.19.3`
Run: `pnpm --filter api add @prisma/client@6.19.3`

> If you're running this fresh and `prisma`'s and `@prisma/client`'s
> `latest` npm dist-tags have since converged on a matching stable major,
> prefer unpinned `pnpm --filter api add -D prisma` / `pnpm --filter api
add @prisma/client` and adjust the rest of this task's steps for that
> major's CLI surface instead of forcing 6.19.3.

- [ ] **Step 2: Initialize Prisma**

Run: `pnpm --filter api exec prisma init --datasource-provider postgresql`
Expected: creates `apps/api/prisma/schema.prisma` and `apps/api/.env`.

- [ ] **Step 3: Confirm the schema has zero models**

Open `apps/api/prisma/schema.prisma` and confirm it looks like this (no `model` blocks — this is intentional, per spec, until domain work starts):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- [ ] **Step 4: Set the connection string**

Create `apps/api/.env.example`:

```
DATABASE_URL="postgresql://hermex:hermex@localhost:5432/hermex?schema=public"
```

Edit `apps/api/.env` (created by `prisma init`) so `DATABASE_URL` has the same value as above. `.env` is already covered by the root `.gitignore`'s `.env` rule — confirm with `git status` that it does not show as trackable.

- [ ] **Step 5: Generate the Prisma client**

Run: `pnpm --filter api exec prisma generate`
Expected: "Generated Prisma Client" success message.

- [ ] **Step 6: Create `PrismaService`**

Create `apps/api/src/prisma/prisma.service.ts`:

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

- [ ] **Step 7: Create `PrismaModule`**

Create `apps/api/src/prisma/prisma.module.ts`:

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 8: Register `PrismaModule` in `AppModule`**

Edit `apps/api/src/app.module.ts` — add the import:

```ts
import { PrismaModule } from './prisma/prisma.module.js';
```

and add `PrismaModule` to the `imports` array (alongside `GraphQLModule.forRoot(...)`).

- [ ] **Step 8b: Load `.env` at runtime (added during execution — see ledger)**

> Neither `main.ts` nor `app.module.ts` loads `.env` into `process.env` at
> runtime — `prisma.config.ts` and the Prisma CLI resolve `DATABASE_URL`
> fine for `generate`/`migrate`/`validate`, but the running Nest app has no
> such mechanism, so `PrismaService.onModuleInit()`'s `$connect()` fails
> the moment anything (Task 5's health check) actually runs the server.
> Fix with Nest's standard config module, which loads `.env` by default.

Run: `pnpm --filter api add @nestjs/config`

Edit `apps/api/src/app.module.ts` — add the import:

```ts
import { ConfigModule } from '@nestjs/config';
```

and add `ConfigModule.forRoot({ isGlobal: true })` as the **first** entry
in the `imports` array (before `GraphQLModule.forRoot(...)` and
`PrismaModule`), so environment variables are populated before anything
that depends on them initializes.

- [ ] **Step 9: Add root Prisma scripts**

Edit root `package.json` `scripts` to add:

```json
{
  "prisma:generate": "pnpm --filter api exec prisma generate",
  "prisma:migrate": "pnpm --filter api exec prisma migrate dev"
}
```

- [ ] **Step 10: Verify**

Run: `pnpm --filter api exec prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`

Run: `pnpm build:api`
Expected: exit code 0 (confirms `PrismaModule`/`PrismaService` compile cleanly against the generated client types).

- [ ] **Step 11: Commit**

```bash
git add apps/api/prisma apps/api/.env.example apps/api/src/prisma apps/api/src/app.module.ts package.json
git commit -m "feat: wire Prisma into the API (no domain models yet)"
```

---

### Task 5: Health check resolver (proves Nest → GraphQL → Prisma → Postgres)

**Files:**

- Create: `apps/api/src/health/health.model.ts`
- Create: `apps/api/src/health/health.resolver.ts`
- Create: `apps/api/src/health/health.module.ts`
- Modify: `apps/api/src/app.module.ts` — import `HealthModule`

**Interfaces:**

- Consumes: `PrismaService` from Task 4 (`apps/api/src/prisma/prisma.service.ts`).
- Produces: a GraphQL `health` query, publicly reachable at `POST http://localhost:3001/graphql`, returning `{ status: "ok", database: "connected" }`. This is the acceptance-criteria proof from the spec — no later task depends on this module's internals.

- [ ] **Step 1: Create the GraphQL object type**

Create `apps/api/src/health/health.model.ts`:

```ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Health {
  @Field()
  status: string;

  @Field()
  database: string;
}
```

- [ ] **Step 2: Create the resolver**

Create `apps/api/src/health/health.resolver.ts`:

```ts
import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { Health } from './health.model.js';

@Resolver()
export class HealthResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => Health)
  async health(): Promise<Health> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  }
}
```

- [ ] **Step 3: Create the module**

Create `apps/api/src/health/health.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { HealthResolver } from './health.resolver.js';

@Module({
  providers: [HealthResolver],
})
export class HealthModule {}
```

- [ ] **Step 4: Register `HealthModule` in `AppModule`**

Edit `apps/api/src/app.module.ts` — add the import:

```ts
import { HealthModule } from './health/health.module.js';
```

and add `HealthModule` to the `imports` array.

- [ ] **Step 5: Verify the full stack live**

Make sure Postgres is up: `pnpm db:up`

Start the API in the background:

```bash
pnpm --filter api start:dev &
sleep 8
```

Query it:

```bash
curl -s -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health { status database } }"}'
```

Expected output: `{"data":{"health":{"status":"ok","database":"connected"}}}`

Stop the background dev server:

```bash
kill %1
```

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/health apps/api/src/app.module.ts
git commit -m "feat: add GraphQL health check proving Nest-Prisma-Postgres wiring"
```

---

### Task 6: Frontend scaffold — Next.js + Tailwind + atomic design

**Files:**

- Create: `apps/web/` (generated by `create-next-app`)
- Create: `apps/web/src/components/atoms/Button/Button.tsx`
- Create: `apps/web/src/components/atoms/Button/index.ts`
- Create: `apps/web/src/components/molecules/.gitkeep`
- Create: `apps/web/src/components/organisms/.gitkeep`
- Create: `apps/web/src/components/templates/.gitkeep`
- Create: `apps/web/src/app/(auth)/login/page.tsx`
- Create: `apps/web/src/lib/auth/README.md`
- Modify: `apps/web/src/app/page.tsx` — render the `Button` atom
- Modify: `package.json` (root) — add `dev:web`, `build:web` scripts

**Interfaces:**

- Consumes: nothing from `apps/api` — independent of Tasks 3-5.
- Produces: `apps/web` as a workspace member serving `http://localhost:3000`; the `Button` atom at `apps/web/src/components/atoms/Button` establishes the pattern later molecules/organisms/templates follow.

- [ ] **Step 1: Scaffold the Next.js app**

```bash
cd apps
npx --yes create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
cd ..
```

Expected: `apps/web` contains a standard Next.js App Router project.

> Updated during execution (see ledger): with `--use-pnpm`, `create-next-app`
> runs its own `pnpm install` scoped to `apps/web`, producing a second,
> nested, self-contained workspace (`apps/web/pnpm-workspace.yaml`,
> `apps/web/pnpm-lock.yaml`, `apps/web/node_modules`, plus a stray
> `packageManager` field in `apps/web/package.json`) instead of joining the
> monorepo root workspace. Before Step 2, remove those nested artifacts —
> `rm -f apps/web/pnpm-workspace.yaml apps/web/pnpm-lock.yaml && rm -rf
apps/web/node_modules`, and delete the `packageManager` line from
> `apps/web/package.json` (root already declares it; `apps/api` doesn't
> repeat it either) — so the root `pnpm install` below links `apps/web` as
> an ordinary third workspace member instead.

- [ ] **Step 2: Link the new workspace member**

Run: `pnpm install`
Expected: exit code 0. (If it fails with `ERR_PNPM_IGNORED_BUILDS` for a
new native postinstall script — the same class of issue seen in Tasks 3-5
— add the flagged package to root `pnpm-workspace.yaml`'s `allowBuilds`
map and retry, per the established pattern.)

- [ ] **Step 3: Create the atomic-design folders and the first atom**

Create `apps/web/src/components/atoms/Button/Button.tsx`:

```tsx
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 ${className}`}
      {...props}
    />
  );
}
```

Create `apps/web/src/components/atoms/Button/index.ts`:

```ts
export { Button } from './Button';
```

Create empty placeholder files so the empty tiers are tracked by git:

- `apps/web/src/components/molecules/.gitkeep`
- `apps/web/src/components/organisms/.gitkeep`
- `apps/web/src/components/templates/.gitkeep`

- [ ] **Step 4: Render the Button on the home page**

Edit `apps/web/src/app/page.tsx` — add the import at the top:

```tsx
import { Button } from '@/components/atoms/Button';
```

and render `<Button>Reservar veículo</Button>` somewhere in the returned JSX (e.g. right after the opening `<main>` tag).

- [ ] **Step 5: Create the auth placeholder structure**

Create `apps/web/src/app/(auth)/login/page.tsx`:

```tsx
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-slate-500">
        Login placeholder — authentication is not implemented yet.
      </p>
    </main>
  );
}
```

Create `apps/web/src/lib/auth/README.md`:

```md
# Auth placeholder

Authentication is not implemented yet. This folder is reserved for the
future auth integration (provider, session handling, route protection).
See docs/superpowers/specs/2026-09-01-hermex-scaffold-design.md for scope.
```

- [ ] **Step 6: Add root scripts**

Edit root `package.json` `scripts` to add:

```json
{
  "dev:web": "pnpm --filter web dev",
  "build:web": "pnpm --filter web build"
}
```

- [ ] **Step 7: Verify it builds and renders**

Run: `pnpm build:web`
Expected: exit code 0, production build succeeds.

Start it and check the button renders:

```bash
pnpm --filter web start &
sleep 5
curl -s http://localhost:3000 | grep -o "Reservar veículo"
```

Expected: `Reservar veículo` printed.

Stop it: `kill %1`

- [ ] **Step 8: Commit**

```bash
git add apps/web package.json
git commit -m "feat: scaffold Next.js web app with atomic design and auth placeholder"
```

---

### Task 7: Shared ESLint/Prettier config at the root

> Updated during execution (see ledger): the installed `@nestjs/cli`
> scaffolded `apps/api` with **oxlint** (`apps/api/oxlint.json`), not
> ESLint — there is no `apps/api/eslint.config.mjs` to extend. Oxlint's
> config is a JSON schema with no mechanism to import/extend an arbitrary
> JS file the way ESLint flat config does. Ruling: don't fight the CLI's
> current default (same call already made for Task 3's ESM output and
> Task 6's nested workspace) — leave `apps/api/oxlint.json` as its own
> tool, and let root Prettier be the actual shared layer across both apps
> (the substantive goal: one formatting standard, one `pnpm lint`/`pnpm
format` entrypoint). `apps/web` still extends the root ESLint base
> config as originally planned, since Next.js still generates ESLint.

**Files:**

- Create: `eslint.config.mjs` (root)
- Create: `prettier.config.js` (root)
- Create: `.prettierignore` (root)
- Modify: `apps/web/eslint.config.mjs` — extend root config
- Modify/Delete: `apps/api/.prettierrc` — remove so root Prettier config applies
- Modify: `package.json` (root) — add `lint`, `format`, `format:check` scripts

**Interfaces:**

- Consumes: `apps/web` from Task 6 (has a generated ESLint config to extend); `apps/api` from Task 3 (uses oxlint, not extended — see note above).
- Produces: root `eslint.config.mjs` exporting a `baseConfig` array — `apps/web` imports it now; any future ESLint-based workspace package would do the same.

- [ ] **Step 1: Create the root ESLint base config**

Create `eslint.config.mjs`:

```js
export const baseConfig = [
  {
    ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**', '**/coverage/**'],
  },
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
];

export default baseConfig;
```

- [ ] **Step 2: Create the root Prettier config**

Create `prettier.config.js`:

```js
/** @type {import('prettier').Config} */
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
};
```

Create `.prettierignore`:

```
node_modules
dist
.next
coverage
pnpm-lock.yaml
```

- [ ] **Step 3: Install Prettier at the workspace root**

Run: `pnpm add -D -w prettier`

- [ ] **Step 4: Remove apps/api's local Prettier config**

Delete `apps/api/.prettierrc` (or `.prettierrc.json`/`.prettierrc.js` — whichever `nest new` generated; check with `ls apps/api/.prettier*`). Prettier walks up the directory tree for a config, so once the local one is gone, the root `prettier.config.js` applies to `apps/api` automatically. `apps/web` never had its own Prettier config, so nothing to remove there.

- [ ] **Step 5: `apps/api` linting — no shared-ESLint extension (see ruling above)**

`apps/api` uses oxlint (`apps/api/oxlint.json`), not ESLint — there is nothing to extend here. Leave `apps/api/oxlint.json` and `apps/api/package.json`'s `"lint": "oxlint src/ test/"` script exactly as `nest new` generated them. Root Prettier (Steps 2-4) still applies to `apps/api` — that's the actual shared layer for this app. Skip straight to Step 6.

- [ ] **Step 6: Extend the root ESLint config from `apps/web`**

Open `apps/web/eslint.config.mjs` (generated by `create-next-app`, using `FlatCompat`). Add this import at the top:

```js
import baseConfig from '../../eslint.config.mjs';
```

Then find the `const eslintConfig = [` array and make `...baseConfig` its first entry, e.g.:

```js
const eslintConfig = [...baseConfig, ...compat.extends('next/core-web-vitals', 'next/typescript')];
```

- [ ] **Step 7: Add root lint/format scripts**

Edit root `package.json` `scripts` to add:

```json
{
  "lint": "pnpm --filter web lint && pnpm --filter api lint",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

- [ ] **Step 8: Verify**

Run: `pnpm format`
Expected: exit code 0, files reformatted (or already formatted) with no errors.

Run: `pnpm format:check`
Expected: exit code 0, "All matched files use Prettier code style!"

Run: `pnpm lint`
Expected: exit code 0 for both `web` and `api` lint runs.

- [ ] **Step 9: Commit**

```bash
git add eslint.config.mjs prettier.config.js .prettierignore apps/web/eslint.config.mjs package.json
git add -u apps/api
git commit -m "chore: share ESLint/Prettier config across web and api"
```

(`git add -u apps/api` picks up the `.prettierrc` deletion from Step 4 — there's no `apps/api/eslint.config.mjs` to stage, per the Step 5 ruling.)

---

## Final Verification (run after all tasks)

- [ ] `pnpm install` from root — exit code 0
- [ ] `pnpm db:up` — Postgres up, `docker compose ps` shows it running
- [ ] `pnpm dev:api` (background) — `curl -X POST http://localhost:3001/graphql -d '{"query":"{ health { status database } }"}'` returns `{"data":{"health":{"status":"ok","database":"connected"}}}`
- [ ] `pnpm dev:web` (background) — `curl http://localhost:3000` returns HTML containing "Reservar veículo"
- [ ] `pnpm lint` and `pnpm format:check` — both exit code 0
- [ ] `git log --oneline` shows one commit per task, newest last
