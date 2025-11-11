# 🚀 Guia Rápido: Como Executar o Seed

## Pré-requisitos
✅ Dependências instaladas: `pnpm install`
✅ `.env.local` configurado com `DATABASE_URL` (Supabase)
✅ Banco de dados PostgreSQL criado

## Passo 1: Sincronizar o Schema

Execute este comando para sincronizar o schema do Prisma com o banco:

```bash
npx prisma db push
```

**O que acontece:**
- Cria as tabelas no PostgreSQL
- Gera o Prisma Client

**Saída esperada:**
```
✔ Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client (v5.x.x) to ./node_modules/.prisma/client in XXXms
```

---

## Passo 2: Executar o Seed

Agora execute o seed para popular as tabelas de Roles:

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

---

## Passo 3: Verificar se Funcionou

Você pode verificar se os dados foram inseridos usando Prisma Studio:

```bash
npx prisma studio
```

Isso abre uma interface gráfica em `http://localhost:5555` onde você pode:
- Ver as tabelas criadas
- Verificar os registros de AdminRole e WorkspaceRole
- Testar queries

---

## ⚡ Alternativa: Seed Automático com db push

Se quiser executar o seed automaticamente junto com o `db push`, use:

```bash
npx prisma db push --skip-generate
npx prisma db seed
```

Ou crie um script no package.json:

```bash
pnpm run setup
```

(Se adicionarmos ao package.json: `"setup": "prisma db push && prisma db seed"`)

---

## 📊 Verificar Dados Inseridos

Via Prisma Studio:
```bash
npx prisma studio
```

Via SQL direto (Supabase):
```sql
SELECT * FROM "AdminRole";
SELECT * FROM "WorkspaceRole";
```

Via Query do Prisma:
```typescript
import { prisma } from "@/lib/prisma";

// No seu arquivo de teste ou API route
const roles = await prisma.adminRole.findMany();
console.log(roles);
// Output: [
//   { id: 'xxx', name: 'super_admin' },
//   { id: 'xxx', name: 'admin' },
//   { id: 'xxx', name: 'manager' }
// ]
```

---

## ❌ Troubleshooting

### Erro: "DATABASE_URL não está configurado"
**Solução:** Crie `.env.local` com:
```
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Erro: "Duplicate key value violates unique constraint"
**Solução:** O script tem `skipDuplicates: true`, então é seguro executar múltiplas vezes.
Se quiser limpar tudo:
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### Erro: "Connection refused"
**Solução:** Verifique se:
1. O banco PostgreSQL está rodando
2. O host/port está correto no DATABASE_URL
3. As credenciais estão corretas

### Erro: "tsx not found"
**Solução:** Já foi instalado como devDependency, mas se preciso reinstale:
```bash
pnpm add -D tsx
```

---

## 📝 Estrutura Criada

```
nextcrm-primeiro/
├── prisma/
│   ├── schema.prisma         (modelos existentes)
│   └── seed.ts              ✨ (NOVO - script de seed)
├── src/
│   └── lib/
│       └── prisma.ts        (singleton - já existia)
├── package.json             (ATUALIZADO - adicionado "prisma": { "seed": ... })
├── PRISMA_SETUP.md          ✨ (NOVO - documentação completa)
└── IMPLEMENTATION_SUMMARY.md ✨ (NOVO - resumo da implementação)
```

---

## ✅ Checklist Final

- [ ] `.env.local` configurado com DATABASE_URL
- [ ] `pnpm install` executado com sucesso
- [ ] `npx prisma db push` sem erros
- [ ] `npx prisma db seed` executado com sucesso
- [ ] Dados verificados em Prisma Studio
- [ ] Pronto para iniciar a aplicação com `pnpm dev`

---

## 🎯 Próxima Etapa

Com o seed pronto, você pode:

1. **Criar um usuário admin padrão** - Expandir o seed.ts
2. **Implementar autenticação** - Usar o Prisma Client em auth.actions.ts
3. **Criar middleware de autorização** - Validar roles na middleware
4. **Adicionar mais dados de seed** - Workspace demo, contacts, etc.

---

## 💬 Resumo Rápido

| Comando | O que faz |
|---------|-----------|
| `npx prisma db push` | Sincroniza schema com banco |
| `npx prisma db seed` | Executa seed.ts |
| `npx prisma studio` | Abre interface gráfica |
| `pnpm dev` | Inicia a aplicação |

**Ordem recomendada na primeira execução:**
```bash
pnpm install
npx prisma db push
npx prisma db seed
npx prisma studio  # (verificar dados)
pnpm dev           # (iniciar aplicação)
```

---

Pronto! Seu projeto está configurado com Prisma Singleton + Seed automático! 🚀

