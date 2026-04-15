import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// Rate limiting en memoria (se resetea al reiniciar el proceso)
const intentosFallidos = new Map<string, { count: number; resetAt: number }>();
const MAX_INTENTOS = 10;
const VENTANA_MS = 15 * 60 * 1000; // 15 minutos

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconocida"
  );
}

function registrarIntento(ip: string): boolean {
  const ahora = Date.now();
  const entry = intentosFallidos.get(ip);

  if (!entry || ahora > entry.resetAt) {
    intentosFallidos.set(ip, { count: 1, resetAt: ahora + VENTANA_MS });
    return true; // permitido
  }

  entry.count++;
  if (entry.count > MAX_INTENTOS) return false; // bloqueado
  return true;
}

function resetearIntento(ip: string) {
  intentosFallidos.delete(ip);
}

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
  const ip = getIp(req);

  if (!registrarIntento(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta en 15 minutos." },
      { status: 429 }
    );
  }

  const secret = req.headers.get("x-admin-secret") ?? "";
  const expected = process.env.ADMIN_SECRET ?? "";

  if (!expected || !secretsIguales(secret, expected)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  resetearIntento(ip);
  return null; // autenticado OK
}
