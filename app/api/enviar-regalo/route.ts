import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { tipo, id, email_destinatario } = await req.json();

  if (!tipo || !id || !email_destinatario) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (tipo === "carta") {
    const { data: carta } = await supabaseAdmin
      .from("cartas")
      .select("id, para, de, pagada")
      .eq("id", id)
      .single();

    if (!carta || !carta.pagada) {
      return NextResponse.json({ error: "Carta no encontrada o no pagada" }, { status: 404 });
    }

    const link = `${baseUrl}/carta/${id}`;

    await resend.emails.send({
      from: "perdonaloya.cl <noreply@perdonaloya.cl>",
      to: email_destinatario,
      subject: `${carta.de} te envió un regalo especial 💝`,
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#f43f5e 0%,#fb7185 50%,#fda4af 100%);padding:40px 32px;text-align:center;">
            <p style="color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;">Tienes un mensaje especial</p>
            <h1 style="color:#fff;font-size:32px;font-weight:700;margin:0;line-height:1.2;">💝</h1>
            <h2 style="color:#fff;font-size:22px;font-weight:600;margin:12px 0 0;">${carta.de} te escribió</h2>
          </div>
          <!-- Body -->
          <div style="padding:32px;">
            <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">
              Hola <strong>${carta.para}</strong>, alguien especial te preparó una carta animada personalizada.
              Toca el botón para abrirla.
            </p>
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#f43f5e,#fb7185);color:#fff;font-weight:700;font-size:16px;padding:16px 36px;border-radius:999px;text-decoration:none;box-shadow:0 4px 14px rgba(244,63,94,0.35);">
                Abrir mi carta animada →
              </a>
            </div>
            <div style="background:#fef2f2;border-radius:16px;padding:16px 20px;margin-bottom:24px;">
              <p style="color:#9f1239;font-size:12px;margin:0 0 4px;letter-spacing:0.06em;">O copia este enlace:</p>
              <p style="color:#374151;font-size:13px;word-break:break-all;margin:0;">${link}</p>
            </div>
          </div>
          <!-- Footer -->
          <div style="border-top:1px solid #fef2f2;padding:20px 32px;text-align:center;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">perdonaloya.cl — regalos digitales con corazón 💕</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  }

  if (tipo === "estrella") {
    const { data: estrella } = await supabaseAdmin
      .from("estrellas")
      .select("id, para, de, nombre_estrella, codigo_secreto, pagada")
      .eq("id", id)
      .single();

    if (!estrella || !estrella.pagada) {
      return NextResponse.json({ error: "Estrella no encontrada o no pagada" }, { status: 404 });
    }

    const link = `${baseUrl}/estrella/${id}`;

    await resend.emails.send({
      from: "perdonaloya.cl <noreply@perdonaloya.cl>",
      to: email_destinatario,
      subject: `${estrella.de} dedicó una estrella para ti ✨`,
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;background:#0a0a2e;border-radius:24px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.4);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%);padding:40px 32px;text-align:center;position:relative;">
            <p style="color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 12px;">Alguien pensó en ti</p>
            <h1 style="font-size:40px;margin:0 0 12px;">✨</h1>
            <h2 style="color:#fff;font-size:22px;font-weight:600;margin:0;">${estrella.de} dedicó una estrella</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:8px 0 0;">para <strong style="color:#fff;">${estrella.para}</strong></p>
          </div>
          <!-- Nombre estrella -->
          <div style="padding:28px 32px 0;text-align:center;">
            <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 6px;">Tu estrella se llama</p>
            <h3 style="color:#fbbf24;font-size:28px;font-weight:300;letter-spacing:0.06em;margin:0;">${estrella.nombre_estrella}</h3>
          </div>
          <!-- Código secreto -->
          <div style="padding:20px 32px;">
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px 24px;text-align:center;">
              <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 10px;">Código secreto para revelarla</p>
              <p style="color:#fff;font-size:28px;font-weight:700;letter-spacing:0.18em;margin:0;text-shadow:0 0 20px rgba(251,191,36,0.4);">${estrella.codigo_secreto}</p>
            </div>
          </div>
          <!-- CTA -->
          <div style="padding:4px 32px 28px;text-align:center;">
            <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:700;font-size:16px;padding:16px 36px;border-radius:999px;text-decoration:none;box-shadow:0 4px 20px rgba(124,58,237,0.4);">
              Ir a mi estrella →
            </a>
            <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:16px 0 0;">O copia: <span style="color:rgba(255,255,255,0.45);">${link}</span></p>
          </div>
          <!-- Footer -->
          <div style="border-top:1px solid rgba(255,255,255,0.06);padding:18px 32px;text-align:center;">
            <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">perdonaloya.cl — regalos digitales con corazón 💕</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
}
