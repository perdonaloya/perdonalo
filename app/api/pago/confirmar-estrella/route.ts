import { NextRequest, NextResponse } from "next/server";
import { webpayTx } from "@/lib/webpay";
import { supabaseAdmin } from "@/lib/supabase-server";
import { registrarLog, generarOperacionId } from "@/lib/logger";

async function procesarConfirmacion(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconocida";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let token: string | null = new URL(req.url).searchParams.get("token_ws");
  if (!token && req.method === "POST") {
    const body = await req.formData();
    token = body.get("token_ws") as string | null;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/estrella/pago-cancelado", baseUrl));
  }

  let estrella_id: string | null = null;
  let operacion_id = generarOperacionId();

  try {
    const response = await webpayTx.commit(token);
    const buyOrder = response.buy_order;

    const { data: estrella } = await supabaseAdmin
      .from("estrellas")
      .select("id, operacion_id")
      .eq("buy_order", buyOrder)
      .single();

    estrella_id = estrella?.id ?? null;
    if (estrella?.operacion_id) operacion_id = estrella.operacion_id;

    if (response.status === "AUTHORIZED" && response.response_code === 0) {
      await supabaseAdmin
        .from("estrellas")
        .update({ pagada: true })
        .eq("buy_order", buyOrder);

      await registrarLog({
        operacion_id,
        tipo: "pago_estrella",
        evento: "exito",
        mensaje: `Pago aprobado — estrella ${estrella_id} pagada exitosamente desde IP ${ip}`,
        referencia_id: estrella_id ?? undefined,
        ip,
        datos: {
          estrella_id,
          monto: response.amount,
          payment_type: response.payment_type_code,
          installments: response.installments_number,
          card_last_four: response.card_detail?.card_number,
        },
      });

      return NextResponse.redirect(new URL(`/estrella/${estrella_id}`, baseUrl));
    } else {
      await registrarLog({
        operacion_id,
        tipo: "pago_estrella",
        evento: "fallido",
        mensaje: `Pago rechazado — estrella ${estrella_id} — código: ${response.response_code}`,
        referencia_id: estrella_id ?? undefined,
        ip,
        datos: { response_code: response.response_code, status: response.status },
      });

      return NextResponse.redirect(
        new URL(`/estrella/pago-fallido?id=${estrella_id}`, baseUrl)
      );
    }
  } catch (err) {
    const motivo = err instanceof Error ? err.message : "Error desconocido";
    await registrarLog({
      operacion_id: generarOperacionId(),
      tipo: "pago_estrella",
      evento: "fallido",
      mensaje: `Error al confirmar pago desde IP ${ip} — ${motivo}`,
      referencia_id: estrella_id ?? undefined,
      ip,
      datos: { motivo },
    });

    return NextResponse.redirect(new URL("/estrella/pago-fallido", baseUrl));
  }
}

export async function GET(req: NextRequest) {
  return procesarConfirmacion(req);
}

export async function POST(req: NextRequest) {
  return procesarConfirmacion(req);
}
