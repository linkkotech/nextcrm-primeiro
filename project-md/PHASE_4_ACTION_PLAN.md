# 📝 PRÓXIMAS AÇÕES - PHASE 4: Cleanup & Optimization

**Status:** Pronto para iniciar  
**Duração Estimada:** 2-3 semanas  
**Prioridade:** MÉDIA (após confirmar que produção está estável)

---

## 🎯 Visão Geral da PHASE 4

Consolidar o projeto removendo débito técnico e otimizando estrutura para crescimento futuro.

### Objetivos
1. ✅ Eliminar código legado/duplicado
2. ✅ Consolidar imports com barrel exports
3. ✅ Documentar patterns e tipos
4. ✅ Implementar testes básicos
5. ✅ Otimizar bundle size

---

## 📋 TAREFA 4.1: Cleanup - Remover Arquivos Legados

### O que fazer
Remover/arquivar arquivos não utilizados ou obsoletos:

```
_backup/                          ← Remover ou arquivar
CreateTemplateDialog.tsx          ← Verificar se está em uso
scripts/update-user-admin-role.ts ← Arquivo one-time script (mover para docs)
jest.config.js (se não usar testes ainda)
jest.setup.js  (se não usar testes ainda)
```

### Como Executar

1. **Localizar arquivos não utilizados:**
```bash
pnpm lint
grep -r "CreateTemplateDialog" src/ || echo "Arquivo não referenciado"
grep -r "update-user-admin-role" src/ || echo "Arquivo não referenciado"
```

2. **Remover ou Arquivar:**
```bash
# Opção 1: Remover completamente
rm -r _backup/
rm CreateTemplateDialog.tsx

# Opção 2: Arquivar (melhor para audit trail)
mkdir -p .archive
mv _backup/ .archive/
mv CreateTemplateDialog.tsx .archive/
mv scripts/update-user-admin-role.ts .archive/
```

3. **Commitar:**
```bash
git add -A
git commit -m "chore: remove legacy files and backups"
```

---

## 📋 TAREFA 4.2: Barrel Exports - Consolidar Imports

### O que fazer
Criar `index.ts` em cada diretório para simplificar imports

### Exemplo 1: src/types/index.ts
```typescript
// src/types/index.ts
export type {
  UnknownData,
  SerializableValue,
  PrismaSerializable,
  ApiResponse,
  LoadingState,
  AsyncFunction,
  Nullable,
  Optional,
  SafeAny,
} from './common';

export type {
  WorkspaceMember,
  WorkspaceWithMembers,
  WorkspaceRole,
  InviteFormData,
  TeamMemberProps,
} from './workspace';

export type {
  BlockData,
  CTABlock,
  HeroBlock,
  DynamicBlock,
  EditorProps,
  BlockListProps,
  ContentEditorProps,
} from './editor';

export type { TeamMember } from './team';
```

### Exemplo 2: src/schemas/index.ts
```typescript
// src/schemas/index.ts
export * from './auth.schemas';
export * from './ctaBlock.schemas';
export * from './heroBlock.schemas';
export * from './plan.schemas';
export * from './team.schemas';
export * from './template.schemas';
```

### Arquivos que precisam index.ts
- [ ] `src/types/` 
- [ ] `src/schemas/`
- [ ] `src/lib/actions/`
- [ ] `src/components/ui/` (opcional, mais complexo)
- [ ] `src/hooks/` (se crescer)

### Como Executar
1. Criar cada arquivo `index.ts` com exports
2. Atualizar imports em todo projeto:
   ```typescript
   // ANTES
   import { UnknownData } from '@/types/common';
   import type { AuthFormData } from '@/schemas/auth.schemas';
   
   // DEPOIS
   import type { UnknownData, AuthFormData } from '@/types';
   import type { AuthFormData } from '@/schemas';
   ```

---

## 📋 TAREFA 4.3: Documentação de Tipos

### O que fazer
Documentar os tipos criados em `src/types/` com exemplos

### Arquivo: project-md/TYPES_GUIDE.md
```markdown
# Guia de Tipos - NextCRM

## UnknownData
Use quando você tem dados não-tipados (ex: JSON do servidor).

```typescript
import type { UnknownData } from '@/types';

// ✅ BOM
const clients: UnknownData[] = await fetchClients();
const value: UnknownData = JSON.parse(rawString);

// ❌ NÃO
const value: any = JSON.parse(rawString);
```

## PrismaSerializable
Use ao serializar dados do Prisma para enviar ao cliente.

```typescript
import type { PrismaSerializable } from '@/types';

function serializeUser(user: User): PrismaSerializable {
  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt?.toISOString(),
  };
}
```

## WorkspaceMember
Use para membros com relações ao workspace.

```typescript
import type { WorkspaceMember } from '@/types';

const member: WorkspaceMember = {
  id: '123',
  userId: 'user-456',
  workspaceId: 'ws-789',
  user: { id: 'user-456', name: 'João', email: 'joao@example.com' },
  workspaceRole: { id: 'role-1', name: 'ADMIN' },
};
```

## LoadingState
Use para gerenciar estados de carregamento.

```typescript
import type { LoadingState } from '@/types';

