import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { TEMAS } from "@/lib/temas";
import { registrarLog, generarOperacionId } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconocida";

  const body = await req.json();
  const { para, de, mensaje, tema, email_comprador, operacion_id: operacionIdExterno } = body;
  const operacion_id = (operacionIdExterno as string | undefined) ?? generarOperacionId();

  await registrarLog({
    operacion_id,
    tipo: "carta_digital",
    evento: "iniciando",
    mensaje: `La IP ${ip} inició una operación de carta digital`,
    ip,
    datos: { tema, para, de },
  });

  if (!para?.trim() || !de?.trim() || !mensaje?.trim() || !tema) {
    await registrarLog({
      operacion_id,
      tipo: "carta_digital",
      evento: "fallido",
      mensaje: `La IP ${ip} falló al iniciar — faltan campos obligatorios`,
      ip,
      datos: { motivo: "Faltan campos obligatorios", tema, para, de },
    });
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  if (!(tema in TEMAS)) {
    await registrarLog({
      operacion_id,
      tipo: "carta_digital",
      evento: "fallido",
      mensaje: `La IP ${ip} envió un tema inválido: "${tema}"`,
      ip,
      datos: { motivo: "Tema inválido", tema },
    });
    return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
  }

  await registrarLog({
    operacion_id,
    tipo: "carta_digital",
    evento: "ejecutando",
    mensaje: `Procesando carta de "${de.trim()}" para "${para.trim()}" — tema: ${tema}`,
    ip,
    datos: { tema, para: para.trim(), de: de.trim() },
  });

  const { data, error } = await supabaseAdmin
    .from("cartas")
    .insert({ para: para.trim(), de: de.trim(), mensaje: mensaje.trim(), tema, email_comprador: email_comprador?.trim() || null })
    .select("id")
    .single();

  if (error) {
    await registrarLog({
      operacion_id,
      tipo: "carta_digital",
      evento: "fallido",
      mensaje: `Error al crear carta para "${para.trim()}" desde IP ${ip} — ${error.message}`,
      ip,
      datos: { motivo: error.message, tema },
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await registrarLog({
    operacion_id,
    tipo: "carta_digital",
    evento: "exito",
    mensaje: `Carta creada exitosamente — de "${de.trim()}" para "${para.trim()}" (${tema}) desde IP ${ip}`,
    referencia_id: data.id,
    ip,
    datos: { carta_id: data.id, tema, para: para.trim(), de: de.trim() },
  });

  return NextResponse.json({ id: data.id });
}
