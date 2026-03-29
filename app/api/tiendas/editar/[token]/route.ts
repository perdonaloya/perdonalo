import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const CAMPOS_EDITABLES = [
  "descripcion",
  "whatsapp",
  "instagram",
  "web",
  "horario",
  "delivery",
  "direccion",
];

// GET /api/tiendas/editar/:token — obtener datos editables de la tienda
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data, error } = await supabaseAdmin
    .from("tiendas")
    .select("id, nombre, categoria, comuna, descripcion, whatsapp, instagram, web, horario, delivery, direccion")
    .eq("token_edicion", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Enlace inválido o expirado" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH /api/tiendas/editar/:token — actualizar campos permitidos
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // Verificar que el token existe
  const { data: tienda, error: errBuscar } = await supabaseAdmin
    .from("tiendas")
    .select("id")
    .eq("token_edicion", token)
    .single();

  if (errBuscar || !tienda) {
    return NextResponse.json({ error: "Enlace inválido o expirado" }, { status: 404 });
  }

  const body = await req.json();

  // Solo permitir campos editables
  const actualizacion: Record<string, unknown> = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (campo in body) {
      actualizacion[campo] = body[campo];
    }
  }

  if (Object.keys(actualizacion).length === 0) {
    return NextResponse.json({ error: "Sin campos para actualizar" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("tiendas")
    .update(actualizacion)
    .eq("id", tienda.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
