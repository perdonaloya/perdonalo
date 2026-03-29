import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { para, de, nombre_estrella, mensaje, codigo_secreto, operacion_id, config } = body;

  if (!para || !de || !nombre_estrella || !mensaje || !codigo_secreto) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: para, de, nombre_estrella, mensaje, codigo_secreto" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("estrellas")
    .insert({
      para: para.trim(),
      de: de.trim(),
      nombre_estrella: nombre_estrella.trim(),
      mensaje: mensaje.trim(),
      codigo_secreto: codigo_secreto.trim().toUpperCase(),
      operacion_id: operacion_id ?? null,
      config: config ?? {},
      pagada: false,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
