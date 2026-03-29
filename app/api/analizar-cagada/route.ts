import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { descripcion } = await req.json();

  if (!descripcion?.trim()) {
    return NextResponse.json({ error: "Falta descripción" }, { status: 400 });
  }

  const prompt = `Eres un experto en relaciones de pareja con sentido del humor. Alguien te describe lo que hizo mal en su relación.

Situación descrita: "${descripcion}"

Tu tarea:
1. Determina el nivel de gravedad del 1 al 5:
   - 1: Error menor (un malentendido, algo trivial)
   - 2: Descuido (olvidó algo no tan importante, llegó tarde)
   - 3: Falla real (olvidó un aniversario, canceló planes importantes, dijo algo hiriente)
   - 4: Error grave (olvidó cumpleaños, mintió en algo relevante)
   - 5: Catástrofe (infidelidad emocional o física, mentira grave, traición)

2. Escribe un comentario breve (máximo 120 caracteres) que:
   - Sea específico a la situación descrita
   - Tenga un tono honesto pero con algo de humor seco
   - Diga qué tan grave es y por qué
   - Suene humano, no generado por IA

Responde SOLO con JSON válido, sin texto adicional:
{"nivel": <número del 1 al 5>, "comentario": "<texto del comentario>"}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ nivel: 3, comentario: null });
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const nivel = Math.min(5, Math.max(1, parseInt(parsed.nivel) || 3));
    return NextResponse.json({ nivel, comentario: parsed.comentario ?? null });
  } catch {
    return NextResponse.json({ nivel: 3, comentario: null });
  }
}
