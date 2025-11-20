"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addTeamMemberSchema, type AddTeamMemberInput } from "@/schemas/team.schemas";
import { addTeamMember } from "@/services/team.actions";
import { WORKSPACE_ROLE_OPTIONS } from "@/config/roles";
import { toast } from "sonner";

interface Unit {
  id: string;
  name: string;
}

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceSlug: string;
  organizationName: string;
  availableUnits: Unit[];
  availableRoles: { id: string; name: string }[];
}

export function AddTeamMemberDialog({
  open,
  onOpenChange,
  workspaceSlug,
  organizationName,
  availableUnits,
  availableRoles,
}: AddTeamMemberDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddTeamMemberInput>({
    resolver: zodResolver(addTeamMemberSchema),
    defaultValues: {
      name: "",
      cargo: "",
      unitId: "",
      email: "",
      celular: "",
      workspaceRoleId: "",
      isActive: true,
      sendInvite: true,
      password: "",
    },
  });

  const sendInvite = form.watch("sendInvite");

  const handleSubmit = async (data: AddTeamMemberInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await addTeamMember(workspaceSlug, data);

      if (!result.success) {
        setError(result.error || result.message);
      } else {
        toast.success(result.message);
        onOpenChange(false);
        form.reset();
      }
    } catch (err) {
      console.error("Erro ao adicionar membro:", err);
      setError("Ocorreu um erro ao adicionar o membro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Membro da Equipe</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo membro do workspace
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Informações Pessoais</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: João Silva"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Gerente de Vendas"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Organização e Unidade */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Organização e Unidade</h3>

              <div className="space-y-2">
                <Label>Organização/Empresa</Label>
                <Input value={organizationName} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  Este membro será adicionado a esta organização
                </p>
              </div>

              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma unidade (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableUnits.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione a unidade à qual o membro pertence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Contato</h3>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ex: joao@empresa.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="celular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: (11) 98888-8888"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Permissões */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Permissões</h3>

              <FormField
                control={form.control}
                name="workspaceRoleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função no Workspace *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => {
                          const roleOption = WORKSPACE_ROLE_OPTIONS.find(
                            (r) => r.value === role.name
                          );
                          return (
                            <SelectItem key={role.id} value={role.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {roleOption?.label || role.name}
                                </span>
                                {roleOption?.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {roleOption.description}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                      <FormDescription>
                        Desative para criar o membro sem acesso imediato
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Onboarding */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Configurações de Acesso</h3>

              <FormField
                control={form.control}
                name="sendInvite"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enviar convite por e-mail
                      </FormLabel>
                      <FormDescription>
                        O membro receberá um link para criar sua própria senha
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!sendInvite && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Provisória *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres, 1 letra maiúscula e 1 número"
                            disabled={isLoading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Esta senha será usada para o primeiro acesso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Dialog Footer */}
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adicionando..." : "Adicionar Membro"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
