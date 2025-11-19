"use client";

import type { UnknownData } from "@/types/common";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useHeader } from "@/context/HeaderContext";
import {
  Users,
  CheckSquare,
  FolderOpen,
  TrendingUp,
} from "lucide-react";

interface DashboardClientProps {
  workspaceSlug: string;
  locale: string;
  workspace: UnknownData;
  translations: {
    title: string;
    welcome: string;
    members: string;
    activities: string;
    recentContacts: string;
    pendingTasks: string;
    activeProjects: string;
    growth: string;
    recentActivity: string;
    nextSteps: string;
    addContacts: string;
    addContactsDesc: string;
    createProject: string;
    createProjectDesc: string;
    configureAutomations: string;
    configureAutomationsDesc: string;
    last7Days: string;
    inProgress: string;
    thisMonth: string;
    comparedToPreviousMonth: string;
  };
}

/**
 * Dashboard Client Component
 * 
 * Responsabilidades:
 * - Renderizar UI com estadouário interativo
 * - Usar hooks (useEffect, useHeader) para gerenciar estado
 * - Exibir dados passados do Server Component
 */
export function DashboardClient({
  translations,
}: DashboardClientProps) {
  const { setPrimaryTitle, setSecondaryHeaderContent } = useHeader();

  // Configurar header dinâmico
  useEffect(() => {
    setPrimaryTitle(translations.title);
    setSecondaryHeaderContent(null);
  }, [setPrimaryTitle, setSecondaryHeaderContent, translations.title]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {translations.welcome}
        </h1>
        <p className="text-muted-foreground">
          {translations.welcome} ao seu Workspace
        </p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card: Contatos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {translations.recentContacts}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {translations.last7Days}
            </p>
          </CardContent>
        </Card>

        {/* Card: Tarefas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {translations.pendingTasks}
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {translations.inProgress}
            </p>
          </CardContent>
        </Card>

        {/* Card: Projetos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {translations.activeProjects}
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {translations.thisMonth}
            </p>
          </CardContent>
        </Card>

        {/* Card: Crescimento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {translations.growth}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+0%</div>
            <p className="text-xs text-muted-foreground">
              {translations.comparedToPreviousMonth}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Placeholder para Gráficos */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.recentActivity}</CardTitle>
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
          <CardTitle>{translations.nextSteps}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{translations.addContacts}</p>
                <p className="text-xs text-muted-foreground">
                  {translations.addContactsDesc}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{translations.createProject}</p>
                <p className="text-xs text-muted-foreground">
                  {translations.createProjectDesc}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{translations.configureAutomations}</p>
                <p className="text-xs text-muted-foreground">
                  {translations.configureAutomationsDesc}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
