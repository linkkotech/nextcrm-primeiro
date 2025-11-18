"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeader } from "@/context/HeaderContext";
import {
  Users,
  CheckSquare,
  FolderOpen,
  TrendingUp,
} from "lucide-react";

/**
 * Página de Dashboard do Cliente (Workspace)
 * Exibe visão geral das estatísticas e atividades do workspace.
 *
 * Componentes:
 * - Cards com métricas principais (contatos, tarefas, projetos)
 * - Gráficos placeholder para futura implementação
 * - Call-to-action para navegar para módulos principais
 */
export default function DashboardPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();

  // Configurar header dinâmico
  useEffect(() => {
    setPrimaryTitle("Dashboard");
    setSecondaryHeaderContent(null);
  }, [setPrimaryTitle, setSecondaryHeaderContent]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo ao seu Workspace
        </h1>
        <p className="text-muted-foreground">
          Aqui você pode gerenciar seus projetos, contatos e tarefas
        </p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card: Contatos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Novos Contatos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>

        {/* Card: Tarefas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tarefas Pendentes
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Em progresso
            </p>
          </CardContent>
        </Card>

        {/* Card: Projetos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        {/* Card: Crescimento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Crescimento
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+0%</div>
            <p className="text-xs text-muted-foreground">
              Comparado ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Placeholder para Gráficos */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Gráfico de atividade será exibido aqui
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">Adicione seus primeiros contatos</p>
                <p className="text-xs text-muted-foreground">
                  Comece adicionando clientes e prospects à sua base
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">Crie seu primeiro projeto</p>
                <p className="text-xs text-muted-foreground">
                  Organize seu trabalho em projetos estruturados
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">Configure automações</p>
                <p className="text-xs text-muted-foreground">
                  Automatize tarefas repetitivas para aumentar produtividade
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
