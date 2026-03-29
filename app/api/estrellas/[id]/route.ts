import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("estrellas")
    .select("id, para, de, nombre_estrella, mensaje, codigo_secreto, pagada, created_at, config")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Estrella no encontrada" }, { status: 404 });
  }

  return NextResponse.json(data);
}
