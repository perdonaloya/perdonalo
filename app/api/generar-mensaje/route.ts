import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { situacion } = await req.json();

  if (!situacion?.trim()) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const prompt = `Eres un escritor empático especializado en mensajes de disculpa y reconciliación.
Alguien te describe su situación y necesitas escribir el mensaje por él.

Situación: "${situacion}"

Escribe un mensaje breve, sincero y emotivo en primera persona que pueda enviarle a quien lastimó.

Instrucciones:
- Primera persona, español latinoamericano casual pero sincero
- Máximo 230 caracteres
- Sin comillas al inicio ni al final
- Sin frases hechas o clichés
- Que suene humano, específico a la situación
- Solo el mensaje, sin explicaciones`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.85, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    console.error("[generar-mensaje] Gemini error:", res.status, errBody);
    return NextResponse.json({ error: "Error al generar mensaje" }, { status: 500 });
  }

  const data = await res.json();
  const mensaje = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

  if (!mensaje) {
    console.error("[generar-mensaje] Respuesta vacía:", JSON.stringify(data));
    return NextResponse.json({ error: "Respuesta vacía" }, { status: 500 });
  }

  return NextResponse.json({ mensaje });
}
