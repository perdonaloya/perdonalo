"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Props {
  tiendaId: string;
  onNuevaResena: () => void;
}

export default function FormularioResena({ tiendaId, onNuevaResena }: Props) {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [nombreAutor, setNombreAutor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const enviar = async () => {
    if (calificacion === 0) {
      setError("Selecciona una calificación.");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const res = await fetch(`/api/tiendas/${tiendaId}/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calificacion,
          comentario: comentario.trim() || null,
          nombre_autor: nombreAutor.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
      setCalificacion(0);
      setComentario("");
      setNombreAutor("");
      onNuevaResena();
    } catch {
      setError("No se pudo enviar la reseña. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center">
        <p className="text-lg font-semibold text-foreground">¡Gracias por tu reseña! 🙌</p>
        <button
          onClick={() => setEnviado(false)}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground underline"
        >
          Dejar otra reseña
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h3 className="mb-4 font-semibold text-foreground">Deja tu reseña</h3>

      {/* Estrellas */}
      <div className="mb-4">
        <p className="mb-2 text-sm text-muted-foreground">Calificación</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((estrella) => (
            <button
              key={estrella}
              onClick={() => setCalificacion(estrella)}
              onMouseEnter={() => setHover(estrella)}
              onMouseLeave={() => setHover(0)}
              className="text-3xl transition-transform hover:scale-110"
            >
              {estrella <= (hover || calificacion) ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre (opcional) */}
      <div className="mb-3">
        <Input
          placeholder="Tu nombre (opcional)"
          value={nombreAutor}
          onChange={(e) => setNombreAutor(e.target.value)}
        />
      </div>

      {/* Comentario */}
      <div className="mb-4">
        <Textarea
          placeholder="Cuéntanos tu experiencia..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="min-h-[90px] resize-none"
        />
      </div>

      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      <Button onClick={enviar} disabled={enviando || calificacion === 0} className="w-full">
        {enviando ? "Enviando..." : "Publicar reseña"}
      </Button>
    </div>
  );
}
