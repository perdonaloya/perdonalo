import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { crearRateLimit } from "@/lib/rate-limit";

const rateLimitAdmin = crearRateLimit(10, 15 * 60 * 1000); // 10 intentos cada 15 min

function secretsIguales(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a.padEnd(64));
    const bBuf = Buffer.from(b.padEnd(64));
    return timingSafeEqual(aBuf, bBuf) && a.length === b.length;
  } catch {
    return false;
  }
}

export function verificarAdmin(req: NextRequest): NextResponse | null {
  const limitError = rateLimitAdmin(req);
  if (limitError) return limitError;

  const secret = req.headers.get("x-admin-secret") ?? "";
  const expected = process.env.ADMIN_SECRET ?? "";

  if (!expected || !secretsIguales(secret, expected)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return null; // autenticado OK
}
