import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verificarAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authError = verificarAdmin(req);
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
