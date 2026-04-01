import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mp, isSandbox, PRECIO_ESTRELLA } from "@/lib/mercadopago";
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
    .select("id, pagada, email_comprador")
    .eq("id", estrella_id)
    .single();

  if (estrellaError || !estrella) {
    await registrarLog({
      operacion_id,
      tipo: "pago_estrella",
      evento: "fallido",
      mensaje: `Estrella ${estrella_id} no encontrada — IP ${ip}`,
      referencia_id: estrella_id,
      ip,
      datos: { motivo: "Estrella no encontrada" },
    });
    return NextResponse.json({ error: "Estrella no encontrada" }, { status: 404 });
  }

  if (estrella.pagada) {
    return NextResponse.json({ error: "Esta estrella ya fue pagada" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  await registrarLog({
    operacion_id,
    tipo: "pago_estrella",
    evento: "ejecutando",
    mensaje: `Creando preferencia Mercado Pago para estrella ${estrella_id} — monto: $${PRECIO_ESTRELLA} CLP`,
    referencia_id: estrella_id,
    ip,
    datos: { estrella_id, monto: PRECIO_ESTRELLA },
  });

  try {
    const preference = new Preference(mp);
    const response = await preference.create({
      body: {
        items: [
          {
            id: estrella_id,
            title: "Estrella Dedicada — perdonaloya.cl",
            quantity: 1,
            unit_price: PRECIO_ESTRELLA,
            currency_id: "CLP",
          },
        ],
        external_reference: estrella_id,
        notification_url: `${baseUrl}/api/webhook/mercadopago`,
        payer: estrella.email_comprador ? { email: estrella.email_comprador } : undefined,
        back_urls: {
          success: `${baseUrl}/estrella/pago-exitoso`,
          failure: `${baseUrl}/estrella/pago-fallido`,
          pending: `${baseUrl}/estrella/pago-fallido`,
        },
        payment_methods: {
          excluded_payment_types: [],
        },
      },
    });

    await supabaseAdmin
      .from("estrellas")
      .update({ operacion_id })
      .eq("id", estrella_id);

    const url = isSandbox ? response.sandbox_init_point : response.init_point;
    return NextResponse.json({ url });
  } catch (err) {
    const motivo = err instanceof Error ? err.message : typeof err === "object" && err !== null ? JSON.stringify(err) : String(err);
    await registrarLog({
      operacion_id,
      tipo: "pago_estrella",
      evento: "fallido",
      mensaje: `Error al crear preferencia MP para estrella ${estrella_id} — ${motivo}`,
      referencia_id: estrella_id,
      ip,
      datos: { motivo },
    });
    return NextResponse.json({ error: "Error al iniciar el pago", detalle: motivo }, { status: 500 });
  }
}
