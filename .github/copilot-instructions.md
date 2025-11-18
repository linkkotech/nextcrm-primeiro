# Prompt copilot

## Regras de Saída e Criação de Arquivos (REGRA ESTRITA)

-   **PROIBIÇÃO DE ARQUIVOS DE RELATÓRIO:** **NÃO CRIE** arquivos de resumo, log, checklist, guia ou qualquer outro tipo de arquivo Markdown (.md) para documentar suas ações ou progresso. Seu trabalho é gerar CÓDIGO e COMANDOS, não documentação sobre seu próprio trabalho.
-   **Comunicação Concisa:** Comunique o progresso de forma direta e objetiva no chat. Exemplo: "Plano aprovado. Gerando o código para a Etapa 1...".
-   **Exceção para Documentação:** A ÚNICA exceção para criar arquivos .md é se eu solicitar explicitamente a criação de um documento de projeto, que deve ser salvo exclusivamente na pasta project-md/.

## Fluxo de Trabalho e Interação

-   **Plano de Execução OBRIGATÓRIO:** Para qualquer tarefa, sua PRIMEIRA resposta DEVE ser um plano de execução objetivo e conciso em formato de lista. Não use formatação de arquivo Markdown nem prosa excessiva. Apenas as etapas técnicas.
-   **Aprovação Necessária:** NUNCA gere código ou execute comandos antes que eu aprove seu plano com uma mensagem explícita como "aprovado" ou "pode seguir".

* * *

## **\[NOVO\] Regras de Pesquisa e Componentização**

-   **ACESSO AO MCP SERVER:** **Você tem permissão para acessar o MCP (Master Control Program) Server da Context7.** Utilize este recurso para buscar informações atualizadas sobre as stacks que estamos usando (Next.js, Prisma, Supabase, etc.), seja para implementar novas funcionalidades ou para corrigir bugs. **Priorize sempre a documentação e as melhores práticas mais recentes obtidas através do MCP Server.**
-   **ESTRATÉGIA DE COMPONENTES shadcn/ui:** Ao precisar de um novo componente de UI (ex: seletor de data, carrossel):
    1.  **SEMPRE** verifique primeiro se um componente pronto existe no site oficial do shadcn/ui. Use-o como modelo principal.
    2.  **SE NÃO ENCONTRAR**, sua próxima ação é **PERGUNTAR**. Apresente alternativas no seu plano de execução, como "O componente X não existe no shadcn/ui. Sugiro usar a biblioteca Y, ou podemos desenvolvê-lo do zero. Qual você prefere?".
    3.  **NUNCA** desenvolva um componente complexo do zero sem minha aprovação explícita.

* * *

## **\[REFORÇADO\] REGRAS DE DOCUMENTAÇÃO DE CÓDIGO (OBRIGATÓRIO)**

A documentação do código é **obrigatória** para garantir a manutenibilidade do projeto. Siga estas regras estritamente.

✅ **DOCUMENTE (não é óbvio):**

-   Funções/métodos com lógica de negócio complexa
-   Server Actions e suas validações
-   Algoritmos não triviais
-   Funções com side effects (mutações, chamadas de API)
-   Tipos TypeScript complexos ou genéricos
-   Regras de autorização/permissões
-   Transformações de dados não óbvias
-   Edge cases e comportamentos especiais
-   Parâmetros com valores especiais ou restrições

❌ **NÃO DOCUMENTE (óbvio):**

-   Getters/setters simples
-   Componentes React básicos (sem lógica)
-   Funções auto-explicativas (ex: getUserById)
-   Tipos TypeScript simples
-   Imports/exports
-   Variáveis com nomes descritivos

### **FORMATO:**

Para funções/métodos complexos:

