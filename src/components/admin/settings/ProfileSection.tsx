"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Seção de Perfil - Gerencia informações pessoais do usuário
 * Inclui: Avatar, Nome completo, E-mail, Senha
 */
export function ProfileSection() {
  const userName = "Marcelo Dias"; // TODO: Get from session
  const userEmail = "marcelo@linkko.tech"; // TODO: Get from session
  const userImage = "/avatars/default.png"; // TODO: Get from session

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Perfil</h2>
        <p className="text-sm text-muted-foreground">
          Suas informações pessoais e configurações de segurança da conta.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Button variant="outline" size="sm">
            Alterar Avatar
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, GIF ou PNG. Máximo 10MB.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nome Completo */}
        <div className="space-y-2">
          <Label htmlFor="fullname">Nome completo</Label>
          <Input
            id="fullname"
            placeholder="Seu nome completo"
            defaultValue={userName}
          />
        </div>

        {/* E-mail */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            defaultValue={userEmail}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Para alterar seu e-mail, entre em contato com o suporte.
          </p>
        </div>

        {/* Nova Senha */}
        <div className="space-y-2">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Insira a nova senha"
          />
          <p className="text-xs text-muted-foreground">
            Deixe em branco para manter a senha atual.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
}
