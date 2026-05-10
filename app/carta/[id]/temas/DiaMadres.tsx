"use client";

import { useState } from "react";

interface Props { para: string; de: string; mensaje: string; }

export default function DiaMadres({ para, de, mensaje }: Props) {
  const [open, setOpen] = useState(false);

  const msgFs = mensaje.length <= 100 ? "0.95rem" : mensaje.length <= 180 ? "0.82rem" : "0.72rem";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 overflow-x-hidden"
      style={{ background: "#fff8f4", fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,500;1,400&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');

        .dm-scene {
          perspective: 1200px;
        }
        .dm-flipper {
          transform-style: preserve-3d;
          transform-origin: left center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (hover: hover) {
          .dm-scene:hover .dm-flipper {
            transform: rotateY(-165deg);
          }
        }
        .dm-scene.is-open .dm-flipper {
          transform: rotateY(-165deg);
        }
        .dm-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .dm-face-back {
          transform: rotateY(180deg);
        }
        .dm-gold-rule {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, #735c00, transparent);
          margin: 0 auto;
        }
      `}</style>

      {/* Tarjeta — translateX(-25%) centra la portada (mitad derecha del scene) */}
      <div
        className={`dm-scene relative cursor-pointer drop-shadow-xl ${open ? "is-open" : ""}`}
        style={{ width: "min(600px, 96vw)", aspectRatio: "3/2", transform: "translateX(-25%)" }}
        onClick={() => setOpen(v => !v)}
      >
        {/* Interior derecho (mensaje) — fijo detrás de la portada */}
        <div
          className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center z-0 rounded-r-lg"
          style={{
            width: "50%",
            background: "#fff8f4",
            border: "1px solid #d4c2c2",
            borderLeft: "none",
            padding: "clamp(12px, 4%, 32px)",
          }}
        >
          <p style={{
            fontSize: "clamp(0.55rem, 1.2vw, 0.68rem)",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#7b5455",
            marginBottom: "clamp(6px, 2%, 12px)",
          }}>
            Para {para}
          </p>

          <div className="dm-gold-rule" style={{ marginBottom: "clamp(8px, 2.5%, 14px)" }} />

          <p style={{
            fontFamily: "'Noto Serif', Georgia, serif",
            fontSize: `clamp(0.68rem, ${msgFs === "0.95rem" ? "2" : msgFs === "0.82rem" ? "1.8" : "1.5"}vw, ${msgFs})`,
            fontStyle: "italic",
            color: "#1f1b17",
            lineHeight: "1.7",
            textAlign: "center",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            overflow: "auto",
            maxHeight: "50%",
          }}>
            &ldquo;{mensaje}&rdquo;
          </p>

          <div className="dm-gold-rule" style={{ marginTop: "clamp(8px, 2.5%, 14px)", marginBottom: "clamp(6px, 2%, 10px)" }} />

          <p style={{
            fontFamily: "'Noto Serif', Georgia, serif",
            fontSize: "clamp(0.62rem, 1.3vw, 0.8rem)",
            color: "#504444",
          }}>
            — Con amor, {de} 🌷
          </p>
        </div>

        {/* Lomo central */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: "50%", width: "1px", background: "#d4c2c2" }}
        />

        {/* Portada plegable */}
        <div
          className="dm-flipper absolute z-20"
          style={{ left: "50%", width: "50%", height: "100%" }}
        >
          {/* Cara frontal — portada externa */}
          <div
            className="dm-face rounded-r-lg overflow-hidden"
            style={{ border: "1px solid #e8dcd4" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Portada Día de las Madres"
              src="/externo.png"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Cara trasera — portada interna */}
          <div
            className="dm-face dm-face-back rounded-l-lg overflow-hidden"
            style={{ borderTop: "1px solid #e8dcd4", borderBottom: "1px solid #e8dcd4", borderLeft: "1px solid #e8dcd4", borderRight: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Interior Día de las Madres"
              src="/interno.png"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <p style={{
        fontSize: "0.7rem",
        color: "#827473",
        letterSpacing: "0.05em",
      }}>
        Pasa el cursor o toca para abrir
      </p>
    </div>
  );
}
