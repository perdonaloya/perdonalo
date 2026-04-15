import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verificarAdmin } from "@/lib/admin-auth";

// POST /api/admin/solicitudes/:id/rechazar
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = verificarAdmin(req);
  if (authError) return authError;

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("solicitudes")
    .update({ estado: "rechazada" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
