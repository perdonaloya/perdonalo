interface Props { para: string; de: string; mensaje: string; }

// Salen de a poco en grupo — escalonadas 0.08s, flyOut lento de 2s
const STEP = 0.08;
const BUTTERFLIES = [
  // Fila superior
  { ox: "-44vw", oy: "-42vh", dur: "12s", size: "1.8rem", delay: `${0  * STEP}s` },
  { ox: "-25vw", oy: "-43vh", dur: "14s", size: "1.5rem", delay: `${1  * STEP}s` },
  { ox:  "-8vw", oy: "-45vh", dur: "11s", size: "1.9rem", delay: `${2  * STEP}s` },
  { ox:  "10vw", oy: "-44vh", dur: "13s", size: "1.4rem", delay: `${3  * STEP}s` },
  { ox:  "28vw", oy: "-42vh", dur: "10s", size: "2.0rem", delay: `${4  * STEP}s` },
  { ox:  "44vw", oy: "-40vh", dur: "14s", size: "1.5rem", delay: `${5  * STEP}s` },
  // Fila alta-media
  { ox: "-40vw", oy: "-27vh", dur: "11s", size: "1.6rem", delay: `${6  * STEP}s` },
  { ox: "-20vw", oy: "-29vh", dur: "13s", size: "2.1rem", delay: `${7  * STEP}s` },
  { ox:  "16vw", oy: "-28vh", dur: "10s", size: "1.4rem", delay: `${8  * STEP}s` },
  { ox:  "38vw", oy: "-26vh", dur: "12s", size: "1.7rem", delay: `${9  * STEP}s` },
  { ox:  "-4vw", oy: "-25vh", dur: "14s", size: "1.3rem", delay: `${10 * STEP}s` },
  // Lateral izquierdo
  { ox: "-46vw", oy: "-12vh", dur: "10s", size: "2.2rem", delay: `${11 * STEP}s` },
  { ox: "-44vw", oy:   "3vh", dur: "13s", size: "1.5rem", delay: `${12 * STEP}s` },
  { ox: "-43vw", oy:  "18vh", dur: "11s", size: "1.8rem", delay: `${13 * STEP}s` },
  // Lateral derecho
  { ox:  "44vw", oy:  "-9vh", dur: "12s", size: "1.6rem", delay: `${14 * STEP}s` },
  { ox:  "43vw", oy:   "5vh", dur: "10s", size: "2.0rem", delay: `${15 * STEP}s` },
  { ox:  "42vw", oy:  "20vh", dur: "14s", size: "1.4rem", delay: `${16 * STEP}s` },
  // Fila baja-media
  { ox: "-38vw", oy:  "28vh", dur: "13s", size: "1.7rem", delay: `${17 * STEP}s` },
  { ox: "-18vw", oy:  "30vh", dur: "11s", size: "1.3rem", delay: `${18 * STEP}s` },
  { ox:  "14vw", oy:  "29vh", dur: "10s", size: "1.9rem", delay: `${19 * STEP}s` },
  { ox:  "36vw", oy:  "27vh", dur: "12s", size: "1.5rem", delay: `${20 * STEP}s` },
  { ox:   "2vw", oy:  "25vh", dur: "14s", size: "1.4rem", delay: `${21 * STEP}s` },
  // Fila inferior
  { ox: "-42vw", oy:  "41vh", dur: "11s", size: "1.6rem", delay: `${22 * STEP}s` },
  { ox: "-24vw", oy:  "43vh", dur: "13s", size: "2.0rem", delay: `${23 * STEP}s` },
  { ox:  "-6vw", oy:  "45vh", dur: "10s", size: "1.4rem", delay: `${24 * STEP}s` },
  { ox:  "16vw", oy:  "44vh", dur: "12s", size: "1.8rem", delay: `${25 * STEP}s` },
  { ox:  "36vw", oy:  "42vh", dur: "14s", size: "1.5rem", delay: `${26 * STEP}s` },
  // Esquinas extremas
  { ox: "-46vw", oy: "-44vh", dur: "13s", size: "1.3rem", delay: `${27 * STEP}s` },
  { ox:  "45vw", oy: "-42vh", dur: "11s", size: "1.4rem", delay: `${28 * STEP}s` },
  { ox: "-45vw", oy:  "43vh", dur: "12s", size: "1.6rem", delay: `${29 * STEP}s` },
  { ox:  "43vw", oy:  "45vh", dur: "10s", size: "1.3rem", delay: `${30 * STEP}s` },
  // Extras
  { ox: "-46vw", oy: "-28vh", dur: "14s", size: "1.5rem", delay: `${31 * STEP}s` },
];

