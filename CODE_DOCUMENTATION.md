# 📖 Documentação de Código - NextCRM Primeiro

Documentação dos padrões e decisões não-óbvias no codebase.

---

## 🔐 Autenticação & Sessão

### Fluxo de Autenticação

```
Browser (Client)
    ↓
LoginForm ("use client")
    ↓
loginAction (Server Action)
    ↓
authenticateWithCredentials (Serviço)
    ├─ Supabase Auth (cria sessão)
    └─ Prisma User (sincroniza com DB)
    ↓
Middleware (refresh session)
    ↓
Redireciona para /admin/dashboard
```

**Por que 3 camadas?**
- **Componente (LoginForm):** UI + validação do lado do cliente
- **Action (loginAction):** Validação com Zod + orquestração de efeitos
- **Serviço (authenticateWithCredentials):** Lógica de autenticação isolada

### `src/middleware.ts` - Session Management

```typescript
// ✅ Middleware é executado em TODAS as requisições
// Responsabilidades críticas:
// 1. Refresh da sessão Supabase (se expirada)
// 2. Redirecionar usuários não-autenticados para /sign-in
// 3. Redirecionar autenticados longe de /sign-in
// 4. Preparar contexto para Server Components

// ⚠️ IMPORTANTE: matcher regex exclui arquivos estáticos
// Se adicionar nova rota estática (ex: /logo.svg), adicione ao matcher!
```

**Fluxo de Requisição:**
```
Request → Middleware (refresh session) → Route Handler/Server Component → Response
```

### `src/lib/supabase.ts` - Client Factories

```typescript
// createServerClient() - Para Server Components e Server Actions
// ├─ Acessa cookies via `await cookies()`
// ├─ Mantém sessão entre requisições
// └─ Pode ser chamado múltiplas vezes (idempotent)

// createBrowserClient() - Para Client Components ("use client")
// ├─ Gerencia cookies no browser
// └─ Instância única (criar uma vez e reutilizar)
```

**Por que dois factories diferentes?**
- Server: Usa `next/headers` cookies (async, seguro)
- Browser: Usa localStorage/cookies do navegador (sync, rápido)

### `src/services/auth.service.ts` - Dual Persistence

A função `authenticateWithCredentials` faz sync de duas fontes:

```typescript
// 1. Supabase Auth - Sessão oficial (JWT tokens)
const { data, error } = await supabase.auth.signInWithPassword({...})

// 2. Prisma User - Registro em PostgreSQL
// ├─ Buscar user existente
// ├─ Se não existir, criar novo (auto-provisioning)
// └─ Sincronizar dados: email, name, emailVerified
```

**Por que sincronizar?**
- Supabase Auth: Gerencia sessão (JWT tokens, refresh tokens)
- Prisma User: Gerencia dados (name, admin roles, workspaces)
- Ambos precisam estar em sync para multi-tenant funcionar

---

## 🎯 Server Actions & Forms

### `src/lib/actions/auth.actions.ts` - Server Action Pattern

```typescript
"use server" // ← Directive crítica - executa APENAS no servidor

export async function loginAction(data: unknown): Promise<LoginActionResult> {
  // 1. Validação: Zod converte `unknown` para tipo seguro
  const validatedFields = loginSchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: "Campos inválidos." }
  }

  // 2. Lógica: Chamar serviço
  const result = await authenticateWithCredentials(...)

  // 3. Side Effects: Revalidar cache e redirecionar
  revalidatePath('/', 'layout')  // ← Limpa cache de todas as rotas
  redirect('/admin/dashboard')   // ← Throws RedirectError (não é erro real)
}
```

**Por que revalidatePath ANTES de redirect?**
- Ordem importa: revalidatePath → redirect → NextResponse.redirect()
- Se fazer reverse, o redirect pode não ver dados atualizados

### `src/components/blocks/login-form.tsx` - Client Form Pattern

```tsx
"use client" // ← Client Component (para interatividade)

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  
  async function onSubmit(data: LoginInput) {
    // useTransition: Permite async na form submission
    startTransition(async () => {
      const result = await loginAction(data)  // ← Server Action
      
      // Se erro, mostrar no estado local (não redireciona)
      if (result.error) {
        setError(result.error)
      }
      // Se sucesso, loginAction faz redirect (nunca chega aqui)
    })
  }

  // Inputs desabilitados enquanto pendente (UX visual)
  disabled={isPending}
}
```

**Por que não redirecionar no componente?**
- Server Actions não podem redirecionar direto
- `redirect()` throws RedirectError (é intenção, não erro)
- Componente fica simples: só mostra erro ou aguarda

