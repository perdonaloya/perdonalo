"use client";

import { useState, useEffect, useRef, useMemo } from "react";

const DEMO_ID = "demo-preview-firmament-2026";
const CODIGO_CORRECTO = "LUNA";

function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + index.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
}

/* ─── Sonido ambiental cósmico ─── */
function useCosmicAmbient() {
  const ctxRef = useRef<AudioContext | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      try {
        type WW = Window & { webkitAudioContext?: typeof AudioContext };
        const Ctx = window.AudioContext ?? (window as WW).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        ctxRef.current = ctx;

        const master = ctx.createGain();
        master.gain.setValueAtTime(0, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.038, ctx.currentTime + 5);
        master.connect(ctx.destination);

        // Pad cósmico: osciladores ligeramente desafinados entre sí para crear beating
        [
          { f: 55,    v: 0.30 }, // A1 - bajo profundo
          { f: 110,   v: 0.22 }, // A2
          { f: 110.4, v: 0.18 }, // A2 detuned → beating lento
          { f: 165,   v: 0.13 }, // E3 - quinta
          { f: 220,   v: 0.10 }, // A3
          { f: 220.5, v: 0.08 }, // A3 detuned
          { f: 329.6, v: 0.05 }, // E4 - color harmónico
          { f: 440,   v: 0.03 }, // A4 - cima etérea
          { f: 440.7, v: 0.02 }, // A4 detuned shimmer
        ].forEach(({ f, v }) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          g.gain.setValueAtTime(v, ctx.currentTime);
          osc.connect(g);
          g.connect(master);
          osc.start();
        });

        // LFO lento → efecto respiración
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.frequency.setValueAtTime(0.07, ctx.currentTime);
        lfoG.gain.setValueAtTime(0.014, ctx.currentTime);
        lfo.connect(lfoG);
        lfoG.connect(master.gain);
        lfo.start();

        // Segundo LFO con ritmo diferente → movimiento orgánico
        const lfo2 = ctx.createOscillator();
        const lfoG2 = ctx.createGain();
        lfo2.frequency.setValueAtTime(0.11, ctx.currentTime);
        lfoG2.gain.setValueAtTime(0.009, ctx.currentTime);
        lfo2.connect(lfoG2);
        lfoG2.connect(master.gain);
        lfo2.start();
      } catch { /* audio no disponible */ }
    };

    window.addEventListener("click", start, { once: true });
    window.addEventListener("touchstart", start, { once: true });
    return () => {
      window.removeEventListener("click", start);
      window.removeEventListener("touchstart", start);
      ctxRef.current?.close();
    };
  }, []);
}

/* ─── Sonido de reveal ─── */
function playRevealSound() {
  try {
    type WW = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctx = window.AudioContext ?? (window as WW).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.connect(ctx.destination);

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const t = ctx.currentTime + i * 0.18;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 3.2);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 3.2);
    });
    [2093, 2637].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const t = ctx.currentTime + 0.5 + i * 0.14;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.02, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 2.2);
    });
  } catch { /* sin audio */ }
}

