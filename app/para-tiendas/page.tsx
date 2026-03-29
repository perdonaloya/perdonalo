"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CATEGORIAS, COMUNAS_SANTIAGO } from "@/lib/data";

function validarRUT(rut: string): boolean {
  const cleaned = rut.replace(/[.\-\s]/g, "").toUpperCase();
  if (cleaned.length < 2) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = sum % 11;
  const expected = remainder === 0 ? "0" : remainder === 1 ? "K" : String(11 - remainder);
  return dv === expected;
}

function formatearRUT(valor: string): string {
  const cleaned = valor.replace(/[^\dkK]/g, "").toUpperCase();
  if (cleaned.length === 0) return "";
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const bodyFormatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dv ? `${bodyFormatted}-${dv}` : bodyFormatted;
}

export default function ParaTiendasPage() {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    direccion: "",
    comuna: "",
    whatsapp: "",
    instagram: "",
    web: "",
    nombre_contacto: "",
    email_contacto: "",
    rut: "",
    horario: "",
  });
  const [delivery, setDelivery] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [veracidad, setVeracidad] = useState(false);
  const [rutTocado, setRutTocado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const rutEsValido = form.rut.length === 0 || validarRUT(form.rut);

  const handleRUT = (valor: string) => {
    set("rut", formatearRUT(valor));
  };

  const set = (campo: string, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const enviar = async () => {
    if (!form.nombre.trim() || !form.categoria || !form.direccion.trim() || !form.comuna) {
      setError("Nombre, categoría, dirección y comuna son obligatorios.");
      return;
    }
    if (!form.nombre_contacto.trim() || !form.email_contacto.trim()) {
      setError("Tu nombre y email de contacto son obligatorios.");
      return;
    }
    if (!form.rut.trim()) {
      setError("El RUT es obligatorio.");
      return;
    }
    if (!validarRUT(form.rut)) {
      setError("El RUT ingresado no es válido. Verifica el dígito verificador.");
      return;
    }
    if (!terminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }
    if (!veracidad) {
      setError("Debes declarar que la información es verídica.");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, delivery }),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
    } catch {
      setError("No se pudo enviar la solicitud. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar maxWidth="max-w-3xl" />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-4 text-5xl">🎉</span>
          <h1 className="mb-3 text-2xl font-bold text-foreground">¡Solicitud enviada!</h1>
          <p className="mb-8 text-muted-foreground">
            Revisaremos tu información y te contactaremos pronto. Gracias por querer ser parte de perdónalo.cl.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar maxWidth="max-w-3xl" />

      <div className="mx-auto max-w-3xl px-6 pt-4">
        <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <Badge className="mb-3 bg-accent text-accent-foreground hover:bg-accent">Para tiendas</Badge>
          <h1 className="mb-3 text-3xl font-bold text-foreground">
            Llega a más personas<br />
            <span className="text-primary">en el momento que más importa.</span>
          </h1>
          <p className="text-muted-foreground">
            Miles de personas buscan el regalo perfecto para reconciliarse o sorprender a alguien especial.
            Únete a perdónalo.cl y aparece cuando más te necesitan.
          </p>
        </div>

        {/* Formulario */}
        <div className="space-y-6">

          {/* Datos de la tienda */}
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Datos de tu tienda</h2>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Nombre de la tienda <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ej: Flores del Centro"
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Categoría <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORIAS).map(([key, { label, emoji }]) => (
                  <button
                    key={key}
                    onClick={() => set("categoria", key)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      form.categoria === key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-foreground hover:bg-muted"
                    }`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Descripción <span className="text-muted-foreground text-xs">(opcional)</span>
              </label>
              <Textarea
                placeholder="Cuéntanos qué ofreces y qué te hace especial..."
                value={form.descripcion}
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
                value={form.horario}
                onChange={(e) => set("horario", e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={delivery}
                  onChange={(e) => setDelivery(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-primary"
                />
                <span className="text-sm font-medium text-foreground">Ofrezco delivery</span>
              </label>
            </div>
          </div>

          {/* Ubicación */}
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Ubicación</h2>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Dirección <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ej: Ahumada 312, local 5"
                value={form.direccion}
                onChange={(e) => set("direccion", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Comuna <span className="text-destructive">*</span>
              </label>
              <select
                value={form.comuna}
                onChange={(e) => set("comuna", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Selecciona tu comuna</option>
                {COMUNAS_SANTIAGO.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contacto público */}
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-foreground">Contacto público</h2>
              <p className="text-sm text-muted-foreground">Estos datos se mostrarán a los clientes en tu perfil.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp</label>
              <Input
                placeholder="+56 9 1234 5678"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Instagram</label>
              <Input
                placeholder="@mitienda"
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Sitio web</label>
              <Input
                placeholder="https://mitienda.cl"
                value={form.web}
                onChange={(e) => set("web", e.target.value)}
              />
            </div>
          </div>

          {/* Contacto privado */}
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-foreground">Tu contacto</h2>
              <p className="text-sm text-muted-foreground">Solo para que podamos comunicarnos contigo. No se muestra públicamente.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Tu nombre"
                value={form.nombre_contacto}
                onChange={(e) => set("nombre_contacto", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={form.email_contacto}
                onChange={(e) => set("email_contacto", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                RUT de la empresa o persona <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ej: 12.345.678-9"
                value={form.rut}
                onChange={(e) => handleRUT(e.target.value)}
                onBlur={() => setRutTocado(true)}
                className={rutTocado && form.rut && !rutEsValido ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {rutTocado && form.rut && !rutEsValido && (
                <p className="mt-1 text-xs text-destructive">RUT inválido. Verifica el dígito verificador.</p>
              )}
              {rutTocado && form.rut && rutEsValido && (
                <p className="mt-1 text-xs text-green-600">✓ RUT válido</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Solo para verificar identidad. No se muestra públicamente.</p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={terminos}
                onChange={(e) => setTerminos(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                Acepto los{" "}
                <Link href="/terminos" target="_blank" className="underline underline-offset-4 text-foreground hover:text-primary transition-colors">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacidad" target="_blank" className="underline underline-offset-4 text-foreground hover:text-primary transition-colors">
                  política de privacidad
                </Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={veracidad}
                onChange={(e) => setVeracidad(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                Declaro que toda la información entregada es verídica y que tengo autorización para representar a este negocio.
              </span>
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={enviar} disabled={enviando || !terminos || !veracidad} size="lg" className="w-full">
            {enviando ? "Enviando..." : "Enviar solicitud"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Revisamos cada solicitud manualmente. Te contactaremos en menos de 48 horas.
          </p>
        </div>
      </div>
    </div>
  );
}