---

## 📊 Prisma Singleton Pattern

### `src/lib/prisma.ts` - Connection Reuse

```typescript
// ❌ PROBLEMA (sem singleton):
// const prisma = new PrismaClient()
// Em hot-reload, cria nova conexão = muitas conexões abertas

// ✅ SOLUÇÃO (com singleton):
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  // ↑ Em desenvolvimento, salva no global para hot-reload reutilizar
}
```

**Por que em dev mas não em production?**
- Dev: Next.js hot-reload pode executar código múltiplas vezes
- Production: Cada servidor/worker tem uma instância só

### Seeding com `prisma/seed.ts`

```typescript
// Executado por: npx prisma db seed

const prisma = new PrismaClient()  // ← Nova instância (script descartável)

async function main() {
  // createMany com skipDuplicates: true
  // ├─ Idempotent: seguro executar múltiplas vezes
  // └─ Não falha se dados já existem
  
  await prisma.adminRole.createMany({
    data: [
      { name: "super_admin" },
      { name: "admin" },
      { name: "manager" },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

**Nota:** Script não usa singleton (é descartável), Supabase usa singleton via importa `@/lib/prisma`

---

## 🏗️ Multi-Tenant Isolation

### Workspaces & Users Relationship

```typescript
// User pode ser dono (owner) de N workspaces
User.workspacesOwned Workspace[]  (1:N via "WorkspaceOwner")

// User pode ser membro (member) de N workspaces
User.workspaceMemberships WorkspaceMember[]  (1:N)
  ├─ WorkspaceMember.workspaceRoleId (work_admin, work_manager, work_user)
  └─ Unique constraint: [userId, workspaceId]
     (um user só pode estar uma vez em cada workspace)

// Workspace pertence a 1 owner User
Workspace.owner User  (N:1)
```

### Querying com Isolamento

```typescript
// ❌ INSEGURO - sem isolamento
const tasks = await prisma.task.findMany()  // Todos os tasks de todos!

// ✅ SEGURO - com workspaceId
const tasks = await prisma.task.findMany({
  where: { workspaceId: currentWorkspaceId }
})

// De onde vem currentWorkspaceId?
// → Extraído da URL: /app/[workspaceSlug]/tasks
// → Validado contra WorkspaceMember para confirmar acesso
```

### Cascade Delete

```typescript
model Task {
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  //                                                                            ↑
  // Se deletar Workspace, deleta todos Tasks automaticamente
}
```

---

## 🎨 Component Architecture

### Directory Structure

```
src/components/
├── ui/                    # shadcn/ui primitivos (Button, Card, Input, etc)
│   ├── button.tsx         # Sem "use client" (RSC)
│   ├── card.tsx
│   └── ...
│
├── blocks/                # Componentes com "use client" (interatividade)
│   ├── login-form.tsx     # "use client" - form com estado
│   ├── signup-form.tsx
│   └── forgot-password-form.tsx
│
├── admin/                 # Admin-specific layouts & components
│   ├── AdminHeader.tsx    # "use client" - header responsivo
│   ├── SidebarNavigation.tsx
│   └── UserProfile.tsx
│
├── application/           # Workspace app components
│   └── app-navigation/
│       ├── config.ts      # Configuração de menu
│       └── sidebar-navigation/
│
└── providers/             # Context Providers
    ├── route-provider.tsx
    └── theme-provider.tsx
```

**Convenção:**
- `ui/`: Componentes puros (sem estado, sem "use client")
- `blocks/`: Componentes com forma (forms, cards com lógica)
- `admin/`: Admin-only components
- `application/`: Workspace app components

### React Server Components (RSC) vs Client

```tsx
// ✅ RSC (padrão - sem "use client")
// Executam no servidor, zero JavaScript no cliente
export function CardHeader({ children }) {
  return <header>{children}</header>
}

// ✅ Client Component (precisa de "use client")
// Interatividade local, formulários, hooks
"use client"
export function LoginForm() {
  const [email, setEmail] = useState("")
  // ...
}
```

**Hierarquia:** Server → Client → Server (via Server Actions)
```
Server Component (app/page.tsx)
  ↓
<LoginForm />  (Client Component com "use client")
  ↓
<Button onClick={() => loginAction()} />  (chama Server Action)
  ↓
loginAction() executa no servidor
```

---

## 🔄 Data Validation

### Zod Schemas + React Hook Form

```typescript
// schemas/auth.schemas.ts - Definiçãoescada
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

