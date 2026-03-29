"use client"

import React, { useState, useEffect, useRef } from "react";
import BalloonBouquet from "./BalloonBouquet";

interface Props { para: string; de: string; mensaje: string; }

// ── Círculos bokeh — como los de la imagen de fondo ──
// size: diámetro en px | blur: desenfoque suave | op: opacidad
const BOKEH = [
  // grandes
  { left:"3%",  dur:"9s",   delay:"0.0s", drift:"8px",   size:48, blur:1, op:0.60 },
  { left:"22%", dur:"8s",   delay:"0.5s", drift:"7px",   size:42, blur:1, op:0.55 },
  { left:"45%", dur:"9.5s", delay:"1.2s", drift:"9px",   size:52, blur:1, op:0.50 },
  { left:"68%", dur:"8.5s", delay:"0.9s", drift:"6px",   size:44, blur:1, op:0.52 },
  { left:"89%", dur:"11s",  delay:"1.5s", drift:"7px",   size:40, blur:1, op:0.55 },
  // medianos
  { left:"11%", dur:"12s",  delay:"1.8s", drift:"-6px",  size:28, blur:1, op:0.68 },
  { left:"33%", dur:"10s",  delay:"2.8s", drift:"-7px",  size:24, blur:1, op:0.72 },
  { left:"57%", dur:"11s",  delay:"3.3s", drift:"-6px",  size:26, blur:1, op:0.65 },
  { left:"79%", dur:"10s",  delay:"2.1s", drift:"-8px",  size:22, blur:1, op:0.70 },
  { left:"16%", dur:"13s",  delay:"0.3s", drift:"7px",   size:30, blur:1, op:0.60 },
  { left:"72%", dur:"9s",   delay:"3.0s", drift:"6px",   size:20, blur:1, op:0.75 },
  // pequeñitos
  { left:"7%",  dur:"7s",   delay:"1.1s", drift:"5px",   size:10, blur:0, op:0.85 },
  { left:"19%", dur:"8s",   delay:"2.4s", drift:"-5px",  size:8,  blur:0, op:0.88 },
  { left:"29%", dur:"6.5s", delay:"0.7s", drift:"6px",   size:12, blur:0, op:0.82 },
  { left:"41%", dur:"7.5s", delay:"3.5s", drift:"-4px",  size:7,  blur:0, op:0.90 },
  { left:"53%", dur:"6s",   delay:"1.6s", drift:"5px",   size:10, blur:0, op:0.85 },
  { left:"64%", dur:"8.5s", delay:"0.4s", drift:"-6px",  size:9,  blur:0, op:0.88 },
  { left:"76%", dur:"7s",   delay:"2.9s", drift:"5px",   size:11, blur:0, op:0.83 },
  { left:"85%", dur:"6.5s", delay:"1.3s", drift:"-5px",  size:7,  blur:0, op:0.90 },
  { left:"93%", dur:"7.5s", delay:"3.7s", drift:"4px",   size:13, blur:0, op:0.80 },
];

