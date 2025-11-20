'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import {
    Button,
    Card,
    Checkbox,
    Input,
    Switch,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui';
import { unitFormSchema, type UnitFormData } from '@/schemas/unit.schemas';
import { upsertUnit } from '@/actions/unit.actions';
import { toast } from 'sonner';
import { MapPin, Plus } from 'lucide-react';
import type { Address, DigitalTemplate } from '@prisma/client';

interface UnitFormProps {
    workspaceSlug: string;
    templates: DigitalTemplate[];
    addresses: Address[];
    initialData?: Partial<UnitFormData>;
    onSuccess?: () => void;
    onCancel?: () => void;
    onOpenAddressModal?: () => void;
}

/**
 * Formulário de criação/edição de unidades
 * Inclui seleção de template e endereço com lógica condicional
 * 
 * @param workspaceSlug - Slug do workspace atual
 * @param templates - Lista de templates disponíveis
 * @param addresses - Lista de endereços existentes
 * @param initialData - Dados iniciais para edição (opcional)
 * @param onSuccess - Callback chamado após sucesso
 * @param onCancel - Callback para cancelar operação
 * @param onOpenAddressModal - Callback para abrir modal de criar novo endereço
 */
export function UnitForm({
    workspaceSlug,
    templates,
    addresses,
    initialData,
    onSuccess,
    onCancel,
    onOpenAddressModal,
}: UnitFormProps) {
    const [isPending, startTransition] = useTransition();
    const isEditMode = !!initialData?.id;

    const form = useForm<UnitFormData>({
        resolver: zodResolver(unitFormSchema),
        defaultValues: {
            id: initialData?.id || undefined,
            name: initialData?.name || '',
            description: initialData?.description || '',
            templateId: initialData?.templateId || undefined,
            addressId: initialData?.addressId || undefined,
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

    const selectedAddressId = form.watch('addressId');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome da Unidade */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome da Unidade *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Unidade São Paulo, Filial Norte"
                                    className="form-field-bg form-field-border"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Descrição */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descrição ou observações sobre esta unidade"
                                    className="resize-none form-field-bg form-field-border"
                                    rows={3}
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Template */}
                <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Template</FormLabel>
                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="form-field-bg form-field-border">
                                        <SelectValue placeholder="Selecione um template" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Endereço - Seleção Condicional */}
                <FormField
                    control={form.control}
                    name="addressId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <div className="space-y-3">
                                {addresses.length > 0 ? (
                                    <>
                                        <div className="text-sm font-medium text-muted-foreground mb-3">
                                            Select Addresses
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
                                            {addresses.map((address) => (
                                                <Card
                                                    key={address.id}
                                                    className="p-4 cursor-pointer border transition-all hover:bg-accent/50"
                                                    onClick={() => field.onChange(address.id)}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Checkbox */}
                                                        <Checkbox
                                                            checked={field.value === address.id}
                                                            onCheckedChange={() => field.onChange(address.id)}
                                                            className="mt-1"
                                                        />

                                                        {/* Ícone e Conteúdo */}
                                                        <div className="flex-1">
                                                            <div className="flex items-start gap-3 w-full">
                                                                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-sm">
                                                                        {address.name}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {address.type === 'comercial' ? 'Comercial' : 'Residencial'}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                        {address.street}, {address.number}
                                                                        {address.complement && ` - ${address.complement}`}
                                                                        <br />
                                                                        {address.district}, {address.city} - {address.stateCode}, {address.country}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    // Estado vazio - Criar novo endereço
                                    <Card
                                        className="p-8 cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/30 transition-all flex flex-col items-center justify-center gap-3"
                                        onClick={() => onOpenAddressModal?.()}
                                    >
                                        <Plus className="w-8 h-8 text-muted-foreground" />
                                        <div className="text-center">
                                            <div className="font-medium text-muted-foreground">
                                                + Create a New Address
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Nenhum endereço disponível. Crie um novo para continuar.
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status Ativo */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Unidade Ativa</FormLabel>
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

