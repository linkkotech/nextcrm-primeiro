'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { addressFormSchema, type AddressFormData } from '@/schemas/address.schemas';
import { upsertAddress } from '@/actions/address.actions';
import { toast } from 'sonner';

interface AddressFormProps {
    workspaceSlug: string;
    initialData?: Partial<AddressFormData>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

/**
 * Formulário de criação/edição de endereços
 * Usa react-hook-form + Zod para validação
 * 
 * @param workspaceSlug - Slug do workspace atual
 * @param initialData - Dados iniciais para edição (opcional)
 * @param onSuccess - Callback chamado após sucesso
 * @param onCancel - Callback para cancelar operação
 */
export function AddressForm({
    workspaceSlug,
    initialData,
    onSuccess,
    onCancel,
}: AddressFormProps) {
    const [isPending, startTransition] = useTransition();
    const isEditMode = !!initialData?.id;

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            id: initialData?.id || undefined,
            name: initialData?.name || '',
            label: initialData?.label || '',
            street: initialData?.street || '',
            number: initialData?.number || '',
            complement: initialData?.complement || '',
            district: initialData?.district || '',
            city: initialData?.city || '',
            stateCode: initialData?.stateCode || '',
            country: initialData?.country || 'BR',
            postalCode: initialData?.postalCode || '',
            type: initialData?.type || 'comercial',
            isActive: initialData?.isActive ?? true,
            latitude: initialData?.latitude,
            longitude: initialData?.longitude,
        },
    });

    async function onSubmit(data: AddressFormData) {
        startTransition(async () => {
            try {
                await upsertAddress(workspaceSlug, data);
                toast.success(
                    isEditMode
                        ? 'Endereço atualizado com sucesso!'
                        : 'Endereço criado com sucesso!'
                );
                form.reset();
                onSuccess?.();
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Erro ao salvar endereço'
                );
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome/Identificação */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome/Identificação *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Matriz, Filial Sul, Casa"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Etiqueta (opcional) */}
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Etiqueta</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Endereço Principal" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Grid de 2 colunas para Rua e Número */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Rua/Avenida *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Avenida Paulista" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 1000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Complemento */}
                <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Sala 501, Bloco A" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Grid para Bairro e Cidade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bairro *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Bela Vista" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: São Paulo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Grid para Estado, País e CEP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="stateCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: SP"
                                        maxLength={2}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value.toUpperCase())
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>País *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="BR"
                                        maxLength={2}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value.toUpperCase())
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CEP *</FormLabel>
                                <FormControl>
                                    <Input placeholder="00000-000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Tipo de Endereço */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="comercial">Comercial</SelectItem>
                                    <SelectItem value="residencial">Residencial</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status Ativo/Inativo */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Endereço Ativo</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                    Endereços inativos não aparecem nas listagens principais
                                </div>
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
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending
                            ? 'Salvando...'
                            : isEditMode
                                ? 'Atualizar'
                                : 'Criar Endereço'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
