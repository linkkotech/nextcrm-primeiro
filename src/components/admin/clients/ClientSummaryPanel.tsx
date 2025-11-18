"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Building2, CreditCard, Calendar, Key, Eye } from "lucide-react";

interface ClientSummaryPanelProps {
  client: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    workspaceMemberships: Array<{
      workspace: {
        id: string;
        name: string;
        slug: string;
        subscription: {
          status: string;
          plan: {
            id: string;
            name: string;
            price: number;
          };
        };
      };
      workspaceRole: {
        id: string;
        name: string;
      };
    }>;
  };
}

/**
 * Painel de resumo expansível para detalhes do cliente.
 * Exibe informações completas do cliente, workspace, plano e ações rápidas.
 */
export function ClientSummaryPanel({ client }: ClientSummaryPanelProps) {
  const membership = client.workspaceMemberships[0];
  const workspace = membership?.workspace;
  const plan = workspace?.subscription.plan;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Informações do Cliente */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Mail className="h-4 w-4" />
              Cliente
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">{client.name || "Sem nome"}</p>
              <p className="text-xs text-muted-foreground">{client.email}</p>
              <p className="text-xs text-muted-foreground">
                ID: {client.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </Card>

        {/* Informações do Workspace */}
        {workspace && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Workspace
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">{workspace.slug}</p>
                <Badge variant="outline" className="w-fit text-xs">
                  {membership.workspaceRole.name}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Informações do Plano */}
        {plan && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Plano
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{plan.name}</p>
                <p className="text-sm font-semibold text-green-600">
                  {formatCurrency(plan.price)}/mês
                </p>
                <Badge
                  variant={
                    workspace.subscription.status === "Active"
                      ? "default"
                      : "secondary"
                  }
                  className="w-fit text-xs"
                >
                  {workspace.subscription.status}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Data de Cadastro */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Cadastrado em
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">{formatDate(client.createdAt)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(client.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button size="sm" variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          Visualizar Dashboard
        </Button>
        <Button size="sm" variant="outline" className="gap-2">
          <Key className="h-4 w-4" />
          Resetar Senha
        </Button>
        <Button size="sm" variant="outline">
          Ver Logs
        </Button>
        <Button size="sm" variant="outline">
          Editar Cliente
        </Button>
      </div>
    </div>
  );
}
