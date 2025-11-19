"use client";

import Link from "next/link";
import {
  Database,
  Bell,
  RefreshCw,
  Info,
  Plus,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data para histórico de backups
const backupHistory = [
  {
    id: 1,
    filename: "backup_2025.01.15_02.00.sql",
    size: "15.0 MB",
    datetime: "14/01/2025 às 23:00",
    status: "Concluído",
  },
  {
    id: 2,
    filename: "backup_2025.01.14_02.00.sql",
    size: "14.0 MB",
    datetime: "13/01/2025 às 23:00",
    status: "Concluído",
  },
  {
    id: 3,
    filename: "backup_2025.01.13_02.00.sql",
    size: "13.8 MB",
    datetime: "12/01/2025 às 23:00",
    status: "Concluído",
  },
];

export default function SchedulerPage() {
  const handleCreateBackup = () => {
    console.log("Criando novo backup...");
    alert("Backup iniciado! Você receberá uma notificação quando estiver pronto.");
  };

  const handleConfigureAutomaticBackup = () => {
    console.log("Abrindo configuração de backup automático...");
    alert("Configurações de backup automático (em breve)");
  };

  const handleBackupAction = (action: string, filename: string) => {
    console.log(`Executando ação: ${action} no arquivo: ${filename}`);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Agendamentos (Cron Jobs)
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure tarefas automáticas e agendadas
        </p>
      </div>

      {/* Tabs de Agendamentos */}
      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="synchronizations" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sincronizações
          </TabsTrigger>
        </TabsList>

        {/* Aba: Backup */}
        <TabsContent value="backup" className="space-y-6">
          {/* Alert Informativo */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Os backups são armazenados no módulo de Storage. Configure o storage em{" "}
              <Link href="/admin/settings/storage" className="font-medium underline hover:no-underline">
                Configurações → Storage e Uploads
              </Link>
              .
            </AlertDescription>
          </Alert>

          {/* Card Gerenciar Backups */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Backups</CardTitle>
              <CardDescription>
                Crie backups manuais ou configure rotinas automáticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCreateBackup}
                  className="gap-2 flex-1 sm:flex-none"
                >
                  <Plus className="h-4 w-4" />
                  Criar Backup Agora
                </Button>
                <Button
                  variant="outline"
                  onClick={handleConfigureAutomaticBackup}
                  className="gap-2 flex-1 sm:flex-none"
                >
                  <Settings className="h-4 w-4" />
                  Configurar Backup Automático
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Histórico de Backups */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Backups</CardTitle>
              <CardDescription>Lista de backups criados e seu status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Arquivo do Backup</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Data e Hora</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupHistory.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-mono text-sm">
                          {backup.filename}
                        </TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>{backup.datetime}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                            {backup.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleBackupAction("download", backup.filename)
                                }
                              >
                                Baixar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleBackupAction("restore", backup.filename)
                                }
                              >
                                Restaurar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleBackupAction("delete", backup.filename)
                                }
                                className="text-red-600"
                              >
                                Deletar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure alertas e notificações de agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Configurações para Notificações estarão disponíveis em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Sincronizações */}
        <TabsContent value="synchronizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sincronizações</CardTitle>
              <CardDescription>
                Configure sincronizações automáticas com serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Configurações para Sincronizações estarão disponíveis em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
