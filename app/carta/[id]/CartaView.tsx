"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Carta } from "@/types";
import Rosa from "./temas/Rosa";
import BuenosDias from "./temas/BuenosDias";
import CartaSecreta from "./temas/CartaSecreta";
import Mariposas from "./temas/Mariposas";
import Petals from "./temas/Petals";
import Cumpleanos from "./temas/Cumpleanos";

function ShareButton({ id }: { id: string }) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [capturando, setCapturando] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : `https://perdonaloya.cl/carta/${id}`;
  const texto = encodeURIComponent(`Te envié un regalo especial 💝 ${url}`);

  const copiar = async () => {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => { setCopiado(false); setAbierto(false); }, 2000);
  };

  const compartirHistoria = async () => {
    setCapturando(true);
    try {
      const html2canvas = (await import("html2canvas")).default;

      // captura la pantalla completa
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // agrega watermark en esquina inferior
      const ctx = canvas.getContext("2d")!;
      const fw = canvas.width;
      const fh = canvas.height;

      // franja inferior semitransparente
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.fillRect(0, fh - Math.round(fh * 0.13), fw, Math.round(fh * 0.13));

      // botón "Ver animación" dibujado
      const btnW = Math.round(fw * 0.52);
      const btnH = Math.round(fh * 0.052);
      const btnX = (fw - btnW) / 2;
      const btnY = fh - Math.round(fh * 0.095);
      const r = btnH / 2;
      ctx.beginPath();
      ctx.moveTo(btnX + r, btnY);
      ctx.lineTo(btnX + btnW - r, btnY);
      ctx.arcTo(btnX + btnW, btnY, btnX + btnW, btnY + btnH, r);
      ctx.lineTo(btnX + r, btnY + btnH);
      ctx.arcTo(btnX, btnY + btnH, btnX, btnY, r);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fill();

      const btnFs = Math.round(fw * 0.032);
      ctx.font = `bold ${btnFs}px sans-serif`;
      ctx.fillStyle = "#1a1a2e";
      ctx.textAlign = "center";
      ctx.fillText("✨ Ver animación completa", fw / 2, btnY + btnH * 0.66);

      // marca
      ctx.font = `${Math.round(btnFs * 0.75)}px sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.60)";
      ctx.fillText("perdonaloya.cl", fw / 2, fh - Math.round(fh * 0.018));

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "perdonaloya.jpg", { type: "image/jpeg" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Un regalo especial para ti 💝",
            text: `✨ Ve la animación completa en perdonaloya.cl 👉 ${url}`,
          });
        } else {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "perdonaloya.jpg";
          a.click();
        }
      }, "image/jpeg", 0.92);
    } catch (e) {
      console.error(e);
    } finally {
      setCapturando(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      {abierto && (
        <div className="flex flex-col gap-2 items-center">
          <button
            onClick={compartirHistoria}
            disabled={capturando}
            className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <span>📸</span> {capturando ? "Capturando..." : "Compartir en Historias"}
          </button>
          <a
            href={`https://wa.me/?text=${texto}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>💬</span> WhatsApp
          </a>
          <button
            onClick={copiar}
            className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>{copiado ? "✅" : "🔗"}</span>
            {copiado ? "¡Copiado!" : "Copiar link"}
          </button>
        </div>
      )}
      <button
        onClick={() => setAbierto((v) => !v)}
        className="rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-gray-800 shadow-xl hover:bg-white transition-all hover:scale-105 flex items-center gap-2"
      >
        <span>{abierto ? "✕" : "📤"}</span>
        <span>{abierto ? "Cerrar" : "Compartir este regalo"}</span>
      </button>
    </div>
  );
}

function TemaComponent({ carta }: { carta: Carta }) {
  const props = { para: carta.para, de: carta.de, mensaje: carta.mensaje };
  switch (carta.tema) {
    case "rosa": return <Rosa {...props} />;
    case "buenos-dias": return <BuenosDias {...props} />;
    case "carta": return <CartaSecreta {...props} />;
    case "mariposas": return <Mariposas {...props} />;
    case "petals": return <Petals {...props} />;
    case "cumpleanos": return <Cumpleanos {...props} />;
    default: return <Rosa {...props} />;
  }
}

export default function CartaView() {
  const { id } = useParams<{ id: string }>();
  const [carta, setCarta] = useState<Carta | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/cartas/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setCarta(data))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <p className="text-5xl mb-4">😔</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Regalo no encontrado</h1>
          <p className="text-gray-500 text-sm">Este enlace no existe o ya expiró.</p>
        </div>
      </div>
    );
  }

  if (!carta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-5xl mb-4 animate-pulse">💝</p>
          <p className="text-gray-500 text-sm">Cargando tu regalo...</p>
        </div>
      </div>
    );
  }

  if (!carta.pagada) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <p className="text-5xl mb-4">⏳</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Pago pendiente</h1>
          <p className="text-gray-500 text-sm">Este regalo aún no ha sido pagado.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TemaComponent carta={carta} />
      <ShareButton id={id} />
    </>
  );
}
