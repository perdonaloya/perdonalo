"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Carta {
  id: string;
  para: string;
  de: string;
  pagada: boolean;
}

function PagoExitosoCartaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") ?? searchParams.get("external_reference");

  const [carta, setCarta] = useState<Carta | null>(null);
  const [confirmando, setConfirmando] = useState(true);
  const [intentos, setIntentos] = useState(0);
  const [modo, setModo] = useState<"elegir" | "email" | "enviado">("elegir");
  const [emailDest, setEmailDest] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://perdonaloya.cl";
  const link = id ? `${baseUrl}/carta/${id}` : "";

  const cargarCarta = useCallback(async () => {
    if (!id) { router.push("/"); return; }
    try {
      const r = await fetch(`/api/cartas/${id}`);
      if (!r.ok) { router.push("/"); return; }
      const data: Carta = await r.json();
      setCarta(data);
      setConfirmando(false);
    } catch {
      setIntentos((n) => n + 1);
    }
  }, [id, router]);

  useEffect(() => {
    if (!confirmando) return;
    if (intentos >= 3) { setConfirmando(false); return; }
    const t = setTimeout(cargarCarta, intentos === 0 ? 0 : 1000);
    return () => clearTimeout(t);
  }, [intentos, confirmando, cargarCarta]);

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
        body: JSON.stringify({ tipo: "carta", id, email_destinatario: emailDest.trim() }),
      });
      if (!res.ok) throw new Error();
      setModo("enviado");
    } catch {
      setError("No se pudo enviar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const whatsappTexto = carta
    ? encodeURIComponent(`💝 Te envié una carta especial, ${carta.para} 💝\n\n👉 ${link}`)
    : "";

  if (confirmando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(180deg, #fff5f7 0%, #fff 60%)" }}>
        <div className="text-4xl animate-pulse">💝</div>
        <p className="text-rose-400 text-sm">Confirmando tu pago...</p>
        <p className="text-gray-300 text-xs">Esto puede tomar unos segundos</p>
      </div>
    );
  }

  if (!carta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: "linear-gradient(180deg, #fff5f7 0%, #fff 60%)" }}>
        <div className="text-4xl">⏳</div>
        <p className="text-gray-600 text-sm text-center">Tu pago está siendo procesado.</p>
        <p className="text-gray-400 text-xs text-center">Recibirás un correo en cuanto se confirme. Si no llega, contáctanos.</p>
        <Link href="/" className="mt-4 text-gray-300 text-xs hover:text-gray-500 transition-colors">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
      background: "linear-gradient(180deg, #fff5f7 0%, #fff 60%)",
    }}>
      <div style={{ maxWidth: 480, width: "100%" }}>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💝</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago exitoso!</h1>
          <p className="text-gray-500 text-sm">
            La carta para <strong className="text-gray-700">{carta.para}</strong> está lista.
          </p>
        </div>

        {modo === "elegir" && (
          <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #fce7f3", boxShadow: "0 2px 16px rgba(244,63,94,0.07)" }}>
            <p className="text-gray-500 text-sm text-center mb-5">
              Envía el link a <strong className="text-gray-700">{carta.para}</strong>
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
                style={{ background: "linear-gradient(135deg,#f43f5e,#fb7185)", color: "#fff" }}
              >
                <span>✉️</span> Enviar por correo
              </button>
            </div>
          </div>
        )}

        {modo === "email" && (
          <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #fce7f3", boxShadow: "0 2px 16px rgba(244,63,94,0.07)" }}>
            <p className="text-gray-500 text-sm mb-4">
              Escribe el correo de <strong className="text-gray-700">{carta.para}</strong>
            </p>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={emailDest}
              onChange={(e) => { setEmailDest(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && enviarEmail()}
              className="w-full rounded-xl px-4 py-3 text-sm text-gray-800 mb-3 outline-none"
              style={{ background: "#fdf2f8", border: "1px solid #fce7f3" }}
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => setModo("elegir")}
                className="flex-1 rounded-xl py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                style={{ border: "1px solid #fce7f3" }}
              >
                ← Volver
              </button>
              <button
                onClick={enviarEmail}
                disabled={enviando}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#f43f5e,#fb7185)" }}
              >
                {enviando ? "Enviando..." : "Enviar 💝"}
              </button>
            </div>
          </div>
        )}

        {modo === "enviado" && (
          <div className="rounded-2xl p-6 text-center" style={{ background: "#fff", border: "1px solid #fce7f3", boxShadow: "0 2px 16px rgba(244,63,94,0.07)" }}>
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-gray-800 font-semibold mb-1">¡Correo enviado!</p>
            <p className="text-gray-400 text-sm">
              {carta.para} recibirá el link de la carta en su correo.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/carta/${id}`}
            className="block text-center rounded-2xl py-3 text-sm text-gray-500 transition-colors hover:text-gray-700"
            style={{ border: "1px solid #fce7f3" }}
          >
            Ver la carta →
          </Link>
          <Link
            href="/"
            className="block text-center text-sm text-gray-300 hover:text-gray-500 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PagoExitosoCarta() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fff5f7" }}>
        <p className="text-rose-300 text-sm">Cargando...</p>
      </div>
    }>
      <PagoExitosoCartaContent />
    </Suspense>
  );
}