type LoginInput = z.infer<typeof loginSchema>  // TypeScript tipo derivado

// components/blocks/login-form.tsx - Uso
const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),  // ← Valida ao fazer blur/submit
})

// lib/actions/auth.actions.ts - Re-validação no servidor
const validatedFields = loginSchema.safeParse(data)  // Sempre re-validar!
if (!validatedFields.success) {
  return { error: "Campos inválidos" }
}
```

**Por que validar 2x (client + server)?**
- Client: UX rápida (feedback imediato)
- Server: Segurança (nunca confiar no cliente)

---

## 📝 Padrão de Resposta de Actions

Todas as Server Actions retornam objeto estruturado:

```typescript
export interface LoginActionResult {
  error?: string;
  // Se sucesso, não retorna nada (redirect ou revalidate)
}

// Uso:
const result = await loginAction(data)
if (result.error) {
  // Mostrar erro no cliente
} else {
  // loginAction fez redirect (nunca chega aqui)
}
```

**Por que não throw errors?**
- `redirect()` throws RedirectError (intenção, não erro real)
- Melhor: retornar objeto com `{ error }` ou deixar redirect acontecer

---

## 🌍 Environment Variables

Obrigatórias:

```bash
# .env.local
DATABASE_URL="postgresql://..."  # Supabase PostgreSQL
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

**NEXT_PUBLIC_** prefixo = visível no cliente (seguro expor, é anon key)

---

## 🧪 Testing Patterns (Quando Implementar)

Para Server Actions:

```typescript
// ✅ Testável se isolar a lógica
export async function authenticateWithCredentials(email, password) {
  // Lógica pura = testável
}

// ✅ Test
test("authenticateWithCredentials retorna erro com credenciais inválidas", async () => {
  const result = await authenticateWithCredentials("user@test.com", "wrong")
  expect(result.success).toBe(false)
})
```

Para Componentes:

```typescript
// ✅ Testável se não tiver muita lógica
export function LoginForm() { ... }

// ✅ Test com React Testing Library
test("LoginForm mostra erro quando submit com dados inválidos", async () => {
  const { getByRole, getByText } = render(<LoginForm />)
  const input = getByRole("textbox", { name: /email/i })
  
  fireEvent.change(input, { target: { value: "invalid" } })
  fireEvent.click(getByRole("button", { name: /entrar/i }))
  
  expect(getByText(/email inválido/i)).toBeInTheDocument()
})
```

---

## 🚀 Performance Considerations

### Cache com `revalidatePath`

```typescript
// Limpa cache de TODOS os routes que renderizam essa page
revalidatePath('/', 'layout')

// Mais específico: apenas o route envolvido
revalidatePath('/admin/dashboard', 'page')
```

### Singleton Prisma

```typescript
// ✅ BOM - reutiliza conexão
import { prisma } from "@/lib/prisma"
const user = await prisma.user.findUnique({...})

// ❌ RUIM - nova conexão cada vez
const prisma = new PrismaClient()
const user = await prisma.user.findUnique({...})
```

### useTransition para User Feedback

```typescript
// Mantém loading state enquanto Server Action executa
const [isPending, startTransition] = useTransition()

startTransition(async () => {
  await longRunningAction()  // Sem await bloqueador
})

// isPending === true enquanto pendente
return <button disabled={isPending}>Enviando...</button>
```

---

## 🔒 Security Best Practices

### Nunca Confiar no Cliente

```typescript
// ❌ INSEGURO - confiar em role do cliente
if (user.adminRoleId) {
  return admin_content
}

// ✅ SEGURO - verificar role no servidor
export async function getAdminData() {
  "use server"
  const user = await getCurrentUser()  // Do session, não do cliente
  if (user.adminRole?.name !== "admin") {
    throw new Error("Não autorizado")
  }
  return sensitiveData
}
```

### Validação Sempre em Server Actions

```typescript
// ✅ Sempre re-validar no servidor
export async function updateProfile(data: unknown) {
  const validated = profileSchema.safeParse(data)
  if (!validated.success) {
    return { error: "Dados inválidos" }
  }
  // ...
}
```

### CSRF Protection com Next.js

```typescript
// ✅ Automático com Server Actions + cookies
// next.js gera token CSRF automaticamente
// (não precisa fazer nada, é built-in)
```

---

## 📚 Referências

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Prisma Singleton Pattern](https://www.prisma.io/docs/orm/more/help-center/help-articles/nextjs-prisma-client-dev-practices)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)
- [React Server Components](https://react.dev/reference/rsc/server-components)

