# 📚 Documentação - NextCRM Primeiro

Guia completo de documentação do projeto, com foco em o que NÃO é óbvio.

---

## 📖 Arquivos de Documentação

### 1. **`.github/copilot-instructions.md`** 🤖
Instruções para AI agents (GitHub Copilot, Claude, Cursor, etc.)

**Conteúdo:**
- Project overview (stack, tipo, linguagem)
- Architecture overview (multi-tenant, 3 zonas, roles)
- Key files & patterns (database, auth, components)
- Critical workflows (setup, dev, add new module)
- Common pitfalls (evita 5 erros críticos)
- Routing conventions
- Styling rules
- Security checklist

**Quando ler:** Quando começar a trabalhar no projeto ou gerar código com AI

---

### 2. **`CODE_DOCUMENTATION.md`** 📖 (NOVO)
Documentação detalhada de código para implementações não-óbvias

**Seções:**
- **Autenticação & Sessão** - Fluxo auth, middleware, client factories
- **Server Actions & Forms** - Pattern de Server Actions, Client Forms
- **Prisma Singleton** - Por que singleton, seeding, connection reuse
- **Multi-Tenant Isolation** - Workspaces, relationships, cascade delete, querying
- **Component Architecture** - Directory structure, RSC vs Client
- **Data Validation** - Zod + React Hook Form, validação dupla
- **Padrão de Resposta** - Como retornar erros em Actions
- **Environment Variables** - Obrigatórias e configuração
- **Testing Patterns** - Como testar Actions e Componentes
- **Performance** - Cache, Singleton, useTransition
- **Security** - Validação servidor, never trust client, CSRF
- **Referências** - Links para documentação oficial

**Quando ler:** Antes de implementar features de autenticação, forms, queries com multi-tenant, etc.

---

### 3. **`DATABASE_SCHEMA.md`** 🗄️
Visão completa do banco de dados

**Conteúdo:**
- Arquitetura geral (multi-tenant, isolamento)
- 17 models detalhados (campos, tipos, restrições)
- Diagrama ER visual
- Índices e constraints
- Enums (AdminRole, WorkspaceRole)
- Campos únicos e obrigatórios
- Isolamento multi-tenant explicado
- Integração Stripe
- SQL de referência

**Quando ler:** Antes de adicionar novo model ou query ao banco

---

### 4. **`PRISMA_SETUP.md`** 🌱
Setup do Prisma com singleton e seeding

**Conteúdo:**
- Singleton Prisma Client (implementação + explicação)
- Script de Seed (código completo)
- Configuração package.json
- Padrão singleton explicado (evita connection leaks)
- Como usar Prisma Client no código
- Fluxo de setup inicial
- Troubleshooting

**Quando ler:** Durante setup inicial, antes de executar `npx prisma db seed`

---

### 5. **`QUICK_START_SEED.md`** 🚀
Instruções passo a passo para executar o seed

**Conteúdo:**
- Pré-requisitos
- 3 passos para executar seed
- Como verificar dados inseridos
- Troubleshooting comum
- Checklist final
- Próximas tarefas

**Quando ler:** Na primeira vez que vai executar `npx prisma db push && npx prisma db seed`

---

### 6. **`README.md`** 
Overview geral do projeto

**Conteúdo:**
- Stack (Next.js 15, Prisma, Supabase, shadcn/ui)
- Como iniciar (install, config, sync schema)
- Estrutura (3 zonas: auth, admin, app)
- Próximos passos

**Quando ler:** Primeira vez no projeto, para visão geral

---

### 7. **`README_SEED.md`** 🌱
Resumo executivo da implementação de seed

---

### 8. **`IMPLEMENTATION_SUMMARY.md`** ✅
Resumo da implementação de Prisma + Seed

---

## 📊 Mapa de Leitura por Cenário

### 🆕 Primeira vez no projeto
1. `README.md` - Overview
2. `.github/copilot-instructions.md` - Arquitetura e patterns
3. `QUICK_START_SEED.md` - Setup inicial
4. `pnpm dev` - Rodar projeto

### 🗄️ Preciso adicionar novo modelo/query
1. `DATABASE_SCHEMA.md` - Ver models existentes e relações
2. `prisma/schema.prisma` - Ver exemplo de outro model
3. `CODE_DOCUMENTATION.md` - Seção "Multi-Tenant Isolation"
4. Implementar novo model

### 🔐 Preciso implementar autenticação/forms
1. `CODE_DOCUMENTATION.md` - Seção "Autenticação & Sessão"
2. `CODE_DOCUMENTATION.md` - Seção "Server Actions & Forms"
3. Ver exemplos em `src/components/blocks/login-form.tsx`
4. Implementar

### 🤖 Vou usar AI agent (Copilot, Claude, Cursor)
1. `.github/copilot-instructions.md` - Lê automaticamente
2. Descrever o que quer (agent vai usar instruções)
3. Se precisar mais contexto, referenciar `CODE_DOCUMENTATION.md`

### 🧪 Preciso testar
1. `CODE_DOCUMENTATION.md` - Seção "Testing Patterns"
2. Implementar testes

### 🚀 Preciso fazer deploy
1. `README.md` - Scripts de build/start
2. Verificar `.env.local` tem todas as vars obrigatórias
3. Fazer deploy

---

## 🔄 Manutenção da Documentação

Quando adicionar nova funcionalidade:

- [ ] Adicionar seção em `.github/copilot-instructions.md` (se padrão crítico)
- [ ] Adicionar documentação em `CODE_DOCUMENTATION.md` (se não-óbvio)
- [ ] Atualizar `DATABASE_SCHEMA.md` (se novo model)
- [ ] Atualizar este arquivo se novo arquivo criado

---

## 📝 Convenção: O que Documentar

### ✅ DOCUMENTAR

- Padrões não-óbvios (ex: por que singleton, por que dual persistence)
- Fluxos com múltiplos passos (ex: auth flow, seed setup)
- Decisões arquiteturais (ex: multi-tenant isolation)
- Gotchas/pitfalls (ex: sempre re-validar no servidor)
- Quando usar qual padrão (ex: RSC vs Client Component)

### ❌ NÃO DOCUMENTAR

- Código óbvio (ex: `useState`, `useForm`)
- API standard (ex: como usar `prisma.user.findUnique()`)
- Bibliotecas bem-conhecidas (ex: React Hook Form)
- Código autoexplicativo

### 💡 Dúvida?

Se não tem certeza, adicione comentários de código inline ou pergunta. Melhor documentar demais do que deixar ambíguo.

---

## 🎯 Objetivo

Documentação é para:
1. **Novos desenvolvedores** - Entender arquitetura rapidamente
2. **AI agents** - Gerar código correto sem bugs de segurança
3. **Você mesmo** - Lembrar decisões 3 meses depois

---

## 📞 Ficou confuso com algo?

- Adicione comentário no código (`// Why: ...`)
- Crie issue no GitHub com dúvida
- Atualize a documentação para ser mais clara
- Pergunte a outro dev que conhece o projeto

**Documentação viva = melhor que perfeita!**

