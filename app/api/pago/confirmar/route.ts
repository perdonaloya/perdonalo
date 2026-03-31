import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mp } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-server";
import { registrarLog, generarOperacionId } from "@/lib/logger";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconocida";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const { searchParams } = new URL(req.url);

  const payment_id = searchParams.get("payment_id") ?? searchParams.get("collection_id");
  const carta_id = searchParams.get("external_reference");

  // Usuario canceló o volvió sin pagar
  if (!payment_id || !carta_id) {
    return NextResponse.redirect(new URL("/carta/pago-cancelado", baseUrl));
  }

  let operacion_id = generarOperacionId();

  try {
    const { data: carta } = await supabaseAdmin
      .from("cartas")
      .select("id, operacion_id, email_comprador, para")
      .eq("id", carta_id)
      .single();

    if (carta?.operacion_id) operacion_id = carta.operacion_id;

    // Verificar el pago en MP (no confiar solo en los query params)
    const payment = new Payment(mp);
    const paymentData = await payment.get({ id: Number(payment_id) });

    if (paymentData.status === "approved") {
      await supabaseAdmin
        .from("cartas")
        .update({ pagada: true })
        .eq("id", carta_id);

      await registrarLog({
        operacion_id,
        tipo: "pago_carta",
        evento: "exito",
        mensaje: `Pago aprobado — carta ${carta_id} pagada exitosamente desde IP ${ip}`,
        referencia_id: carta_id,
        ip,
        datos: {
          carta_id,
          payment_id,
          monto: paymentData.transaction_amount,
          payment_method: paymentData.payment_method_id,
        },
      });

      if (carta?.email_comprador) {
        const link = `${baseUrl}/carta/${carta_id}`;
        await resend.emails.send({
          from: "perdonaloya.cl <noreply@perdonaloya.cl>",
          to: carta.email_comprador,
          subject: "Tu carta digital está lista 💝",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
              <h1 style="font-size:24px;font-weight:700;color:#1a1a2e;margin-bottom:8px;">¡Tu carta está lista! 💝</h1>
              <p style="color:#555;margin-bottom:24px;">La carta para <strong>${carta.para}</strong> ya fue pagada y está lista para compartir.</p>
              <a href="${link}" style="display:inline-block;background:#e11d48;color:#fff;font-weight:600;padding:14px 28px;border-radius:999px;text-decoration:none;margin-bottom:24px;">Ver carta animada →</a>
              <p style="color:#888;font-size:13px;">O copia este link: ${link}</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
              <p style="color:#aaa;font-size:12px;">perdonaloya.cl — regalos digitales con corazón</p>
            </div>
          `,
        }).catch(() => null);
      }

      return NextResponse.redirect(new URL(`/carta/pago-exitoso?id=${carta_id}`, baseUrl));
    } else {
      await registrarLog({
        operacion_id,
        tipo: "pago_carta",
        evento: "fallido",
        mensaje: `Pago no aprobado — carta ${carta_id} — estado: ${paymentData.status}`,
        referencia_id: carta_id,
        ip,
        datos: { status: paymentData.status, payment_id },
      });

      return NextResponse.redirect(new URL(`/carta/pago-fallido?id=${carta_id}`, baseUrl));
    }
  } catch (err) {
    const motivo =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null
        ? JSON.stringify(err)
        : String(err);
    await registrarLog({
      operacion_id,
      tipo: "pago_carta",
      evento: "fallido",
      mensaje: `Error al confirmar pago desde IP ${ip} — ${motivo}`,
      referencia_id: carta_id ?? undefined,
      ip,
      datos: { motivo },
    });

    return NextResponse.redirect(new URL("/carta/pago-fallido", baseUrl));
  }
}
