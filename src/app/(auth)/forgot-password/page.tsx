import { ForgotPasswordForm } from "@/components/blocks/forgot-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Esqueci minha senha | NextCRM",
  description: "Recupere sua senha NextCRM",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  )
}
