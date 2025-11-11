import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações da Empresa
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie informações institucionais e identidade da organização
        </p>
      </div>

      {/* Card de Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Nome, CNPJ, endereço, logo e informações de contato
          </CardDescription>
        </CardHeader>
        <div className="px-6 py-4 text-sm text-muted-foreground">
          <p>Configurações disponíveis em breve...</p>
        </div>
      </Card>
    </div>
  );
}


