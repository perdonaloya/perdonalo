"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Estrella {
  id: string;
  para: string;
  de: string;
  nombre_estrella: string;
  codigo_secreto: string;
  pagada: boolean;
}

function PagoExitosoEstrellaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") ?? searchParams.get("external_reference");

  const [estrella, setEstrella] = useState<Estrella | null>(null);
  const [confirmando, setConfirmando] = useState(true);
  const [intentos, setIntentos] = useState(0);
  const [modo, setModo] = useState<"elegir" | "email" | "enviado">("elegir");
  const [emailDest, setEmailDest] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://perdonaloya.cl";
  const link = id ? `${baseUrl}/estrella/${id}` : "";

  const cargarEstrella = useCallback(async () => {
    if (!id) { router.push("/"); return; }
    try {
      const r = await fetch(`/api/estrellas/${id}`);
      if (!r.ok) { router.push("/"); return; }
      const data: Estrella = await r.json();
      setEstrella(data);
      setConfirmando(false);
    } catch {
      setIntentos((n) => n + 1);
    }
  }, [id, router]);

  useEffect(() => {
    if (!confirmando) return;
    if (intentos >= 3) { setConfirmando(false); return; }
    const t = setTimeout(cargarEstrella, intentos === 0 ? 0 : 1000);
    return () => clearTimeout(t);
  }, [intentos, confirmando, cargarEstrella]);

  const enviarEmail = async () => {
    if (!emailDest.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailDest)) {
      setError("Escribe un correo válido.");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/enviar-regalo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "estrella", id, email_destinatario: emailDest.trim() }),
      });
      if (!res.ok) throw new Error();
      setModo("enviado");
    } catch {
      setError("No se pudo enviar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const whatsappTexto = estrella
    ? encodeURIComponent(
        `✨ Te dediqué una estrella, ${estrella.para} ✨\n\nSe llama *${estrella.nombre_estrella}*\n\n🔑 Código secreto: *${estrella.codigo_secreto}*\n\n👉 ${link}`
      )
    : "";

  // Confirmando pago
  if (confirmando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(180deg, #0d0b2e 0%, #050618 60%)" }}>
        <div className="text-4xl animate-pulse">✨</div>
        <p className="text-white/70 text-sm">Confirmando tu pago...</p>
        <p className="text-white/30 text-xs">Esto puede tomar unos segundos</p>
      </div>
    );
  }

  // Pago no confirmado tras los intentos
  if (!estrella) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: "linear-gradient(180deg, #0d0b2e 0%, #050618 60%)" }}>
        <div className="text-4xl">⏳</div>
        <p className="text-white/70 text-sm text-center">Tu pago está siendo procesado.</p>
        <p className="text-white/40 text-xs text-center">Recibirás un correo en cuanto se confirme. Si no llega, contáctanos.</p>
        <Link href="/" className="mt-4 text-white/30 text-xs hover:text-white/60 transition-colors">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
      background: "linear-gradient(180deg, #0d0b2e 0%, #050618 60%)",
    }}>
      <div style={{ maxWidth: 480, width: "100%" }}>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-2xl font-bold text-white mb-2">¡Pago exitoso!</h1>
          <p className="text-white/50 text-sm">
            La estrella <strong className="text-white/80">{estrella.nombre_estrella}</strong> para{" "}
            <strong className="text-white/80">{estrella.para}</strong> está lista.
          </p>
        </div>

        <div className="mb-6 rounded-2xl p-5 text-center" style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Código secreto</p>
          <p className="text-white text-3xl font-bold tracking-widest mb-1" style={{ textShadow: "0 0 20px rgba(251,191,36,0.4)" }}>
            {estrella.codigo_secreto}
          </p>
          <p className="text-white/30 text-xs">Guárdalo — {estrella.para} lo necesita para revelar la estrella</p>
        </div>

        {modo === "elegir" && (
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/70 text-sm text-center mb-5">
              Envía el link y el código a <strong className="text-white/90">{estrella.para}</strong>
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=${whatsappTexto}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: "#25D366" }}
              >
                <span>💬</span> Enviar por WhatsApp
              </a>
              <button
                onClick={() => setModo("email")}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition-all hover:scale-105"
                style={{ background: "rgba(124,58,237,0.8)", color: "#fff", border: "1px solid rgba(167,139,250,0.3)" }}
              >
                <span>✉️</span> Enviar por correo
              </button>
            </div>
          </div>
        )}

        {modo === "email" && (
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/70 text-sm mb-4">
              Escribe el correo de <strong className="text-white/90">{estrella.para}</strong>
            </p>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={emailDest}
              onChange={(e) => { setEmailDest(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && enviarEmail()}
              className="w-full rounded-xl px-4 py-3 text-sm text-white mb-3 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => setModo("elegir")}
                className="flex-1 rounded-xl py-3 text-sm text-white/50 hover:text-white/80 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                ← Volver
              </button>
              <button
                onClick={enviarEmail}
                disabled={enviando}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
              >
                {enviando ? "Enviando..." : "Enviar ✨"}
              </button>
            </div>
          </div>
        )}

        {modo === "enviado" && (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white font-semibold mb-1">¡Correo enviado!</p>
            <p className="text-white/50 text-sm">
              {estrella.para} recibirá el link y el código secreto en su correo.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/estrella/${id}`}
            className="block text-center rounded-2xl py-3 text-sm text-white/60 transition-colors hover:text-white/90"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Ver la estrella →
          </Link>
          <Link
            href="/"
            className="block text-center text-sm text-white/30 hover:text-white/50 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PagoExitosoEstrella() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050618" }}>
        <p className="text-white/40 text-sm">Cargando...</p>
      </div>
    }>
      <PagoExitosoEstrellaContent />
    </Suspense>
  );
}
