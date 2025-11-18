import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase Admin para operações privilegiadas.
 *
 * IMPORTANTE: Este cliente usa a SERVICE_ROLE_KEY (chave privada) e deve
 * ser usado APENAS no servidor. Nunca exponha no client-side.
 *
 * Capacidades:
 * - Criar usuários direto (sem verificação de email)
 * - Deletar usuários
 * - Gerenciar sessões
 * - Operações administrativas
 *
 * @example
 * ```ts
 * const { data, error } = await supabaseAdmin.auth.admin.createUser({
 *   email: "novo@example.com",
 *   password: "senha123",
 *   email_confirm: true
 * });
 * ```
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL não está definida. Verifique seu arquivo .env.local"
  );
}

if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY não está definida. Verifique seu arquivo .env.local. " +
      "Obtenha a chave em: Supabase Dashboard → Project Settings → API → Service Role Key"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
