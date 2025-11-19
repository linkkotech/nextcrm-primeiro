import { z } from 'zod';

/**
 * Schema de validação para formulário de unidade.
 * Valida todos os campos necessários para criar/editar uma unidade.
 */
export const unitFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Nome é obrigatório').max(255),
    description: z.string().max(500).optional(),
    isActive: z.boolean().default(true),
});

export type UnitFormData = z.infer<typeof unitFormSchema>;
