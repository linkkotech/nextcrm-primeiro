"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-center text-zinc-100">
      <span className="rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.22em] text-white/60">
        NextCRM Primeiro
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
        Uma plataforma de CRM multi-tenant pronta para acelerar seus
        relacionamentos com clientes.
      </h1>
      <p className="max-w-2xl text-base text-zinc-400 sm:text-lg">
        Inicie configurando um workspace, convide seu time e personalize os
        módulos que sua operação precisa — tudo em um único lugar.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/dashboard"
          className="rounded-md bg-white px-5 py-2 text-sm font-medium text-slate-950 shadow transition hover:bg-white/80"
        >
          Acessar Admin
        </Link>
        <Link
          href="/app/demo-workspace/dashboard"
          className="rounded-md border border-white/10 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:text-white"
        >
          Entrar em um Workspace
        </Link>
      </div>
    </main>
  );
}