code TypeScript

    `/**
    

-   \[Breve descrição do PROPÓSITO, não do que faz\]
-     
    
-   @example
-     
    
-   // Caso de uso real
-     
    
-     
    
-   @throws {Error} \[Quando e por quê\]
-   @returns \[O que retorna e em que cenários\] \*/\`

Para comportamentos especiais:

// IMPORTANTE: \[Explicação do por quê isso é necessário\]

Para edge cases:

// EDGE CASE: \[Situação específica que precisa dessa lógica\]

### **AÇÃO:**

A partir de agora, **toda nova função ou lógica complexa que você criar DEVE seguir estas regras de documentação**. Para o código existente, percorra os arquivos em src/ e adicione documentação gradualmente, priorizando:

1.  Server Actions (src/actions/ ou src/services/)
2.  Middleware (src/middleware.ts)
3.  Utilitários da lib (src/lib/)
4.  Schemas Zod complexos (src/schemas/)

* * *

## 🏗️ Architecture Overview

### Multi-Tenant Isolation Strategy

All data is isolated via workspaceId at the Prisma model level. **Critical:** Every database query must filter by the requesting user's workspace to prevent data leakage. **Exception:** super\_admin and admin roles can operate with workspaceId: null for global templates.

### Three Application Zones

1.  **src/app/(auth)** - Public auth flows
2.  **src/app/admin** - Platform admin area (requires admin roles)
3.  **src/app/app/\[workspaceSlug\]** - Multi-tenant user workspace

### Role Architecture

-   **AdminRoles** (platform-level): super\_admin, admin, manager
-   **WorkspaceRoles** (workspace-level): work\_admin, work\_manager, work\_user

* * *

## 📂 Key Files & Patterns

### Database Configuration

-   **prisma/schema.prisma** - Source of truth for models.
-   **src/lib/prisma.ts** - Singleton pattern. Always import from here.
-   **prisma/seed.ts** - Bootstraps roles.

### Authentication & Session

-   **src/middleware.ts** - Refreshes session, protects routes.
-   **src/lib/session.ts** - Contains getAuthSession() to safely get current user + roles.
-   **src/services/\*.actions.ts** - Server actions for business logic.

### **Components**

-   _**`src/components/ui/`**_ - shadcn/ui components (Button, Card, Input, Label, Alert, Avatar, DropdownMenu).
-   _**`src/components/blocks/`**_ - Form components (LoginForm, SignupForm, ForgotPasswordForm) - use react-hook-form + Zod.
-   _**`src/components/admin/`**_ - Admin-specific (AdminHeader, SidebarNavigation, UserProfile).
-   _**`src/components/application/app-navigation/`**_ - Workspace navigation (app-specific sidebar).

**\### Forms & Validation**

-   _**`src/schemas/auth.schemas.ts`**_ - Zod schemas for auth forms.
-   Pattern: `useForm` + `zodResolver` + Server Actions (no tRPC/API routes for auth yet).

* * *

**\## 🔄 Critical Workflows**

**\### Setup Database**

    
    npx prisma db push                    # Sync schema
    
    npx prisma db seed                    # Insert AdminRole & WorkspaceRole
    
    npx prisma studio                     # Verify data (port 5555)
    
    

**\### Development Server**

    
    pnpm install                          # Install deps (postinstall runs prisma generate)
    
    pnpm dev                              # Start Next.js on port 3000
    
    

**\### Add New Module**

1.  Add model to `prisma/schema.prisma` with `workspaceId` FK (onDelete: Cascade).
    
2.  Create `src/app/app/[workspaceSlug]/[module]/page.tsx`.
    
3.  Run `npx prisma db push` to sync.
    
4.  Import `{ prisma }` from `@/lib/prisma` and filter by `workspaceId`.
    

* * *

**\## ⚠️ Common Pitfalls**

1.  ****Forgot workspace isolation**** - Every query needs `where: { workspaceId: ... }`.
    
2.  ****Direct PrismaClient import**** - Always use `import { prisma } from "@/lib/prisma"` (singleton).
    
3.  ****Supabase session stale**** - Middleware refreshes it, but verify in Server Actions.
    
4.  ****Role confusion**** - AdminRole is platform-level; WorkspaceRole is workspace-level.
    
5.  ****Component location**** - Forms with "use client" go in `blocks/`; UI primitives in `ui/`; layouts in `admin/` or `app/`.
    

* * *

**\## 🛣️ Routing Conventions**

-   _**Auth area:**_\* `/(auth)/sign-in`, `/(auth)/sign-up`, `/(auth)/forgot-password`
-   _**Admin:**_\* `/admin`, `/admin/users`, `/admin/products`, `/admin/orders` (all require admin roles)
-   _**Workspace:**_\* `/app/[workspaceSlug]/`, `/app/[workspaceSlug]/crm`, `/app/[workspaceSlug]/tasks` (multi-tenant)

When adding new workspace routes, always extract `workspaceSlug` from params and validate user membership.

* * *

**\## 🎨 Styling Rules**

-   _**Tailwind CSS 4**_\* (alpha) with CSS variables via `@tailwindcss/postcss`.
-   _**shadcn/ui**_\* is the component library - use it for consistency.
-   Global styles: `src/styles/globals.css`.
-   Color scheme: Light mode default, dark mode support via `next-themes`.

* * *

**\## 🔐 Security Checklist**

-   Filter all Prisma queries by `workspaceId`
-   Validate user belongs to workspace before accessing `/app/[workspaceSlug]/*`
-   Check AdminRole in middleware for `/admin/*` routes
-   Never trust client-side role claims - always verify in Server Actions
-   Use Supabase Row Level Security (RLS) once policies are defined

* * *

**\## 📚 Related Documentation**

-   `DATABASE_SCHEMA.md` - ER diagram, all 17 models, constraints, indexes.
-   `PRISMA_SETUP.md` - Singleton pattern, seed script, Stripe fields.
-   `QUICK_START_SEED.md` - Step-by-step seed execution.

* * *

**\## ❓ Next Major Milestone**

-   _**Server-side session extraction**_\* - Create `src/lib/session.ts` to safely get current user + workspace from middleware context. This unblocks auth-protected Server Actions across all modules.