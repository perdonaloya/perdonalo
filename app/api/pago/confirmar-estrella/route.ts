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
  const estrella_id = searchParams.get("external_reference");

  // Usuario canceló o volvió sin pagar
  if (!payment_id || !estrella_id) {
    return NextResponse.redirect(new URL("/estrella/pago-cancelado", baseUrl));
  }

  let operacion_id = generarOperacionId();

  try {
    const { data: estrella } = await supabaseAdmin
      .from("estrellas")
      .select("id, operacion_id, email_comprador, para, nombre_estrella, codigo_secreto")
      .eq("id", estrella_id)
      .single();

    if (estrella?.operacion_id) operacion_id = estrella.operacion_id;

    // Verificar el pago en MP (no confiar solo en los query params)
    const payment = new Payment(mp);
    const paymentData = await payment.get({ id: Number(payment_id) });

    if (paymentData.status === "approved") {
      await supabaseAdmin
        .from("estrellas")
        .update({ pagada: true })
        .eq("id", estrella_id);

      await registrarLog({
        operacion_id,
        tipo: "pago_estrella",
        evento: "exito",
        mensaje: `Pago aprobado — estrella ${estrella_id} pagada exitosamente desde IP ${ip}`,
        referencia_id: estrella_id,
        ip,
        datos: {
          estrella_id,
          payment_id,
          monto: paymentData.transaction_amount,
          payment_method: paymentData.payment_method_id,
        },
      });

      if (estrella?.email_comprador) {
        const link = `${baseUrl}/estrella/${estrella_id}`;
        await resend.emails.send({
          from: "perdonaloya.cl <noreply@perdonaloya.cl>",
          to: estrella.email_comprador,
          subject: "Tu estrella dedicada está lista ✨",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a2e;color:#fff;">
              <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">¡Tu estrella está lista! ✨</h1>
              <p style="color:#aaa;margin-bottom:8px;">La estrella <strong>${estrella.nombre_estrella}</strong> para <strong>${estrella.para}</strong> ya fue pagada.</p>
              <p style="color:#aaa;margin-bottom:16px;">Comparte el link junto al código secreto para que pueda verla.</p>
              <div style="background:#1a1a3e;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="color:#aaa;font-size:12px;margin:0 0 4px;">Código secreto</p>
                <p style="color:#fff;font-size:22px;font-weight:700;letter-spacing:0.1em;margin:0;">${estrella.codigo_secreto}</p>
              </div>
              <a href="${link}" style="display:inline-block;background:#7c3aed;color:#fff;font-weight:600;padding:14px 28px;border-radius:999px;text-decoration:none;margin-bottom:16px;">Ver estrella →</a>
              <p style="color:#666;font-size:13px;">O copia este link: ${link}</p>
              <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
              <p style="color:#444;font-size:12px;">perdonaloya.cl — regalos digitales con corazón</p>
            </div>
          `,
        }).catch(() => null);
      }

      return NextResponse.redirect(new URL(`/estrella/pago-exitoso?id=${estrella_id}`, baseUrl));
    } else {
      await registrarLog({
        operacion_id,
        tipo: "pago_estrella",
        evento: "fallido",
        mensaje: `Pago no aprobado — estrella ${estrella_id} — estado: ${paymentData.status}`,
        referencia_id: estrella_id,
        ip,
        datos: { status: paymentData.status, payment_id },
      });

      return NextResponse.redirect(
        new URL(`/estrella/pago-fallido?id=${estrella_id}`, baseUrl)
      );
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
