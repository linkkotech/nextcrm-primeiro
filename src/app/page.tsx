"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center text-foreground">
      <span className="rounded-full border border-border px-4 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
        NextCRM Primeiro
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
        Uma plataforma de CRM multi-tenant pronta para acelerar seus
        relacionamentos com clientes.
      </h1>
      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
        Inicie configurando um workspace, convide seu time e personalize os
        módulos que sua operação precisa — tudo em um único lugar.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/dashboard"
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow transition hover:opacity-80"
        >
          Acessar Admin
        </Link>
        <Link
          href="/app/demo-workspace/dashboard"
          className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          Entrar em um Workspace
        </Link>
      </div>
    </main>
  );
}
