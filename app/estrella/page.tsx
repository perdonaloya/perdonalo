"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import {
  ESTILOS_ESTRELLA,
  MUSICAS_ESTRELLA,
  FUENTES_ESTRELLA,
  COLORES_TEXTO,
  type EstiloEstrella,
  type MusicaEstrella,
  type FuenteEstrella,
  type ColorTexto,
} from "@/lib/estrella-config";
import { crearPreviewAudio } from "@/lib/estrella-audio";

const CODIGOS_PALABRAS = ["LUNA", "ROSA", "SOL", "MAR", "CIELO", "NOCHE", "BRISA", "FUEGO", "AURORA", "EDEN"];

/* ─── Modal de vista previa ─── */
function ModalVistaPrevia({
  estilo, fuente, color, nombreEstrella, para, de, mensaje, onClose,
}: {
  estilo: EstiloEstrella; fuente: FuenteEstrella; color: ColorTexto;
  nombreEstrella: string; para: string; de: string; mensaje: string;
  onClose: () => void;
}) {
  const e = ESTILOS_ESTRELLA[estilo];
  const f = FUENTES_ESTRELLA[fuente];
  const c = COLORES_TEXTO[color];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: `linear-gradient(to bottom, ${e.bgTint} 0%, #0a0a2e 60%, #0d0a1f 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: "4vh", paddingBottom: "40px", overflowY: "auto",
    }}>
      <style>{`
        @keyframes pvHalo { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.12)} }
        @keyframes pvSpike { 0%,100%{opacity:1} 50%{opacity:0.22} }
        @keyframes pvCore {
          0%,100%{transform:scale(1);box-shadow:${e.coreGlow}}
          50%{transform:scale(1.3);box-shadow:${e.coreGlowBig}}
        }
        @keyframes pvFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pvTw { 0%,100%{transform:scale(1)} 50%{transform:scale(0.4);opacity:0.04} }
      `}</style>

      {/* Campo de estrellas */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 80 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 37 + 13) % 100}%`, top: `${(i * 53 + 7) % 100}%`,
            width: `${0.5 + (i % 3) * 0.6}px`, height: `${0.5 + (i % 3) * 0.6}px`,
            borderRadius: "50%", background: i % 5 === 0 ? "#fff9ee" : "#dce8ff",
            opacity: 0.2 + (i % 5) * 0.1,
            animation: `pvTw ${2.5 + (i % 4)}s ease-in-out ${(i % 7) * 0.8}s infinite`,
          }} />
        ))}
      </div>

      {/* Botón cerrar */}
      <button onClick={onClose} style={{
        position: "fixed", top: "16px", right: "16px",
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: "50%", width: 38, height: 38, color: "rgba(255,255,255,0.65)",
        cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center",
        justifyContent: "center", zIndex: 10,
      }}>✕</button>

      {/* Etiqueta */}
      <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "10px", zIndex: 1 }}>
        Vista previa
      </p>

      {/* Estrella animada */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 220, height: 220, animation: "pvFloat 6s ease-in-out infinite", zIndex: 1 }}>
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${e.halo1} 0%, transparent 68%)`, animation: "pvHalo 4.5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 145, height: 145, borderRadius: "50%", background: `radial-gradient(circle, ${e.halo2} 0%, transparent 68%)`, animation: "pvHalo 4s ease-in-out 0.7s infinite" }} />
        <div style={{ position: "absolute", width: 78, height: 78, borderRadius: "50%", background: `radial-gradient(circle, ${e.halo3} 0%, transparent 68%)`, animation: "pvHalo 3s ease-in-out 0.3s infinite" }} />
        <div style={{ position: "absolute", width: 200, height: 1.5, background: `linear-gradient(to right, transparent, ${e.spikeColor.replace("0.95", "0.4")} 20%, ${e.spikeColor} 50%, ${e.spikeColor.replace("0.95", "0.4")} 80%, transparent)`, animation: "pvSpike 3.2s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 1.5, height: 200, background: `linear-gradient(to bottom, transparent, ${e.spikeColor.replace("0.95", "0.4")} 20%, ${e.spikeColor} 50%, ${e.spikeColor.replace("0.95", "0.4")} 80%, transparent)`, animation: "pvSpike 3.2s ease-in-out 0.5s infinite" }} />
        <div style={{ position: "absolute", width: 140, height: 1, background: `linear-gradient(to right, transparent, ${e.spikeColor.replace("0.95", "0.2")} 50%, transparent)`, transform: "rotate(45deg)", animation: "pvSpike 4s ease-in-out 1s infinite" }} />
        <div style={{ position: "absolute", width: 140, height: 1, background: `linear-gradient(to right, transparent, ${e.spikeColor.replace("0.95", "0.2")} 50%, transparent)`, transform: "rotate(-45deg)", animation: "pvSpike 4s ease-in-out 1.3s infinite" }} />
        <div style={{ position: "absolute", width: 15, height: 15, borderRadius: "50%", background: e.coreGradient, boxShadow: e.coreGlow, animation: "pvCore 2.8s ease-in-out infinite" }} />
      </div>

      {/* Dedicatoria */}
      <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px", textAlign: "center", fontFamily: f.fontFamily, zIndex: 1, marginTop: "8px" }}>
        <p style={{ color: "rgba(255,255,255,0.26)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: "8px" }}>Estrella</p>
        <h1 style={{ fontSize: "clamp(1.8rem, 7vw, 2.8rem)", fontWeight: fuente === "sans" ? 300 : 400, color: c.value, letterSpacing: fuente === "cursiva" ? "0.02em" : "0.04em", textShadow: `0 0 40px ${c.value.replace("0.90", "0.3")}`, lineHeight: 1.1, marginBottom: "8px" }}>
          {nombreEstrella || "Nombre de tu estrella"}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "20px" }}>
          Para <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{para || "…"}</span>
          {"  ·  "}de <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{de || "…"}</span>
        </p>
        <div style={{ borderRadius: "18px", padding: "20px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(14px)", marginBottom: "16px", maxHeight: "38vh", overflowY: "auto" }}>
          <p style={{ color: c.value, fontSize: fuente === "cursiva" ? "clamp(1rem, 2.8vw, 1.2rem)" : "clamp(0.875rem, 2.4vw, 1rem)", lineHeight: 1.8, fontWeight: fuente === "cursiva" ? 600 : 300, fontStyle: fuente === "serif" ? "italic" : "normal" }}>
            &ldquo;{mensaje || "Tu mensaje aparecerá aquí…"}&rdquo;
          </p>
        </div>
        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "11px" }}>
          Así verá tu estrella quien la reciba
        </p>
      </div>
    </div>
  );
}

/* ─── Mini preview visual de estrella ─── */
function MiniEstrellaVisual({ estilo }: { estilo: EstiloEstrella }) {
  const e = ESTILOS_ESTRELLA[estilo];
  return (
    <div
      className="mx-auto mb-2 flex items-center justify-center rounded-full"
      style={{ width: 44, height: 44, background: "linear-gradient(180deg, #010110 0%, #0a0a2e 100%)" }}
    >
      <span
        style={{
          fontSize: "24px",
          color: e.spikeColor,
          textShadow: `0 0 6px ${e.halo3}, 0 0 14px ${e.halo2}`,
          lineHeight: 1,
          display: "block",
        }}
      >
        ★
      </span>
    </div>
  );
}


function PreviewMusica({ tipo }: { tipo: MusicaEstrella }) {
  const [tocando, setTocando] = useState(false);
  const stopRef  = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      stopRef.current?.();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggle = () => {
    if (tocando) {
      stopRef.current?.();
      stopRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
      setTocando(false);
      return;
    }
    try {
      const stop = crearPreviewAudio(tipo);
      stopRef.current = stop;
      setTocando(true);
      timerRef.current = setTimeout(() => {
        stop();
        stopRef.current = null;
        setTocando(false);
      }, 5000);
    } catch { /* sin audio */ }
  };

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      className={`mt-1.5 w-full rounded-lg border px-2 py-1 text-xs transition-colors ${
        tocando
          ? "border-primary bg-primary/10 text-primary font-medium"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {tocando ? "■ Detener" : "▶ Escuchar"}
    </button>
  );
}

