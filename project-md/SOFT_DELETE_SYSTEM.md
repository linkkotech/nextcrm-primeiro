## 🛡️ Sistema de Soft Delete e Proteção de Administradores

### Resumo da Implementação

O sistema foi refatorado para implementar soft deletes e proteção de super_admin contra exclusão acidental. Aqui está o que foi feito:

---

### 1️⃣ Modificação do Schema Prisma ✅

**Arquivo:** `prisma/schema.prisma`

```prisma
model User {
  id                   String            @id @default(cuid())
  supabaseUserId       String?           @unique @map("supabase_user_id")
  name                 String?
  email                String?           @unique
  emailVerified        DateTime?
  image                String?
  deletedAt            DateTime?         // ← Campo adicionado para soft delete
  adminRoleId          String?
  adminRole            AdminRole?        @relation(fields: [adminRoleId], references: [id])
  // ... resto do modelo
}
```

**Ações realizadas:**
- ✅ Campo `deletedAt DateTime?` adicionado ao modelo User
- ✅ `npx prisma db push` executado e sincronizado com banco PostgreSQL
- ✅ `npx prisma generate` executado para regenerar cliente TypeScript

---

### 2️⃣ Middleware do Prisma ✅

**Arquivo:** `src/lib/prisma.ts`

```typescript
/**
 * Middleware para implementar soft deletes no modelo User.
 * 
 * Intercepta todas as queries que acessam o modelo User e adiciona
 * automaticamente o filtro where: { deletedAt: null } para as operações
 * de leitura (findUnique, findFirst, findMany).
 */
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (['findUnique', 'findFirst'].includes(params.action)) {
      if (!params.args.where) {
        params.args.where = {};
      }
      params.args.where.deletedAt = null;
    } else if (params.action === 'findMany') {
      if (!params.args.where) {
        params.args.where = {};
      }
      if (typeof params.args.where === 'object' && !Array.isArray(params.args.where)) {
        params.args.where.deletedAt = null;
      }
    }
  }
  
  return next(params);
});
```

**Funcionalidade:**
- ✅ `findUnique` → adiciona `where.deletedAt = null` automaticamente
- ✅ `findFirst` → adiciona `where.deletedAt = null` automaticamente
- ✅ `findMany` → adiciona `where.deletedAt = null` automaticamente
- ✅ Usuários deletados ficam **invisíveis** para toda a aplicação
- ✅ Dados históricos preservados no banco (não são removidos)

**Benefícios:**
- Nenhuma query precisa ser modificada manualmente
- Proteção em camada de banco de dados
- Auditoria de usuários deletados disponível via Prisma Studio

---

### 3️⃣ Server Action deleteUser ✅

**Arquivo:** `src/lib/actions/user.actions.ts` (novo)

#### Função Principal: `deleteUser()`

```typescript
export async function deleteUser(data: unknown): Promise<DeleteUserResult> {
  // 1. Validação de entrada com Zod
  const validatedData = deleteUserSchema.parse(data);
  
  // 2. Obter sessão do usuário autenticado
  const authSession = await getAuthSession();
  
  // 3. Verificar se usuário está autenticado
  if (!authSession?.user?.id) {
    return { success: false, error: "UNAUTHORIZED" };
  }
  
  // 4. Verificar se usuário é admin
  const isAdmin = authSession.user.adminRole?.name === "super_admin" ||
                  authSession.user.adminRole?.name === "admin";
  if (!isAdmin) {
    return { success: false, error: "FORBIDDEN" };
  }
  
  // 5. Impedir auto-deleção
  if (userIdToDelete === authSession.user.id) {
    return { success: false, error: "SELF_DELETE_FORBIDDEN" };
  }
  
  // 6. Buscar usuário a deletar
  const userToDelete = await prisma.user.findUnique({
    where: { id: userIdToDelete },
    select: { id: true, name: true, email: true, adminRole: { select: { name: true } } }
  });
  
  // ===== CLÁUSULA DE PROTEÇÃO: SUPER_ADMIN NÃO PODE SER DELETADO =====
  if (userToDelete.adminRole?.name === "super_admin") {
    return { 
      success: false, 
      error: "CANNOT_DELETE_SUPER_ADMIN",
      message: "Não é permitido deletar um super administrador"
    };
  }
  
  // 7. Executar soft delete
  await prisma.user.update({
    where: { id: userIdToDelete },
    data: { deletedAt: new Date() }
  });
  
  // 8. Revalidar cache
  revalidatePath("/admin/users");
  
  return { success: true, message: "Usuário deletado com sucesso" };
}
```

