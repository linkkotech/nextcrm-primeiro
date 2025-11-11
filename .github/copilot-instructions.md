# 🤖 Copilot Instructions - NextCRM Primeiro

**Project Type:** Next.js 15 SaaS Multi-tenant CRM  
**Language:** TypeScript  
**Key Stack:** Next.js 15 (App Router), Prisma ORM, Supabase, NextAuth v5, shadcn/ui, Tailwind CSS 4

---
## Regras de Saída e Criação de Arquivos (REGRA ESTRITA)

- **PROIBIÇÃO DE ARQUIVOS DE RELATÓRIO:** **NÃO CRIE** arquivos de resumo, log, checklist, guia ou qualquer outro tipo de arquivo Markdown (`.md`) para documentar suas ações ou progresso. Seu trabalho é gerar CÓDIGO e COMANDOS, não documentação sobre seu próprio trabalho.
- **Comunicação Concisa:** Comunique o progresso de forma direta e objetiva no chat. Exemplo: "Plano aprovado. Gerando o código para a Etapa 1...", em vez de "Perfeito! Agora vou criar um documento de resumo...".
- **Exceção para Documentação:** A ÚNICA exceção para criar arquivos `.md` é se eu solicitar explicitamente a criação de um documento de projeto, que deve ser salvo exclusivamente na pasta `project-md/`.

## Fluxo de Trabalho e Interação

- **Plano de Execução OBRIGATÓRIO:** Para qualquer tarefa, sua PRIMEIRA resposta DEVE ser um plano de execução objetivo e conciso em formato de lista. Não use formatação de arquivo Markdown nem prosa excessiva. Apenas as etapas técnicas.
- **Aprovação Necessária:** NUNCA gere código ou execute comandos antes que eu aprove seu plano com uma mensagem explícita como "aprovado" ou "pode seguir".

## REGRAS DE DOCUMENTAÇÃO:

✅ DOCUMENTE (não é óbvio):
- Funções/métodos com lógica de negócio complexa
- Server Actions e suas validações
- Algoritmos não triviais
- Funções com side effects (mutations, API calls)
- Tipos complexos ou genéricos
- Regras de autorização/permissões
- Transformações de dados não óbvias
- Edge cases e comportamentos especiais
- Parâmetros com valores especiais ou restrições

❌ NÃO DOCUMENTE (óbvio):
- Getters/setters simples
- Componentes React básicos (sem lógica)
- Funções auto-explicativas (ex: getUserById)
- Tipos TypeScript simples
- Imports/exports
- Variáveis com nomes descritivos

## FORMATO:

Para funções/métodos complexos:
/**
 * [Breve descrição do PROPÓSITO, não do que faz]
 * 
 * @example
 * ```ts
 * // Caso de uso real
 * ```
 * 
 * @throws {Error} [Quando e por quê]
 * @returns [O que retorna e em que cenários]
 */

Para comportamentos especiais:
// IMPORTANTE: [Explicação do por quê isso é necessário]

Para edge cases:
// EDGE CASE: [Situação específica que precisa dessa lógica]

## AÇÃO:
Percorra os arquivos em src/ e adicione documentação seguindo essas regras.
Priorize: 
1. Server Actions (src/actions/)
2. Middleware (src/middleware.ts)
3. Lib utilities (src/lib/)
4. Schemas complexos (src/schemas/)

NÃO documente tudo, apenas o que realmente precisa de contexto adicional.

## 🏗️ Architecture Overview

### Multi-Tenant Isolation Strategy
All data is isolated via `workspaceId` at the Prisma model level. **Critical:** Every database query must filter by the requesting user's workspace to prevent data leakage. Example:

```typescript
// ✅ CORRECT: Filter by workspaceId
const tasks = await prisma.task.findMany({
  where: { workspaceId: currentWorkspaceId }
});

// ❌ WRONG: Missing workspaceId filter
const tasks = await prisma.task.findMany();
```

### Three Application Zones
1. **`src/app/(auth)`** - Public auth flows (sign-in, sign-up, forgot-password)
2. **`src/app/admin`** - Platform admin area (super_admin, admin roles only)
3. **`src/app/app/[workspaceSlug]`** - Multi-tenant user workspace (12 modules: CRM, tasks, projects, campaigns, etc.)

### Role Architecture
- **AdminRoles** (platform-level): `super_admin`, `admin`, `manager` - stored in `User.adminRoleId`
- **WorkspaceRoles** (workspace-level): `work_admin`, `work_manager`, `work_user` - via `WorkspaceMember.workspaceRoleId`

