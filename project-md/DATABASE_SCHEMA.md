# 📊 Visão Geral Completa do Schema Prisma

## 1. 🏗️ Arquitetura Geral

O banco de dados segue um modelo **multi-tenant** onde:
- Usuários podem ser **super admins** (gerenciam a plataforma)
- Workspaces são ambientes isolados (um usuário pode estar em múltiplos workspaces)
- Cada workspace tem seus próprios dados (contacts, tasks, projects, etc.)

---

## 2. 📋 Models e Relacionamentos

### **GRUPO 1: AUTENTICAÇÃO E CORE**

#### `User`
Representa um usuário da plataforma.

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | String (CUID) | PK, Auto-gerado |
| `supabaseUserId` | String | UNIQUE, opcional |
| `name` | String | Opcional |
| `email` | String | UNIQUE, opcional |
| `emailVerified` | DateTime | Opcional |
| `image` | String | Opcional (URL da foto) |
| `adminRoleId` | String | FK para AdminRole (opcional) |
| `createdAt` | DateTime | Auto-preenchido (now) |
| `updatedAt` | DateTime | Auto-atualizado |

**Relações:**
- 1:N com `Workspace` (como owner)
- 1:N com `WorkspaceMember` (memberships)
- 1:1 com `AdminRole` (opcional)

---

#### `AdminRole`
Papéis de administração da plataforma.

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | String (CUID) | PK |
| `name` | String | UNIQUE |

**Valores possíveis:** `'super_admin'`, `'admin'`, `'manager'`

**Relações:**
- 1:N com `User`

---

#### `WorkspaceRole`
Papéis dentro de um workspace.

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | String (CUID) | PK |
| `name` | String | UNIQUE |

**Valores possíveis:** `'work_admin'`, `'work_manager'`, `'work_user'`

**Relações:**
- 1:N com `WorkspaceMember`

---

#### `Workspace`
Ambiente isolado multi-tenant onde os dados residem.

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | String (CUID) | PK |
| `name` | String | Obrigatório |
| `slug` | String | UNIQUE (URL-friendly) |
| `ownerId` | String | FK para User (obrigatório) |
| `createdAt` | DateTime | Auto-preenchido |
| `updatedAt` | DateTime | Auto-atualizado |
| `stripeCustomerId` | String | UNIQUE, opcional |
| `stripeSubscriptionId` | String | UNIQUE, opcional |
| `stripePriceId` | String | Opcional |
| `stripeCurrentPeriodEnd` | DateTime | Opcional |

**Relações:**
- N:1 com `User` (owner)
- 1:N com `WorkspaceMember`
- 1:N com todos os módulos (Contact, Task, Project, etc.)

---

#### `WorkspaceMember`
Associação many-to-many entre User e Workspace com Role.

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | String (CUID) | PK |
| `userId` | String | FK para User |
| `workspaceId` | String | FK para Workspace (cascade delete) |
| `workspaceRoleId` | String | FK para WorkspaceRole |
| `createdAt` | DateTime | Auto-preenchido |
| `updatedAt` | DateTime | Auto-atualizado |

**Constraint:** `@@unique([userId, workspaceId])` - um usuário só pode estar uma vez em cada workspace

**Relações:**
- N:1 com `User`
- N:1 com `Workspace`
- N:1 com `WorkspaceRole`

---

### **GRUPO 2: MÓDULOS (Placeholders)**

Todos os módulos seguem o mesmo padrão: cada um pertence a um Workspace.

#### `Contact` (CRM)
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `fullName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Task`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `title` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Project`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `name` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `DigitalProfile`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `profileName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Campaign`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `campaignName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `AiAssistant`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `assistantName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Report`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `reportName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Portfolio`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `portfolioName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Event`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `eventName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Automation`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `automationName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Review`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `reviewText` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

#### `Planning`
| Campo | Tipo |
|-------|------|
| `id` | String (CUID) |
| `planName` | String |
| `workspaceId` | String (FK) |
| `createdAt` | DateTime |
| `updatedAt` | DateTime |

---

