import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    const firstWorkspaceSlug =
      (session.user as { workspaces?: Array<{ slug: string }> }).workspaces?.[0]
        ?.slug ?? "demo-workspace";
    redirect(`/app/${firstWorkspaceSlug}/dashboard`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-white/5 p-8">
        <header className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Entrar</h1>
          <p className="text-sm text-white/50">
            Autentique-se com suas credenciais para acessar o NextCRM.
          </p>
        </header>
        <form className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-[0.3em] text-white/40"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@empresa.com"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-[0.3em] text-white/40"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-white/80"
          >
            Acessar
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/40">
          TODO: conectar formulário às server actions de autenticação.
        </p>
      </div>
    </main>
  );
}
