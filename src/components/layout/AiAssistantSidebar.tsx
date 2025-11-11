"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function AiAssistantSidebar() {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Assistente IA</SheetTitle>
        <SheetDescription>
          Faça perguntas e obtenha insights sobre sua plataforma
        </SheetDescription>
      </SheetHeader>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-0 py-4 space-y-4">
        {/* Welcome Message */}
        <div className="bg-muted rounded-lg p-3 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Olá! Sou seu assistente de IA. Como posso ajudá-lo?
          </p>
        </div>

        {/* Placeholder Messages */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>💡 Dicas úteis:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Faça perguntas sobre seu CRM</li>
            <li>Solicite análise de dados</li>
            <li>Pedir sugestões de otimização</li>
            <li>Gerar relatórios automáticos</li>
          </ul>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border px-0 py-4 space-y-2 mt-4">
        <Input
          placeholder="Digite sua pergunta..."
          className="text-sm"
        />
        <Button className="w-full">
          Enviar
        </Button>
      </div>
    </>
  );
}