// ── Confetti dorado — igual a la imagen de fondo ──
// w×h: tamaño de la pieza | rot0: ángulo inicial de rotación
const CONFETTI = [
  // piezas cuadradas / anchas
  { left:"6%",  dur:"4.2s", delay:"0.0s", drift:"18px",  w:10, h:8,  rot0:  15 },
  { left:"18%", dur:"5.0s", delay:"1.3s", drift:"-22px", w:14, h:6,  rot0: -30 },
  { left:"32%", dur:"3.8s", delay:"0.6s", drift:"20px",  w:8,  h:8,  rot0:  45 },
  { left:"48%", dur:"4.6s", delay:"2.0s", drift:"-16px", w:12, h:5,  rot0: -20 },
  { left:"63%", dur:"3.5s", delay:"0.9s", drift:"24px",  w:10, h:10, rot0:  60 },
  { left:"77%", dur:"4.9s", delay:"1.7s", drift:"-20px", w:8,  h:6,  rot0: -45 },
  { left:"91%", dur:"4.1s", delay:"3.1s", drift:"18px",  w:14, h:8,  rot0:  10 },
  { left:"11%", dur:"5.3s", delay:"2.5s", drift:"-14px", w:10, h:5,  rot0: -55 },
  // tiras verticales
  { left:"3%",  dur:"3.9s", delay:"0.4s", drift:"22px",  w:5,  h:18, rot0:  25 },
  { left:"24%", dur:"4.4s", delay:"1.6s", drift:"-18px", w:4,  h:22, rot0: -40 },
  { left:"39%", dur:"3.6s", delay:"0.8s", drift:"26px",  w:5,  h:16, rot0:  35 },
  { left:"55%", dur:"4.8s", delay:"2.3s", drift:"-24px", w:4,  h:20, rot0: -15 },
  { left:"70%", dur:"3.4s", delay:"0.2s", drift:"20px",  w:5,  h:18, rot0:  50 },
  { left:"84%", dur:"4.2s", delay:"1.1s", drift:"-20px", w:4,  h:22, rot0: -60 },
  { left:"95%", dur:"3.7s", delay:"2.8s", drift:"16px",  w:5,  h:16, rot0:  20 },
  // medianas mixtas
  { left:"9%",  dur:"4.5s", delay:"1.9s", drift:"-16px", w:8,  h:12, rot0: -35 },
  { left:"29%", dur:"3.3s", delay:"0.5s", drift:"22px",  w:12, h:8,  rot0:  40 },
  { left:"44%", dur:"5.1s", delay:"2.6s", drift:"-18px", w:7,  h:14, rot0: -25 },
  { left:"60%", dur:"3.8s", delay:"1.4s", drift:"24px",  w:10, h:10, rot0:  30 },
  { left:"75%", dur:"4.3s", delay:"0.7s", drift:"-22px", w:8,  h:12, rot0: -50 },
  { left:"88%", dur:"3.6s", delay:"3.5s", drift:"18px",  w:12, h:6,  rot0:  15 },
  { left:"50%", dur:"4.7s", delay:"1.0s", drift:"-20px", w:6,  h:16, rot0: -45 },
];


function MiniCard() {
  return (
    <div className="bd-env-mini">
      <div style={{ position:"relative", width:200, height:140 }}>
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(135deg,#F5ECC0,#E8DCA0)",
          borderRadius:4, border:"1px solid #D0C480",
          boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
        }} />
        <div style={{
          position:"absolute", top:0, left:0, width:0, height:0,
          borderLeft:"100px solid transparent",
          borderRight:"100px solid transparent",
          borderTop:"80px solid #D8CC90",
        }} />
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%) translateY(10px)",
          width:20, height:20,
          background:"radial-gradient(circle at 40% 38%,#F0D060,#C8A030)",
          borderRadius:"50%", border:"1px solid #B89028",
        }} />
      </div>
    </div>
  );
}

