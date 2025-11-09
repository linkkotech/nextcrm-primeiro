"use client"

import Link from "next/link"
import { Button } from "@/components/untitled/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/untitled/Card"
import { Input } from "@/components/untitled/Input"
import { Label } from "@/components/untitled/Label"

export function ForgotPasswordForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Esqueci minha senha</CardTitle>
        <CardDescription>
          Digite seu email e enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Enviar link de recuperação
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Lembrou a senha?{" "}
            <Link href="/sign-in" className="underline underline-offset-4 text-brand-600 hover:text-brand-700">
              Fazer login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

