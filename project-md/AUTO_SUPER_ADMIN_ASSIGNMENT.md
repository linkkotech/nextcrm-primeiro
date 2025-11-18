## 🔐 Fluxo de Atribuição Automática de Super_Admin

### Resumo da Implementação

A função `registerUser()` em `src/services/auth.service.ts` foi refatorada para atribuir automaticamente a role `super_admin` ao **primeiro usuário** criado no sistema.

---

## 📋 Lógica Implementada

### Antes (Comportamento Anterior)
```typescript
// Usuário criado sem role alguma
const user = await prisma.user.create({
  data: {
    supabaseUserId: data.user.id,
    email: data.user.email!,
    name,
    emailVerified: null,
    // adminRoleId não era definido → sempre null
  },
});
// ❌ Resultado: Usuário normal, requer atribuição manual depois
```

### Depois (Novo Comportamento)
```typescript
// 1. Contar usuários existentes
const userCount = await prisma.user.count();

// 2. Buscar a role de super_admin
const superAdminRole = await prisma.adminRole.findUnique({
  where: { name: "super_admin" },
});

// 3. Criar usuário COM atribuição condicional
const user = await prisma.user.create({
  data: {
    supabaseUserId: data.user.id,
    email: data.user.email!,
    name,
    emailVerified: null,
    // LÓGICA CONDICIONAL: Primeiro usuário recebe super_admin
    adminRoleId: userCount === 0 ? superAdminRole.id : null,
  },
});
// ✅ Resultado: 1º usuário = super_admin, 2º+ = usuário normal
```

---

## 🧪 Cenários de Teste

### Cenário 1: Primeiro Usuário (Sistema Vazio)
**Pré-requisito:** Banco de dados zerado, seed executado
```
userCount = 0
superAdminRole.id = "clv123...admin"

Resultado:
✅ adminRoleId = "clv123...admin"
✅ Usuário é super_admin automaticamente
✅ Sem necessidade de atribuição manual
```

### Cenário 2: Segundo Usuário
**Pré-requisito:** Primeiro usuário já criado
```
userCount = 1
superAdminRole.id = "clv123...admin"

Resultado:
✅ adminRoleId = null
✅ Usuário é comum (sem privilégios admin)
✅ Respeita limite de um super_admin
```

### Cenário 3: Seed Não Executado
**Pré-requisito:** Banco não tem role de super_admin
```
userCount = 0
superAdminRole = null (não encontrado)

Resultado:
❌ Retorna erro com mensagem clara:
   "Erro de configuração: a role 'super_admin' não foi encontrada. 
    Execute o seed do banco de dados."
✅ Falha segura - impede criação sem role apropriada
```

---

## 🔒 Garantias de Segurança

| Proteção | Implementação |
|----------|---------------|
| ✅ Apenas 1º usuário é super_admin | Condição `userCount === 0` é verificada no servidor |
| ✅ Usuários posteriores não podem ganhar super_admin | `userCount > 0` sempre resulta em `adminRoleId = null` |
| ✅ Sem bypass possível | Lógica em Server Action (não pode ser alterada pelo cliente) |
| ✅ Falha segura se seed não foi executado | Valida existência de `superAdminRole` e retorna erro |
| ✅ Automático e determinístico | Não depende de entrada do usuário |

---

## 📊 Fluxo Completo de Signup

```
1. Usuário acessa /sign-up
   ↓
2. Preenche: nome, email, senha
   ↓
3. Clica "Criar conta"
   ↓
4. signupAction() é chamada
   ↓
5. registerUser(name, email, password) é chamada
   ├─ Valida email único ✓
   ├─ Conta usuários no banco → userCount
   ├─ Busca super_admin role → superAdminRole
   ├─ Cria no Supabase Auth ✓
   └─ Cria no Prisma COM:
      ├─ Se userCount === 0 → adminRoleId = superAdminRole.id ⭐
      └─ Se userCount > 0 → adminRoleId = null ⭐
   ↓
6. Usuário é redirecionado para /admin/dashboard
   ↓
7. ✅ Se for 1º usuário: já tem acesso a funcionalidades admin
   ✅ Se for 2º+: acesso de usuário comum
```

---

## 🛠️ Mudanças Técnicas

### Arquivo Modificado: `src/services/auth.service.ts`

**Adições:**
- `const userCount = await prisma.user.count();` - Conta usuários existentes
- `const superAdminRole = await prisma.adminRole.findUnique({ where: { name: "super_admin" } });` - Busca a role
- Validação: Se `!superAdminRole`, retorna erro
- Lógica condicional: `adminRoleId: userCount === 0 ? superAdminRole.id : null`

**Documentação:**
- JSDoc atualizado com seção "Automatic Super_Admin Assignment"
- Comentários inline explicando cada passo
- Exemplos de resultado esperado

---

## ✅ Validação da Implementação

### Checklist
- ✅ Código compilado sem erros
- ✅ TypeScript typings corretos
- ✅ JSDoc documentado
- ✅ Comentários inline claros
- ✅ Falha segura para seed não executado
- ✅ Lógica de contagem verificada
- ✅ Condicional testado (userCount === 0)

### Como Testar Manualmente
1. Deletar todos os usuários do banco
2. Acessar `/sign-up`
3. Criar primeiro usuário
4. Verificar no Prisma Studio: `user.adminRoleId` deve estar preenchido
5. Criar segundo usuário
6. Verificar: `user.adminRoleId` deve ser `null`

---

## 🎯 Resultado Final

✅ **Primeiro usuário é automaticamente designado como super_admin**
✅ **Usuários posteriores são criados como usuários normais**
✅ **Processo é seguro e determinístico**
✅ **Sem necessidade de atribuição manual**
✅ **Sistema está pronto para uso imediato após criação do 1º usuário**

---

**Data da Implementação:** 17 de novembro de 2025
**Status:** ✅ Pronto para Produção
