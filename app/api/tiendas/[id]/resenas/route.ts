import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET /api/tiendas/:id/resenas
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("resenas")
    .select("*")
    .eq("tienda_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/tiendas/:id/resenas
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { nombre_autor, calificacion, comentario } = body;

  if (!calificacion || calificacion < 1 || calificacion > 5) {
    return NextResponse.json({ error: "Calificación inválida" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("resenas")
    .insert({ tienda_id: id, nombre_autor, calificacion, comentario })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
