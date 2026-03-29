import { NextRequest, NextResponse } from "next/server";
import { webpayTx, PRECIO_CARTA } from "@/lib/webpay";
import { supabaseAdmin } from "@/lib/supabase-server";
import { registrarLog, generarOperacionId } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconocida";

  const { carta_id, operacion_id: operacionIdExterno } = await req.json();
  const operacion_id = (operacionIdExterno as string | undefined) ?? generarOperacionId();

  if (!carta_id) {
    return NextResponse.json({ error: "carta_id requerido" }, { status: 400 });
  }

  await registrarLog({
    operacion_id,
    tipo: "pago_carta",
    evento: "iniciando",
    mensaje: `La IP ${ip} inició el pago de carta ${carta_id}`,
    referencia_id: carta_id,
    ip,
    datos: { carta_id },
  });

  const { data: carta, error: cartaError } = await supabaseAdmin
    .from("cartas")
    .select("id, pagada")
    .eq("id", carta_id)
    .single();

  if (cartaError || !carta) {
    await registrarLog({
      operacion_id,
      tipo: "pago_carta",
      evento: "fallido",
      mensaje: `Carta ${carta_id} no encontrada — IP ${ip}`,
      referencia_id: carta_id,
      ip,
      datos: { motivo: "Carta no encontrada" },
    });
    return NextResponse.json({ error: "Carta no encontrada" }, { status: 404 });
  }

  if (carta.pagada) {
    return NextResponse.json({ error: "Esta carta ya fue pagada" }, { status: 400 });
  }

  const buyOrder = carta_id.replace(/-/g, "").slice(0, 26);
  const sessionId = operacion_id.replace(/-/g, "").slice(0, 61);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const returnUrl = `${baseUrl}/api/pago/confirmar`;

  await registrarLog({
    operacion_id,
    tipo: "pago_carta",
    evento: "ejecutando",
    mensaje: `Creando transacción Webpay para carta ${carta_id} — monto: $${PRECIO_CARTA} CLP`,
    referencia_id: carta_id,
    ip,
    datos: { carta_id, monto: PRECIO_CARTA, buyOrder },
  });

  try {
    const response = await webpayTx.create(buyOrder, sessionId, PRECIO_CARTA, returnUrl);

    await supabaseAdmin
      .from("cartas")
      .update({ operacion_id, buy_order: buyOrder })
      .eq("id", carta_id);

    return NextResponse.json({ url: response.url, token: response.token });
  } catch (err) {
    const motivo = err instanceof Error ? err.message : "Error desconocido";
    await registrarLog({
      operacion_id,
      tipo: "pago_carta",
      evento: "fallido",
      mensaje: `Error al crear transacción Webpay para carta ${carta_id} — ${motivo}`,
      referencia_id: carta_id,
      ip,
      datos: { motivo },
    });
    return NextResponse.json({ error: "Error al iniciar el pago" }, { status: 500 });
  }
}
