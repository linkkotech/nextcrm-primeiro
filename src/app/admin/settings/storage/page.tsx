"use client";

import { useState } from "react";
import { HardDrive, Cloud, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function StorageSettingsPage() {
  const [storageProvider, setStorageProvider] = useState<"local" | "s3">(
    "local"
  );

  const handleSaveConfiguration = () => {
    console.log("Salvando configuração de storage:", storageProvider);
    // TODO: Implementar lógica de salvamento no backend
    alert("Configurações de storage salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Armazenamento</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie configurações de armazenamento de arquivos
        </p>
      </div>

      {/* Card Principal de Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Storage</CardTitle>
          <CardDescription>
            Configure o provedor de armazenamento para gerenciar arquivos da
            plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert Informativo Inicial */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              O armazenamento é onde todos os arquivos, imagens e documentos da
              plataforma serão salvos. Escolha entre armazenamento local ou na
              nuvem (AWS S3).
            </AlertDescription>
          </Alert>

          {/* Seletor de Provedor */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Provedor de Armazenamento
            </label>
            <Select value={storageProvider} onValueChange={(value) => setStorageProvider(value as "local" | "s3")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Local (servidor)
                  </div>
                </SelectItem>
                <SelectItem value="s3">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Amazon S3
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alert Condicional - Local Storage */}
          {storageProvider === "local" && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
              <HardDrive className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                Modo de armazenamento local ativado. Arquivos serão salvos no
                diretório do servidor. Para ambientes de produção, considere usar
                AWS S3.
              </AlertDescription>
            </Alert>
          )}

          {/* Alert Condicional - AWS S3 */}
          {storageProvider === "s3" && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Configure suas credenciais do AWS S3 abaixo. Esta é a opção
                recomendada para produção.
              </AlertDescription>
            </Alert>
          )}

          {/* Seção de Conteúdo Condicional */}
          <div className="border-t pt-6 space-y-4">
            {storageProvider === "local" && (
              <div className="space-y-3">
                <h4 className="font-medium">Informações de Armazenamento Local</h4>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Diretório padrão:</span>{" "}
                    <code className="bg-background px-2 py-1 rounded">
                      /storage/uploads
                    </code>
                  </p>
                  <p>
                    <span className="font-medium">Tamanho máximo por arquivo:</span> 100 MB
                  </p>
                  <p>
                    <span className="font-medium">Formatos suportados:</span> Imagens,
                    documentos, vídeos e áudios
                  </p>
                  <p className="text-muted-foreground mt-4">
                    ⚠️ <strong>Nota:</strong> Backups regulares são recomendados.
                    Em ambientes de produção com alta concorrência, AWS S3 oferece
                    melhor escalabilidade.
                  </p>
                </div>
              </div>
            )}

            {storageProvider === "s3" && (
              <div className="space-y-4">
                <h4 className="font-medium">Credenciais do AWS S3</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Key ID</label>
                    <input
                      type="password"
                      placeholder="AKIA..."
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Sua chave de acesso AWS será configurada via variáveis de
                      ambiente
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Access Key</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      A chave secreta será configurada via variáveis de ambiente
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Bucket</label>
                    <input
                      type="text"
                      placeholder="meu-bucket-smarthu"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Nome do bucket S3 onde os arquivos serão armazenados
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Região</label>
                    <input
                      type="text"
                      placeholder="us-east-1"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Região AWS do seu bucket
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end pt-6 border-t">
            <Button size="lg" onClick={handleSaveConfiguration}>
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
