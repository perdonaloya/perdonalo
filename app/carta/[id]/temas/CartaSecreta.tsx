interface Props { para: string; de: string; mensaje: string; }

export default function CartaSecreta({ para, de, mensaje }: Props) {
  const msgFontSize   = mensaje.length <= 100 ? 14 : mensaje.length <= 180 ? 12 : 10;
  const msgLineHeight = mensaje.length <= 180 ? "1.7" : "1.3";
  const hdrMargin     = mensaje.length <= 180 ? "12px" : "4px";
  const msgMargin     = mensaje.length <= 180 ? "14px" : "4px";
  const paperPad      = mensaje.length <= 180 ? "20px 18px" : "10px 18px";
  const EW = 300, EH = 230, FH = 115;
  const C = "#ffffff"; // blanco — cuerpo y papel
  const F = "#ffd6e6"; // rosa claro — solapa (diferente al papel)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ background: "linear-gradient(135deg, #fff0f5 0%, #ffe0ec 50%, #ffc8de 100%)" }}>
      <style>{`
        @keyframes bounceIn  { 0%{transform:scale(0.3) rotate(-10deg);opacity:0} 70%{transform:scale(1.08) rotate(2deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes keyAnim   {
          0%  { opacity:1; transform:translateX(-50%) rotate(0deg)   }
          18% { opacity:1; transform:translateX(-50%) rotate(-22deg) }
          40% { opacity:1; transform:translateX(-50%) rotate(16deg)  }
          58% { opacity:1; transform:translateX(-50%) rotate(-8deg)  }
          72% { opacity:1; transform:translateX(-50%) rotate(0deg)   }
          100%{ opacity:0; transform:translateX(-50%) scale(0.05)    }
        }
        @keyframes flapOpen  { 0%{transform:rotateX(0deg);z-index:4} 100%{transform:rotateX(-178deg);z-index:0} }
        @keyframes paperRise {
          0%  { transform:translateY(0px);    opacity:0 }
          12% { opacity:1 }
          100%{ transform:translateY(-160px); opacity:1 }
        }
        @keyframes fadeUp    { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }

        .cs-bounce { animation: bounceIn 1s cubic-bezier(.34,1.4,.64,1) forwards; }
        .cs-float  { animation: float 4s ease-in-out 1.2s infinite; }
        .cs-key    { animation: keyAnim 1s ease-in-out 1.3s forwards; }
        .cs-flap   { transform-origin:50% 0%; animation:flapOpen 0.85s cubic-bezier(.4,0,.2,1) 2.4s forwards; }
        .cs-paper  { opacity:0; animation:paperRise .9s cubic-bezier(.34,1.15,.64,1) 3.35s forwards; }
        .cs-f1     { opacity:0; animation:fadeUp .7s ease 3.9s  forwards; }
        .cs-f2     { opacity:0; animation:fadeUp .7s ease 4.3s  forwards; }
        .cs-f3     { opacity:0; animation:fadeUp .7s ease 4.7s  forwards; }
      `}</style>

      <div className="cs-bounce">
        {/* perspective aquí para que el rotateX de la solapa se vea en 3D */}
        <div className="cs-float" style={{ position: "relative", width: EW, height: EH, perspective: "600px" }}>

          {/* Liner blanco fijo — z:1, rellena la boca triangular con blanco para que
              no se vea el fondo rosa de la página cuando la solapa está abierta */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: `${FH}px`,
            background: "white",
            zIndex: 1,
          }} />

          {/* Papel — z:1, queda detrás del cuerpo. Parte alta emerge, parte baja oculta. */}
          <div className="cs-paper" style={{
            position: "absolute",
            top: "0px", left: "18px", right: "18px",
            height: `${EH + 20}px`,
            overflow: "hidden",
            background: "white",
            borderRadius: "3px 3px 4px 4px",
            padding: paperPad,
            textAlign: "center",
            boxShadow: "0 2px 14px rgba(255,100,150,0.18)",
            zIndex: 1,
          }}>
            <p className="cs-f1" style={{ color: "#e91e8c", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: hdrMargin }}>
              Para {para}
            </p>
            <p className="cs-f2" style={{ color: "#4a2035", fontSize: `${msgFontSize}px`, lineHeight: msgLineHeight, fontStyle: "italic", marginBottom: msgMargin, overflowWrap: "break-word", wordBreak: "break-word" }}>
              &ldquo;{mensaje}&rdquo;
            </p>
            <p className="cs-f3" style={{ color: "#e91e8c", fontSize: "13px" }}>
              — Con cariño, {de} 💌
            </p>
          </div>

          {/* Cuerpo del sobre — z:2, clip-path excluye la boca triangular para que
              el papel (z:1) sea visible en ese espacio */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "6px",
            background: C,
            boxShadow: "0 8px 32px rgba(233,30,99,0.22), 0 2px 8px rgba(0,0,0,0.06)",
            zIndex: 2,
            overflow: "hidden",
            clipPath: `polygon(0% 0%, 50% ${(FH/EH*100).toFixed(2)}%, 100% 0%, 100% 100%, 0% 100%)`,
          }}>
            <svg width="100%" height="100%">
              {/* Triángulo inferior */}
              <path d={`M0,${EH} L${EW/2},${EH * 0.54} L${EW},${EH}`} fill={C}/>
              <line x1="0"  y1={EH} x2={EW/2} y2={EH * 0.54} stroke="#e8c8d5" strokeWidth="1"/>
              <line x1={EW} y1={EH} x2={EW/2} y2={EH * 0.54} stroke="#e8c8d5" strokeWidth="1"/>
            </svg>
          </div>

          {/* Líneas del pliegue — z:3, sobre el papel, clipeadas al triángulo de la boca */}
          <svg
            style={{
              position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
              clipPath: `polygon(0% 0%, 100% 0%, 50% ${(FH/EH*100).toFixed(2)}%)`,
            }}
            width={EW} height={EH}
          >
            <line x1="0"  y1="0" x2={EW/2} y2={FH} stroke="#e8c8d5" strokeWidth="1" opacity="0.8"/>
            <line x1={EW} y1="0" x2={EW/2} y2={FH} stroke="#e8c8d5" strokeWidth="1" opacity="0.8"/>
          </svg>

          {/* Solapa — z:4, usa SVG interno (sin clip-path en el div) para que
              rotateX funcione correctamente. Queda abierta al terminar (forwards). */}
          <div className="cs-flap" style={{
            position: "absolute", top: 0, left: 0,
            width: EW, height: FH,
            zIndex: 4,
          }}>
            {/* Triángulo dibujado con SVG — mismo color que el cuerpo */}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
              <path d={`M0,0 L${EW},0 L${EW/2},${FH} Z`} fill={F}/>
              <line x1="0"  y1="0" x2={EW/2} y2={FH} stroke="#e8c8d5" strokeWidth="0.8" opacity="0.5"/>
              <line x1={EW} y1="0" x2={EW/2} y2={FH} stroke="#e8c8d5" strokeWidth="0.8" opacity="0.5"/>
            </svg>

            {/* 🔐 — dentro del flap, en el sello (cerca del vértice del triángulo) */}
            <div className="cs-key" style={{
              position: "absolute",
              top: `${FH - 16}px`,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "26px", lineHeight: 1,
            }}>
              🔐
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
