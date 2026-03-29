import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET /api/tiendas/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("tiendas")
    .select("*")
    .eq("id", id)
    .eq("activa", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
  }

  return NextResponse.json(data);
}
