"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Eye, EyeOff } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Zod Schema para validação
const smtpConfigSchema = z.object({
  smtpEnabled: z.boolean(),
  host: z.string(),
  port: z.string(),
  encryption: z.enum(["tls", "ssl", "none"]),
  username: z.string(),
  password: z.string(),
  fromName: z.string(),
  fromEmail: z.string(),
});

type SmtpConfigFormData = z.infer<typeof smtpConfigSchema>;

export default function AuthSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const form = useForm<SmtpConfigFormData>({
    resolver: zodResolver(smtpConfigSchema),
    defaultValues: {
      smtpEnabled: false,
      host: "",
      port: "587",
      encryption: "tls" as const,
      username: "",
      password: "",
      fromName: "",
      fromEmail: "",
    },
  });

  const smtpEnabled = form.watch("smtpEnabled");

  const onSubmit = (data: SmtpConfigFormData) => {
    console.log("Salvando configurações SMTP:", data);
    // TODO: Implementar lógica de salvamento
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      alert("Por favor, insira um email para teste");
      return;
    }

    setIsSending(true);
    try {
      // TODO: Implementar chamada à API para enviar email de teste
      console.log("Enviando email de teste para:", testEmail);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Email de teste enviado com sucesso!");
    } catch {
      alert("Erro ao enviar email de teste");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Autenticação e E-mail
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure métodos de login, SMTP e notificações por e-mail
        </p>
      </div>

      {/* Abas */}
      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="smtp">Servidor SMTP</TabsTrigger>
          <TabsTrigger value="login_methods">Métodos de Login</TabsTrigger>
        </TabsList>

        {/* Aba: Servidor SMTP */}
        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Servidor SMTP</CardTitle>
              <CardDescription>
                Configure credenciais e parâmetros de envio de email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Switch de Ativação */}
                  <FormField
                    control={form.control}
                    name="smtpEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Configure seu servidor SMTP</FormLabel>
                          <FormDescription>
                            Para habilitar e envio de emails transacionais como notificações, redefinição de senha e convites de usuários.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Formulário SMTP (condicional) */}
                  {smtpEnabled && (
                    <div className="space-y-4 border-t pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Host do Servidor */}
                        <FormField
                          control={form.control}
                          name="host"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Host do Servidor</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="smtp.gmail.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Exemplo: smtp.gmail.com, smtp.sendgrid.net
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Porta */}
                        <FormField
                          control={form.control}
                          name="port"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Porta</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="587"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                TLS: 587, SSL: 465, None: 25
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Criptografia */}
                        <FormField
                          control={form.control}
                          name="encryption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Criptografia</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="tls">TLS</SelectItem>
                                  <SelectItem value="ssl">SSL</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome de Usuário */}
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome de Usuário / Chave de API</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="seu-usuario@exemplo.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Senha */}
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha / Valor de Chave de API</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...field}
                                    className="pr-10"
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome do Remetente */}
                        <FormField
                          control={form.control}
                          name="fromName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Remetente</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="SmartHub Studio"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Nome que aparecerá nos emails enviados
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email do Remetente */}
                        <FormField
                          control={form.control}
                          name="fromEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email do Remetente</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="noreply@smarthubstudio.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Endereço de email que será usado como remetente
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Seção de Teste */}
                      <div className="border-t pt-6 space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Testar Configurações</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Digite um email para teste
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="seu-email@exemplo.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSendTest}
                            disabled={isSending || !smtpEnabled}
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            {isSending ? "Enviando..." : "Enviar Teste"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão Salvar */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button type="submit" size="lg">
                      Salvar Configurações
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Métodos de Login */}
        <TabsContent value="login_methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Login</CardTitle>
              <CardDescription>
                Configure autenticação social e integração com provedores
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Configurações para métodos de login (Google, Microsoft, GitHub, etc.) estarão disponíveis em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
