"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { CATEGORIAS } from "@/lib/data";

interface TiendaEditable {
  id: string;
  nombre: string;
  categoria: string;
  comuna: string;
  descripcion: string;
  whatsapp: string;
  instagram: string;
  web: string;
  horario: string;
  delivery: boolean;
  direccion: string;
}

export default function EditarTiendaPage() {
  const { token } = useParams<{ token: string }>();
  const [tienda, setTienda] = useState<TiendaEditable | null>(null);
  const [form, setForm] = useState<Omit<TiendaEditable, "id" | "nombre" | "categoria" | "comuna"> | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tiendas/editar/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: TiendaEditable) => {
        setTienda(data);
        setForm({
          descripcion: data.descripcion ?? "",
          whatsapp: data.whatsapp ?? "",
          instagram: data.instagram ?? "",
          web: data.web ?? "",
          horario: data.horario ?? "",
          delivery: data.delivery ?? false,
          direccion: data.direccion ?? "",
        });
      })
      .catch(() => setError("Enlace inválido o expirado."))
      .finally(() => setCargando(false));
  }, [token]);

  const set = (campo: string, valor: string | boolean) =>
    setForm((prev) => prev ? { ...prev, [campo]: valor } : prev);

  const guardar = async () => {
    if (!form) return;
    setGuardando(true);
    setError("");
    setGuardado(false);
    try {
      const res = await fetch(`/api/tiendas/editar/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setGuardado(true);
    } catch {
      setError("No se pudieron guardar los cambios. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <Navbar maxWidth="max-w-2xl" />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted-foreground">
          Cargando...
        </div>
      </div>
    );
  }

  if (error && !tienda) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <Navbar maxWidth="max-w-2xl" />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">Enlace inválido o expirado</p>
          <p className="text-sm text-muted-foreground mb-8">
            Este enlace no corresponde a ninguna tienda. Si crees que es un error, contáctanos.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cat = tienda ? CATEGORIAS[tienda.categoria] : null;

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar maxWidth="max-w-2xl" />

      <div className="mx-auto max-w-2xl px-6 pt-4">
        <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Editando perfil de</p>
          <h1 className="text-2xl font-bold text-foreground">
            {cat?.emoji} {tienda?.nombre}
          </h1>
          <p className="text-sm text-muted-foreground">
            {cat?.label} · {tienda?.comuna}
          </p>
        </div>

        {guardado && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ Cambios guardados correctamente.
          </div>
        )}

        {/* Descripción y datos públicos */}
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Información pública</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Descripción <span className="text-muted-foreground text-xs">(opcional)</span>
            </label>
            <Textarea
              placeholder="Cuéntanos qué ofreces y qué te hace especial..."
              value={form?.descripcion ?? ""}
              onChange={(e) => set("descripcion", e.target.value)}
              className="min-h-[90px] resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Horario de atención <span className="text-muted-foreground text-xs">(opcional)</span>
            </label>
            <Input
              placeholder="Ej: Lun–Vie 10:00–19:00 · Sáb 10:00–14:00"
              value={form?.horario ?? ""}
              onChange={(e) => set("horario", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Dirección
            </label>
            <Input
              placeholder="Ej: Ahumada 312, local 5"
              value={form?.direccion ?? ""}
              onChange={(e) => set("direccion", e.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form?.delivery ?? false}
              onChange={(e) => set("delivery", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-primary"
            />
            <span className="text-sm font-medium text-foreground">Ofrezco delivery</span>
          </label>
        </div>

        {/* Contacto */}
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-foreground">Contacto público</h2>
            <p className="text-sm text-muted-foreground">Estos datos se muestran a los clientes en tu perfil.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp</label>
            <Input
              placeholder="+56 9 1234 5678"
              value={form?.whatsapp ?? ""}
              onChange={(e) => set("whatsapp", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Instagram</label>
            <Input
              placeholder="@mitienda"
              value={form?.instagram ?? ""}
              onChange={(e) => set("instagram", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Sitio web</label>
            <Input
              placeholder="https://mitienda.cl"
              value={form?.web ?? ""}
              onChange={(e) => set("web", e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={guardar} disabled={guardando} size="lg" className="w-full">
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Para cambios en nombre, categoría o comuna, contáctanos directamente.
        </p>
      </div>
    </div>
  );
}
