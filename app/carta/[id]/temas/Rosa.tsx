interface Props { para: string; de: string; mensaje: string; }

const PETALS = [
  { top: "8%",  left: "7%",  w: 13, h: 19, rot: 20,  delay: "0s",    dur: "4.2s" },
  { top: "5%",  left: "78%", w: 10, h: 15, rot: -35, delay: "1.1s",  dur: "3.8s" },
  { top: "18%", left: "88%", w: 12, h: 17, rot: 50,  delay: "0.4s",  dur: "4.6s" },
  { top: "12%", left: "45%", w: 9,  h: 13, rot: -15, delay: "2.0s",  dur: "3.5s" },
  { top: "55%", left: "5%",  w: 11, h: 16, rot: 30,  delay: "0.8s",  dur: "4.0s" },
  { top: "60%", left: "82%", w: 10, h: 14, rot: -40, delay: "1.6s",  dur: "3.9s" },
  { top: "75%", left: "22%", w: 8,  h: 12, rot: 10,  delay: "2.4s",  dur: "4.4s" },
];

const SPARKS = [
  { top: "10%", left: "20%", delay: "0s"   }, { top: "25%", left: "75%", delay: "0.4s" },
  { top: "70%", left: "15%", delay: "0.8s" }, { top: "80%", left: "70%", delay: "0.2s" },
  { top: "40%", left: "90%", delay: "1.1s" }, { top: "85%", left: "35%", delay: "0.6s" },
];

const RAMO = [
  { deg: -32, scale: 0.82, z: 1 },
  { deg: -16, scale: 0.91, z: 2 },
  { deg:   0, scale: 1.00, z: 3 },
  { deg:  16, scale: 0.91, z: 2 },
  { deg:  32, scale: 0.82, z: 1 },
];

// Blobs de luz atmosférica — luz de vela sobre fondo oscuro
const BLOBS = [
  { w: 420, h: 320, top: "-8%",  left: "-15%", color: "rgba(160,0,35,0.65)",  blur: 100 },
  { w: 340, h: 300, top: "5%",   left: "55%",  color: "rgba(210,0,55,0.45)",  blur: 85  },
  { w: 280, h: 240, top: "55%",  left: "18%",  color: "rgba(255,70,95,0.28)", blur: 75  },
  { w: 460, h: 380, top: "28%",  left: "8%",   color: "rgba(70,0,18,0.70)",   blur: 130 },
  { w: 200, h: 180, top: "72%",  left: "65%",  color: "rgba(180,0,50,0.32)",  blur: 65  },
];

export default function Rosa({ para, de, mensaje }: Props) {
  const msgFs = mensaje.length <= 100 ? "1.2rem" : mensaje.length <= 180 ? "1rem" : "0.875rem";
  const msgLh = mensaje.length <= 180 ? "1.7" : "1.3";
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden px-6 pt-14"
      style={{ background: "#07000a" }}
    >
      <style>{`
        @keyframes bloom   { 0%{transform:scale(0.1) rotate(-30deg);opacity:0} 70%{transform:scale(1.15) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes floatUp { 0%{transform:translateY(0) rotate(var(--r)) scale(1);opacity:.8} 100%{transform:translateY(-130px) rotate(calc(var(--r) + 60deg)) scale(0.5);opacity:0} }
        @keyframes fadeUp  { 0%{opacity:0;transform:translateY(24px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:0.2} 50%{opacity:0.7} }
        .r-bloom  { animation: bloom 1.4s cubic-bezier(.34,1.56,.64,1) forwards; }
        .r-petal  { position:absolute; animation: floatUp 3.8s ease-in infinite; }
        .r-fade1  { animation: fadeUp .8s ease forwards; animation-delay:1.6s; opacity:0; }
        .r-fade2  { animation: fadeUp .8s ease forwards; animation-delay:2s;   opacity:0; }
        .r-fade3  { animation: fadeUp .8s ease forwards; animation-delay:2.4s; opacity:0; }
        .r-spark  { position:absolute; width:4px; height:4px; border-radius:50%; background:rgba(255,150,150,0.5); animation:pulse 3s ease-in-out infinite; }
      `}</style>

      {/* Blobs atmosféricos */}
      {BLOBS.map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: b.w, height: b.h,
          top: b.top, left: b.left,
          background: b.color, borderRadius: "50%",
          filter: `blur(${b.blur}px)`, pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      {SPARKS.map((s, i) => (
        <div key={i} className="r-spark" style={{ top: s.top, left: s.left, animationDelay: s.delay }} />
      ))}

      {PETALS.map((p, i) => (
        <div
          key={i}
          className="r-petal"
          style={{
            top: p.top, left: p.left,
            width: p.w, height: p.h,
            borderRadius: "50% 50% 44% 44% / 60% 60% 40% 40%",
            background: "radial-gradient(ellipse at 40% 30%, #ff8aaa, #c8102e)",
            "--r": `${p.rot}deg`,
            animationDelay: p.delay,
            animationDuration: p.dur,
          } as React.CSSProperties}
        />
      ))}

      {/* Ramo */}
      <div className="r-bloom z-10 mb-4" style={{ position: "relative", width: "280px", height: "200px" }}>
        {RAMO.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              width: "90px",
              marginLeft: "-45px",
              fontSize: "82px",
              lineHeight: "90px",
              textAlign: "center",
              transform: `rotate(${r.deg}deg) scale(${r.scale})`,
              transformOrigin: "bottom center",
              zIndex: r.z,
            }}
          >
            🌹
          </div>
        ))}
        <div style={{ position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", fontSize: "32px", zIndex: 10, letterSpacing: "-6px" }}>
          🍃🌿🍃
        </div>
      </div>

      <div className="z-10 text-center w-full max-w-md" style={{
        padding: "24px 32px",
        background: "rgba(12,0,6,0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: "18px",
        border: "1px solid rgba(220,80,100,0.22)",
      }}>
        <p className="r-fade1 text-rose-300 text-xs font-semibold tracking-widest uppercase mb-3">
          Para {para}
        </p>
        <p className="r-fade2 text-white italic mb-5" style={{ overflowWrap: "break-word", wordBreak: "break-word", fontSize: msgFs, lineHeight: msgLh }}>
          &ldquo;{mensaje}&rdquo;
        </p>
        <p className="r-fade3 text-rose-400 text-sm">
          — Con cariño, {de} 🌹
        </p>
      </div>
    </div>
  );
}
