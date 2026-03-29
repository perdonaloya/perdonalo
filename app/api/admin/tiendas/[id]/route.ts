import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

function autenticado(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

// PATCH /api/admin/tiendas/:id — actualizar campos (ej: activa)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!autenticado(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const { error } = await supabaseAdmin.from("tiendas").update(body).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
