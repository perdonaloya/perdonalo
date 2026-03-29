import { createClient } from "@supabase/supabase-js";

// Cliente con service role key — solo para uso en el servidor (Route Handlers, Server Components)
// Nunca importar este archivo desde componentes del cliente
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
