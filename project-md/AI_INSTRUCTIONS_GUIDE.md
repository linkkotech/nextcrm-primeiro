# 📋 AI Instructions Documentation Summary

## ✅ Arquivo Criado: `.github/copilot-instructions.md`

Um guia completo para AI agents (GitHub Copilot, Claude, Cursor, etc.) serem imediatamente produtivos no projeto NextCRM Primeiro.

---

## 📚 O que foi documentado:

### 1. **Project Overview**
- Stack: Next.js 15, Prisma, Supabase, NextAuth v5, shadcn/ui, Tailwind CSS 4
- Type: Multi-tenant SaaS CRM
- Language: TypeScript

### 2. **Architecture Overview** ⭐ (Crítico)
- **Multi-tenant isolation via `workspaceId`** - Todos os queries DEVEM filtrar por workspace
- **Three zones:** Auth public, Admin, Workspace multi-tenant
- **Role architecture:** AdminRoles (platform) vs WorkspaceRoles (workspace-level)

### 3. **Key Files & Patterns**
- Database: `prisma/schema.prisma`, `src/lib/prisma.ts` (singleton), `prisma/seed.ts`
- Auth: `src/middleware.ts`, `src/lib/session.ts` (TODO), `auth.actions.ts`
- Components: `ui/` (shadcn), `blocks/` (forms), `admin/` (admin-specific)
- Forms: React Hook Form + Zod validation

### 4. **Critical Workflows**
Comandos essenciais:
```bash
npx prisma db push              # Sync schema
npx prisma db seed              # Insert base roles
npx prisma studio              # Verify data
pnpm dev                        # Start dev server
```

### 5. **Common Pitfalls** ⚠️ (Previne Bugs)
- ❌ Esquecer isolamento de workspace
- ❌ Importar PrismaClient direto (usar singleton)
- ❌ Session Supabase stale em Server Actions
- ❌ Confundir AdminRole vs WorkspaceRole
- ❌ Colocar "use client" components no lugar errado

### 6. **Routing Conventions**
- Auth: `/(auth)/sign-in`, `/(auth)/sign-up`, `/(auth)/forgot-password`
- Admin: `/admin/*` (require admin roles)
- Workspace: `/app/[workspaceSlug]/*` (multi-tenant)

### 7. **Styling Rules**
- Tailwind CSS 4 com CSS variables
- shadcn/ui para componentes
- Global styles: `src/styles/globals.css`

### 8. **Security Checklist**
Itens a verificar:
- [ ] Filter queries por `workspaceId`
- [ ] Validate user workspace membership
- [ ] Check AdminRole em `/admin/*`
- [ ] Verify roles em Server Actions (não confiar no client)
- [ ] Setup RLS no Supabase

### 9. **Related Documentation**
- `DATABASE_SCHEMA.md` - Diagrama ER, 17 models
- `PRISMA_SETUP.md` - Singleton pattern explicado
- `QUICK_START_SEED.md` - Instruções passo a passo

### 10. **Next Milestone**
- Criar `src/lib/session.ts` - Extrair user + workspace do contexto
- Desbloqueará auth-protected Server Actions

---

## 🎯 Por que este arquivo é importante:

Quando um AI agent (você mesmo, GitHub Copilot, Claude, Cursor, etc.) for trabalhar neste projeto, ele terá:

1. ✅ **Compreensão rápida da arquitetura** - Não precisa ler 10 arquivos para entender multi-tenant
2. ✅ **Padrões específicos do projeto** - Sabe exatamente como fazer queries, estruturar componentes, etc.
3. ✅ **Workflows críticos documentados** - Sabe quais comandos rodar e em que ordem
4. ✅ **Segurança em primeiro lugar** - Checklists evitam vulnerabilidades comuns
5. ✅ **Contexto de decisões** - Entende o "por quê" por trás de cada pattern

---

## 📍 Próximos Passos Sugeridos

Para melhorar ainda mais a produtividade de AI agents, você pode:

1. **Criar `src/lib/session.ts`** - Centralizar extração de user/workspace
2. **Adicionar testes** - Documentar padrões de teste no `.github/copilot-instructions.md`
3. **Criar `.env.example`** - Com todas as variáveis necessárias (DATABASE_URL, Supabase keys, etc.)
4. **Adicionar ESLint rules** - Para garantir padrões no código gerado por AI
5. **Documentar API routes** - Se forem adicionadas (atualmente usando Server Actions)

---

## 💬 Feedback?

Você pode:
- Adicionar seções específicas (ex: "Stripe Integration")
- Refinar as "Common Pitfalls"
- Adicionar exemplos de código mais específicos
- Documentar padrões de testing
- Especificar regras de commit/PR

**O arquivo está pronto para uso, mas pode ser iterado conforme o projeto evolui!** 🚀

