import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mp } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  // MP envía { type, data: { id } } o { topic, id }
  const type = (body.type ?? body.topic) as string | undefined;
  const paymentId = (body.data as Record<string, unknown> | undefined)?.id ?? body.id;

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://perdonaloya.cl";

  try {
    const payment = new Payment(mp);
    const paymentData = await payment.get({ id: Number(paymentId) });

    if (paymentData.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    const referenceId = paymentData.external_reference;
    if (!referenceId) return NextResponse.json({ ok: true });

    // ── Intentar como estrella ──
    const { data: estrella } = await supabaseAdmin
      .from("estrellas")
      .select("id, pagada, para, de, nombre_estrella, codigo_secreto, email_comprador")
      .eq("id", referenceId)
      .single();

    if (estrella && !estrella.pagada) {
      await supabaseAdmin
        .from("estrellas")
        .update({ pagada: true, mp_payment_id: String(paymentId) })
        .eq("id", referenceId);

      await supabaseAdmin.from("transacciones").insert({
        estrella_id: referenceId,
        producto_id: "estrella",
        monto: paymentData.transaction_amount ?? 0,
        moneda: paymentData.currency_id ?? "CLP",
        estado: "aprobado",
        payment_id: String(paymentId),
        mp_payment_id: String(paymentId),
        payment_status: paymentData.status,
        metodo_pago: paymentData.payment_method_id ?? null,
        cuotas: paymentData.installments ?? 1,
      });

      if (estrella.email_comprador) {
        const link = `${baseUrl}/estrella/${referenceId}`;
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
              <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
              <div style="background:#111132;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
                <p style="color:#666;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.06em;">Datos de tu compra</p>
                <p style="color:#aaa;font-size:13px;margin:0 0 4px;">ID producto: <strong style="color:#fff;">${referenceId}</strong></p>
                <p style="color:#aaa;font-size:13px;margin:0;">N° operación MP: <strong style="color:#fff;">${paymentId}</strong></p>
              </div>
              <p style="color:#444;font-size:12px;">perdonaloya.cl — regalos digitales con corazón</p>
            </div>
          `,
        }).catch(() => null);
      }

      return NextResponse.json({ ok: true });
    }

    // ── Intentar como carta ──
    const { data: carta } = await supabaseAdmin
      .from("cartas")
      .select("id, pagada, para, de, email_comprador")
      .eq("id", referenceId)
      .single();

    if (carta && !carta.pagada) {
      await supabaseAdmin
        .from("cartas")
        .update({ pagada: true, mp_payment_id: String(paymentId) })
        .eq("id", referenceId);

      await supabaseAdmin.from("transacciones").insert({
        carta_id: referenceId,
        producto_id: "carta",
        monto: paymentData.transaction_amount ?? 0,
        moneda: paymentData.currency_id ?? "CLP",
        estado: "aprobado",
        payment_id: String(paymentId),
        mp_payment_id: String(paymentId),
        payment_status: paymentData.status,
        metodo_pago: paymentData.payment_method_id ?? null,
        cuotas: paymentData.installments ?? 1,
      });

      if (carta.email_comprador) {
        const link = `${baseUrl}/carta/${referenceId}`;
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
                <p style="color:#374151;font-size:13px;margin:0 0 4px;">ID producto: <strong>${referenceId}</strong></p>
                <p style="color:#374151;font-size:13px;margin:0;">N° operación MP: <strong>${paymentId}</strong></p>
              </div>
              <p style="color:#aaa;font-size:12px;">perdonaloya.cl — regalos digitales con corazón</p>
            </div>
          `,
        }).catch(() => null);
      }
    }
  } catch {
    // Siempre retornar 200 a MP aunque falle algo interno
  }

  return NextResponse.json({ ok: true });
}
