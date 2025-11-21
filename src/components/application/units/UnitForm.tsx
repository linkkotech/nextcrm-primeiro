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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                {/* Nome da Unidade */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Nome da Unidade *</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Identificação principal desta unidade
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Unidade São Paulo, Filial Norte"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Descrição */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Descrição</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Observações sobre esta unidade
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <FormControl>
                                    <Textarea
                                        placeholder="Descrição ou observações sobre esta unidade"
                                        className="resize-none"
                                        rows={3}
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Template */}
                <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Template</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Template visual para esta unidade
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
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
                            </div>
                        </FormItem>
                    )}
                />

                {/* Endereço - Seleção Condicional */}
                <FormField
                    control={form.control}
                    name="addressId"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                            <div className="md:col-span-1 space-y-1">
                                <FormLabel>Endereço</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Localização física da unidade
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-3">
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
                        </div>
                        </FormItem>
                    )}
                />

                {/* Status Ativo */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4">
                            <div className="md:col-span-2 md:col-start-2">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Unidade Ativa</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Unidades inativas não aparecem nas listagens
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
                <div className="flex gap-3 pt-6">
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

