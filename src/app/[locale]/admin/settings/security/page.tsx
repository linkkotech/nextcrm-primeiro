"use client";

import { useState } from "react";
import { Shield, Bot, Info, Eye, EyeOff } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SecuritySettingsPage() {
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isRecaptchaEnabled, setIsRecaptchaEnabled] = useState(false);
  const [siteKey, setSiteKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleSave = () => {
    // TODO: Implementar lógica de salvamento
    console.log("Salvando configurações de segurança", {
      is2faEnabled,
      isRecaptchaEnabled,
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Segurança</h1>
        <p className="text-sm text-muted-foreground">
          Configure políticas de segurança e autenticação
        </p>
      </div>

      {/* Card 2FA */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
                <CardDescription>
                  Aumente a segurança exigindo um segundo passo de verificação para o login da equipe administrativa.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seção de Toggle 2FA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Habilitar 2FA para a equipe (Admin)</h4>
                <p className="text-sm text-muted-foreground">
                  Usuários administrativos precisarão de um código de verificação adicional ao fazer login.
                </p>
              </div>
              <Switch
                checked={is2faEnabled}
                onCheckedChange={setIs2faEnabled}
              />
            </div>
          </div>

          {/* Alert Informativo */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Como funciona o 2FA?</AlertTitle>
            <AlertDescription className="text-blue-800 text-sm">
              Após habilitar, os usuários administrativos precisarão configurar um aplicativo autenticador (como Google Authenticator ou Authy) em seus dispositivos. A cada login, será solicitado um código de 6 dígitos gerado pelo app.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Card reCAPTCHA */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Google reCAPTCHA</CardTitle>
                <CardDescription>
                  Proteja formulários públicos contra spam e bots.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seção de Toggle reCAPTCHA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Habilitar reCAPTCHA</h4>
                <p className="text-sm text-muted-foreground">
                  Adiciona proteção contra bots em formulários de contato e registro.
                </p>
              </div>
              <Switch
                checked={isRecaptchaEnabled}
                onCheckedChange={setIsRecaptchaEnabled}
              />
            </div>
          </div>

          {/* Formulário de Configuração reCAPTCHA (quando habilitado) */}
          {isRecaptchaEnabled && (
            <div className="mt-6 space-y-4 border-t pt-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Obtenha suas chaves gratuitamente</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm">
                  Obtenha suas chaves gratuitamente no{" "}
                  <a
                    href="https://www.google.com/recaptcha/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Google reCAPTCHA Admin Console
                  </a>
                  . Escolha a versão reCAPTCHA v2 (checkbox) ou v3 (invisível).
                </AlertDescription>
              </Alert>

              {/* Chave do Site (Site Key) */}
              <div className="space-y-2">
                <Label htmlFor="siteKey" className="font-medium">
                  Chave do Site (Site Key)
                </Label>
                <Input
                  id="siteKey"
                  placeholder="6Lc..."
                  value={siteKey}
                  onChange={(e) => setSiteKey(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Chave pública usada no frontend dos formulários.
                </p>
              </div>

              {/* Chave Secreta (Secret Key) */}
              <div className="space-y-2">
                <Label htmlFor="secretKey" className="font-medium">
                  Chave Secreta (Secret Key)
                </Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    placeholder="6Lc..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecretKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chave privada usada para validação no backend. Nunca compartilhe publicamente.
                </p>
              </div>
            </div>
          )}

          {/* Alert Informativo */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">O que é reCAPTCHA?</AlertTitle>
            <AlertDescription className="text-blue-800 text-sm">
              O reCAPTCHA do Google utiliza IA para detectar e bloquear bots, mantendo seus formulários seguros sem incomodar usuários legítimos. Será necessário configurar chaves de API do reCAPTCHA v3 nas configurações avançadas.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} size="lg">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
