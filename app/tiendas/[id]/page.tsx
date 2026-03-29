"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIAS } from "@/lib/data";
import { Tienda, Resena } from "@/types";
import FormularioResena from "./FormularioResena";
import { Navbar } from "@/components/Navbar";

function Estrellas({ valor, total }: { valor: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((e) => (
          <span key={e} className="text-xl">
            {e <= Math.round(valor) ? "⭐" : "☆"}
          </span>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {valor.toFixed(1)} · {total} {total === 1 ? "reseña" : "reseñas"}
      </span>
    </div>
  );
}

export default function TiendaPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [noEncontrada, setNoEncontrada] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const cargarResenas = useCallback(async (tiendaId: string) => {
    const res = await fetch(`/api/tiendas/${tiendaId}/resenas`);
    if (res.ok) setResenas(await res.json());
  }, []);

  useEffect(() => {
    if (!id) return;
    async function cargar() {
      const res = await fetch(`/api/tiendas/${id}`);
      if (!res.ok) { setNoEncontrada(true); setCargando(false); return; }
      setTienda(await res.json());
      await cargarResenas(id!);
      setCargando(false);
    }
    cargar();
  }, [id, cargarResenas]);

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground text-sm">
        Cargando...
      </div>
    );
  }

  if (noEncontrada || !tienda) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Tienda no encontrada.</p>
        <Link href="/explorar" className="text-primary underline text-sm">Volver a explorar</Link>
      </div>
    );
  }

  const cat = CATEGORIAS[tienda.categoria];
  const promedio = resenas.length > 0
    ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <Navbar maxWidth="max-w-3xl">
        <Button asChild><Link href="/recomiendame">Ayúdame a elegir ✨</Link></Button>
      </Navbar>

      <div className="mx-auto max-w-3xl px-6 pt-4">
        <Link href="/explorar" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">

        {/* Info principal */}
        <div>
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <span className="text-4xl">{cat?.emoji}</span>
              <h1 className="mt-2 text-3xl font-bold text-foreground">{tienda.nombre}</h1>
            </div>
            <Badge variant="secondary" className="mt-2 shrink-0">{tienda.comuna}</Badge>
          </div>

          {resenas.length > 0 && (
            <div className="mb-4">
              <Estrellas valor={promedio} total={resenas.length} />
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">{tienda.descripcion}</p>
        </div>

        {/* Botones de contacto */}
        <div className="flex flex-wrap gap-3">
          {tienda.whatsapp && (
            <a
              href={`https://wa.me/${tienda.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>WhatsApp</Button>
            </a>
          )}
          {tienda.instagram && (
            <a
              href={`https://instagram.com/${tienda.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Instagram</Button>
            </a>
          )}
          {tienda.web && (
            <a href={tienda.web} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Sitio web</Button>
            </a>
          )}
        </div>

        {/* Formulario de reseña */}
        <FormularioResena tiendaId={tienda.id} onNuevaResena={() => cargarResenas(tienda.id)} />

        {/* Reseñas */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Reseñas {resenas.length > 0 && `(${resenas.length})`}
          </h2>

          {resenas.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aún no hay reseñas. ¡Sé el primero!</p>
          ) : (
            <div className="space-y-4">
              {resenas.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-white p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {r.nombre_autor ?? "Anónimo"}
                      </span>
                      <span className="text-sm">
                        {"⭐".repeat(r.calificacion)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  {r.comentario && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