/* ─── Campo de estrellas ─── */
function StarField() {
  const stars = useMemo(() => Array.from({ length: 170 }, (_, i) => ({
    x: seededRandom(DEMO_ID, i * 3) * 100,
    y: seededRandom(DEMO_ID, i * 3 + 1) * 100,
    size: 0.4 + seededRandom(DEMO_ID, i * 3 + 2) * 1.8,
    delay: seededRandom(DEMO_ID, i * 7) * 7,
    duration: 2.5 + seededRandom(DEMO_ID, i * 11) * 4,
    opacity: 0.18 + seededRandom(DEMO_ID, i * 13) * 0.62,
    warm: seededRandom(DEMO_ID, i * 17) > 0.6,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          opacity: s.opacity,
          background: s.warm ? "#fff9ee" : "#dce8ff",
          animation: `tw ${s.duration}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── Luna romántica ─── */
function Luna() {
  return (
    <div className="absolute pointer-events-none" style={{ top: "5%", right: "6%", animation: "moonFloat 9s ease-in-out infinite" }}>
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none" overflow="visible">
        <defs>
          <mask id="c">
            <rect width="88" height="88" fill="white" />
            <circle cx="57" cy="36" r="28" fill="black" />
          </mask>
          <radialGradient id="mg" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fffef0" />
            <stop offset="55%" stopColor="#fff5c0" />
            <stop offset="100%" stopColor="#f0d97a" stopOpacity="0.9" />
          </radialGradient>
          <filter id="mglow"><feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="38" cy="44" r="44" fill="rgba(255,245,180,0.025)" />
        <circle cx="38" cy="44" r="36" fill="rgba(255,245,180,0.04)" />
        <circle cx="38" cy="44" r="26" fill="url(#mg)" mask="url(#c)" filter="url(#mglow)" />
        <ellipse cx="30" cy="44" rx="5" ry="3.5" fill="rgba(180,155,70,0.18)" mask="url(#c)" />
        <circle cx="36" cy="54" r="3.5" fill="rgba(180,155,70,0.13)" mask="url(#c)" />
        <circle cx="28" cy="38" r="2.5" fill="rgba(180,155,70,0.1)" mask="url(#c)" />
        <circle cx="38" cy="44" r="26" stroke="rgba(255,248,190,0.3)" strokeWidth="0.8" fill="none" mask="url(#c)" />
        <circle cx="9"  cy="18" r="1.2" fill="rgba(255,255,255,0.5)" />
        <circle cx="17" cy="7"  r="0.9" fill="rgba(255,255,255,0.4)" />
        <circle cx="72" cy="69" r="1"   fill="rgba(255,255,255,0.4)" />
        <circle cx="80" cy="57" r="0.7" fill="rgba(255,255,255,0.35)" />
      </svg>
    </div>
  );
}

/* ─── Cometa ─── */
function Cometa({ top, left, delay, length = 100, angle = -30 }: {
  top: string; left: string; delay: number; length?: number; angle?: number;
}) {
  return (
    <div className="absolute pointer-events-none" style={{
      top, left, width: `${length}px`, height: "1.5px", borderRadius: "2px",
      background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.9) 80%, white 100%)",
      transform: `rotate(${angle}deg)`, transformOrigin: "right center",
      animation: `comet 9s ease-in ${delay}s infinite`, opacity: 0,
    }}>
      <div style={{ position: "absolute", right: -1, top: "50%", transform: "translateY(-50%)", width: "3.5px", height: "3.5px", borderRadius: "50%", background: "white", boxShadow: "0 0 5px 2px rgba(255,255,255,0.8)" }} />
    </div>
  );
}

/* ─── Estrella protagonista ─── */
function EstrellaCentral({ dim, brightening }: { dim: boolean; brightening: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{
      width: 220, height: 220,
      transition: "opacity 1.6s ease, filter 1.6s ease",
      opacity: dim ? 0.25 : 1,
      filter: dim ? "blur(2px) saturate(0.3)" : "blur(0) saturate(1)",
      animation: brightening ? "starBright 1.5s ease forwards" : "float 6s ease-in-out infinite",
    }}>
      <div className="absolute rounded-full" style={{ width: 220, height: 220, background: "radial-gradient(circle, rgba(255,225,110,0.08) 0%, transparent 68%)", animation: "halo 4.5s ease-in-out infinite" }} />
      <div className="absolute rounded-full" style={{ width: 145, height: 145, background: "radial-gradient(circle, rgba(255,215,80,0.14) 0%, transparent 68%)", animation: "halo 4s ease-in-out 0.7s infinite" }} />
      <div className="absolute rounded-full" style={{ width: 78, height: 78, background: "radial-gradient(circle, rgba(255,235,150,0.24) 0%, transparent 68%)", animation: "halo 3s ease-in-out 0.3s infinite" }} />
      <div className="absolute" style={{ width: 200, height: 1.5, background: "linear-gradient(to right, transparent, rgba(255,228,110,0.4) 20%, rgba(255,245,180,0.95) 50%, rgba(255,228,110,0.4) 80%, transparent)", animation: "spike 3.2s ease-in-out infinite" }} />
      <div className="absolute" style={{ width: 1.5, height: 200, background: "linear-gradient(to bottom, transparent, rgba(255,228,110,0.4) 20%, rgba(255,245,180,0.95) 50%, rgba(255,228,110,0.4) 80%, transparent)", animation: "spike 3.2s ease-in-out 0.5s infinite" }} />
      <div className="absolute" style={{ width: 140, height: 1, background: "linear-gradient(to right, transparent, rgba(255,228,110,0.2) 50%, transparent)", transform: "rotate(45deg)", animation: "spike 4s ease-in-out 1s infinite" }} />
      <div className="absolute" style={{ width: 140, height: 1, background: "linear-gradient(to right, transparent, rgba(255,228,110,0.2) 50%, transparent)", transform: "rotate(-45deg)", animation: "spike 4s ease-in-out 1.3s infinite" }} />
      <div className="absolute rounded-full" style={{
        width: 15, height: 15,
        background: "radial-gradient(circle, #fffef2 0%, #ffe97a 50%, #ffcc33 100%)",
        boxShadow: "0 0 10px 5px rgba(255,240,120,0.95), 0 0 28px 12px rgba(255,210,60,0.55), 0 0 70px 28px rgba(255,180,30,0.22)",
        animation: "core 2.8s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ─── Página ─── */
export default function EstrellaDemo() {
  const [phase, setPhase] = useState<"locked" | "brightening" | "revealed">("locked");
  const [codigo, setCodigo] = useState("");
  const [inputError, setInputError] = useState(false);
  const [visible, setVisible] = useState(false);

  useCosmicAmbient();

  useEffect(() => {
    setTimeout(() => setVisible(true), 400);
  }, []);

  const revelar = () => {
    if (codigo.trim().toUpperCase() === CODIGO_CORRECTO.toUpperCase()) {
      playRevealSound();
      setPhase("brightening");
      setTimeout(() => setPhase("revealed"), 1500);
    } else {
      setInputError(true);
      setTimeout(() => setInputError(false), 1200);
    }
  };

  return (
    <>
      <style>{`
        @keyframes tw {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.4); opacity: 0.04; }
        }
        @keyframes moonFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-9px) rotate(1.5deg); }
        }
        @keyframes halo {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.12); }
        }
        @keyframes spike {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.22; }
        }
        @keyframes core {
          0%, 100% { transform: scale(1); box-shadow: 0 0 10px 5px rgba(255,240,120,0.95), 0 0 28px 12px rgba(255,210,60,0.55), 0 0 70px 28px rgba(255,180,30,0.22); }
          50%       { transform: scale(1.3); box-shadow: 0 0 16px 8px rgba(255,240,120,1), 0 0 46px 20px rgba(255,210,60,0.75), 0 0 100px 45px rgba(255,180,30,0.35); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes starBright {
          0%   { opacity: 0.25; filter: blur(2px) saturate(0.3); }
          45%  { opacity: 1;    filter: blur(0) saturate(1.6); }
          100% { opacity: 1;    filter: blur(0) saturate(1); }
        }
        @keyframes comet {
          0%   { opacity: 0;   transform: rotate(var(--a,-30deg)) translateX(0); }
          6%   { opacity: 0.9; }
          55%  { opacity: 0;   transform: rotate(var(--a,-30deg)) translateX(340px); }
          100% { opacity: 0;   transform: rotate(var(--a,-30deg)) translateX(340px); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes slideInFromBelow {
          from { opacity: 0; transform: translateY(48px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden select-none"
        style={{ background: "linear-gradient(180deg, #010110 0%, #050618 28%, #090820 62%, #0c0a22 100%)" }}>

        <StarField />
        <Luna />
        <Cometa top="20%" left="4%"  delay={0}   length={115} angle={-27} />
        <Cometa top="7%"  left="38%" delay={5.5}  length={82}  angle={-34} />
        <Cometa top="60%" left="62%" delay={12}   length={95}  angle={-21} />

        {/* Nebulosa */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:
            "radial-gradient(ellipse 65% 42% at 18% 68%, rgba(65,22,100,0.14) 0%, transparent 100%), " +
            "radial-gradient(ellipse 50% 32% at 80% 22%, rgba(18,32,95,0.11) 0%, transparent 100%), " +
            "radial-gradient(ellipse 38% 28% at 50% 85%, rgba(95,18,55,0.07) 0%, transparent 100%)",
        }} />

        {/* Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.28)", borderRadius: "999px", padding: "5px 14px", fontSize: "10px", letterSpacing: "0.18em", backdropFilter: "blur(8px)" }}>
            VISTA PREVIA
          </span>
        </div>

        {/* Layout: estrella arriba, contenido justo abajo */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          paddingTop: "10vh",
          paddingBottom: "80px",
        }}>

          {/* Estrella — posición fija, nunca se mueve */}
          <div style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 2s ease",
          }}>
            <EstrellaCentral dim={phase === "locked"} brightening={phase === "brightening"} />
          </div>

          {/* Contenido — directamente debajo de la estrella */}
          <div style={{
            marginTop: "28px",
            width: "100%",
            maxWidth: "400px",
            padding: "0 24px",
            position: "relative",
            minHeight: "260px",
          }}>

            {/* INPUT */}
            <div style={{
              position: "absolute",
              top: 0, left: 24, right: 24,
              opacity: phase === "revealed" ? 0 : (visible ? 1 : 0),
              transform: phase === "revealed" ? "translateY(-16px)" : "translateY(0)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              pointerEvents: phase === "revealed" ? "none" : "auto",
              textAlign: "center",
            }}>
              <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "10px", animation: visible ? "fadeInUp 1s ease 0.5s both" : "none" }}>
                Hay una estrella esperándote
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "24px", fontWeight: 300, animation: visible ? "fadeInUp 1s ease 0.7s both" : "none" }}>
                Introduce el código secreto para revelarla
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: visible ? "fadeInUp 1s ease 0.9s both" : "none" }}>
                <input
                  type="text"
                  placeholder="Código secreto..."
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && revelar()}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: inputError ? "1px solid rgba(255,110,110,0.55)" : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "14px", padding: "13px 18px",
                    color: "white", fontSize: "15px", textAlign: "center", outline: "none",
                    backdropFilter: "blur(12px)",
                    animation: inputError ? "shake 0.45s ease" : "none",
                    transition: "border-color 0.3s ease",
                    width: "100%", boxSizing: "border-box", letterSpacing: "0.08em",
                  }}
                />
                <button
                  onClick={revelar}
                  style={{
                    background: "rgba(255,220,90,0.11)", border: "1px solid rgba(255,220,90,0.25)",
                    borderRadius: "14px", padding: "13px 18px",
                    color: "rgba(255,235,140,0.82)", fontSize: "13px", fontWeight: 500,
                    cursor: "pointer", backdropFilter: "blur(10px)", letterSpacing: "0.06em",
                    transition: "all 0.25s ease",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,220,90,0.2)"; e.currentTarget.style.borderColor = "rgba(255,220,90,0.45)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,220,90,0.11)"; e.currentTarget.style.borderColor = "rgba(255,220,90,0.25)"; }}
                >
                  Revelar mi estrella ✦
                </button>
                {inputError && <p style={{ color: "rgba(255,120,120,0.75)", fontSize: "11px" }}>Código incorrecto. Intenta de nuevo.</p>}
                <p style={{ color: "rgba(255,255,255,0.14)", fontSize: "10px", marginTop: "4px" }}>
                  Pista: el código es LUNA
                </p>
              </div>
            </div>

            {/* DEDICATORIA — sube desde abajo */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              opacity: phase === "revealed" ? 1 : 0,
              transform: phase === "revealed" ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.9s cubic-bezier(0.2,0.8,0.3,1) 0.3s, transform 0.9s cubic-bezier(0.2,0.8,0.3,1) 0.3s",
              pointerEvents: phase === "revealed" ? "auto" : "none",
              textAlign: "center",
            }}>
              <div style={{ animation: phase === "revealed" ? "slideInFromBelow 0.9s cubic-bezier(0.2,0.8,0.3,1) 0.3s both" : "none" }}>
                <p style={{ color: "rgba(255,255,255,0.26)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: "8px" }}>Estrella</p>
                <h1 style={{ fontSize: "clamp(1.8rem, 7vw, 2.8rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", textShadow: "0 0 40px rgba(255,220,100,0.4)", lineHeight: 1.1, marginBottom: "8px" }}>
                  Estrella Camila
                </h1>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "20px" }}>
                  Para <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>Camila</span>
                  {"  ·  "}de <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>Nicolás</span>
                </p>
              </div>

              <div style={{ animation: phase === "revealed" ? "slideInFromBelow 0.9s cubic-bezier(0.2,0.8,0.3,1) 0.5s both" : "none" }}>
                <div style={{ borderRadius: "18px", padding: "20px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(14px)", marginBottom: "16px" }}>
                  <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(0.875rem, 2.4vw, 1rem)", lineHeight: 1.8, fontWeight: 300, fontStyle: "italic" }}>
                    &ldquo;Cada vez que mires el cielo, sabe que hay una estrella que lleva tu nombre. Porque mereces tener algo eterno.&rdquo;
                  </p>
                </div>
              </div>

              <div style={{ animation: phase === "revealed" ? "slideInFromBelow 0.9s cubic-bezier(0.2,0.8,0.3,1) 0.7s both" : "none" }}>
                <p style={{ color: "rgba(255,255,255,0.16)", fontSize: "10px" }}>Dedicada el 22 de febrero de 2026</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
