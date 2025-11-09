import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autenticação | NextCRM",
  description: "Sistema de autenticação NextCRM",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/20 opacity-50 blur-[80px]"></div>
      </div>
      
      {/* Logo/Brand */}
      <div className="absolute left-8 top-8">
        <h1 className="text-2xl font-bold text-primary">NextCRM</h1>
      </div>

      {/* Content */}
      <main>{children}</main>
    </div>
  )
}

