# 🗄️ Legacy Code - Editor de Templates Digitais

## 🚧 Status: Código em Quarentena

Este diretório contém o código do **Editor de Templates Digitais** que foi temporariamente isolado do projeto principal devido a problemas arquiteturais fundamentais.

---

## 📅 Informações do Isolamento

- **Data**: 18 de novembro de 2025
- **Branch**: `develop`
- **Motivo**: Reset Estratégico - Código experimental com fundação frágil
- **Decisão**: Isolar para desbloquear build e planejar reconstrução do zero

---

## 🎯 Motivos do Isolamento

### Problemas Identificados

1. **Modelo de Dados Inadequado**
   - `DigitalTemplate` no Prisma não possui estrutura adequada para blocos dinâmicos
   - Campo `content: Json` genérico causava tipos `unknown` em cascata
   - Falta de relacionamento `templateId` nos blocos
   - Ausência de campos `isActive`, `sortOrder` necessários

2. **Cascata de Erros de Tipo**
   - Uso generalizado de `any`, `unknown`, `UnknownData[]`
   - Type assertions inseguras em 30+ locações
   - Incompatibilidade entre `UIBlock` (strings customizadas) e `Block` (TemplateType enum)
   - Conversões manuais propensas a erro

3. **Complexidade de Correção**
   - Cada correção revelava 3-5 novos erros
   - Refatoração incremental sobre base frágil
   - Esforço de correção > esforço de reconstrução

---

## 📦 Conteúdo Isolado

### Rotas Admin
```
_legacy/admin-routes/
└── digital-templates/
    ├── page.tsx (lista de templates)
    └── [id]/page.tsx (editor de template)
```

### Componentes
```
_legacy/components/
├── admin/
│   └── digital-templates/
│       ├── TemplatesClient.tsx
│       ├── TemplateCard.tsx
│       ├── CreateTemplateDialog.tsx
│       ├── DeleteTemplateDialog.tsx
│       ├── TemplatesListView.tsx
│       ├── TemplatesCardView.tsx
│       └── editor/
│           ├── EditorLayout.tsx
│           ├── ContentEditor.tsx
│           ├── BlockListContainer.tsx
│           ├── MobilePreview.tsx
│           ├── AddBlockSheet.tsx
│           ├── SelectBlockDialog.tsx
│           ├── TemplateEditorContainer.tsx
│           ├── BlockTypeCard.tsx
│           └── ContentBlock.tsx
├── editors/
│   ├── CTAEditor.tsx
│   ├── HeroBlockEditor.tsx
│   └── SettingsEditor.tsx
├── preview/
│   └── MobileScreen.tsx
└── ui/
    └── ColorPickerChrome.tsx (dependência react-color não instalada)
```

### Tipos
```
_legacy/types/
└── editor.ts (Block, CTABlockContent, HeroBlockContent, etc.)
```

### Schemas Zod
```
_legacy/schemas/
├── ctaBlock.schemas.ts
└── heroBlock.schemas.ts
```

### Server Actions
```
_legacy/lib/actions/
├── template.actions.ts
├── ctaBlock.actions.ts
└── heroBlock.actions.ts
```

---

## 🔧 Alterações Feitas no Projeto Principal

### Arquivos Modificados

1. **`tsconfig.json`**
   - Adicionado `"_legacy"` e `"_backup"` ao `exclude`
   - Garante que TypeScript ignore código em quarentena

2. **`src/components/admin/AdminSidebar.tsx`**
   - Comentado link "Templates Digitais"
   - Removido import `FileText` não utilizado

3. **`src/components/global/CommandDialog.tsx`**
   - Comentado comando "Templates Digitais"
   - Removido import `FileText` não utilizado

4. **`src/types/index.ts`**
   - Comentado barrel exports dos tipos do editor
   - Preservado comentário explicativo

5. **`src/lib/index.ts`**
   - Removida referência a `template.actions` no JSDoc

---

## 🔄 Próximos Passos (Reconstrução Futura)

### FASE 1: Redesenhar Modelo de Dados Prisma

```prisma
// Proposta de novo modelo
model DigitalTemplate {
  id              String   @id @default(cuid())
  name            String
  description     String?
  type            TemplateType
  isPublished     Boolean  @default(false)
  workspaceId     String?
  
  // Relacionamento com blocos
  blocks          TemplateBlock[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model TemplateBlock {
  id              String   @id @default(cuid())
  templateId      String
  template        DigitalTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
  
  type            BlockType // Enum: CTA, HERO, LINK, etc.
  name            String?
  content         Json
  
  isActive        Boolean  @default(true)
  sortOrder       Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([templateId])
}

enum BlockType {
  CTA
  HERO
  LINK
  SOCIAL
  CONTACT
  // ...
}
```

### FASE 2: Nova Arquitetura de Tipos

```typescript
// Tipos fortemente tipados com discriminated unions
type BlockContent = 
  | { type: 'CTA'; data: CTAContent }
  | { type: 'HERO'; data: HeroContent }
  | { type: 'LINK'; data: LinkContent };

// Validação runtime com Zod
const blockContentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('CTA'), data: ctaContentSchema }),
  z.object({ type: z.literal('HERO'), data: heroContentSchema }),
  // ...
]);
```

### FASE 3: Reconstruir Editor

- [ ] Criar nova estrutura de componentes
- [ ] Implementar gerenciamento de estado (Zustand/Context)
- [ ] Sistema de arrastar e soltar (dnd-kit)
- [ ] Preview em tempo real
- [ ] Validação de formulários com react-hook-form + Zod

### FASE 4: Migração de Dados (Se Necessário)

- [ ] Script de migração de templates existentes
- [ ] Backup de dados legados
- [ ] Teste de integridade

---

## ⚠️ Avisos Importantes

### ❌ NÃO Modificar Este Código

Este código **NÃO está em uso** na aplicação principal. Qualquer modificação deve ser feita na **nova implementação**.

### 📖 Uso como Referência

Você **PODE** consultar este código como referência para:
- Entender fluxos de negócio implementados
- Recuperar lógicas específicas que funcionavam
- Aprender com os erros arquiteturais

### 🗑️ Remoção Futura

Este diretório será **REMOVIDO** após:
1. Nova implementação completa e testada
2. Migração de dados (se aplicável)
3. Aprovação da equipe

---

## 📊 Estatísticas do Código Isolado

- **Total de Arquivos**: ~40 arquivos
- **Linhas de Código**: ~3.000 linhas (estimativa)
- **Componentes React**: 18
- **Server Actions**: 3
- **Schemas Zod**: 2
- **Type Definitions**: 1 arquivo central

---

## 🎓 Lições Aprendidas

1. **Planejamento de Schema**: Sempre definir modelo de dados Prisma ANTES de implementar UI
2. **Type Safety**: Nunca usar `any` ou `unknown` sem validação runtime
3. **Iteração Incremental**: Refatoração incremental só funciona sobre base sólida
4. **Reset Estratégico**: Às vezes recomeçar é mais eficiente que corrigir

---

## 📝 Notas Adicionais

- Build principal agora **100% limpo** (zero erros TypeScript)
- Apenas 1 warning aceitável: `ImageCropDialog` (`<img>` vs `<Image>`)
- Aplicação principal funcional sem o módulo de templates
- Código preservado para referência futura

---

**Última Atualização**: 18 de novembro de 2025  
**Responsável**: GitHub Copilot (Claude Sonnet 4.5)  
**Status**: ✅ Quarentena Estabelecida com Sucesso
