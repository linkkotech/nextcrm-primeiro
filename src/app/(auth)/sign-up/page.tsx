import { SignupForm } from "@/components/blocks/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Criar Conta | NextCRM",
  description: "Crie sua conta NextCRM",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignupForm />
    </div>
  )
}

