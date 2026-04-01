import { NextRequest, NextResponse } from "next/server";
import { getWebpay, PRECIO_CARTA } from "@/lib/webpay";
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
    return NextResponse.json({ error: "Carta no encontrada" }, { status: 404 });
  }

  if (carta.pagada) {
    return NextResponse.json({ error: "Esta carta ya fue pagada" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const tx = getWebpay();
    const buy_order = carta_id.replace(/-/g, "").slice(0, 26);
    const session_id = operacion_id.replace(/-/g, "").slice(0, 61);
    const response = await tx.create(
      buy_order,
      session_id,
      PRECIO_CARTA,
      `${baseUrl}/api/pago/confirmar`
    );

    await supabaseAdmin
      .from("cartas")
      .update({ operacion_id: session_id, mp_payment_id: buy_order })
      .eq("id", carta_id);

    await registrarLog({
      operacion_id,
      tipo: "pago_carta",
      evento: "ejecutando",
      mensaje: `Transacción Webpay creada para carta ${carta_id}`,
      referencia_id: carta_id,
      ip,
      datos: { carta_id, monto: PRECIO_CARTA, token: response.token },
    });

    return NextResponse.json({ url: response.url, token: response.token });
  } catch (err) {
    console.error("[iniciar pago carta]", err);
    const motivo = err instanceof Error ? err.message : typeof err === "object" && err !== null ? JSON.stringify(err) : String(err);
    await registrarLog({
      operacion_id,
      tipo: "pago_carta",
      evento: "fallido",
      mensaje: `Error al crear transacción Webpay para carta ${carta_id} — ${motivo}`,
      referencia_id: carta_id,
      ip,
      datos: { motivo },
    });
    return NextResponse.json({ error: "Error al iniciar el pago", detalle: motivo }, { status: 500 });
  }
}
