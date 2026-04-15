import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verificarAdmin } from "@/lib/admin-auth";

// GET /api/admin/tiendas — todas (activas e inactivas)
export async function GET(req: NextRequest) {
  const authError = verificarAdmin(req);
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from("tiendas")
    .select("*")
    .order("nombre");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
