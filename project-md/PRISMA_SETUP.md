# 🌱 Configuração do Prisma e Database Seeding

## 📋 Resumo

Configuração completa do Prisma com padrão singleton e script de seed para popular as tabelas de Roles (AdminRole e WorkspaceRole) automaticamente.

---

## 1. ✅ Arquivos Implementados

### 1.1 `src/lib/prisma.ts` - Singleton do Prisma Client

**Status:** ✅ Já existente e corretamente configurado

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**O que faz:**
- ✅ Implementa o padrão **Singleton** do Prisma Client
- ✅ Verifica se uma instância já existe no objeto global do Node.js
- ✅ Reutiliza a mesma conexão durante hot-reloading em desenvolvimento
- ✅ Evita esgotamento de conexões
- ✅ Configura logging apenas de errors e warnings

---

### 1.2 `prisma/seed.ts` - Script de Seed (CRIADO)

**Status:** ✅ Criado com sucesso

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Seed AdminRoles
    console.log("📝 Inserindo AdminRoles...");
    await prisma.adminRole.createMany({
      data: [
        { name: "super_admin" },
        { name: "admin" },
        { name: "manager" },
      ],
      skipDuplicates: true,
    });
    console.log("✅ AdminRoles inseridas com sucesso!");

    // Seed WorkspaceRoles
    console.log("📝 Inserindo WorkspaceRoles...");
    await prisma.workspaceRole.createMany({
      data: [
        { name: "work_admin" },
        { name: "work_manager" },
        { name: "work_user" },
      ],
      skipDuplicates: true,
    });
    console.log("✅ WorkspaceRoles inseridas com sucesso!");

    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

**O que faz:**
- ✅ Importa o PrismaClient
- ✅ Cria função `main` assíncrona
- ✅ Insere 3 AdminRoles: `super_admin`, `admin`, `manager`
- ✅ Insere 3 WorkspaceRoles: `work_admin`, `work_manager`, `work_user`
- ✅ Usa `skipDuplicates: true` para evitar erros se já existirem
- ✅ Try/catch/finally garante tratamento de erros e desconexão
- ✅ Logs descritivos em console com emojis
- ✅ Exit code 1 em caso de erro

---

### 1.3 `package.json` - Configuração do Seed (ATUALIZADO)

**Status:** ✅ Atualizado com sucesso

**JSON adicionado ao final do arquivo:**
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

**Resultado final em package.json:**
```json
{
  "name": "nextcrm-primeiro",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    // ... dependências ...
  },
  "devDependencies": {
    // ... dev dependências ...
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 2. 🚀 Como Usar

### 2.1 Executar o Seed

**Comando:**
```bash
npx prisma db seed
```

**Saída esperada:**
```
🌱 Iniciando seed do banco de dados...
📝 Inserindo AdminRoles...
✅ AdminRoles inseridas com sucesso!
📝 Inserindo WorkspaceRoles...
✅ WorkspaceRoles inseridas com sucesso!
🎉 Seed concluído com sucesso!
```

### 2.2 Executar com `db push`

O seed é executado automaticamente após migração:
```bash
npx prisma db push --skip-generate
```

### 2.3 Usar o Prisma Client no código

```typescript
import { prisma } from "@/lib/prisma";

// Exemplo: Buscar um AdminRole
const superAdmin = await prisma.adminRole.findUnique({
  where: { name: "super_admin" }
});

// Exemplo: Criar um usuário com role de admin
const user = await prisma.user.create({
  data: {
    email: "admin@example.com",
    adminRoleId: superAdmin.id
  }
});
```

---

## 3. 📊 O que é Inserido no Seed

### AdminRoles (Roles de Administração da Plataforma)

| Nome | Descrição |
|------|-----------|
| `super_admin` | Controle total da plataforma |
| `admin` | Administrador com permissões amplas |
| `manager` | Gerente com permissões limitadas |

### WorkspaceRoles (Roles dentro de um Workspace)

| Nome | Descrição |
|------|-----------|
| `work_admin` | Administrador do workspace |
| `work_manager` | Gerente do workspace |
| `work_user` | Usuário comum do workspace |

---

## 4. 🔒 Padrão Singleton Explicado

O código em `src/lib/prisma.ts` implementa o padrão **Singleton** para garantir:

1. **Uma única instância de conexão** durante toda a execução
2. **Reutilização da mesma conexão** em hot-reloading (desenvolvimento)
3. **Evita vazamento de conexões** (connection leaks)
4. **Melhor performance** ao evitar múltiplas instâncias

```typescript
// ❌ Problema: Múltiplas instâncias em hot-reload
const prisma = new PrismaClient(); // Cria nova a cada reload

// ✅ Solução: Singleton com global
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

---

## 5. 📝 Fluxo de Inicialização Recomendado

### Primeira execução (setup inicial):

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar .env.local com DATABASE_URL
# (copiar de .env.example e atualizar)

# 3. Sincronizar schema com banco
npx prisma db push

# 4. Executar seed
npx prisma db seed

# 5. Iniciar desenvolvimento
pnpm dev
```

### Próximas execuções:

```bash
# Apenas executar
pnpm dev
```

---

## 6. ⚠️ Troubleshooting

### Erro: "tsx not found"

**Solução:** Instalar `tsx` como dev dependency:
```bash
pnpm add -D tsx
```

### Erro: "DATABASE_URL not found"

**Solução:** Verificar `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

### Erro: "Duplicate key value"

**Solução:** O `skipDuplicates: true` já trata isso, mas se precisar limpar:
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### Erro: "Connection timeout"

**Solução:** Verificar se o banco está rodando e acessível pelo DATABASE_URL

---

## 7. 🎯 Checklist de Implementação

- ✅ `src/lib/prisma.ts` - Singleton implementado
- ✅ `prisma/seed.ts` - Script de seed criado
- ✅ `package.json` - Configuração do seed adicionada
- ✅ AdminRoles sendo inseridas (super_admin, admin, manager)
- ✅ WorkspaceRoles sendo inseridas (work_admin, work_manager, work_user)
- ✅ Try/catch/finally com desconexão do Prisma
- ✅ Logs informativos em console
- ✅ `skipDuplicates` ativo para evitar erros em re-execução

---

## 8. 🔗 Integração com Autenticação

Quando implementar NextAuth, use este código para assignar role no login:

```typescript
// auth.actions.ts - Exemplo
import { prisma } from "@/lib/prisma";

export async function createUserWithRole(email: string, roleId: string) {
  const adminRole = await prisma.adminRole.findUnique({
    where: { name: "admin" }
  });

  return prisma.user.create({
    data: {
      email,
      adminRoleId: adminRole?.id,
      supabaseUserId: "..." // From Supabase Auth
    }
  });
}
```

---

## 9. 📚 Próximas Tarefas

1. **Adicionar seed de dados extras** (usuário admin padrão, workspace demo, etc.)
2. **Implementar migrations** com Prisma Migrate
3. **Criar endpoints de gerenciamento de roles**
4. **Implementar autorização na middleware** baseada em roles
5. **Adicionar testes** para o seed script

