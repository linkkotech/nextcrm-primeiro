# Como Adicionar um Novo Elemento ao Construtor de Blocos

Este documento descreve o processo padronizado para estender o Block Builder com novos tipos de elementos (blocos).

## Arquitetura de Validação

O sistema utiliza uma arquitetura de **Schema Map** com type safety total:

- **Schemas separados por tipo**: Cada tipo de bloco tem seu próprio arquivo schema
- **Schemas compartilhados**: Propriedades reutilizáveis (background, border, layout) ficam em `common/`
- **Dispatcher centralizado**: O `blockSchemaMap` em `src/schemas/blocks/index.ts` mapeia tipos para schemas
- **Type Safety**: Uso do enum `BlockType` do Prisma garante autocomplete e validação em compile-time

## Passo a Passo

### 1. Criar o Schema de Validação

**Localização:** `src/schemas/blocks/[tipo].schema.ts`

**Exemplo para um novo tipo "Heading":**

```typescript
import { z } from "zod";
import { backgroundSchema } from "./common/background.schema";
import { borderSchema } from "./common/border.schema";

/**
 * Schema de validação para o conteúdo do bloco HEADING
 */
export const headingContentSchema = z.object({
  text: z.string().min(1, "O texto é obrigatório"),
  level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).default("h2"),
  alignment: z.enum(["left", "center", "right"]).default("left"),
  
  // Reutilizar schemas compartilhados
  background: backgroundSchema.optional(),
  border: borderSchema.optional(),
});

export type HeadingContent = z.infer<typeof headingContentSchema>;
```

**Dica:** Sempre reutilize schemas de `common/` quando possível (background, border, layout, advanced).

### 2. Adicionar ao Schema Map

**Localização:** `src/schemas/blocks/index.ts`

**Adicionar a importação:**
```typescript
import { headingContentSchema } from "./heading.schema";
```

**Adicionar ao mapa:**
```typescript
export const blockSchemaMap: Record<BlockType, z.ZodSchema> = {
  [BlockType.HERO]: heroContentSchema,
  [BlockType.SECTION]: sectionContentSchema,
  [BlockType.HEADING]: headingContentSchema, // ← NOVA ENTRADA
};
```

**Benefício do Type Safety:** Se você digitar `BlockType.HEADIN` (erro de digitação), o TypeScript avisará imediatamente.

### 3. Criar o Componente de Formulário

**Localização:** `src/components/admin/templates/editor/forms/[Tipo]PropertiesForm.tsx`

**Exemplo para Heading:**

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { headingContentSchema } from "@/schemas/blocks/heading.schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function HeadingPropertiesForm({ block }: { block: TemplateBlock }) {
  const form = useForm({
    resolver: zodResolver(headingContentSchema),
    defaultValues: block.content,
  });

  const onSubmit = async (data: any) => {
    const result = await updateBlockContent(block.id, block.type, data);
    if (result.success) {
      toast.success("Heading salvo com sucesso!");
    } else {
      toast.error(result.error || "Erro ao salvar");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Heading</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível (H1-H6)</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  {/* Opções H1-H6 */}
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
```

### 4. Adicionar ao Inspector (Switch Case)

**Localização:** `src/components/admin/templates/editor/Inspector.tsx`

**Adicionar case no renderFormsForElement():**

```typescript
const renderFormsForElement = () => {
  switch (selectedElement.type) {
    case "Section":
      return <SectionPropertiesForm block={block} />;
    
    case "Heading":  // ← NOVO CASE
      return <HeadingPropertiesForm block={block} />;
    
    default:
      return (
        <div className="p-4 text-sm text-muted-foreground">
          Formulário de edição para "{selectedElement.type}" ainda não implementado.
        </div>
      );
  }
};
```

## Checklist de Validação

Após adicionar um novo tipo de bloco, verifique:

- [ ] Schema criado em `src/schemas/blocks/[tipo].schema.ts`
- [ ] Schema adicionado ao `blockSchemaMap` em `src/schemas/blocks/index.ts`
- [ ] TypeScript autocompleta `BlockType.[NOVO_TIPO]` sem erros
- [ ] Componente de formulário criado em `src/components/admin/templates/editor/forms/`
- [ ] Case adicionado ao switch em `Inspector.tsx`
- [ ] Teste manual: criar bloco, editar propriedades, salvar, recarregar página

## Vantagens desta Arquitetura

1. **Type Safety Total**: Enum `BlockType` garante que não há typos em strings
2. **Mensagens de Erro Descritivas**: Se um tipo não tiver schema, a mensagem mostra os tipos disponíveis
3. **Escalabilidade**: Adicionar novo tipo é questão de 3 arquivos (schema, mapa, form)
4. **Reutilização**: Schemas compartilhados evitam duplicação de código
5. **Manutenibilidade**: Cada schema fica em arquivo dedicado, fácil de encontrar e modificar

## Próximos Tipos Planejados

- `HEADING` - Títulos H1-H6 com estilos
- `TEXT` - Parágrafo de texto rico
- `BUTTON` - Botão de CTA
- `IMAGE` - Imagem com crop e filtros
- `CONTAINER` - Container flexível para layout
