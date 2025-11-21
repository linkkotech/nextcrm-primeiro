'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui';

interface FormSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    width?: string;
}

/**
 * Wrapper reutilizável para formulários complexos em Sheet (painel lateral).
 * 
 * Especificações de UX:
 * - Abre pela direita (padrão de dashboards)
 * - Responsivo: w-full mobile, sm:max-w-xl tablet, lg:max-w-3xl desktop
 * - Backdrop bloqueado (não fecha ao clicar fora)
 * - Scroll interno para formulários longos
 * - Padding responsivo: p-0 mobile, sm:p-6 desktop
 * 
 * @param isOpen - Estado de visibilidade do Sheet
 * @param onOpenChange - Callback para controlar abertura/fechamento
 * @param title - Título exibido no header do Sheet
 * @param description - Descrição opcional abaixo do título
 * @param children - Conteúdo do Sheet (geralmente um formulário)
 * @param width - Classes de largura customizadas (default: lg:max-w-3xl)
 */
export function FormSheet({
    isOpen,
    onOpenChange,
    title,
    description,
    children,
    width = 'lg:max-w-3xl',
}: FormSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className={`w-full sm:max-w-xl ${width} overflow-y-auto p-0 sm:p-6`}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>

                <div className="py-6">{children}</div>
            </SheetContent>
        </Sheet>
    );
}
