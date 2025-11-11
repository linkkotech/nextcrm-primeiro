"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginSchema, type LoginInput } from "@/schemas/auth.schemas"
import { loginAction } from "@/lib/actions/auth.actions"

export function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setError(null)
    
    startTransition(async () => {
      const result = await loginAction(data)
      
      if (result.error) {
        setError(result.error)
      } else {
        // Sucesso - o middleware vai redirecionar
        router.push("/admin/dashboard")
      }
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Entre com seu email para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          method="post"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit(onSubmit)(e)
          }}
        >
          <div className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-brand-600 hover:text-brand-700"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                disabled={isPending}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="default"
              className="w-full" 
              disabled={isPending}
            >
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
            
            <Button variant="outline" className="w-full" type="button" disabled>
              Entrar com Google
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/sign-up" className="underline underline-offset-4 text-brand-600 hover:text-brand-700">
              Criar conta
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
