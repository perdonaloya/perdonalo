import { supabaseAdmin } from "@/lib/supabase-server";

type Evento = "iniciando" | "ejecutando" | "exito" | "fallido" | "cancelado";

export function generarOperacionId(): string {
  return crypto.randomUUID();
}

export async function registrarLog({
  operacion_id,
  tipo,
  evento,
  mensaje,
  referencia_id,
  ip,
  datos,
}: {
  operacion_id: string;
  tipo: string;
  evento: Evento;
  mensaje: string;
  referencia_id?: string;
  ip?: string;
  datos?: Record<string, unknown>;
}) {
  await supabaseAdmin.from("logs").insert({
    operacion_id,
    tipo,
    evento,
    mensaje,
    referencia_id: referencia_id ?? null,
    ip: ip ?? null,
    datos: datos ?? null,
  });
}
