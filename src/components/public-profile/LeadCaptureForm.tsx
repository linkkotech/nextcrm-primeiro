"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { captureLeadSchema, type CaptureLeadInput } from "@/schemas/public-profile.schemas";
import { captureLead } from "@/services/public-profile.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LeadCaptureFormProps {
    profileId: string;
}

export function LeadCaptureForm({ profileId }: LeadCaptureFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CaptureLeadInput>({
        resolver: zodResolver(captureLeadSchema),
        defaultValues: {
            profileId,
        },
    });

    async function onSubmit(data: CaptureLeadInput) {
        setIsSubmitting(true);
        try {
            const result = await captureLead(data);

            if (result.success) {
                setIsSuccess(true);
                toast.success("Contato enviado com sucesso!");
            } else {
                toast.error(result.message || "Erro ao enviar contato");
            }
        } catch (error) {
            toast.error("Erro inesperado. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Sucesso!</h3>
                <p className="text-green-700">
                    Seus dados foram enviados. Entraremos em contato em breve!
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("profileId")} />

            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    placeholder="Seu nome completo"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp / Telefone</Label>
                <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="interest">Interesse (Opcional)</Label>
                <Textarea
                    id="interest"
                    placeholder="Em qual produto você tem interesse?"
                    {...register("interest")}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    "Falar com Vendedor"
                )}
            </Button>
        </form>
    );
}
