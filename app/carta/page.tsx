"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TEMAS, TemaKey } from "@/lib/temas";
import Rosa from "./[id]/temas/Rosa";
import BuenosDias from "./[id]/temas/BuenosDias";
import CartaSecreta from "./[id]/temas/CartaSecreta";
import Mariposas from "./[id]/temas/Mariposas";
import Petals from "./[id]/temas/Petals";
import Cumpleanos from "./[id]/temas/Cumpleanos";

const PREVIEW = {
  para: "Camila",
  de: "Tú",
  mensaje: "Este es un ejemplo de cómo se verá tu carta animada. Aquí irá tu mensaje personalizado.",
};

function TemaPreviewContent({ tema }: { tema: TemaKey }) {
  switch (tema) {
    case "rosa": return <Rosa {...PREVIEW} />;
    case "buenos-dias": return <BuenosDias {...PREVIEW} />;
    case "carta": return <CartaSecreta {...PREVIEW} />;
    case "mariposas": return <Mariposas {...PREVIEW} />;
    case "petals": return <Petals {...PREVIEW} />;
    case "cumpleanos": return <Cumpleanos {...PREVIEW} />;
  }
}

function PreviewModal({ tema, onCerrar, onUsar }: { tema: TemaKey; onCerrar: () => void; onUsar: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0">
        <TemaPreviewContent tema={tema} />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 pointer-events-auto">
          <span className="rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs text-white font-medium">
            Vista previa
          </span>
        </div>
        <div className="absolute top-4 right-4 pointer-events-auto">
          <button
            onClick={onCerrar}
            className="rounded-full bg-black/50 backdrop-blur-sm px-4 py-2 text-sm text-white font-medium hover:bg-black/70 transition-all"
          >
            ✕ Cerrar
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button
            onClick={onUsar}
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-2xl hover:scale-105 transition-all"
          >
            Usar este diseño →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartaPage() {
  const [tema, setTema] = useState<TemaKey | "">("");
  const [preview, setPreview] = useState<TemaKey | null>(null);
  const [para, setPara] = useState("");
  const [de, setDe] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Escritura guiada con IA
  const [modoGuiado, setModoGuiado] = useState(false);
  const [situacion, setSituacion] = useState("");
  const [generando, setGenerando] = useState(false);
  const [errorIA, setErrorIA] = useState("");

  const armarMensaje = async () => {
    if (!situacion.trim()) return;
    setGenerando(true);
    setErrorIA("");
    try {
      const res = await fetch("/api/generar-mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situacion }),
      });
      const data = await res.json();
      if (data.mensaje) {
        setMensaje(data.mensaje.slice(0, 280));
        setModoGuiado(false);
      } else {
        setErrorIA("No se pudo generar el mensaje. Intenta de nuevo.");
      }
    } catch {
      setErrorIA("No se pudo generar el mensaje. Intenta de nuevo.");
    } finally {
      setGenerando(false);
    }
  };

  const crear = async () => {
    if (!tema) { setError("Elige un diseño para tu regalo."); return; }
    if (!para.trim()) { setError("Escribe el nombre de quien lo recibe."); return; }
    if (!de.trim()) { setError("Escribe tu nombre."); return; }
    if (!mensaje.trim()) { setError("Escribe tu mensaje."); return; }
    if (!terminos) { setError("Debes aceptar los términos y condiciones."); return; }

    setEnviando(true);
    setError("");
    try {
      const operacion_id = crypto.randomUUID();

      // 1. Crear la carta (queda como pagada: false)
      const resCarta = await fetch("/api/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ para, de, mensaje, tema, operacion_id }),
      });
      if (!resCarta.ok) throw new Error();
      const { id: carta_id } = await resCarta.json();

      // 2. Iniciar el pago en Webpay
      const resPago = await fetch("/api/pago/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carta_id, operacion_id }),
      });
      if (!resPago.ok) throw new Error();
      const { url, token } = await resPago.json();

      // 3. Redirigir a Webpay (formulario POST requerido por Transbank)
      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "token_ws";
      input.value = token;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch {
      setError("No se pudo iniciar el pago. Intenta de nuevo.");
      setEnviando(false);
    }
  };

  return (
    <>
      {preview && (
        <PreviewModal
          tema={preview}
          onCerrar={() => setPreview(null)}
          onUsar={() => { setTema(preview); setPreview(null); }}
        />
      )}

      <div className="min-h-screen bg-white">
        <Navbar maxWidth="max-w-2xl" />

        <div className="mx-auto max-w-2xl px-6 pt-4">
          <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
        </div>

        <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Crea tu regalo digital 💝</h1>
            <p className="text-muted-foreground">Un mensaje animado y personalizado que pueden guardar para siempre.</p>
          </div>

          {/* Selector de tema */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Elige un diseño</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(Object.entries(TEMAS) as [TemaKey, typeof TEMAS[TemaKey]][]).map(([key, t]) => (
                <div key={key} className={`rounded-2xl p-4 transition-all ${tema === key ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                  <button
                    onClick={() => setTema(key)}
                    className="w-full text-left"
                  >
                    <div className={`rounded-xl bg-gradient-to-br ${t.preview} p-4 text-center mb-2`}>
                      <span className="text-4xl">{t.emoji}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{t.nombre}</p>
                    <p className="text-xs text-muted-foreground mb-2">{t.ocasion}</p>
                  </button>
                  <button
                    onClick={() => setPreview(key)}
                    className="w-full text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                  >
                    Ver preview
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Campos */}
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Para quién es <span className="text-destructive">*</span>
              </label>
              <Input placeholder="Nombre de quien lo recibe" value={para} onChange={(e) => setPara(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                De parte de <span className="text-destructive">*</span>
              </label>
              <Input placeholder="Tu nombre" value={de} onChange={(e) => setDe(e.target.value)} />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Tu mensaje <span className="text-destructive">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setModoGuiado((v) => !v)}
                  className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  {modoGuiado ? "Escribir yo mismo" : "¿No sabes qué escribir? Te ayudo →"}
                </button>
              </div>

              {modoGuiado ? (
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">Cuéntanos qué pasó y la IA escribe el mensaje por ti. Luego puedes editarlo.</p>
                  <textarea
                    value={situacion}
                    onChange={(e) => setSituacion(e.target.value)}
                    placeholder="Ej: olvidé nuestro aniversario de 2 años y me enteré tarde, ella se fue sin decirme nada..."
                    rows={4}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  {errorIA && <p className="text-xs text-destructive">{errorIA}</p>}
                  <button
                    type="button"
                    onClick={armarMensaje}
                    disabled={generando || !situacion.trim()}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {generando ? "Generando mensaje..." : "Generar mensaje con IA →"}
                  </button>
                </div>
              ) : (
                <>
                  <Textarea
                    placeholder="Escribe lo que sientes..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value.slice(0, 280))}
                    className="min-h-[100px] resize-none"
                  />
                  <p className="mt-1 text-right text-xs text-muted-foreground">{mensaje.length}/280</p>
                </>
              )}
            </div>
          </div>

          {/* T&C */}
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

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="rounded-2xl border border-border bg-muted/30 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Precio</p>
              <p className="text-2xl font-bold text-foreground">$1.990 <span className="text-sm font-normal text-muted-foreground">CLP</span></p>
            </div>
            <Button onClick={crear} disabled={enviando || !terminos} size="lg">
              {enviando ? "Creando..." : "Crear regalo →"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            El enlace es único y se puede compartir por WhatsApp, Instagram o como quieras.
          </p>
        </div>
      </div>
    </>
  );
}
