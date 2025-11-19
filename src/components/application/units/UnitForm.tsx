'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { unitFormSchema, type UnitFormData } from '@/schemas/unit.schemas';
import { upsertUnit } from '@/actions/unit.actions';
import { toast } from 'sonner';

interface UnitFormProps {
    workspaceSlug: string;
    initialData?: Partial<UnitFormData>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

/**
 * Formulário de criação/edição de unidades
 * Usa react-hook-form + Zod para validação
 * 
 * @param workspaceSlug - Slug do workspace atual
 * @param initialData - Dados iniciais para edição (opcional)
 * @param onSuccess - Callback chamado após sucesso
 * @param onCancel - Callback para cancelar operação
 */
export function UnitForm({
    workspaceSlug,
    initialData,
    onSuccess,
    onCancel,
}: UnitFormProps) {
    const [isPending, startTransition] = useTransition();
    const isEditMode = !!initialData?.id;

    const form = useForm<UnitFormData>({
        resolver: zodResolver(unitFormSchema),
        defaultValues: {
            id: initialData?.id || undefined,
            name: initialData?.name || '',
            description: initialData?.description || '',
            isActive: initialData?.isActive ?? true,
        },
    });

    async function onSubmit(data: UnitFormData) {
        startTransition(async () => {
            try {
                await upsertUnit(workspaceSlug, data);
                toast.success(
                    isEditMode
                        ? 'Unidade atualizada com sucesso!'
                        : 'Unidade criada com sucesso!'
                );
                form.reset();
                onSuccess?.();
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Erro ao salvar unidade'
                );
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Unidade São Paulo, Unidade Rio de Janeiro"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Descrição (opcional) */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descrição ou observações sobre esta unidade"
                                    className="resize-none"
                                    rows={4}
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Ativa</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="flex-1"
                    >
                        {isPending ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isPending}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </Form>
    );
}
