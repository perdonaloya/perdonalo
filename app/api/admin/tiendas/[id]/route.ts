import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verificarAdmin } from "@/lib/admin-auth";

// PATCH /api/admin/tiendas/:id — actualizar campos (ej: activa)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = verificarAdmin(req);
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();

  const { error } = await supabaseAdmin.from("tiendas").update(body).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
