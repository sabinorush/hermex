# Hermex

Uma Locadora de veiculos.

## Monorepo

PNPM workspaces
Com atalhos no package.json usando o --filter para evitar navegar
entre pastas antes de executar os scripts

## Front-end

APp Next.js (criado via NPX)
Estilos com tailwind
Organizacao de componentes: atomic design
Preparado para autenticacao

## Back-end

Nest.js (criado via NPX)
Com graphql
ORM: prisma
Banco de dados postgres (docker-compose.yaml para levantar o banco de dados,
com volume montado )