function FullCard({ para, de, mensaje, startY }: { para: string; de: string; mensaje: string; startY: number }) {
  const msgFs  = mensaje.length <= 100 ? 14 : mensaje.length <= 180 ? 12 : 10;
  const msgLh  = mensaje.length <= 180 ? "1.7" : "1.3";
  const hdrMb  = mensaje.length <= 180 ? 10 : 4;
  const msgMb  = mensaje.length <= 180 ? 12 : 4;
  const pad    = mensaje.length <= 180 ? "18px 14px" : "10px 14px";

  return (
    <div className="bd-card-full" style={{ "--start-y": `${startY}px` } as React.CSSProperties}>
      <div className="bd-cord" />
      <div style={{ position:"relative", width:200, height:140 }}>
        <div style={{ position:"absolute", top:0, left:0, width:200, height:140, background:"linear-gradient(135deg,#EDE4B0,#E0D698)", borderRadius:4, zIndex:1 }} />
        <div style={{ position:"absolute", width:200, height:140, background:"linear-gradient(135deg,#F5ECC0,#E8DCA0)", borderRadius:4, border:"1px solid #D0C480", boxShadow:"0 2px 8px rgba(0,0,0,0.08)", zIndex:2 }} />
        <div style={{ position:"absolute", top:0, left:0, width:200, height:170, clipPath:"inset(0 0 -300px 0)", zIndex:3 }}>
          <div className="bd-letter" style={{ position:"absolute", top:0, left:15, width:170, minHeight:260, background:"linear-gradient(to bottom,#FFFEF8,#F8F4E8)", borderRadius:3, border:"0.5px solid #E0D8C0" }}>
            <div className="bd-letter-content" style={{ padding:pad, fontFamily:"Georgia,serif", fontSize:msgFs, lineHeight:msgLh, color:"#6B5A30", textAlign:"center" }}>
              <p style={{ fontSize:15, fontWeight:500, color:"#8B7030", marginBottom:hdrMb }}>Para {para}</p>
              <p style={{ overflowWrap:"break-word", wordBreak:"break-word", fontStyle:"italic", marginBottom:msgMb }}>&ldquo;{mensaje}&rdquo;</p>
              <p style={{ color:"#8B7030" }}>— {de} 🎂</p>
            </div>
          </div>
        </div>
        <div className="bd-flap-hinge" style={{ position:"absolute", top:0, left:0, width:200, height:0, transformOrigin:"top center", zIndex:6 }}>
          <div style={{ position:"absolute", top:0, left:0, width:0, height:0, borderLeft:"100px solid transparent", borderRight:"100px solid transparent", borderTop:"80px solid #F0E8C8" }} />
          <div style={{ width:0, height:0, borderLeft:"100px solid transparent", borderRight:"100px solid transparent", borderTop:"80px solid #E8DCA0" }} />
        </div>
        <div className="bd-seal" style={{ position:"absolute", top:52, left:"50%", transform:"translate(-50%,-50%)", width:26, height:26, background:"radial-gradient(circle at 40% 38%,#F0D060,#C8A030)", borderRadius:"50%", border:"1.5px solid #B89028", zIndex:7, boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}

export default function Cumpleanos({ para, de, mensaje }: Props) {
  const [open, setOpen] = useState(false);
  const [startY, setStartY] = useState(0);
  const miniRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (miniRef.current) {
        const rect = miniRef.current.getBoundingClientRect();
        setStartY(rect.top + rect.height / 2);
      }
      setOpen(true);
    }, 4200);
    return () => clearTimeout(t);
  }, []);


  return (
    <div
      className="bd-wrap"
      style={{ background:"radial-gradient(ellipse at 50% 40%, #FFF8F2 0%, #FFE0C8 40%, #F5C4A8 70%, #E8A898 100%)" }}
    >
      {/* ── BOKEH cayendo ── */}
      {BOKEH.map((b, i) => (
        <div key={`b${i}`} className="bk-outer"
          style={{ left:b.left, "--dur":b.dur, "--delay":b.delay, "--drift":b.drift } as React.CSSProperties}
        >
          <div style={{
            width:b.size, height:b.size,
            borderRadius:"50%",
            background:"radial-gradient(circle, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.30) 65%, transparent 100%)",
            opacity:b.op,
          }} />
        </div>
      ))}

      {/* ── CONFETTI dorado cayendo ── */}
      {CONFETTI.map((c, i) => (
        <div key={i} className="cf-outer"
          style={{ left:c.left, "--dur":c.dur, "--delay":c.delay, "--drift":c.drift, "--rot0":`${c.rot0}deg` } as React.CSSProperties}
        >
          <div style={{ width:c.w, height:c.h, borderRadius:1, background:"linear-gradient(135deg, #FFF0A0 0%, #F0C030 40%, #C89010 75%, #A07000 100%)" }} />
        </div>
      ))}

      {/* ── RAMO ── */}
      <div className="bd-bouquet">
        <BalloonBouquet className="bd-svg" />
        {!open && <div ref={miniRef}><MiniCard /></div>}
      </div>

      {/* ── CARTA completa ── */}
      {open && <FullCard para={para} de={de} mensaje={mensaje} startY={startY} />}

      <style>{`
        .bd-wrap { position:relative; height:100vh; overflow:hidden; }

        /* círculos bokeh cayendo suavemente */
        .bk-outer {
          position:absolute; top:-60px; z-index:5;
          animation:bk-fall var(--dur) ease-in-out var(--delay) infinite;
        }
        @keyframes bk-fall {
          0%   { transform:translateY(-60px) translateX(0); opacity:0; }
          8%   { opacity:1; }
          40%  { transform:translateY(35vh) translateX(var(--drift)); }
          70%  { transform:translateY(65vh) translateX(0); }
          92%  { opacity:1; }
          100% { transform:translateY(110vh) translateX(calc(var(--drift)*-0.3)); opacity:0; }
        }

        /* confetti metálico cayendo y girando */
        .cf-outer {
          position:absolute; top:-24px; z-index:6;
          animation:cf-fall var(--dur) linear var(--delay) infinite;
        }
        @keyframes cf-fall {
          0%   { transform:translateY(-24px) translateX(0)               rotate(var(--rot0));        opacity:0; }
          6%   { opacity:1; }
          30%  { transform:translateY(26vh)  translateX(var(--drift))    rotate(calc(var(--rot0) + 140deg)); }
          55%  { transform:translateY(53vh)  translateX(0)               rotate(calc(var(--rot0) + 280deg)); }
          78%  { transform:translateY(78vh)  translateX(calc(var(--drift)*-0.5)) rotate(calc(var(--rot0) + 400deg)); }
          93%  { opacity:1; }
          100% { transform:translateY(110vh) translateX(0)               rotate(calc(var(--rot0) + 540deg)); opacity:0; }
        }


        .bd-bouquet {
          position:absolute; left:50%; transform:translateX(-50%);
          width:min(780px, 94vw);
          top:110vh; opacity:0; z-index:20;
          animation:
            bd-rise 4.2s cubic-bezier(.16,.72,.20,1) 0s forwards,
            bd-sway 8s ease-in-out 4.2s infinite alternate;
        }
        .bd-svg { display:block; width:100%; }
        @keyframes bd-rise {
          0%  { top:110vh; opacity:0; transform:translateX(-50%); }
          6%  { opacity:1; }
          100%{ top:-14vh; opacity:1; transform:translateX(-50%); }
        }
        @keyframes bd-sway {
          0%  { transform:translateX(-50%) rotate(0deg); }
          35% { transform:translateX(calc(-50% + 5px)) rotate(0.4deg); }
          65% { transform:translateX(calc(-50% - 4px)) rotate(-0.3deg); }
          100%{ transform:translateX(calc(-50% + 6px)) rotate(0.4deg); }
        }

        .bd-env-mini {
          position:absolute; left:50%; top:91%;
          transform:translateX(-50%) scale(0.13);
          transform-origin:top center;
          filter:drop-shadow(0 2px 4px rgba(120,80,0,0.25));
        }

        .bd-card-full {
          position:fixed;
          top:var(--start-y, 20vh); left:50%;
          transform:translate(-50%,-50%) scale(0.13);
          animation:bd-card-fly 1.5s cubic-bezier(.25,.8,.25,1) 0s forwards;
          z-index:30;
        }
        @keyframes bd-card-fly {
          0%  { top:var(--start-y, 20vh); transform:translate(-50%,-50%) scale(0.13); }
          100%{ top:50%; transform:translate(-50%,-50%) scale(1); }
        }

        .bd-cord {
          position:absolute; bottom:100%; left:50%;
          width:1.5px; height:40px;
          background:linear-gradient(to bottom,#C8B870,#D4C87A);
          transform:translateX(-50%);
          animation:bd-cord-snap 0.25s ease-out 0.05s forwards;
        }
        @keyframes bd-cord-snap {
          0%  { opacity:0.7; }
          100%{ opacity:0; }
        }

        .bd-flap-hinge {
          animation:bd-flap-open 0.9s cubic-bezier(.4,0,.2,1) 1.7s forwards;
        }
        @keyframes bd-flap-open {
          0%  { transform:rotateX(0deg); }
          100%{ transform:rotateX(-180deg); }
        }

        .bd-seal {
          animation:bd-seal-pop 0.4s ease-out 1.8s forwards;
        }
        @keyframes bd-seal-pop {
          0%  { opacity:1; transform:translate(-50%,-50%) scale(1); }
          60% { opacity:0; transform:translate(-50%,-50%) scale(1.3); }
          100%{ opacity:0; transform:translate(-50%,-50%) scale(0); }
        }

        .bd-letter {
          transform:translateY(-260px);
          animation:bd-letter-rise 0.9s cubic-bezier(.34,1.15,.64,1) 2.7s forwards;
        }
        @keyframes bd-letter-rise {
          0%  { transform:translateY(-260px); }
          100%{ transform:translateY(0); }
        }

        .bd-letter-content {
          opacity:0;
          animation:bd-msg-fade 0.6s ease 3.4s forwards;
        }
        @keyframes bd-msg-fade {
          0%  { opacity:0; }
          100%{ opacity:1; }
        }
      `}</style>
    </div>
  );
}