## 3. 📊 Diagrama ER (Entity-Relationship)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────┐         ┌─────────────────────┐           │
│  │   AdminRole      │         │    User             │           │
│  ├──────────────────┤         ├─────────────────────┤           │
│  │ id (PK)          │◄────────│ id (PK)             │           │
│  │ name (UNIQUE)    │  1:N    │ supabaseUserId (U)  │           │
│  └──────────────────┘         │ name                │           │
│         ▲                      │ email (UNIQUE)      │           │
│         │ 1:N                  │ emailVerified       │           │
│         │                      │ image               │           │
│         │                      │ adminRoleId (FK)    │           │
│         │                      │ createdAt           │           │
│         │                      │ updatedAt           │           │
│         │                      └─────────────────────┘           │
│         │                              │                        │
│         │                              │ 1:N (owner)            │
│         │                              │                        │
│  ┌──────────────────┐                 ┌▼──────────────────────┐ │
│  │WorkspaceRole     │         ┌─────►│ Workspace             │ │
│  ├──────────────────┤         │      ├───────────────────────┤ │
│  │ id (PK)          │◄────┐   │      │ id (PK)               │ │
│  │ name (UNIQUE)    │     │   │      │ name                  │ │
│  └──────────────────┘     │   │      │ slug (UNIQUE)         │ │
│         ▲                  │   │      │ ownerId (FK)          │ │
│         │ 1:N              │   │      │ Stripe fields         │ │
│         │                  │   │      │ createdAt/updatedAt   │ │
│  ┌──────┴──────────────────┴───┘      └───────┬───────────────┘ │
│  │  WorkspaceMember                           │                │
│  ├──────────────────────────────────────────┐ │                │
│  │ id (PK)                                  │ │                │
│  │ userId (FK) ──────────────┐              │ │                │
│  │ workspaceId (FK) ◄────────┼──────────────┘ │                │
│  │ workspaceRoleId (FK) ─────┼──────┐         │                │
│  │ @@unique([userId,          │      │         │                │
│  │          workspaceId])     │      │         │                │
│  │ createdAt/updatedAt        │      │         │                │
│  └────────────────────────────┼──────┼─────────┘                │
│                               │      │                          │
└───────────────────────────────┼──────┼──────────────────────────┘
                                │      │
        ┌───────────────────────┘      │
        │                              │
        │  1:N (belongs to)            │ 1:N (owns)
        │                              │
        ▼                              ▼
