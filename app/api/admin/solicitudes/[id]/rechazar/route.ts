import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

function autenticado(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

// POST /api/admin/solicitudes/:id/rechazar
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!autenticado(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("solicitudes")
    .update({ estado: "rechazada" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