const FLY_DUR = "2s";

export default function Mariposas({ para, de, mensaje }: Props) {
  const msgFs = mensaje.length <= 100 ? "1rem" : mensaje.length <= 180 ? "0.875rem" : "0.75rem";
  const msgLh = mensaje.length <= 180 ? "1.7" : "1.3";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ background: "linear-gradient(135deg, #f3e8ff 0%, #e0d4f7 40%, #c8b4f0 100%)" }}>
      <style>{`
        @keyframes flyOut {
          0%   { transform:translate(0,0); opacity:0; }
          15%  { opacity:1; }
          100% { transform:translate(var(--ox),var(--oy)); opacity:1; }
        }
        @keyframes wander {
          0%   { transform:translate(var(--ox), var(--oy)); }
          25%  { transform:translate(calc(var(--ox) + 9vw),  calc(var(--oy) - 7vh)); }
          50%  { transform:translate(calc(var(--ox) - 7vw),  calc(var(--oy) + 8vh)); }
          75%  { transform:translate(calc(var(--ox) + 4vw),  calc(var(--oy) + 5vh)); }
          100% { transform:translate(var(--ox), var(--oy)); }
        }
        @keyframes leftWing  { 0%,100%{transform:scaleX(1)} 45%,55%{transform:scaleX(0.04)} }
        @keyframes rightWing { 0%,100%{transform:scaleX(1)} 45%,55%{transform:scaleX(0.04)} }
        @keyframes fadeUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        .b-fly {
          position:absolute; display:inline-flex; line-height:1;
          animation:
            flyOut ${FLY_DUR} ease-in-out var(--delay) both,
            wander var(--dur) ease-in-out calc(var(--delay) + ${FLY_DUR}) infinite;
        }
        .b-lwing{ display:inline-block;width:0.5em;height:1em;overflow:hidden;transform-origin:right center;animation:leftWing  0.38s ease-in-out infinite }
        .b-rwing{ display:inline-block;width:0.5em;height:1em;overflow:hidden;transform-origin:left  center;animation:rightWing 0.38s ease-in-out infinite }
        .b-fade1{ animation:fadeUp .8s ease forwards;animation-delay:.6s;opacity:0 }
        .b-fade2{ animation:fadeUp .8s ease forwards;animation-delay:1s;opacity:0 }
        .b-fade3{ animation:fadeUp .8s ease forwards;animation-delay:1.4s;opacity:0 }
      `}</style>

      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:20, pointerEvents:"none" }}>
        <div style={{ position:"relative" }}>
          {BUTTERFLIES.map((b, i) => (
            <div key={i} className="b-fly"
              style={{ "--ox": b.ox, "--oy": b.oy, "--dur": b.dur, "--delay": b.delay, fontSize: b.size } as React.CSSProperties}>
              <span className="b-lwing">🦋</span>
              <span className="b-rwing"><span style={{ display:"inline-block", width:"1em", transform:"translateX(-0.5em)" }}>🦋</span></span>
            </div>
          ))}
        </div>
      </div>

      <div className="z-10 text-center max-w-sm bg-white/60 backdrop-blur-sm rounded-3xl px-8 py-8 shadow-lg">
        <div className="text-5xl mb-4">🦋</div>
        <p className="b-fade1 text-violet-500 text-xs font-semibold tracking-widest uppercase mb-3">
          Para {para}
        </p>
        <p className="b-fade2 text-gray-700 italic mb-5" style={{ overflowWrap: "break-word", wordBreak: "break-word", fontSize: msgFs, lineHeight: msgLh }}>
          &ldquo;{mensaje}&rdquo;
        </p>
        <p className="b-fade3 text-violet-500 text-sm">
          — {de} 🦋
        </p>
      </div>
    </div>
  );
}
