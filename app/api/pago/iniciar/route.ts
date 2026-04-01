import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mp, isSandbox, PRECIO_CARTA } from "@/lib/mercadopago";
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
    .select("id, pagada, email_comprador")
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  await registrarLog({
    operacion_id,
    tipo: "pago_carta",
    evento: "ejecutando",
    mensaje: `Creando preferencia Mercado Pago para carta ${carta_id} — monto: $${PRECIO_CARTA} CLP`,
    referencia_id: carta_id,
    ip,
    datos: { carta_id, monto: PRECIO_CARTA },
  });

  try {
    const preference = new Preference(mp);
    const response = await preference.create({
      body: {
        items: [
          {
            id: carta_id,
            title: "Carta Digital — perdonaloya.cl",
            quantity: 1,
            unit_price: PRECIO_CARTA,
            currency_id: "CLP",
          },
        ],
        external_reference: carta_id,
        notification_url: `${baseUrl}/api/webhook/mercadopago`,
        payer: carta.email_comprador ? { email: carta.email_comprador } : undefined,
        back_urls: {
          success: `${baseUrl}/carta/pago-exitoso`,
          failure: `${baseUrl}/carta/pago-fallido`,
          pending: `${baseUrl}/carta/pago-fallido`,
        },
        payment_methods: {
          excluded_payment_types: [],
        },
      },
    });

    await supabaseAdmin
      .from("cartas")
      .update({ operacion_id })
      .eq("id", carta_id);

    const url = isSandbox ? response.sandbox_init_point : response.init_point;
    return NextResponse.json({ url });
  } catch (err) {
    const motivo = err instanceof Error ? err.message : "Error desconocido";
    await registrarLog({
      operacion_id,
      tipo: "pago_carta",
      evento: "fallido",
      mensaje: `Error al crear preferencia MP para carta ${carta_id} — ${motivo}`,
      referencia_id: carta_id,
      ip,
      datos: { motivo },
    });
    return NextResponse.json({ error: "Error al iniciar el pago" }, { status: 500 });
  }
}
