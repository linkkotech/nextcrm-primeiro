"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroContentSchema, HeroContent } from "@/schemas/block-content.schemas";
import { updateBlockContent } from "@/services/block.actions";
import { TemplateBlock } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface HeroPropertiesFormProps {
    block: TemplateBlock;
}

export function HeroPropertiesForm({ block }: HeroPropertiesFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Inicializar formulário com dados do bloco ou defaults
    const form = useForm<HeroContent>({
        resolver: zodResolver(heroContentSchema),
        defaultValues: (block.content as HeroContent) || {
            title: "",
            subtitle: "",
            backgroundColor: "#ffffff",
            textColor: "#000000",
            buttonText: "",
            buttonUrl: "",
        },
    });

    async function onSubmit(data: HeroContent) {
        setIsSaving(true);
        try {
            const result = await updateBlockContent(block.id, block.type, data);

            if (result.error) {
                toast.error("Erro ao salvar", {
                    description: result.error,
                });
            } else {
                toast.success("Salvo com sucesso", {
                    description: "As alterações foram aplicadas.",
                });
            }
        } catch (error) {
            toast.error("Erro inesperado", {
                description: "Ocorreu um erro ao tentar salvar.",
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Título */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o título principal" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Subtítulo */}
                <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subtítulo</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o subtítulo (opcional)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    {/* Cor de Fundo */}
                    <FormField
                        control={form.control}
                        name="backgroundColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fundo</FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-input">
                                            <input
                                                type="color"
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <Input {...field} className="flex-1 font-mono" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Cor do Texto */}
                    <FormField
                        control={form.control}
                        name="textColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Texto</FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-input">
                                            <input
                                                type="color"
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <Input {...field} className="flex-1 font-mono" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Botão (Opcional) */}
                <div className="pt-4 border-t border-border space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Botão de Ação (Opcional)</h3>

                    <FormField
                        control={form.control}
                        name="buttonText"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Texto do Botão</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Saiba Mais" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="buttonUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Link do Botão</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </form>
        </Form>
    );
}
