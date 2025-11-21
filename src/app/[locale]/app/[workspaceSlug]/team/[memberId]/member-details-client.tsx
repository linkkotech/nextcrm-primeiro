/**
 * Componente Client para Detalhes do Membro da Equipe
 * 
 * Responsabilidades:
 * - Renderizar layout de duas colunas com cards de informação
 * - Gerenciar estado de edição via Sheet (painel lateral)
 * - Exibir ProfileDetailsCard unificado
 * - Usar useTranslations() para i18n no cliente
 * 
 * Layout:
 * - Grid responsivo: 1 coluna (mobile) → 3 colunas (lg+)
 * - Coluna esquerda (col-span-2): Cards de informação empilhados
 * - Coluna direita (col-span-1): Cards de status e preview
 */

'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { UserProfileCard } from '@/components/application/team/UserProfileCard';
import { ProfileDetailsCard } from '@/components/application/team/ProfileDetailsCard';
import { ProfileDetailsForm } from '@/components/application/team/ProfileDetailsForm';
import { FormSheet } from '@/components/application/shared/FormSheet';

interface MemberDetailsClientProps {
  member: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    cargo: string | null;
    celular: string | null;
    role: string;
    units: string[];
    createdAt: Date;
  };
  workspaceSlug: string;
}

/**
 * Renderiza a página de detalhes do membro com layout de duas colunas
 * 
 * IMPORTANTE: Usa novo padrão Sheet para formulários complexos.
 * ProfileDetailsCard unificado substitui múltiplos cards placeholder.
 * 
 * @param member - Dados do membro do workspace
 * @param workspaceSlug - Slug do workspace para navegação
 */
export function MemberDetailsClient({
  member,
  workspaceSlug,
}: MemberDetailsClientProps) {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const handleEditSuccess = () => {
    setIsEditSheetOpen(false);
    // TODO: Revalidar dados da página ou refetch
  };

  const handleEditCancel = () => {
    setIsEditSheetOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: Informações do Membro */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card de Perfil Rico */}
          <UserProfileCard 
            member={member} 
            contactsCount={5} 
            tasksCount={2} 
          />

          {/* Card Unificado de Detalhes */}
          <ProfileDetailsCard
            member={member}
            onEditClick={() => setIsEditSheetOpen(true)}
          />
        </div>

      {/* COLUNA DIREITA: Preview e Status */}
      <div className="lg:col-span-1 space-y-6">
        {/* Card 1: Métricas Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {/* Mini Card: QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">QR</div>
                <p className="text-xs text-muted-foreground mt-1">Code</p>
              </div>
              {/* Mini Card: Visits */}
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Visits</p>
              </div>
              {/* Mini Card: Introductions */}
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Intros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Profile Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Mobile preview</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {/* Placeholder: Mockup do celular com aspect-ratio 9/16 */}
            <div className="w-48 aspect-[9/16] bg-muted rounded-xl border-2 border-border flex items-center justify-center">
              <p className="text-xs text-muted-foreground text-center px-4">
                Mobile Profile Preview
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Subscription plan and billing information.
            </p>
          </CardContent>
        </Card>

        {/* Card 4: NFC Card */}
        <Card>
          <CardHeader>
            <CardTitle>NFC Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              NFC card configuration and status.
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Push notification settings and history.
            </p>
          </CardContent>
        </Card>

        {/* Card 6: Delete Person (Zona de Perigo) */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Person</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently remove this member from the workspace. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Member
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Sheet para Edição de Detalhes */}
      <FormSheet
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        title="Editar Detalhes do Perfil"
        description="Atualize as informações pessoais e de contato do membro"
      >
        <ProfileDetailsForm
          workspaceSlug={workspaceSlug}
          memberId={member.id}
          initialData={{
            name: member.name ?? '',
            email: member.email,
            cargo: member.cargo ?? undefined,
            celular: member.celular ?? undefined,
          }}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </FormSheet>
    </>
  );
}