const [state, setState] = useState<LoadingState<User>>({
  status: 'idle',
  data: null,
  error: null,
});

// Carregando
setState({ status: 'loading', data: null, error: null });

// Sucesso
setState({ status: 'success', data: user, error: null });

// Erro
setState({ status: 'error', data: null, error: 'Failed to load' });
```
```

### Localização
- File: `project-md/TYPES_GUIDE.md`
- Incluir exemplos práticos de cada tipo
- Links para onde são usados

---

## 📋 TAREFA 4.4: Documentação de Patterns

### Arquivo: project-md/ARCHITECTURE_PATTERNS.md

Documentar patterns principais:

1. **Server/Client Separation**
   - Quando usar Server Components vs Client Components
   - Como passar dados entre eles
   - Exemplo prático

2. **Type-Safe Actions**
   - Como criar server actions com Zod
   - Validação e tratamento de erros
   - Exemplo: `auth.service.ts`

3. **Multi-Tenant Isolation**
   - Como validar workspaceId em queries
   - Middleware flow
   - Security checklist

4. **Image Optimization**
   - Quando usar `<Image>` vs `<img>`
   - Configuração do `next.config.mjs`
   - Performance tips

---

## 📋 TAREFA 4.5: Bundle Analysis

### O que fazer
Analisar bundle size e identificar otimizações

### Instalação
```bash
pnpm add -D @next/bundle-analyzer
```

### Configuração: next.config.mjs
```javascript
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

### Usar
```bash
ANALYZE=true pnpm build
# Abre: .next/server.html e .next/client.html
```

### Checklist
- [ ] Identificar dependências grandes
- [ ] Procurar por code splitting oportunidades
- [ ] Validar que shadcn/ui está sendo tree-shaken
- [ ] Medir impacto de novas dependências

---

## 📋 TAREFA 4.6: Testes Básicos

### Escopo Mínimo
1. Testes unitários para Server Actions
2. Testes de integração para páginas críticas

### Exemplo: tests/auth.test.ts
```typescript
import { loginUser } from '@/services/auth.service';

describe('Auth Service', () => {
  it('should login user with valid credentials', async () => {
    const result = await loginUser('test@example.com', 'password123');
    expect(result).toHaveProperty('userId');
  });

  it('should reject invalid credentials', async () => {
    await expect(
      loginUser('test@example.com', 'wrong')
    ).rejects.toThrow('Invalid credentials');
  });
});
```

### Executar Testes
```bash
pnpm test
pnpm test:watch
pnpm test --coverage
```

---

## 🚀 ROADMAP - PRÓXIMAS SPRINTS

### Sprint 1 (PHASE 4): Cleanup & Optimization
- ✅ Remover arquivos legados (4.1)
- ✅ Criar barrel exports (4.2)
- ✅ Documentar tipos (4.3)
- ✅ Documentar patterns (4.4)
- ✅ Bundle analysis (4.5)

### Sprint 2: Testing
- ✅ Testes unitários (Server Actions)
- ✅ Testes integração (Páginas críticas)
- ✅ Coverage mínimo 70%

### Sprint 3: Security & Performance
- ✅ Implementar Supabase RLS
- ✅ Adicionar suspense boundaries
- ✅ Stream rendering para páginas heavy

### Sprint 4: E2E & Monitoring
- ✅ Testes E2E (Playwright)
- ✅ Setup error tracking (Sentry)
- ✅ Performance monitoring

---

## 📌 NOTAS IMPORTANTES

1. **Backup antes de Remover**
   - Commit antes de remover arquivos
   - Git permite recuperação sempre

2. **Testar após Mudanças**
   - Rodar `pnpm build` após cada mudança
   - Testar rotas críticas no `pnpm dev`

3. **Documentação Viva**
   - Manter docs atualizadas conforme projeto evolui
   - Incluir exemplos do código real

4. **Performance First**
   - Medir antes e depois de otimizações
   - Usar Lighthouse para validar

---

## ✅ CHECKLIST DE CONCLUSÃO

Quando terminar PHASE 4, confirme:

- [ ] Todos os arquivos legados removidos ou arquivados
- [ ] Barrel exports criados e importações atualizadas
- [ ] Documentação de tipos completa
- [ ] Documentação de patterns completa
- [ ] Bundle analysis realizado e otimizações aplicadas
- [ ] Testes básicos implementados
- [ ] Build sem warnings
- [ ] Código passando em linters
- [ ] README atualizado com nova estrutura
- [ ] Toda equipe alinhada com novos patterns

---

**Pronto para começar PHASE 4?** ✨

Próximas ações:
1. Revisar este documento com a equipe
2. Planejar sprint
3. Começar por TAREFA 4.1 (mais rápida)
4. Progredir para 4.2, 4.3, etc.

**Tempo total estimado:** 2-3 semanas de trabalho focado
