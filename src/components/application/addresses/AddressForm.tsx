'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
} from '@/components/ui';
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
            id: initialData?.id,
            name: initialData?.name || '',
            label: initialData?.label,
            street: initialData?.street || '',
            number: initialData?.number || '',
            complement: initialData?.complement,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                {/* Nome/Identificação */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Nome/Identificação *</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Como você deseja identificar este endereço
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Matriz, Filial Sul, Casa"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Etiqueta (opcional) */}
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Etiqueta</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Etiqueta adicional para organização
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="Ex: Endereço Principal" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Rua e Número */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                    <div className="md:col-span-1 space-y-1">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Endereço *
                        </label>
                        <p className="text-sm text-muted-foreground">
                            Rua/Avenida e número
                        </p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
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
                                    <FormControl>
                                        <Input placeholder="Nº" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Complemento */}
                <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Complemento</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Informações adicionais
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input placeholder="Ex: Sala 501, Bloco A" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Bairro e Cidade */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                    <div className="md:col-span-1 space-y-1">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Localização *</label>
                        <p className="text-sm text-muted-foreground">
                            Bairro e cidade
                        </p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Bairro" {...field} />
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
                                    <FormControl>
                                        <Input placeholder="Cidade" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Estado, País e CEP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                    <div className="md:col-span-1 space-y-1">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Regional *</label>
                        <p className="text-sm text-muted-foreground">
                            Estado, país e CEP
                        </p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="stateCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="UF"
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
                                    <FormControl>
                                        <Input
                                            placeholder="País"
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
                                    <FormControl>
                                        <Input placeholder="CEP" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Tipo de Endereço */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Tipo *</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Classificação do endereço
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
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
                            </div>
                        </FormItem>
                    )}
                />

                {/* Status Ativo/Inativo */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4">
                            <div className="md:col-span-2 md:col-start-2">
                                <div className="flex items-center justify-between rounded-lg border p-4">
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
                                </div>
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
