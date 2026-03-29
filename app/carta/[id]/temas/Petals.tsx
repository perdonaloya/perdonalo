"use client";

import { useState, useEffect, useRef } from "react";

interface Props { para: string; de: string; mensaje: string; }

// 3 capas de profundidad — lejanos (lentos/pequeños), medios, cercanos (rápidos/grandes)
const PETALS = [
  // ── Capa lejana (parallax lento) ──
  { left: "4%",  dur: "9.0s", delay: "0.0s", drift: "8px",   w: 6,  h: 9,  color: "#ffd6df", op: "0.35" },
  { left: "16%", dur: "9.8s", delay: "1.6s", drift: "-7px",  w: 5,  h: 8,  color: "#ffd6df", op: "0.35" },
  { left: "29%", dur: "10.2s",delay: "0.7s", drift: "9px",   w: 6,  h: 9,  color: "#ffccd8", op: "0.35" },
  { left: "43%", dur: "9.5s", delay: "2.3s", drift: "-8px",  w: 5,  h: 8,  color: "#ffd6df", op: "0.35" },
  { left: "57%", dur: "8.9s", delay: "1.1s", drift: "7px",   w: 7,  h: 10, color: "#ffccd8", op: "0.35" },
  { left: "71%", dur: "9.6s", delay: "1.9s", drift: "-10px", w: 5,  h: 8,  color: "#ffd6df", op: "0.35" },
  { left: "85%", dur: "10.0s",delay: "3.1s", drift: "8px",   w: 6,  h: 9,  color: "#ffccd8", op: "0.35" },
  { left: "36%", dur: "10.4s",delay: "2.7s", drift: "-6px",  w: 5,  h: 8,  color: "#ffd6df", op: "0.35" },
  { left: "92%", dur: "9.2s", delay: "0.4s", drift: "7px",   w: 6,  h: 9,  color: "#ffccd8", op: "0.35" },
  // ── Capa media ──
  { left: "2%",  dur: "5.5s", delay: "0.3s", drift: "20px",  w: 11, h: 15, color: "#ffb0c0", op: "0.65" },
  { left: "13%", dur: "4.8s", delay: "1.8s", drift: "-18px", w: 10, h: 14, color: "#ffaabe", op: "0.65" },
  { left: "25%", dur: "5.9s", delay: "0.8s", drift: "22px",  w: 12, h: 17, color: "#ffb0c0", op: "0.65" },
  { left: "39%", dur: "5.2s", delay: "2.4s", drift: "-20px", w: 10, h: 14, color: "#ffaabe", op: "0.65" },
  { left: "53%", dur: "4.6s", delay: "1.1s", drift: "19px",  w: 11, h: 15, color: "#ffb0c0", op: "0.65" },
  { left: "67%", dur: "5.7s", delay: "0.5s", drift: "-22px", w: 12, h: 17, color: "#ffaabe", op: "0.65" },
  { left: "80%", dur: "5.0s", delay: "3.2s", drift: "18px",  w: 10, h: 14, color: "#ffb0c0", op: "0.65" },
  { left: "20%", dur: "5.3s", delay: "1.9s", drift: "-16px", w: 11, h: 15, color: "#ffaabe", op: "0.65" },
  { left: "93%", dur: "6.0s", delay: "2.8s", drift: "14px",  w: 10, h: 14, color: "#ffb0c0", op: "0.65" },
  // ── Capa cercana (parallax rápido) ──
  { left: "7%",  dur: "3.2s", delay: "0.4s", drift: "38px",  w: 17, h: 24, color: "#ff91a8", op: "1.00" },
  { left: "22%", dur: "2.8s", delay: "1.5s", drift: "-35px", w: 16, h: 22, color: "#ff8fa3", op: "1.00" },
  { left: "36%", dur: "3.6s", delay: "0.9s", drift: "42px",  w: 18, h: 25, color: "#ff91a8", op: "1.00" },
  { left: "51%", dur: "2.5s", delay: "2.2s", drift: "-40px", w: 16, h: 22, color: "#ff8fa3", op: "1.00" },
  { left: "65%", dur: "3.4s", delay: "0.2s", drift: "36px",  w: 17, h: 24, color: "#ff91a8", op: "1.00" },
  { left: "79%", dur: "2.9s", delay: "1.3s", drift: "-38px", w: 18, h: 25, color: "#ff8fa3", op: "1.00" },
  { left: "91%", dur: "3.1s", delay: "2.7s", drift: "35px",  w: 16, h: 22, color: "#ff91a8", op: "1.00" },
];

