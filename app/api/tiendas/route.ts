import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET /api/tiendas — devuelve todas las tiendas activas con calificación promedio
export async function GET() {
  const [tiendasResult, resenasResult] = await Promise.all([
    supabaseAdmin
      .from("tiendas")
      .select("*")
      .eq("activa", true)
      .order("plan", { ascending: false })
      .order("nombre"),
    supabaseAdmin
      .from("resenas")
      .select("tienda_id, calificacion"),
  ]);

  if (tiendasResult.error) {
    return NextResponse.json({ error: tiendasResult.error.message }, { status: 500 });
  }

  // Calcular calificación promedio por tienda
  const ratingMap: Record<string, { sum: number; count: number }> = {};
  for (const r of resenasResult.data ?? []) {
    if (!ratingMap[r.tienda_id]) ratingMap[r.tienda_id] = { sum: 0, count: 0 };
    ratingMap[r.tienda_id].sum += r.calificacion;
    ratingMap[r.tienda_id].count += 1;
  }

  const tiendas = (tiendasResult.data ?? []).map((t) => ({
    ...t,
    calificacion_promedio: ratingMap[t.id]
      ? Math.round((ratingMap[t.id].sum / ratingMap[t.id].count) * 10) / 10
      : null,
    total_resenas: ratingMap[t.id]?.count ?? 0,
  }));

  return NextResponse.json(tiendas);
}
