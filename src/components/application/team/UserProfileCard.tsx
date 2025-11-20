/**
 * UserProfileCard - Card de Perfil Rico do Membro
 * 
 * Componente visual inspirado no design "Ludmila" que exibe informações
 * detalhadas do membro em layout de duas colunas:
 * - Coluna esquerda: Avatar, nome, métricas rápidas, ação primária
 * - Coluna direita: Grid de informações (telefone, endereço, cidade, etc.)
 * 
 * @param member - Dados completos do membro incluindo createdAt
 * @param contactsCount - Número de contatos associados (placeholder: 5)
 * @param tasksCount - Número de tarefas associadas (placeholder: 2)
 */

'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil } from 'lucide-react';

interface UserProfileCardProps {
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
  contactsCount?: number;
  tasksCount?: number;
}

export function UserProfileCard({
  member,
  contactsCount = 5,
  tasksCount = 2,
}: UserProfileCardProps) {
  const initials = member.name
    ? member.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : member.email[0].toUpperCase();

  const formattedDate = new Date(member.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Card>
      <CardContent className="p-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* COLUNA ESQUERDA: Avatar, Nome, Métricas, Ação */}
          <div className="flex flex-col items-center text-center space-y-4 md:border-r md:pr-8">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={member.image || undefined} 
                alt={member.name || member.email} 
              />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>

            {/* Nome e Email */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                {member.name || 'No Name'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {member.email}
              </p>
            </div>

            {/* Seção de Métricas */}
            <div className="flex justify-around w-full pt-2">
              {/* Métrica: Contatos */}
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold">{contactsCount}</div>
                <p className="text-xs text-muted-foreground">Contatos</p>
              </div>

              {/* Métrica: Tarefas */}
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold">{tasksCount}</div>
                <p className="text-xs text-muted-foreground">Tarefas</p>
              </div>
            </div>

            {/* Botão de Ação Primária */}
            <Button className="w-full" size="lg">
              <Pencil className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>

          {/* COLUNA DIREITA: Grid de Informações */}
          <div className="md:col-span-2 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {/* Telefone */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium">
                {member.celular || 'Não informado'}
              </p>
            </div>

            {/* Cargo */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Cargo</p>
              <p className="font-medium">
                {member.cargo || 'Não informado'}
              </p>
            </div>

            {/* Endereço Principal (placeholder com primeira unidade) */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Endereço Principal</p>
              <p className="font-medium">
                {member.units.length > 0 ? member.units[0] : 'Não atribuído'}
              </p>
            </div>

            {/* Cidade (placeholder) */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Cidade</p>
              <p className="font-medium text-muted-foreground">
                São Paulo
              </p>
            </div>

            {/* CEP (placeholder) */}
            <div className="space-y-1">
              <p className="text-muted-foreground">CEP</p>
              <p className="font-medium text-muted-foreground">
                01000-000
              </p>
            </div>

            {/* Data de Cadastro */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Data de Cadastro</p>
              <p className="font-medium">{formattedDate}</p>
            </div>

            {/* Role (WorkspaceRole) */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Role</p>
              <div>
                <Badge variant="secondary">{member.role}</Badge>
              </div>
            </div>

            {/* Status do Membro */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Status do Membro</p>
              <div>
                <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
