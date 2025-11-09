import { createClient } from '@supabase/supabase-js';

// Cliente para uso no servidor (Server Components, Server Actions, API Routes)
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Cliente para uso no cliente (Client Components)
// Este cliente pode ser usado diretamente em componentes React com 'use client'
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Cliente singleton para uso no servidor (reutiliza a mesma instância)
let serverClient: ReturnType<typeof createClient> | null = null;

export function getServerClient() {
  if (!serverClient) {
    serverClient = createServerClient();
  }
  return serverClient;
}

