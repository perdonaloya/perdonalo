import { NextRequest, NextResponse } from "next/server";
import { getWebpay, PRECIO_ESTRELLA } from "@/lib/webpay";
import { supabaseAdmin } from "@/lib/supabase-server";
import { registrarLog, generarOperacionId } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconocida";

  const { estrella_id, operacion_id: operacionIdExterno } = await req.json();
  const operacion_id = (operacionIdExterno as string | undefined) ?? generarOperacionId();

  if (!estrella_id) {
    return NextResponse.json({ error: "estrella_id requerido" }, { status: 400 });
  }

  await registrarLog({
    operacion_id,
    tipo: "pago_estrella",
    evento: "iniciando",
    mensaje: `La IP ${ip} inició el pago de estrella ${estrella_id}`,
    referencia_id: estrella_id,
    ip,
    datos: { estrella_id },
  });

  const { data: estrella, error: estrellaError } = await supabaseAdmin
    .from("estrellas")
    .select("id, pagada")
    .eq("id", estrella_id)
    .single();

  if (estrellaError || !estrella) {
    return NextResponse.json({ error: "Estrella no encontrada" }, { status: 404 });
  }

  if (estrella.pagada) {
    return NextResponse.json({ error: "Esta estrella ya fue pagada" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const tx = getWebpay();
    const buy_order = estrella_id.replace(/-/g, "").slice(0, 26);
    const session_id = operacion_id.replace(/-/g, "").slice(0, 61);
    const response = await tx.create(
      buy_order,
      session_id,
      PRECIO_ESTRELLA,
      `${baseUrl}/api/pago/confirmar-estrella`
    );

    await supabaseAdmin
      .from("estrellas")
      .update({ operacion_id: session_id, mp_payment_id: buy_order })
      .eq("id", estrella_id);

    await registrarLog({
      operacion_id,
      tipo: "pago_estrella",
      evento: "ejecutando",
      mensaje: `Transacción Webpay creada para estrella ${estrella_id}`,
      referencia_id: estrella_id,
      ip,
      datos: { estrella_id, monto: PRECIO_ESTRELLA, token: response.token },
    });

    console.log(`[webpay] token estrella ${estrella_id}:`, response.token);
    return NextResponse.json({ url: response.url, token: response.token });
  } catch (err) {
    const motivo = err instanceof Error ? err.message : typeof err === "object" && err !== null ? JSON.stringify(err) : String(err);
    await registrarLog({
      operacion_id,
      tipo: "pago_estrella",
      evento: "fallido",
      mensaje: `Error al crear transacción Webpay para estrella ${estrella_id} — ${motivo}`,
      referencia_id: estrella_id,
      ip,
      datos: { motivo },
    });
    return NextResponse.json({ error: "Error al iniciar el pago", detalle: motivo }, { status: 500 });
  }
}
