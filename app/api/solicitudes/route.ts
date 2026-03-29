import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// POST /api/solicitudes
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, descripcion, categoria, comuna, direccion, whatsapp, instagram, web, nombre_contacto, email_contacto, rut, horario, delivery } = body;

  if (!nombre || !categoria) {
    return NextResponse.json({ error: "Nombre y categoría son obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("solicitudes")
    .insert({ nombre, descripcion, categoria, comuna, direccion, whatsapp, instagram, web, nombre_contacto, email_contacto, rut, horario, delivery: delivery ?? false })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