const SETTLED: { left: number; rot: number; w: number; h: number; color: string }[] = [
  { left: 2,  rot: -22, w: 14, h: 9,  color: "#ffb0c0" }, { left: 8,  rot: 35,  w: 12, h: 8,  color: "#ff91a8" },
  { left: 16, rot: -8,  w: 15, h: 10, color: "#ffd6df" }, { left: 23, rot: 28,  w: 11, h: 7,  color: "#ffb0c0" },
  { left: 30, rot: -40, w: 13, h: 8,  color: "#ff91a8" }, { left: 38, rot: 15,  w: 14, h: 9,  color: "#ffd6df" },
  { left: 45, rot: -25, w: 12, h: 8,  color: "#ffb0c0" }, { left: 52, rot: 42,  w: 15, h: 10, color: "#ff91a8" },
  { left: 60, rot: -12, w: 11, h: 7,  color: "#ffd6df" }, { left: 67, rot: 30,  w: 13, h: 8,  color: "#ffb0c0" },
  { left: 74, rot: -35, w: 14, h: 9,  color: "#ff91a8" }, { left: 81, rot: 18,  w: 12, h: 8,  color: "#ffd6df" },
  { left: 88, rot: -28, w: 15, h: 10, color: "#ffb0c0" }, { left: 95, rot: 45,  w: 11, h: 7,  color: "#ff91a8" },
  { left: 5,  rot: 20,  w: 13, h: 8,  color: "#ffaabe" }, { left: 12, rot: -45, w: 14, h: 9,  color: "#ffd6df" },
  { left: 20, rot: 32,  w: 12, h: 7,  color: "#ffb0c0" }, { left: 28, rot: -18, w: 15, h: 10, color: "#ff91a8" },
  { left: 35, rot: 38,  w: 11, h: 7,  color: "#ffd6df" }, { left: 42, rot: -30, w: 13, h: 8,  color: "#ffaabe" },
  { left: 49, rot: 12,  w: 14, h: 9,  color: "#ffb0c0" }, { left: 57, rot: -42, w: 12, h: 8,  color: "#ff91a8" },
  { left: 64, rot: 25,  w: 15, h: 10, color: "#ffd6df" }, { left: 71, rot: -15, w: 11, h: 7,  color: "#ffaabe" },
  { left: 78, rot: 40,  w: 13, h: 8,  color: "#ffb0c0" }, { left: 85, rot: -22, w: 14, h: 9,  color: "#ff91a8" },
  { left: 92, rot: 18,  w: 12, h: 8,  color: "#ffd6df" }, { left: 98, rot: -38, w: 11, h: 7,  color: "#ffaabe" },
  { left: 1,  rot: 15,  w: 12, h: 8,  color: "#ff91a8" }, { left: 9,  rot: -28, w: 14, h: 9,  color: "#ffb0c0" },
  { left: 17, rot: 42,  w: 11, h: 7,  color: "#ffd6df" }, { left: 25, rot: -10, w: 15, h: 10, color: "#ffaabe" },
  { left: 33, rot: 32,  w: 13, h: 8,  color: "#ffb0c0" }, { left: 41, rot: -45, w: 12, h: 8,  color: "#ff91a8" },
  { left: 48, rot: 22,  w: 14, h: 9,  color: "#ffd6df" }, { left: 55, rot: -35, w: 11, h: 7,  color: "#ffb0c0" },
  { left: 62, rot: 18,  w: 13, h: 8,  color: "#ffaabe" }, { left: 70, rot: -25, w: 15, h: 10, color: "#ff91a8" },
  { left: 77, rot: 38,  w: 12, h: 8,  color: "#ffd6df" }, { left: 84, rot: -12, w: 14, h: 9,  color: "#ffb0c0" },
  { left: 91, rot: 28,  w: 11, h: 7,  color: "#ffaabe" }, { left: 97, rot: -40, w: 13, h: 8,  color: "#ff91a8" },
];

