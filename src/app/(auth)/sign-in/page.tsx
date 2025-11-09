import { LoginForm } from "@/components/blocks/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | NextCRM",
  description: "Faça login na sua conta NextCRM",
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
