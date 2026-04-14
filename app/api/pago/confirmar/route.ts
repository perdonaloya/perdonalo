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
  if (!token) return NextResponse.redirect(new URL("/carta/pago-cancelado", baseUrl));

  // Reusar la lógica POST con un FormData simulado
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
    return NextResponse.redirect(new URL("/carta/pago-cancelado", baseUrl));
  }

  let operacion_id = generarOperacionId();

  try {
    const tx = getWebpay();
    const result = await tx.commit(token);

    // buy_order guardado en mp_payment_id al iniciar
    const { data: carta } = await supabaseAdmin
      .from("cartas")
      .select("id, operacion_id, email_comprador, para, de")
      .eq("mp_payment_id", result.buy_order)
      .single();

    const carta_id = carta?.id ?? "";

    if (carta?.operacion_id) operacion_id = carta.operacion_id;

    if (result.response_code === 0) {
      await supabaseAdmin
        .from("cartas")
        .update({ pagada: true, mp_payment_id: token })
        .eq("id", carta_id);

      await supabaseAdmin.from("transacciones").insert({
        carta_id,
        producto_id: "carta",
        monto: result.amount,
        moneda: "CLP",
        estado: "aprobado",
        payment_id: token,
        mp_payment_id: token,
        payment_status: "approved",
        metodo_pago: result.payment_type_code ?? null,
        cuotas: result.installments_number ?? 1,
        email_comprador: carta?.email_comprador ?? null,
        ip,
      });

      await registrarLog({
        operacion_id,
        tipo: "pago_carta",
        evento: "exito",
        mensaje: `Pago aprobado — carta ${carta_id} pagada desde IP ${ip}`,
        referencia_id: carta_id,
        ip,
        datos: { carta_id, token, monto: result.amount },
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
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
              <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
                <p style="color:#888;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.06em;">Datos de tu compra</p>
                <p style="color:#374151;font-size:13px;margin:0 0 4px;">ID producto: <strong>${carta_id}</strong></p>
                <p style="color:#374151;font-size:13px;margin:0;">Token Webpay: <strong>${token}</strong></p>
              </div>
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
        mensaje: `Pago rechazado — carta ${carta_id} — response_code: ${result.response_code}`,
        referencia_id: carta_id,
        ip,
        datos: { response_code: result.response_code },
      });
      return NextResponse.redirect(new URL(`/carta/pago-fallido?id=${carta_id}`, baseUrl));
    }
  } catch (err) {
    const motivo = err instanceof Error ? err.message : typeof err === "object" && err !== null ? JSON.stringify(err) : String(err);
    await registrarLog({
      operacion_id,
      tipo: "pago_carta",
      evento: "fallido",
      mensaje: `Error al confirmar pago Webpay — ${motivo}`,
      ip,
      datos: { motivo },
    });
    return NextResponse.redirect(new URL("/carta/pago-fallido", baseUrl));
  }
}
