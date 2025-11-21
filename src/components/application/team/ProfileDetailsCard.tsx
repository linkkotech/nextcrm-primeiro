/**
 * ProfileDetailsCard - Card Unificado de Detalhes do Perfil
 * 
 * Substitui os antigos cards placeholder de Details, Addresses, Social, Bio e CTAs.
 * 
 * Layout: Padrão de lista de descrição (dl/dt/dd) com:
 * - Label à esquerda (ícone + texto em text-muted-foreground)
 * - Valor à direita (font-medium ou placeholder em italic muted)
 * - Dividers entre cada campo (divide-y)
 * - Mesmo padrão visual do UserProfileCard (card do Vasco Danelli)
 * 
 * Seções:
 * 1. Informações do Perfil (9 campos)
 * 2. Addresses (placeholder com botão Add)
 * 3. Social Profiles (placeholder)
 * 4. Profile Bio (placeholder)
 * 5. CTAs (Calendar URL, Custom URL)
 * 
 * @param member - Dados completos do membro
 * @param onEditClick - Callback para abrir o Sheet de edição
 */

'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pencil,
  User,
  Mail,
  Phone,
  Smartphone,
  Briefcase,
  Building2,
  MapPin,
  Globe,
  FileText,
  Calendar,
  Link as LinkIcon,
  Plus,
} from 'lucide-react';

interface ProfileDetailsCardProps {
  member: {
    id: string;
    name: string | null;
    email: string;
    cargo: string | null;
    celular: string | null;
    units: string[];
  };
  onEditClick: () => void;
}

export function ProfileDetailsCard({
  member,
  onEditClick,
}: ProfileDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Details</CardTitle>
        <Button variant="ghost" size="sm" onClick={onEditClick}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* SEÇÃO 1: Informações do Perfil */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Informações do Perfil</h3>
          <div className="space-y-0 divide-y">
            {/* Tratamento */}
            <div className="flex justify-between items-center py-3 first:pt-0">
              <span className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                Tratamento:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não informado
              </span>
            </div>

            {/* Nome Completo */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                Nome Completo:
              </span>
              <span className="text-sm font-medium">
                {member.name || 'Não informado'}
              </span>
            </div>

            {/* Pronomes */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                Pronomes:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não informado
              </span>
            </div>

            {/* Título/Credenciais */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-2" />
                Título/Credenciais:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não informado
              </span>
            </div>

            {/* Cargo */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-2" />
                Cargo:
              </span>
              <span className="text-sm font-medium">
                {member.cargo || 'Não informado'}
              </span>
            </div>

            {/* Unidades */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 mr-2" />
                Unidades:
              </span>
              <span className="text-sm font-medium">
                {member.units.length > 0 ? member.units.join(', ') : 'Não atribuído'}
              </span>
            </div>

            {/* E-mail */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                E-mail:
              </span>
              <span className="text-sm font-medium">
                {member.email}
              </span>
            </div>

            {/* Telefone */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                Telefone:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não informado
              </span>
            </div>

            {/* Celular */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Smartphone className="h-4 w-4 mr-2" />
                Celular:
              </span>
              <span className="text-sm font-medium">
                {member.celular || 'Não informado'}
              </span>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Addresses */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Addresses</h3>
              <Badge variant="default" className="bg-blue-500">NEW</Badge>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-0 divide-y">
            <div className="flex justify-between items-center py-3 first:pt-0">
              <span className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Endereços:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Nenhum endereço cadastrado
              </span>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: Social Profiles */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold mb-4">Social Profiles</h3>
          <div className="space-y-0 divide-y">
            <div className="flex justify-between items-center py-3 first:pt-0">
              <span className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                Redes Sociais:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não configurado
              </span>
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: Profile Bio */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold mb-4">Profile Bio</h3>
          <div className="space-y-0 divide-y">
            <div className="flex justify-between items-center py-3 first:pt-0">
              <span className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Biografia:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não informado
              </span>
            </div>
          </div>
        </div>

        {/* SEÇÃO 5: CTAs */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold mb-4">CTAs</h3>
          <div className="space-y-0 divide-y">
            {/* Calendar URL */}
            <div className="flex justify-between items-center py-3 first:pt-0">
              <span className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                URL do Calendário:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não configurado
              </span>
            </div>

            {/* Custom URL */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <LinkIcon className="h-4 w-4 mr-2" />
                Link Personalizado:
              </span>
              <span className="text-sm font-medium italic text-muted-foreground">
                Não configurado
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
