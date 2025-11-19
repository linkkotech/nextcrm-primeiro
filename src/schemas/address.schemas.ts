import { z } from 'zod';

/**
 * Schema de validação para formulário de endereço.
 * Valida todos os campos necessários para criar/editar um endereço.
 */
export const addressFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Nome é obrigatório').max(255),
    label: z.string().max(100).optional(),
    street: z.string().min(1, 'Rua/Avenida é obrigatório').max(255),
    number: z.string().min(1, 'Número é obrigatório').max(20),
    complement: z.string().max(100).optional(),
    district: z.string().min(1, 'Bairro é obrigatório').max(100),
    city: z.string().min(1, 'Cidade é obrigatória').max(100),
    stateCode: z
        .string()
        .length(2, 'Código do estado deve ter 2 caracteres')
        .toUpperCase(),
    country: z.string().max(2).optional().default('BR'),
    postalCode: z
        .string()
        .regex(/^\d{5}-?\d{3}$/, 'CEP inválido (formato: 00000-000)'),
    type: z.enum(['comercial', 'residencial'], {
        errorMap: () => ({ message: 'Tipo deve ser comercial ou residencial' }),
    }),
    isActive: z.boolean().optional().default(true),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type AddressFormData = z.infer<typeof addressFormSchema>;
