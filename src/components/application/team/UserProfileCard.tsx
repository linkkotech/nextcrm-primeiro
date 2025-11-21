/**
 * UserProfileCard - Card de Perfil do Membro
 * 
 * Componente visual que exibe informações do membro em layout de duas colunas:
 * - Coluna esquerda: Avatar, nome, email, métricas e ação
 * - Coluna direita: Lista de descrição com campos do usuário
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
import { Briefcase, Mail, Phone, Building2, Clock, Circle, Pencil } from 'lucide-react';

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
          {/* COLUNA ESQUERDA: Avatar, Nome, Email, Métricas, Ação */}
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

          {/* COLUNA DIREITA: Lista de Descrição */}
          <div className="md:col-span-2 space-y-0 divide-y">
            {/* Cargo */}
            <div className="flex justify-between items-center py-3 first:pt-0">
              <span className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-2" />
                Cargo:
              </span>
              <span className="text-sm font-medium">
                {member.cargo || 'Não informado'}
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
              <span className="text-sm font-medium">
                {member.celular || 'Não informado'}
              </span>
            </div>

            {/* Unidade */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 mr-2" />
                Unidade:
              </span>
              <span className="text-sm font-medium">
                {member.units.length > 0 ? member.units[0] : 'Não atribuído'}
              </span>
            </div>

            {/* Role */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Circle className="h-4 w-4 mr-2" />
                Role:
              </span>
              <Badge variant="secondary">{member.role}</Badge>
            </div>

            {/* Data de Cadastro */}
            <div className="flex justify-between items-center py-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Data de Cadastro:
              </span>
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
