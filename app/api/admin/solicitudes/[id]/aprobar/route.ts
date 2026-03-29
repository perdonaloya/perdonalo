import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function autenticado(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

async function geocodificar(direccion: string, comuna: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${direccion}, ${comuna}, Santiago, Chile`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { "Accept-Language": "es", "User-Agent": "perdonaloya.cl" } }
    );
    const data = await res.json();
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

async function enviarEmailAprobacion(solicitud: {
  nombre: string;
  nombre_contacto?: string;
  email_contacto?: string;
}, token: string) {
  if (!solicitud.email_contacto) return;

  const editUrl = `https://perdonaloya.cl/editar-tienda/${token}`;

  await resend.emails.send({
    from: "perdonaloya.cl <onboarding@resend.dev>",
    to: solicitud.email_contacto,
    subject: "¡Tu tienda fue aprobada en perdonaloya.cl! 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <h1 style="font-size:28px;font-weight:700;color:#e11d48;margin-bottom:8px">
          ¡Bienvenido/a a perdonaloya.cl! 🎉
        </h1>
        <p style="font-size:16px;color:#444;margin-bottom:24px">
          Hola ${solicitud.nombre_contacto ?? ""},
        </p>
        <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:16px">
          Nos alegra informarte que <strong>${solicitud.nombre}</strong> ya está activa en
          <strong>perdonaloya.cl</strong> y visible para miles de personas que buscan el regalo perfecto.
        </p>
        <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:24px">
          Por ahora tu perfil está en plan gratuito. Pronto te contactaremos para contarte
          cómo el plan <strong>Pro ⭐</strong> puede darte más visibilidad y llevar más clientes a tu tienda.
        </p>
        <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:8px">
          <strong>¿Necesitas actualizar tu información?</strong> Usa este enlace exclusivo para editar tu perfil:
        </p>
        <a href="${editUrl}"
          style="display:inline-block;background:#f1f5f9;color:#1a1a1a;font-weight:600;padding:12px 24px;border-radius:99px;text-decoration:none;font-size:14px;margin-bottom:32px;border:1px solid #e2e8f0">
          Editar mi tienda →
        </a>
        <p style="font-size:13px;color:#999;margin-bottom:24px">
          Guarda este enlace, es tuyo y exclusivo. Con él puedes actualizar tu descripción, contacto, horario y más en cualquier momento.
        </p>
        <a href="https://perdonaloya.cl/explorar"
          style="display:inline-block;background:#e11d48;color:white;font-weight:600;padding:12px 24px;border-radius:99px;text-decoration:none;font-size:15px">
          Ver perdonaloya.cl →
        </a>
        <p style="font-size:13px;color:#999;margin-top:40px">
          Cualquier duda responde este correo. ¡Gracias por ser parte!<br/>
          — El equipo de perdonaloya.cl
        </p>
      </div>
    `,
  });
}

// POST /api/admin/solicitudes/:id/aprobar
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!autenticado(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  // Obtener la solicitud
  const { data: solicitud, error: errSolicitud } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", id)
    .single();

  if (errSolicitud || !solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  // Geocodificar la dirección
  const coordenadas = solicitud.direccion
    ? await geocodificar(solicitud.direccion, solicitud.comuna ?? "")
    : null;

  const token_edicion = crypto.randomUUID();

  // Crear la tienda
  const { error: errTienda } = await supabaseAdmin.from("tiendas").insert({
    nombre: solicitud.nombre,
    descripcion: solicitud.descripcion,
    categoria: solicitud.categoria,
    comuna: solicitud.comuna,
    direccion: solicitud.direccion,
    whatsapp: solicitud.whatsapp,
    instagram: solicitud.instagram,
    web: solicitud.web,
    lat: coordenadas?.lat ?? null,
    lng: coordenadas?.lng ?? null,
    delivery: solicitud.delivery ?? false,
    horario: solicitud.horario ?? null,
    activa: true,
    email_contacto: solicitud.email_contacto ?? null,
    token_edicion,
  });

  if (errTienda) return NextResponse.json({ error: errTienda.message }, { status: 500 });

  // Marcar solicitud como aprobada
  await supabaseAdmin.from("solicitudes").update({ estado: "aprobada" }).eq("id", id);

  // Enviar email de bienvenida (no bloqueante)
  enviarEmailAprobacion(solicitud, token_edicion).catch(() => {});

  return NextResponse.json({ ok: true, coordenadas });
}
