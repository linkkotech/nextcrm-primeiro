/**
 * Componente Client para Detalhes do Membro da Equipe
 * 
 * Responsabilidades:
 * - Renderizar layout de duas colunas com cards de informação
 * - Gerenciar estado de interatividade (futuro: edição, modals)
 * - Exibir placeholder para todas as seções
 * - Usar useTranslations() para i18n no cliente
 * 
 * Layout:
 * - Grid responsivo: 1 coluna (mobile) → 3 colunas (lg+)
 * - Coluna esquerda (col-span-2): Cards de informação empilhados
 * - Coluna direita (col-span-1): Cards de status e preview
 */

'use client';

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
 * IMPORTANTE: Esta é a estrutura visual inicial com placeholders.
 * Funcionalidades de edição serão implementadas posteriormente.
 * 
 * @param member - Dados do membro do workspace
 * @param workspaceSlug - Slug do workspace para navegação
 */
export function MemberDetailsClient({
  member,
  workspaceSlug,
}: MemberDetailsClientProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* COLUNA ESQUERDA: Informações do Membro */}
      <div className="lg:col-span-2 space-y-6">
        {/* Card de Perfil Rico */}
        <UserProfileCard 
          member={member} 
          contactsCount={5} 
          tasksCount={2} 
        />

        {/* Card 1: Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Details</CardTitle>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Phone:</strong> {member.celular || 'Not provided'}</p>
              <p><strong>Units:</strong> {member.units.length > 0 ? member.units.join(', ') : 'No units assigned'}</p>
              <p className="text-sm italic">Additional details will be displayed here...</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Addresses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <CardTitle>Addresses</CardTitle>
              <Badge variant="default" className="bg-blue-500">NEW</Badge>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No addresses configured. Click "Add" to create a new address entry.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Social Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Social Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Social media links and profiles will be displayed here (LinkedIn, Twitter, etc.)
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Profile Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Member's biography and professional summary will appear here.
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Linked Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Linked Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connected external profiles and integrations will be listed here.
            </p>
          </CardContent>
        </Card>

        {/* Card 6: Custom Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Custom data fields specific to your organization will be shown here.
            </p>
          </CardContent>
        </Card>

        {/* Card 7: Additional Options */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced settings and configuration options will appear here.
            </p>
          </CardContent>
        </Card>

        {/* Card 8: Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notification preferences and settings for this member.
            </p>
          </CardContent>
        </Card>
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
  );
}
