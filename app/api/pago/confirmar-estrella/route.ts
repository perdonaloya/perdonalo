import { NextRequest, NextResponse } from "next/server";
import { getWebpay } from "@/lib/webpay";
import { supabaseAdmin } from "@/lib/supabase-server";
import { registrarLog, generarOperacionId } from "@/lib/logger";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token_ws");
  if (!token) return NextResponse.redirect(new URL("/estrella/pago-cancelado", baseUrl));
  const formData = new FormData();
  formData.append("token_ws", token);
  return handleConfirmar(req, formData);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  return handleConfirmar(req, formData);
}

async function handleConfirmar(req: NextRequest, formData: FormData) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconocida";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const token = formData.get("token_ws") as string | null;

  if (!token) {
    return NextResponse.redirect(new URL("/estrella/pago-cancelado", baseUrl));
  }

  let operacion_id = generarOperacionId();

  try {
    const tx = getWebpay();
    const result = await tx.commit(token);

    const { data: estrella } = await supabaseAdmin
      .from("estrellas")
      .select("id, operacion_id, email_comprador, para, nombre_estrella, codigo_secreto")
      .eq("mp_payment_id", result.buy_order)
      .single();

    const estrella_id = estrella?.id ?? "";

    if (estrella?.operacion_id) operacion_id = estrella.operacion_id;

    if (result.response_code === 0) {
      await supabaseAdmin
        .from("estrellas")
        .update({ pagada: true, mp_payment_id: token })
        .eq("id", estrella_id);

      await supabaseAdmin.from("transacciones").insert({
        estrella_id,
        producto_id: "estrella",
        monto: result.amount,
        moneda: "CLP",
        estado: "aprobado",
        payment_id: token,
        mp_payment_id: token,
        payment_status: "approved",
        metodo_pago: result.payment_type_code ?? null,
        cuotas: result.installments_number ?? 1,
        email_comprador: estrella?.email_comprador ?? null,
        ip,
      });

      await registrarLog({
        operacion_id,
        tipo: "pago_estrella",
        evento: "exito",
        mensaje: `Pago aprobado — estrella ${estrella_id} pagada desde IP ${ip}`,
        referencia_id: estrella_id,
        ip,
        datos: { estrella_id, token, monto: result.amount },
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
              <div style="background:#1a1a3e;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="color:#aaa;font-size:12px;margin:0 0 4px;">Código secreto</p>
                <p style="color:#fff;font-size:22px;font-weight:700;letter-spacing:0.1em;margin:0;">${estrella.codigo_secreto}</p>
              </div>
              <a href="${link}" style="display:inline-block;background:#7c3aed;color:#fff;font-weight:600;padding:14px 28px;border-radius:999px;text-decoration:none;margin-bottom:16px;">Ver estrella →</a>
              <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
              <div style="background:#111132;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
                <p style="color:#666;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.06em;">Datos de tu compra</p>
                <p style="color:#aaa;font-size:13px;margin:0 0 4px;">ID producto: <strong style="color:#fff;">${estrella_id}</strong></p>
                <p style="color:#aaa;font-size:13px;margin:0;">Token Webpay: <strong style="color:#fff;">${token}</strong></p>
              </div>
              <p style="color:#444;font-size:12px;">perdonaloya.cl — regalos digitales con corazón</p>
            </div>
          `,
        }).catch(() => null);
      }

      return NextResponse.redirect(new URL(`/estrella/pago-exitoso?id=${estrella_id}`, baseUrl));
    } else {
      await supabaseAdmin.from("transacciones").insert({
        estrella_id: estrella_id || null,
        producto_id: "estrella",
        monto: result.amount,
        moneda: "CLP",
        estado: "rechazado",
        payment_id: token,
        mp_payment_id: token,
        payment_status: "rejected",
        metodo_pago: result.payment_type_code ?? null,
        cuotas: result.installments_number ?? 1,
        email_comprador: estrella?.email_comprador ?? null,
        ip,
      });

      await registrarLog({
        operacion_id,
        tipo: "pago_estrella",
        evento: "fallido",
        mensaje: `Pago rechazado — estrella ${estrella_id} — response_code: ${result.response_code}`,
        referencia_id: estrella_id,
        ip,
        datos: { response_code: result.response_code },
      });
      return NextResponse.redirect(new URL(`/estrella/pago-fallido?id=${estrella_id}`, baseUrl));
    }
  } catch (err) {
    const motivo = err instanceof Error ? err.message : typeof err === "object" && err !== null ? JSON.stringify(err) : String(err);
    await registrarLog({
      operacion_id,
      tipo: "pago_estrella",
      evento: "fallido",
      mensaje: `Error al confirmar pago Webpay estrella — ${motivo}`,
      ip,
      datos: { motivo },
    });
    return NextResponse.redirect(new URL("/estrella/pago-fallido", baseUrl));
  }
}