┌─────────────────────────────────────────────────────┐
│  MODULE ENTITIES (12 models)                        │
├─────────────────────────────────────────────────────┤
│  • Contact    • Campaign   • Report    • Planning    │
│  • Task       • AiAssistant• Portfolio              │
│  • Project    • Automation • Event                  │
│  • DigitalProfile • Review                          │
├─────────────────────────────────────────────────────┤
│ Cada um possui:                                     │
│  - id (CUID)                                        │
│  - workspaceId (FK) ◄─────────────────────────┐    │
│  - [entity]-specific field (name/title/etc)   │    │
│  - createdAt/updatedAt                        │    │
│  - onDelete: Cascade (quando workspace delete) │    │
└─────────────────────────────────────────────────────┘
```

---

## 4. 🔑 Índices e Constraints

### Primary Keys (PK)
- Todas as models usam `@id @default(cuid())` para ID único

### Unique Constraints
| Model | Campo | Descrição |
|-------|-------|-----------|
| `User` | `email` | Email único por usuário |
| `User` | `supabaseUserId` | ID Supabase único |
| `AdminRole` | `name` | Nome único de papel admin |
| `WorkspaceRole` | `name` | Nome único de papel workspace |
| `Workspace` | `slug` | URL-friendly unique |
| `Workspace` | `stripeCustomerId` | ID cliente Stripe único |
| `Workspace` | `stripeSubscriptionId` | ID assinatura Stripe único |
| `WorkspaceMember` | `[userId, workspaceId]` | Um usuário por workspace |

### Foreign Keys (FK)
| Model | Campo | Referencia | Behavior |
|-------|-------|-----------|----------|
| `User` | `adminRoleId` | `AdminRole.id` | Sem constraint |
| `Workspace` | `ownerId` | `User.id` | Sem constraint |
| `WorkspaceMember` | `userId` | `User.id` | Sem constraint |
| `WorkspaceMember` | `workspaceId` | `Workspace.id` | **onDelete: Cascade** |
| `WorkspaceMember` | `workspaceRoleId` | `WorkspaceRole.id` | Sem constraint |
| Todas as models modulares | `workspaceId` | `Workspace.id` | **onDelete: Cascade** |

---

## 5. 📌 Enums Utilizados

### AdminRole.name
```
'super_admin'  → Controle total da plataforma
'admin'        → Administrador com permissões amplas
'manager'      → Gerente com permissões limitadas
```

### WorkspaceRole.name
```
'work_admin'   → Administrador do workspace
'work_manager' → Gerente do workspace
'work_user'    → Usuário comum do workspace
```

---

## 6. ✅ Campos Únicos e Obrigatórios

### Campos Obrigatórios (NOT NULL)

#### User
- `id` (PK)
- `createdAt`
- `updatedAt`

#### AdminRole
- `id` (PK)
- `name` (UNIQUE)

#### WorkspaceRole
- `id` (PK)
- `name` (UNIQUE)

#### Workspace
- `id` (PK)
- `name`
- `slug` (UNIQUE)
- `ownerId` (FK)
- `createdAt`
- `updatedAt`

#### WorkspaceMember
- `id` (PK)
- `userId` (FK)
- `workspaceId` (FK, cascade delete)
- `workspaceRoleId` (FK)
- `createdAt`
- `updatedAt`
- Composite: `[userId, workspaceId]` (UNIQUE)

#### Módulos (Contact, Task, Project, etc.)
Todos compartilham:
- `id` (PK)
- `workspaceId` (FK, cascade delete)
- `createdAt`
- `updatedAt`
- Um campo específico (fullName, title, name, etc.)

---

## 7. 🔐 Isolamento Multi-Tenant

**Estratégia:** Isolamento por `workspaceId`

```
User A
  └─ Workspace 1 ─► User A's data (Contact, Task, etc.)
  └─ Workspace 2 ─► User A's data in Workspace 2

User B
  └─ Workspace 1 ─► User B's data (separate from User A)
  └─ Workspace 3 ─► User B's data in Workspace 3
```

### Segurança
- Middleware deve validar `workspaceId` do usuário
- Queries devem sempre filtrar por `workspaceId`
- Cascade delete garante limpeza quando workspace é deletado

---

## 8. 💳 Integração Stripe

O modelo `Workspace` contém campos para pagamento:
- `stripeCustomerId` - ID único do cliente
- `stripeSubscriptionId` - ID da assinatura ativa
- `stripePriceId` - Plano contratado
- `stripeCurrentPeriodEnd` - Data de renovação

---

## 9. 📈 Contagem de Models

| Categoria | Quantidade |
|-----------|-----------|
| Autenticação/Core | 5 models |
| Módulos | 12 models |
| **Total** | **17 models** |

---

## 10. 🚀 Próximos Passos Recomendados

1. **Expandir Models Modulares** - Adicionar campos específicos (descrição, status, prioridade, etc.)
2. **Criar Relacionamentos entre Módulos** - Ex: Task pode estar em um Project
3. **Adicionar Indexes** - Para melhorar performance em queries frequentes
4. **Implementar Soft Deletes** - Caso necessite preservar histórico
5. **Auditoria** - Adicionar `createdBy` e `updatedBy` em entidades críticas
6. **Validações** - Adicionar constraints no Prisma (ex: `@db.VarChar(255)`)

---

## 11. 📝 SQL de Referência (PostgreSQL)

```sql
-- Exemplo: Todas as tarefas de um usuário em um workspace
SELECT t.* 
FROM "Task" t
INNER JOIN "Workspace" w ON t."workspaceId" = w.id
WHERE w."ownerId" = 'user-id' AND w.slug = 'workspace-slug'

-- Exemplo: Membros de um workspace com suas roles
SELECT u.*, wr.name as role
FROM "User" u
INNER JOIN "WorkspaceMember" wm ON u.id = wm."userId"
INNER JOIN "WorkspaceRole" wr ON wm."workspaceRoleId" = wr.id
WHERE wm."workspaceId" = 'workspace-id'
```

