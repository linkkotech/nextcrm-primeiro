'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { z } from 'zod';
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Textarea,
} from '@/components/ui';
import { toast } from 'sonner';

/**
 * Schema de validação para o formulário de detalhes do perfil.
 * Por enquanto, apenas campos básicos. Expandir conforme necessário.
 */
const profileDetailsSchema = z.object({
    // Informações básicas
    salutation: z.string().optional(), // Sr., Dra., etc.
    name: z.string().min(1, 'Nome é obrigatório').max(255),
    pronouns: z.string().optional(), // ele/dele, ela/dela, etc.
    credentials: z.string().optional(), // PhD, MBA, etc.
    
    // Profissional
    cargo: z.string().optional(),
    
    // Contato
    email: z.string().email('E-mail inválido'),
    phone: z.string().optional(),
    celular: z.string().optional(),
    
    // Bio
    bio: z.string().max(1000, 'Bio muito longa (máximo 1000 caracteres)').optional(),
    
    // CTAs
    calendarUrl: z.string().url('URL inválida').optional().or(z.literal('')),
    customUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

type ProfileDetailsFormData = z.infer<typeof profileDetailsSchema>;

interface ProfileDetailsFormProps {
    workspaceSlug: string;
    memberId: string;
    initialData?: Partial<ProfileDetailsFormData>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

/**
 * Formulário de edição dos detalhes do perfil do membro.
 * Usa react-hook-form + Zod para validação.
 * Layout de 3 colunas: label + descrição à esquerda, campo à direita.
 * 
 * @param workspaceSlug - Slug do workspace atual
 * @param memberId - ID do membro sendo editado
 * @param initialData - Dados iniciais para edição
 * @param onSuccess - Callback chamado após sucesso (fecha o Sheet)
 * @param onCancel - Callback para cancelar operação (fecha o Sheet)
 */
export function ProfileDetailsForm({
    workspaceSlug,
    memberId,
    initialData,
    onSuccess,
    onCancel,
}: ProfileDetailsFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<ProfileDetailsFormData>({
        resolver: zodResolver(profileDetailsSchema),
        defaultValues: {
            salutation: initialData?.salutation,
            name: initialData?.name || '',
            pronouns: initialData?.pronouns,
            credentials: initialData?.credentials,
            cargo: initialData?.cargo,
            email: initialData?.email || '',
            phone: initialData?.phone,
            celular: initialData?.celular,
            bio: initialData?.bio,
            calendarUrl: initialData?.calendarUrl,
            customUrl: initialData?.customUrl,
        },
    });

    async function onSubmit(data: ProfileDetailsFormData) {
        startTransition(async () => {
            try {
                // TODO: Implementar server action para atualizar perfil
                console.log('Dados do formulário:', { workspaceSlug, memberId, data });
                
                toast.success('Perfil atualizado com sucesso!');
                form.reset();
                onSuccess?.();
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Erro ao atualizar perfil'
                );
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                {/* Tratamento */}
                <FormField
                    control={form.control}
                    name="salutation"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Tratamento</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Como deseja ser tratado(a)
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="Ex: Sr., Dra., Prof." {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Nome */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Nome Completo *</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Nome que aparecerá no perfil
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="Ex: Maria Silva" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Pronomes */}
                <FormField
                    control={form.control}
                    name="pronouns"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Pronomes</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Pronomes de tratamento preferidos
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="Ex: ele/dele, ela/dela" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Título/Credenciais */}
                <FormField
                    control={form.control}
                    name="credentials"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Título/Credenciais</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Títulos acadêmicos ou profissionais
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="Ex: PhD, MBA, CPA" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Cargo */}
                <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Cargo</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Função ou posição atual
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="Ex: Gerente de Vendas" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* E-mail */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>E-mail *</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    E-mail principal de contato
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input type="email" placeholder="nome@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Telefone */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Telefone</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Telefone fixo
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="(11) 1234-5678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Celular */}
                <FormField
                    control={form.control}
                    name="celular"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Celular</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Celular/WhatsApp
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="(11) 98765-4321" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Bio */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Biografia</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Resumo profissional ou pessoal
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Textarea
                                        placeholder="Conte um pouco sobre você..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* URL do Calendário */}
                <FormField
                    control={form.control}
                    name="calendarUrl"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>URL do Calendário</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Link para agendamento
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://calendly.com/seu-usuario"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Link Personalizado */}
                <FormField
                    control={form.control}
                    name="customUrl"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Link Personalizado</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    URL customizada (portfólio, site, etc.)
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://seusite.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Botões de Ação */}
                <div className="flex justify-end gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
