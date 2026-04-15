import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

export function crearRateLimit(maxPorVentana: number, ventanaMs: number) {
  const buckets = new Map<string, Bucket>();

  function getIp(req: NextRequest): string {
    return (
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "desconocida"
    );
  }

  return function check(req: NextRequest): NextResponse | null {
    const ip = getIp(req);
    const ahora = Date.now();
    const bucket = buckets.get(ip);

    if (!bucket || ahora > bucket.resetAt) {
      buckets.set(ip, { count: 1, resetAt: ahora + ventanaMs });
      return null; // permitido
    }

    bucket.count++;
    if (bucket.count > maxPorVentana) {
      const retryAfter = Math.ceil((bucket.resetAt - ahora) / 1000);
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta más tarde." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    return null; // permitido
  };
}

// 10 intentos de pago por IP cada 10 minutos
export const rateLimitPago = crearRateLimit(10, 10 * 60 * 1000);
