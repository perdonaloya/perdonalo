"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

const CAGADAS_RAPIDAS = [
  { label: "Olvidé el aniversario", nivel: 3 },
  { label: "Olvidé su cumpleaños", nivel: 4 },
  { label: "Dije algo hiriente", nivel: 3 },
  { label: "Llegué muy tarde sin avisar", nivel: 2 },
  { label: "La ignoré por trabajo", nivel: 2 },
  { label: "Cancelé planes importantes", nivel: 3 },
  { label: "Mentí en algo", nivel: 4 },
  { label: "\"Solo es una amiga\"", nivel: 5 },
  { label: "Algo muy grave", nivel: 5 },
];

const NIVEL_INFO: Record<number, { label: string; color: string; sugerencia: string }> = {
  1: { label: "Error menor", color: "bg-green-100 text-green-800", sugerencia: "Una carta animada con las palabras correctas es más que suficiente." },
  2: { label: "Descuido", color: "bg-yellow-100 text-yellow-800", sugerencia: "Una carta o una estrella dedicada le dice que te importa sin que tengas que decirlo." },
  3: { label: "Falla real", color: "bg-orange-100 text-orange-800", sugerencia: "Un gesto digital sincero puede abrir la conversación. Empieza por ahí." },
  4: { label: "Error grave", color: "bg-red-100 text-red-800", sugerencia: "Necesitas algo que ella pueda guardar para siempre. Una estrella con su nombre dice más que las palabras." },
  5: { label: "Catástrofe", color: "bg-red-200 text-red-900", sugerencia: "Dedícale una estrella con un código secreto solo para ella. Es el gesto más sincero que puedes hacer hoy." },
};

type Paso = "inicio" | "analizando" | "resultado";

export default function RecomiendamePage() {
  const [paso, setPaso] = useState<Paso>("inicio");
  const [descripcion, setDescripcion] = useState("");
  const [nivelDetectado, setNivelDetectado] = useState<number>(3);
  const [comentarioIA, setComentarioIA] = useState<string | null>(null);

  const seleccionarCagada = (label: string, nivel: number) => {
    setDescripcion(label);
    analizarRapido(nivel);
  };

  const analizarRapido = (nivel: number) => {
    setComentarioIA(null);
    setPaso("analizando");
    setTimeout(() => {
      setNivelDetectado(nivel);
      setPaso("resultado");
    }, 1200);
  };

  const analizar = async () => {
    if (!descripcion.trim()) return;
    setComentarioIA(null);
    setPaso("analizando");
    try {
      const res = await fetch("/api/analizar-cagada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion }),
      });
      const data = await res.json();
      setNivelDetectado(data.nivel ?? 3);
      setComentarioIA(data.comentario ?? null);
    } catch {
      setNivelDetectado(3);
    }
    setPaso("resultado");
  };

  const reiniciar = () => {
    setPaso("inicio");
    setDescripcion("");
    setNivelDetectado(3);
    setComentarioIA(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar>
        {/* <Button variant="ghost" asChild><Link href="/explorar">Ver tiendas</Link></Button> */}
        <Button variant="ghost" asChild><Link href="/carta">💝 Carta</Link></Button>
        <Button variant="ghost" asChild><Link href="/estrella">✨ Estrella</Link></Button>
      </Navbar>

      <div className="mx-auto max-w-2xl px-6 pt-4">
        <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* PASO: inicio */}
        {paso === "inicio" && (
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">¿Qué fue lo que pasó?</h1>
            <p className="mb-8 text-muted-foreground">
              Cuéntanos o elige una opción. Sin juicios — todos hemos estado ahí.
            </p>

            {/* Opciones rápidas */}
            <div className="mb-6 flex flex-wrap gap-2">
              {CAGADAS_RAPIDAS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => seleccionarCagada(c.label, c.nivel)}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:bg-accent"
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mb-2 text-sm text-muted-foreground">O descríbelo con tus palabras:</div>
            <Textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Olvidé nuestro aniversario de 3 años y me enteré recién..."
              className="mb-4 min-h-[100px] resize-none"
            />
            <Button
              onClick={analizar}
              disabled={!descripcion.trim()}
              className="w-full"
              size="lg"
            >
              Analizar mi situación ✨
            </Button>
          </div>
        )}

        {/* PASO: analizando */}
        {paso === "analizando" && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-6 text-5xl animate-bounce">🤔</div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Analizando tu cagada...</h2>
            <p className="text-muted-foreground">Un momento, esto requiere delicadeza.</p>
          </div>
        )}

        {/* PASO: resultado */}
        {paso === "resultado" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Tu situación:</h2>

            {/* Nivel */}
            <div className="mb-6 rounded-2xl border border-border bg-muted/40 p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-3xl">🌡️</span>
                <div>
                  <div className="text-sm text-muted-foreground">Nivel de cagada</div>
                  <Badge className={`mt-1 ${NIVEL_INFO[nivelDetectado].color}`}>
                    {nivelDetectado}/5 — {NIVEL_INFO[nivelDetectado].label}
                  </Badge>
                </div>
              </div>

              {/* Barra de nivel */}
              <div className="mb-4 h-2 w-full rounded-full bg-border">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${(nivelDetectado / 5) * 100}%` }}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                {comentarioIA ?? NIVEL_INFO[nivelDetectado].sugerencia}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              {/* <Button size="lg" asChild>
                <Link href="/explorar">Ver tiendas recomendadas →</Link>
              </Button> */}
              <Button size="lg" asChild>
                <Link href="/estrella">Dedicarle una estrella ✨</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/carta">Enviarle una carta animada 💝</Link>
              </Button>
              <Button size="lg" variant="ghost" onClick={reiniciar}>
                Intentar de nuevo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