export default function Petals({ para, de, mensaje }: Props) {
  const msgFs = mensaje.length <= 100 ? "1.125rem" : mensaje.length <= 180 ? "0.95rem" : "0.8rem";
  const msgLh = mensaje.length <= 180 ? "1.7" : "1.3";
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos  = useRef({ x: -9999, y: -9999 });
  const deflects  = useRef(PETALS.map(() => ({ x: 0, y: 0 })));
  const [shown, setShown] = useState(0);

  // Acumulación de pétalos en el suelo
  useEffect(() => {
    const t = setInterval(() => setShown(n => n < SETTLED.length ? n + 1 : n), 550);
    return () => clearInterval(t);
  }, []);

  // Interactividad con el mouse — repulsión suave
  useEffect(() => {
    let rafId: number;
    function step() {
      for (let i = 0; i < PETALS.length; i++) {
        const outer = outerRefs.current[i];
        const inner = innerRefs.current[i];
        const d     = deflects.current[i];
        if (!outer || !inner || !d) continue;
        const rect = outer.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = cx - mousePos.current.x;
        const dy = cy - mousePos.current.y;
        const dist = Math.hypot(dx, dy);
        let tx = 0, ty = 0;
        if (dist < 100 && dist > 1) {
          const force = (1 - dist / 100) * 60;
          tx = (dx / dist) * force;
          ty = (dy / dist) * force;
        }
        d.x += (tx - d.x) * 0.13;
        d.y += (ty - d.y) * 0.13;
        inner.style.transform = `translate(${d.x.toFixed(1)}px,${d.y.toFixed(1)}px)`;
      }
      rafId = requestAnimationFrame(step);
    }
    const onMove  = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onLeave = () => { mousePos.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove",  onMove);
    window.addEventListener("touchmove",  onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("touchmove",  onTouch);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/cherry-blossom.png')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white",
      }}
    >
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-40px) translateX(0) rotate(0deg); }
          25%  { transform: translateY(25vh)  translateX(var(--drift)) rotate(90deg); }
          50%  { transform: translateY(52vh)  translateX(0) rotate(200deg); }
          75%  { transform: translateY(76vh)  translateX(calc(var(--drift) * -0.55)) rotate(310deg); }
          100% { transform: translateY(108vh) translateX(0) rotate(420deg); }
        }
        @keyframes settleIn {
          0%   { opacity:0;    transform:translateY(14px) rotate(var(--rot)); }
          65%  { opacity:1;    transform:translateY(-2px) rotate(calc(var(--rot) + 4deg)); }
          100% { opacity:0.88; transform:translateY(0) rotate(var(--rot)); }
        }
        @keyframes fadeUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        .pt-outer   { position:absolute; top:-40px; z-index:5; animation:fall var(--dur) ease-in var(--delay) infinite; opacity:var(--op); }
        .pt-inner   { display:inline-block; will-change:transform; }
        .pt-settled { position:absolute; z-index:4; opacity:0; animation:settleIn 0.55s ease forwards; }
        .p-fade1    { animation:fadeUp .8s ease forwards; animation-delay:.5s;  opacity:0; }
        .p-fade2    { animation:fadeUp .8s ease forwards; animation-delay:.9s;  opacity:0; }
        .p-fade3    { animation:fadeUp .8s ease forwards; animation-delay:1.3s; opacity:0; }
      `}</style>

      {/* Pétalos cayendo con profundidad */}
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="pt-outer"
          ref={el => { outerRefs.current[i] = el; }}
          style={{ left: p.left, "--dur": p.dur, "--delay": p.delay, "--drift": p.drift, "--op": p.op } as React.CSSProperties}
        >
          <div className="pt-inner" ref={el => { innerRefs.current[i] = el; }}>
            <div style={{
              width: p.w, height: p.h,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: `radial-gradient(ellipse at 38% 32%, #ffe8ee, ${p.color})`,
            }}/>
          </div>
        </div>
      ))}

      {/* Pétalos acumulados en el suelo */}
      {SETTLED.slice(0, shown).map((s, i) => {
        const row = Math.floor(i / 14);
        return (
          <div key={i} className="pt-settled"
            style={{ left:`${s.left}%`, bottom:`${row * 7 + 2}px`, "--rot":`${s.rot}deg` } as React.CSSProperties}
          >
            <div style={{
              width: s.w, height: s.h, borderRadius: "50%",
              background: `radial-gradient(ellipse at 40% 35%, #ffe8ee, ${s.color})`,
              transform: `rotate(${s.rot}deg)`, opacity: 0.88,
            }}/>
          </div>
        );
      })}

      {/* Carta */}
      <div className="z-10 text-center max-w-sm rounded-3xl px-8 py-8"
        style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(6px)" }}>
        <p className="p-fade1 text-pink-500 text-xs font-semibold tracking-widest uppercase mb-3">Para {para}</p>
        <p className="p-fade2 text-gray-700 italic mb-5" style={{ overflowWrap:"break-word", wordBreak:"break-word", fontSize: msgFs, lineHeight: msgLh }}>
          &ldquo;{mensaje}&rdquo;
        </p>
        <p className="p-fade3 text-pink-400 text-sm">— {de} 🌸</p>
      </div>
    </div>
  );
}
