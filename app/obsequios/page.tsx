"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIAS } from "@/lib/data";
import { Tienda } from "@/types";
import { Navbar } from "@/components/Navbar";

const OCASIONES = [
  { emoji: "💕", titulo: "Sin motivo", descripcion: "Porque sí. Porque la quieres. No se necesita más." },
  { emoji: "🎂", titulo: "Su cumpleaños", descripcion: "El día más importante del año para ella." },
  { emoji: "💼", titulo: "Logro importante", descripcion: "Celebra sus éxitos con un gesto especial." },
  { emoji: "🌧️", titulo: "Tuvo un mal día", descripcion: "A veces lo único que necesita es saber que estás ahí." },
  { emoji: "🌟", titulo: "Solo para alegrarla", descripcion: "A veces un detalle cambia el día completo." },
];

export default function ObsequiosPage() {
  const router = useRouter();
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/tiendas")
      .then((r) => r.json())
      .then((data) => setTiendas(data))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar>
        <Button asChild><Link href="/recomiendame">¿La cagaste?</Link></Button>
      </Navbar>

      <div className="mx-auto max-w-5xl px-6 pt-4">
        <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
      </div>

      <section className="px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">Porque sí</Badge>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground">
            No hace falta haberla cagado<br />
            <span className="text-primary">para darle un regalo.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            A veces simplemente quieres sorprenderla. Encuentra el detalle perfecto
            para cualquier ocasión — o sin ocasión.
          </p>
        </div>
      </section>

      <section className="bg-muted/40 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-xl font-semibold text-foreground">¿Cuál es la ocasión?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OCASIONES.map((o) => (
              <div key={o.titulo} className="flex flex-col items-center rounded-2xl border border-border bg-white p-5 text-center shadow-sm">
                <span className="mb-3 text-3xl">{o.emoji}</span>
                <h3 className="mb-1 font-semibold text-foreground">{o.titulo}</h3>
                <p className="text-sm text-muted-foreground">{o.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">Tiendas disponibles</h2>
          <p className="mb-8 text-muted-foreground">Las mismas tiendas, otro propósito. Igual de especial.</p>

          {cargando ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : tiendas.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Pronto habrá tiendas disponibles.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tiendas.map((tienda) => {
                const cat = CATEGORIAS[tienda.categoria];
                return (
                  <div
                    key={tienda.id}
                    onClick={() => router.push(`/tiendas/${tienda.id}`)}
                    className={`flex flex-col rounded-2xl border p-5 shadow-sm cursor-pointer transition-shadow hover:shadow-md ${
                      tienda.plan === "pro" ? "border-primary/40 bg-primary/5" : "border-border bg-white"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <span className="text-2xl">{cat?.emoji}</span>
                        <h3 className="mt-1 font-semibold text-foreground">{tienda.nombre}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {tienda.plan === "pro" && <Badge className="text-xs">Destacado ⭐</Badge>}
                        <Badge variant="secondary" className="text-xs">{tienda.comuna}</Badge>
                      </div>
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{tienda.descripcion}</p>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {tienda.whatsapp && (
                        <a href={`https://wa.me/${tienda.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button size="sm" className="w-full">WhatsApp</Button>
                        </a>
                      )}
                      {tienda.instagram && (
                        <a href={`https://instagram.com/${tienda.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">Instagram</Button>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
