"use client";

import { useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdvancedEditorProps {
  templateId: string;
  templateName: string;
  linkedClientsCount?: number;
  onImport?: (jsonData: string) => void;
  onDelete?: () => void;
}

export function AdvancedEditor({
  templateName,
  linkedClientsCount = 0,
  onImport,
  onDelete,
}: AdvancedEditorProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Validação para habilitar botão de exclusão
  const isDeleteEnabled = deleteConfirmation === templateName;

  const handleImport = useCallback(() => {
    if (!jsonInput.trim()) {
      // TODO: Adicionar toast de erro
      console.error("JSON vazio");
      return;
    }

    try {
      // Validar se é JSON válido
      JSON.parse(jsonInput);
      onImport?.(jsonInput);
      // TODO: Adicionar toast de sucesso
      setJsonInput(""); // Limpar após importar
    } catch (error) {
      // TODO: Adicionar toast de erro
      console.error("JSON inválido:", error);
    }
  }, [jsonInput, onImport]);

  const handleDelete = useCallback(async () => {
    if (deleteConfirmation !== templateName) return;

    setIsDeleting(true);
    try {
      await onDelete?.();
      // TODO: Redirecionar para lista de templates
    } catch (error) {
      // TODO: Adicionar toast de erro
      console.error("Erro ao deletar template:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteConfirmation, templateName, onDelete]);

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground">AVANÇADO</h2>
      </div>

      {/* Card Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ferramentas Avançadas</CardTitle>
          <CardDescription>
            Importar configurações ou gerenciar exclusão do template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* SEÇÃO 1: Importar JSON */}
          <section className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Importar JSON
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Substitua todas as configurações deste template colando um arquivo JSON válido abaixo.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="json-input">Configuração JSON</Label>
              <Textarea
                id="json-input"
                rows={12}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`{\n  "templateName": "Meu Template",\n  "templateType": "global",\n  "colors": {\n    "primary": "#0066cc"\n  }\n}`}
                className="font-mono text-xs"
              />
            </div>

            <Button onClick={handleImport} className="w-full">
              Importar e Substituir
            </Button>
          </section>

          {/* Divisor */}
          <div className="border-t" />

          {/* SEÇÃO 2: Zona de Perigo - Deletar Template */}
          <section className="space-y-4 rounded-lg border-2 border-destructive p-6 bg-destructive/5">
            <div>
              <h3 className="text-base font-semibold text-destructive">
                Deletar este Template
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Esta ação é permanente e não pode ser desfeita.
              </p>
            </div>

            {/* Alert de Aviso */}
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Este template está vinculado a <strong>{linkedClientsCount}</strong> cliente{linkedClientsCount !== 1 ? 's' : ''}.
                A exclusão é permanente e irreversível.
              </AlertDescription>
            </Alert>

            {/* Campo de Confirmação */}
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                Para confirmar, digite o nome do template (<strong>{templateName}</strong>) abaixo:
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={templateName}
                className="border-destructive/50 focus-visible:ring-destructive"
              />
            </div>

            {/* Botão de Exclusão */}
            <Button
              variant="destructive"
              disabled={!isDeleteEnabled || isDeleting}
              onClick={handleDelete}
              className="w-full"
            >
              {isDeleting ? "Excluindo..." : "Excluir permanentemente"}
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