Seed these via: `npx prisma db seed` (runs `prisma/seed.ts`)

---

## 📂 Key Files & Patterns

### Database Configuration
- **`prisma/schema.prisma`** - All models (17 total). Start here for entity relationships.
- **`src/lib/prisma.ts`** - Singleton pattern (reuses connection in hot-reload). Always import from here.
- **`prisma/seed.ts`** - Bootstraps AdminRole and WorkspaceRole records.

### Authentication & Session
- **`src/middleware.ts`** - Supabase SSR client setup, refreshes session, defines public routes.
- **`src/lib/session.ts`** - Extract current user/workspace from session (implement this next).
- **`src/lib/actions/auth.actions.ts`** - Server actions for login/signup (use `loginSchema`, `signupSchema` from `src/schemas/auth.schemas.ts`).

### Components
- **`src/components/ui/`** - shadcn/ui components (Button, Card, Input, Label, Alert, Avatar, DropdownMenu).
- **`src/components/blocks/`** - Form components (LoginForm, SignupForm, ForgotPasswordForm) - use react-hook-form + Zod.
- **`src/components/admin/`** - Admin-specific (AdminHeader, SidebarNavigation, UserProfile).
- **`src/components/application/app-navigation/`** - Workspace navigation (app-specific sidebar).

### Forms & Validation
- **`src/schemas/auth.schemas.ts`** - Zod schemas for auth forms.
- Pattern: `useForm` + `zodResolver` + Server Actions (no tRPC/API routes for auth yet).

---

## 🔄 Critical Workflows

### Setup Database
```bash
npx prisma db push                    # Sync schema
npx prisma db seed                    # Insert AdminRole & WorkspaceRole
npx prisma studio                     # Verify data (port 5555)
```

### Development Server
```bash
pnpm install                          # Install deps (postinstall runs prisma generate)
pnpm dev                              # Start Next.js on port 3000
```

### Add New Module
1. Add model to `prisma/schema.prisma` with `workspaceId` FK (onDelete: Cascade).
2. Create `src/app/app/[workspaceSlug]/[module]/page.tsx`.
3. Run `npx prisma db push` to sync.
4. Import `{ prisma }` from `@/lib/prisma` and filter by `workspaceId`.

---

## ⚠️ Common Pitfalls

1. **Forgot workspace isolation** - Every query needs `where: { workspaceId: ... }`.
2. **Direct PrismaClient import** - Always use `import { prisma } from "@/lib/prisma"` (singleton).
3. **Supabase session stale** - Middleware refreshes it, but verify in Server Actions.
4. **Role confusion** - AdminRole is platform-level; WorkspaceRole is workspace-level.
5. **Component location** - Forms with "use client" go in `blocks/`; UI primitives in `ui/`; layouts in `admin/` or `app/`.

---

## 🛣️ Routing Conventions

- **Auth area:** `/(auth)/sign-in`, `/(auth)/sign-up`, `/(auth)/forgot-password`
- **Admin:** `/admin`, `/admin/users`, `/admin/products`, `/admin/orders` (all require admin roles)
- **Workspace:** `/app/[workspaceSlug]/`, `/app/[workspaceSlug]/crm`, `/app/[workspaceSlug]/tasks` (multi-tenant)

When adding new workspace routes, always extract `workspaceSlug` from params and validate user membership.

---

## 🎨 Styling Rules

- **Tailwind CSS 4** (alpha) with CSS variables via `@tailwindcss/postcss`.
- **shadcn/ui** is the component library - use it for consistency.
- Global styles: `src/styles/globals.css`.
- Color scheme: Light mode default, dark mode support via `next-themes`.

---

## 🔐 Security Checklist

- [ ] Filter all Prisma queries by `workspaceId`
- [ ] Validate user belongs to workspace before accessing `/app/[workspaceSlug]/*`
- [ ] Check AdminRole in middleware for `/admin/*` routes
- [ ] Never trust client-side role claims - always verify in Server Actions
- [ ] Use Supabase Row Level Security (RLS) once policies are defined

---

## 📚 Related Documentation

- `DATABASE_SCHEMA.md` - ER diagram, all 17 models, constraints, indexes.
- `PRISMA_SETUP.md` - Singleton pattern, seed script, Stripe fields.
- `QUICK_START_SEED.md` - Step-by-step seed execution.

---

## ❓ Next Major Milestone

**Server-side session extraction** - Create `src/lib/session.ts` to safely get current user + workspace from middleware context. This unblocks auth-protected Server Actions across all modules.

