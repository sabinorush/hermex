# Hermex

Hermex é uma locadora de veículos. This repository is currently a **monorepo
scaffold only** — there is no business/domain logic yet (no vehicles,
customers, reservations, etc.), just the technical foundation the future
features will be built on.

## Prerequisites

- Node.js >= 22
- pnpm 11.21.0 (use [Corepack](https://nodejs.org/api/corepack.html): `corepack enable` then `corepack prepare pnpm@11.21.0 --activate`)
- Docker (for the local Postgres instance)

## Setup

```bash
pnpm install
pnpm db:up                                   # starts Postgres via Docker Compose
cp apps/api/.env.example apps/api/.env
pnpm dev:api                                  # Nest.js on http://localhost:3001, GraphQL at /graphql
pnpm dev:web                                  # Next.js on http://localhost:3000
```

`dev:api` and `dev:web` can be run in separate terminals to have both apps up
at once.

## Running the API's e2e tests

`apps/api`'s e2e suite (`pnpm --filter api test:e2e`) boots the full
`AppModule`, including Prisma, so it requires Postgres running (`pnpm db:up`)
and `apps/api/.env` present (see Setup above) before it will pass.

## Monorepo structure

- `apps/web` — Next.js (App Router, TypeScript, Tailwind)
- `apps/api` — Nest.js (code-first GraphQL, Prisma)

This is scaffolding only — see
`docs/superpowers/specs/2026-09-01-hermex-scaffold-design.md` for what's in
and out of scope for this phase.

## Root scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `dev:web`         | Run the Next.js app in dev mode          |
| `dev:api`         | Run the Nest.js app in dev/watch mode    |
| `build:web`       | Build the Next.js app                    |
| `build:api`       | Build the Nest.js app                    |
| `lint`            | Lint both apps                           |
| `format`          | Format the whole repo with Prettier      |
| `format:check`    | Check formatting without writing changes |
| `db:up`           | Start Postgres (Docker Compose)          |
| `db:down`         | Stop Postgres                            |
| `prisma:generate` | Generate the Prisma client               |
| `prisma:migrate`  | Run Prisma migrations in dev mode        |
| `prisma:seed`     | Seed the database                        |
| `storybook`       | Run Storybook for the web app            |
| `build-storybook` | Build the static Storybook site          |