export default function EstrellaCrearPage() {
  const [para, setPara] = useState("");
  const [de, setDe] = useState("");
  const [nombreEstrella, setNombreEstrella] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [codigoSecreto, setCodigoSecreto] = useState("");
  const [emailComprador, setEmailComprador] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Configuración visual
  const [estilo, setEstilo] = useState<EstiloEstrella>("clasica");
  const [musica, setMusica] = useState<MusicaEstrella>("cosmica");
  const [fuente, setFuente] = useState<FuenteEstrella>("sans");
  const [color, setColor] = useState<ColorTexto>("dorado");

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

  const sugerirCodigo = () => {
    const palabra = CODIGOS_PALABRAS[Math.floor(Math.random() * CODIGOS_PALABRAS.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    setCodigoSecreto(`${palabra}${num}`);
  };

  const crear = async () => {
    if (!para.trim()) { setError("Escribe el nombre de quien lo recibe."); return; }
    if (!de.trim()) { setError("Escribe tu nombre."); return; }
    if (!nombreEstrella.trim()) { setError("Dale un nombre a tu estrella."); return; }
    if (!mensaje.trim()) { setError("Escribe tu mensaje."); return; }
    if (!codigoSecreto.trim()) { setError("Define un código secreto para tu estrella."); return; }
    if (!emailComprador.trim()) { setError("Escribe tu correo para recibir la confirmación."); return; }
    if (!terminos) { setError("Debes aceptar los términos y condiciones."); return; }

    setEnviando(true);
    setError("");
    try {
      const operacion_id = crypto.randomUUID();

      // 1. Crear la estrella
      const resEstrella = await fetch("/api/estrellas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          para,
          de,
          nombre_estrella: nombreEstrella,
          mensaje,
          codigo_secreto: codigoSecreto.trim().toUpperCase(),
          operacion_id,
          config: { estilo, musica, fuente, color },
          email_comprador: emailComprador.trim(),
        }),
      });
      if (!resEstrella.ok) {
        const errData = await resEstrella.json().catch(() => ({}));
        throw new Error(`crear_estrella: ${resEstrella.status} — ${JSON.stringify(errData)}`);
      }
      const { id: estrella_id } = await resEstrella.json();

      // 2. Iniciar el pago en Mercado Pago
      const resPago = await fetch("/api/pago/iniciar-estrella", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estrella_id, operacion_id }),
      });
      if (!resPago.ok) {
        const errData = await resPago.json().catch(() => ({}));
        throw new Error(`iniciar_pago: ${resPago.status} — ${JSON.stringify(errData)}`);
      }
      const { url } = await resPago.json();

      // 3. Redirigir al checkout de Mercado Pago
      window.location.href = url;
    } catch (err) {
      console.error("[crear estrella]", err);
      setError("No se pudo iniciar el pago. Intenta de nuevo.");
      setEnviando(false);
    }
  };

  const estiloActual = ESTILOS_ESTRELLA[estilo];

  return (
    <div className="min-h-screen bg-white pt-16">
      {showPreview && (
        <ModalVistaPrevia
          estilo={estilo} fuente={fuente} color={color}
          nombreEstrella={nombreEstrella} para={para} de={de} mensaje={mensaje}
          onClose={() => setShowPreview(false)}
        />
      )}
      <Navbar maxWidth="max-w-2xl" />

      <div className="mx-auto max-w-2xl px-6 pt-4">
        <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dedica una estrella ✨</h1>
          <p className="text-muted-foreground">
            Nombra una estrella en el firmamento digital y dedícala con un mensaje que durará para siempre.
          </p>
        </div>

        {/* Preview del cielo */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: `linear-gradient(to bottom, ${estiloActual.bgTint} 0%, #0a0a2e 60%, #0d0a1f 100%)`,
            height: "180px",
          }}
        >
          {[
            { x: 15, y: 20, s: 2 }, { x: 30, y: 50, s: 1.5 }, { x: 50, y: 15, s: 2.5 },
            { x: 65, y: 60, s: 1 }, { x: 80, y: 25, s: 2 }, { x: 90, y: 70, s: 1.5 },
            { x: 45, y: 75, s: 1 }, { x: 10, y: 75, s: 1.5 }, { x: 72, y: 45, s: 1 },
            { x: 25, y: 35, s: 1 }, { x: 58, y: 40, s: 2 }, { x: 85, y: 50, s: 1.5 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.s}px`,
                height: `${s.s}px`,
                opacity: 0.6 + (i % 3) * 0.15,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="text-4xl mb-1"
                style={{ filter: `drop-shadow(0 0 12px ${estiloActual.coreGlow.split(",")[0].replace("0 0 10px 5px ", "")})` }}
              >
                {estiloActual.emoji}
              </div>
              <p
                style={{
                  color: COLORES_TEXTO[color].value,
                  fontFamily: FUENTES_ESTRELLA[fuente].fontFamily,
                  fontSize: "14px",
                  opacity: 0.8,
                }}
              >
                {nombreEstrella || "El nombre de tu estrella"}
              </p>
            </div>
          </div>
        </div>

        {/* Personalización */}
        <div className="space-y-6">
          <h2 className="font-semibold text-foreground">Personaliza tu estrella</h2>

          {/* Estilo de estrella */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Tipo de estrella</p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(ESTILOS_ESTRELLA) as [EstiloEstrella, typeof ESTILOS_ESTRELLA[EstiloEstrella]][]).map(([key, e]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEstilo(key)}
                  className={`rounded-xl border p-3 text-center transition-all ${estilo === key ? "border-primary ring-2 ring-primary ring-offset-1" : "border-border hover:border-primary/50"}`}
                >
                  <MiniEstrellaVisual estilo={key} />
                  <p className="text-xs font-medium text-foreground">{e.label}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{e.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Música */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Ambiente musical</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.entries(MUSICAS_ESTRELLA) as [MusicaEstrella, typeof MUSICAS_ESTRELLA[MusicaEstrella]][]).map(([key, m]) => (
                <div
                  key={key}
                  onClick={() => setMusica(key)}
                  className={`flex flex-col rounded-xl border p-3 text-left transition-all cursor-pointer ${musica === key ? "border-primary ring-2 ring-primary ring-offset-1" : "border-border hover:border-primary/50"}`}
                >
                  <div className="text-xl mb-1">{m.emoji}</div>
                  <p className="text-xs font-medium text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5 grow">{m.desc}</p>
                  <PreviewMusica tipo={key} />
                </div>
              ))}
            </div>
          </div>

          {/* Tipografía */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Tipografía del mensaje</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(FUENTES_ESTRELLA) as [FuenteEstrella, typeof FUENTES_ESTRELLA[FuenteEstrella]][]).map(([key, f]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFuente(key)}
                  className={`rounded-xl border p-3 text-center transition-all ${fuente === key ? "border-primary ring-2 ring-primary ring-offset-1" : "border-border hover:border-primary/50"}`}
                >
                  <p
                    className="text-xl mb-1 font-medium"
                    style={{ fontFamily: f.fontFamily }}
                  >
                    {f.sample}
                  </p>
                  <p className="text-xs font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color del texto */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Color del mensaje</p>
            <div className="flex gap-3 flex-wrap">
              {(Object.entries(COLORES_TEXTO) as [ColorTexto, typeof COLORES_TEXTO[ColorTexto]][]).map(([key, c]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  title={c.label}
                  className={`flex flex-col items-center gap-1 transition-all`}
                >
                  <div
                    className={`w-9 h-9 rounded-full border-2 transition-all ${color === key ? "border-foreground scale-110" : "border-border hover:border-foreground/50"}`}
                    style={{ background: c.swatch }}
                  />
                  <span className={`text-xs ${color === key ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Para quién es <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Nombre de quien la recibe"
              value={para}
              onChange={(e) => setPara(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              De parte de <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Tu nombre"
              value={de}
              onChange={(e) => setDe(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Tu correo <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              placeholder="Para enviarte la confirmación de pago"
              value={emailComprador}
              onChange={(e) => setEmailComprador(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nombre de la estrella <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Ej: Estrella Camila, Alpha Valentina..."
              value={nombreEstrella}
              onChange={(e) => setNombreEstrella(e.target.value.slice(0, 50))}
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{nombreEstrella.length}/50</p>
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Código secreto <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Ej: ROSA2026, LUNA, AMOR..."
                value={codigoSecreto}
                onChange={(e) => setCodigoSecreto(e.target.value.slice(0, 20))}
                className="tracking-widest uppercase"
              />
              <button
                type="button"
                onClick={sugerirCodigo}
                className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Sugerir
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              La persona destinataria necesitará este código para ver la dedicatoria. Compártelo en privado.
            </p>
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
            <Link
              href="/terminos"
              target="_blank"
              className="underline underline-offset-4 text-foreground hover:text-primary transition-colors"
            >
              términos y condiciones
            </Link>{" "}
            y la{" "}
            <Link
              href="/privacidad"
              target="_blank"
              className="underline underline-offset-4 text-foreground hover:text-primary transition-colors"
            >
              política de privacidad
            </Link>
          </span>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="w-full rounded-2xl border border-border py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          👁 Ver cómo queda tu estrella
        </button>

        <div className="rounded-2xl border border-border bg-muted/30 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Precio</p>
            <p className="text-2xl font-bold text-foreground">
              $2.990 <span className="text-sm font-normal text-muted-foreground">CLP</span>
            </p>
          </div>
          <Button onClick={crear} disabled={enviando || !terminos} size="lg">
            {enviando ? "Creando..." : "Dedicar estrella →"}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          El enlace es único y se puede compartir por WhatsApp, Instagram o como quieras.
        </p>
      </div>
    </div>
  );
}
