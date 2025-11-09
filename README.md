# NextCRM Primeiro

Plataforma SaaS de CRM multi-tenant construída com Next.js 16 (App Router), Prisma e Supabase.

## Stack

- Next.js 16 com Server Actions e App Router
- Prisma ORM conectado a PostgreSQL (Supabase)
- Autenticação via NextAuth v5 (Credentials Provider + Prisma Adapter)
- Tailwind CSS 4 (alpha)
- TypeScript, Zod e ESLint 9

## Como iniciar

1. **Instale as dependências**
   ```bash
   pnpm install # ou npm install / yarn install
   ```
2. **Configure o banco**
   - Copie `.env.example` para `.env.local`
   - Atualize `DATABASE_URL` com a connection string do Supabase
3. **Sincronize o schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Execute o projeto**
   ```bash
   pnpm dev
   ```

## Estrutura

- `src/app/admin` – área administrativa da plataforma
- `src/app/app/[workspaceSlug]` – área dos clientes/workspaces (multi-tenant)
- `src/app/(auth)` – fluxo de autenticação
- `prisma/schema.prisma` – modelos com isolamento por `workspaceId`

## Próximos passos

- Implementar server actions para o fluxo de login
- Configurar políticas de autorização na `middleware`
- Conectar módulos às entidades Prisma e criar testes eSeeds de dados