**Proteções Implementadas:**

| Proteção | Descrição | Retorno |
|----------|-----------|---------|
| ✅ Autenticação | Apenas usuários autenticados podem deletar | `UNAUTHORIZED` |
| ✅ Autorização | Apenas admins podem deletar | `FORBIDDEN` |
| ✅ Auto-proteção | Usuário não pode se deletar | `SELF_DELETE_FORBIDDEN` |
| ✅ **Super-admin** | **NUNCA pode ser deletado** | `CANNOT_DELETE_SUPER_ADMIN` |

---

### 4️⃣ Funções Auxiliares ✅

#### `getActiveUserCount()`
Retorna o número de usuários ativos (não deletados).

```typescript
const count = await getActiveUserCount(); // Retorna: number
```

#### `restoreUser()`
Restaura um usuário deletado (apenas para super_admin).

```typescript
const result = await restoreUser({ userIdToDelete: "clv123abc" });
// { success: true, message: "Usuário restaurado com sucesso" }
```

---

### 📊 Fluxo de Uso

#### Cenário 1: Deletar um usuário comum
```typescript
const result = await deleteUser({ 
  userIdToDelete: "user-id-123" 
});
// ✓ Sucesso: { success: true, message: "Usuário deletado..." }
```

#### Cenário 2: Tentar deletar super_admin
```typescript
const result = await deleteUser({ 
  userIdToDelete: "super-admin-id" 
});
// ✗ Bloqueado: { success: false, error: "CANNOT_DELETE_SUPER_ADMIN", message: "Não é permitido deletar..." }
```

#### Cenário 3: Query normal mostra apenas usuários ativos
```typescript
const users = await prisma.user.findMany();
// Retorna apenas usuários com deletedAt = null (middleware aplica automaticamente)
```

#### Cenário 4: Restaurar usuário deletado
```typescript
const result = await restoreUser({ 
  userIdToDelete: "user-id-123" 
});
// ✓ Sucesso: { success: true, message: "Usuário restaurado com sucesso" }
```

---

### 🔍 Verificação de Dados

Use **Prisma Studio** para verificar os dados:

```bash
npx prisma studio
# Abre em http://localhost:5555
```

Na interface, você pode:
- Ver usuários com `deletedAt` preenchido (deletados)
- Ver usuários com `deletedAt = null` (ativos)
- Restaurar usuários manualmente se necessário

---

### 🚨 Segurança - Edge Cases Tratados

| Caso | Tratamento |
|------|-----------|
| Usuário não autenticado tenta deletar | Retorna UNAUTHORIZED |
| Usuário comum tenta deletar outro | Retorna FORBIDDEN |
| Admin tenta se deletar | Retorna SELF_DELETE_FORBIDDEN |
| Admin tenta deletar super_admin | Retorna CANNOT_DELETE_SUPER_ADMIN |
| Query busca usuário deletado diretamente | Middleware retorna null (invisível) |
| Tentativa de bypass do middleware via SQL direto | Middleware não intercepta - depende de RLS no Supabase |

---

### 📝 Tipo de Retorno

```typescript
interface DeleteUserResult {
  success: boolean;
  message: string;
  error?: string;
}
```

---

### ✅ Checklist de Implementação

- ✅ Campo `deletedAt` adicionado ao modelo User
- ✅ Schema sincronizado com banco PostgreSQL
- ✅ Middleware Prisma implementado e testado
- ✅ Server Action `deleteUser` criada com proteção super_admin
- ✅ Validação Zod para entrada de dados
- ✅ Documentação JSDoc completa
- ✅ Mensagens de erro em português
- ✅ Revalidação de cache após soft delete
- ✅ Funções auxiliares (`getActiveUserCount`, `restoreUser`)
- ✅ Servidor compilando sem erros

---

### 🚀 Próximos Passos (Opcional)

1. **Integrar com UI Admin:** Adicionar botão "Deletar" na página `/admin/users`
2. **Auditoria:** Criar log de quem deletou qual usuário e quando
3. **Purga Permanente:** Adicionar função para super_admin purgar deletados após X dias
4. **RLS no Supabase:** Implementar políticas para impedir acesso a dados de usuários deletados

---

**Data da Implementação:** 17 de novembro de 2025  
**Status:** ✅ Implementado e Testado
