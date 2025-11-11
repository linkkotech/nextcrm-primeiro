# 📚 Documentação - NextCRM Primeiro

Bem-vindo ao NextCRM Primeiro! Este projeto é uma plataforma SaaS de CRM multi-tenant construída com Next.js 15, Prisma, Supabase e shadcn/ui.

---

## 📖 Documentação

A documentação foi organizada em dois grupos:

### 🔴 Na Raiz do Projeto
- **`README.md`** - Overview geral do projeto (start here!)
- **`CODE_DOCUMENTATION.md`** - Documentação detalhada de código (padrões, fluxos, decisões arquiteturais)

### 📁 Em `project-md/` (Documentação de Implementação)
Documentação sobre setup, database e decisões técnicas:

- **`DATABASE_SCHEMA.md`** - Diagrama ER, 17 models, constraints, enums
- **`PRISMA_SETUP.md`** - Singleton pattern, seed setup, examples
- **`QUICK_START_SEED.md`** - Passo a passo para executar o seed
- **`IMPLEMENTATION_SUMMARY.md`** - Resumo da implementação
- **`DOCUMENTATION_INDEX.md`** - Mapa completo de documentação
- **`DOCUMENTATION_SUMMARY.md`** - Resumo da documentação
- **`AI_INSTRUCTIONS_GUIDE.md`** - Guia sobre `.github/copilot-instructions.md`
- **`README_SEED.md`** - Resumo executivo do seed

---

## 🚀 Quick Start

### 1. Setup Inicial
```bash
pnpm install                    # Instalar dependências
cp .env.example .env.local      # Copiar variáveis de ambiente
pnpm dev                        # Iniciar desenvolvimento
```

### 2. Setup do Banco de Dados
```bash
npx prisma db push             # Sincronizar schema
npx prisma db seed             # Inserir roles base
npx prisma studio              # Verificar dados (opcional)
```

Para detalhes, ver `project-md/QUICK_START_SEED.md`

---

## 🏗️ Arquitetura

### Três Zonas da Aplicação

```
1. Auth (Pública)         → src/app/(auth)/
   ├─ /sign-in
   ├─ /sign-up
   └─ /forgot-password

2. Admin (Restrita)       → src/app/admin/
   ├─ /admin/dashboard
   ├─ /admin/users
   └─ ... (só super_admin/admin)

3. Workspace (Multi-tenant) → src/app/app/[workspaceSlug]/
   ├─ /app/my-workspace/crm
   ├─ /app/my-workspace/tasks
   └─ ... (12 módulos, isolado por workspace)
```

### Multi-Tenant Isolation
**Crítico:** Todos os queries devem filtrar por `workspaceId`:
```typescript
const tasks = await prisma.task.findMany({
  where: { workspaceId: currentWorkspaceId }  // ✅ SEMPRE!
})
```

Para entender a arquitetura em detalhes, ver:
- `.github/copilot-instructions.md` - Para AI agents
- `CODE_DOCUMENTATION.md` - Para novos devs

---

## 📚 Como Navegar a Documentação

### 👤 Novo desenvolvedor?
1. `README.md` (este arquivo) - Overview
2. `.github/copilot-instructions.md` - Arquitetura e patterns
3. `CODE_DOCUMENTATION.md` - Entender implementações
4. `project-md/QUICK_START_SEED.md` - Setup inicial

### 🤖 Usando AI agent (Copilot, Claude, Cursor)?
1. Agente lê automaticamente `.github/copilot-instructions.md`
2. Se precisar mais contexto, ele pode referenciar `CODE_DOCUMENTATION.md`
3. Você comanda: "Cria nova página de dashboard no workspace"

### 🗄️ Precisa adicionar novo modelo?
1. `project-md/DATABASE_SCHEMA.md` - Ver estrutura existente
2. `CODE_DOCUMENTATION.md` - Seção "Multi-Tenant Isolation"
3. Implementar novo modelo

### 🔐 Implementando autenticação/forms?
1. `CODE_DOCUMENTATION.md` - Seção "Autenticação & Server Actions"
2. Ver exemplos em `src/components/blocks/login-form.tsx`
3. Implementar

---

## 🔑 Conceitos Fundamentais

### Server Actions + Forms
```typescript
"use server"  // Executa no servidor
export async function loginAction(data: unknown) {
  // 1. Validar com Zod
  // 2. Chamar serviço (Supabase Auth)
  // 3. Revalidar cache e redirecionar
}
```

### Prisma Singleton
```typescript
// Evita múltiplas conexões em hot-reload
import { prisma } from "@/lib/prisma"
```

### shadcn/ui Components
```typescript
import { Button } from "@/components/ui/button"
// Usar para consistência visual
```

---

## 🧪 Desenvolvimento

### Scripts Principais
```bash
pnpm dev                # Iniciar dev server (localhost:3000)
pnpm build              # Build para produção
pnpm lint               # Verificar código
npx prisma db push     # Sincronizar schema
npx prisma db seed     # Rodar seed script
npx prisma studio      # Abrir Prisma Studio (localhost:5555)
```

---

## 🔒 Segurança

**Checklist antes de commit:**
- [ ] Todos os queries filtram por `workspaceId`
- [ ] Roles verificadas no servidor (não confiar no cliente)
- [ ] Validação Zod em Server Actions
- [ ] Middleware permite/nega acesso corretamente

Ver `.github/copilot-instructions.md` para Security Checklist completo.

---

## 📊 Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 15.1.0 | Framework React com App Router |
| **Prisma** | 5.19.1 | ORM para PostgreSQL |
| **Supabase** | 2.80.0 | Auth + PostgreSQL |
| **NextAuth** | v5 | Autenticação (em setup) |
| **Tailwind CSS** | 4.1.0 | Estilização |
| **shadcn/ui** | Latest | Componentes UI |
| **React Hook Form** | 7.66.0 | Gerenciamento de forms |
| **Zod** | 3.23.8 | Validação de schemas |
| **TypeScript** | 5.6.3 | Tipagem |

---

## 🎯 Próximos Passos

1. **Implementar session.ts** - Extrair user/workspace do contexto
2. **Adicionar testes** - Unit tests para Server Actions
3. **Configurar Stripe** - Pagamentos (campos já existem em Workspace)
4. **Implementar RLS** - Row Level Security no Supabase
5. **Adicionar logging** - Para monitoramento em produção

---

## 📞 Suporte

- **Dúvida sobre arquitetura?** → Ver `CODE_DOCUMENTATION.md`
- **Preciso fazer algo?** → Ver `project-md/DOCUMENTATION_INDEX.md`
- **Erro de setup?** → Ver `project-md/QUICK_START_SEED.md`
- **Não encontro algo?** → Procurar em `project-md/DOCUMENTATION_SUMMARY.md`

---

## 📝 Contribuindo

Ao adicionar nova funcionalidade:
1. Seguir padrões em `.github/copilot-instructions.md`
2. Adicionar testes
3. Atualizar documentação se novo padrão
4. Fazer commit com mensagem descritiva

---

## 📄 Licença

Private - NextCRM Primeiro (LinkkoTech)

---

**Feliz codificação!** 🚀

Dúvidas? Leia `CODE_DOCUMENTATION.md` ou `project-md/DOCUMENTATION_INDEX.md`
