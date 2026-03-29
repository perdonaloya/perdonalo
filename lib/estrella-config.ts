export type EstiloEstrella = "clasica" | "rosa" | "azul" | "plateada";
export type MusicaEstrella = "cosmica" | "romantica" | "serena" | "magica";
export type FuenteEstrella = "sans" | "serif" | "cursiva";
export type ColorTexto = "dorado" | "blanco" | "rosado" | "celeste" | "lila";

export interface EstrellaConfig {
  estilo?: EstiloEstrella;
  musica?: MusicaEstrella;
  fuente?: FuenteEstrella;
  color?: ColorTexto;
}

export const DEFAULT_CONFIG: Required<EstrellaConfig> = {
  estilo: "clasica",
  musica: "cosmica",
  fuente: "sans",
  color: "dorado",
};

export const ESTILOS_ESTRELLA: Record<EstiloEstrella, {
  label: string;
  emoji: string;
  desc: string;
  halo1: string;
  halo2: string;
  halo3: string;
  spikeColor: string;
  coreGradient: string;
  coreGlow: string;
  coreGlowBig: string;
  bgTint: string;
}> = {
  clasica: {
    label: "Clásica",
    emoji: "⭐",
    desc: "Dorada y atemporal",
    halo1: "rgba(255,225,110,0.08)",
    halo2: "rgba(255,215,80,0.14)",
    halo3: "rgba(255,235,150,0.24)",
    spikeColor: "rgba(255,245,180,0.95)",
    coreGradient: "radial-gradient(circle, #fffef2 0%, #ffe97a 50%, #ffcc33 100%)",
    coreGlow: "0 0 10px 5px rgba(255,240,120,0.95), 0 0 28px 12px rgba(255,210,60,0.55), 0 0 70px 28px rgba(255,180,30,0.22)",
    coreGlowBig: "0 0 16px 8px rgba(255,240,120,1), 0 0 46px 20px rgba(255,210,60,0.75), 0 0 100px 45px rgba(255,180,30,0.35)",
    bgTint: "#020209",
  },
  rosa: {
    label: "Rosa",
    emoji: "🌸",
    desc: "Romántica y suave",
    halo1: "rgba(255,160,200,0.08)",
    halo2: "rgba(255,130,180,0.14)",
    halo3: "rgba(255,185,215,0.24)",
    spikeColor: "rgba(255,200,225,0.95)",
    coreGradient: "radial-gradient(circle, #fff0f5 0%, #ffb3cc 50%, #ff6699 100%)",
    coreGlow: "0 0 10px 5px rgba(255,150,200,0.95), 0 0 28px 12px rgba(255,100,170,0.55), 0 0 70px 28px rgba(200,60,120,0.22)",
    coreGlowBig: "0 0 16px 8px rgba(255,160,210,1), 0 0 46px 20px rgba(255,110,180,0.75), 0 0 100px 45px rgba(200,70,130,0.35)",
    bgTint: "#090208",
  },
  azul: {
    label: "Azul",
    emoji: "💙",
    desc: "Etérea y glacial",
    halo1: "rgba(100,160,255,0.08)",
    halo2: "rgba(80,140,255,0.14)",
    halo3: "rgba(140,190,255,0.24)",
    spikeColor: "rgba(180,215,255,0.95)",
    coreGradient: "radial-gradient(circle, #f0f6ff 0%, #88b8ff 50%, #4480ff 100%)",
    coreGlow: "0 0 10px 5px rgba(120,185,255,0.95), 0 0 28px 12px rgba(80,145,255,0.55), 0 0 70px 28px rgba(50,100,255,0.22)",
    coreGlowBig: "0 0 16px 8px rgba(140,200,255,1), 0 0 46px 20px rgba(90,160,255,0.75), 0 0 100px 45px rgba(60,120,255,0.35)",
    bgTint: "#010818",
  },
  plateada: {
    label: "Plateada",
    emoji: "✨",
    desc: "Fría y minimalista",
    halo1: "rgba(200,215,255,0.07)",
    halo2: "rgba(190,205,255,0.12)",
    halo3: "rgba(215,225,255,0.20)",
    spikeColor: "rgba(225,235,255,0.95)",
    coreGradient: "radial-gradient(circle, #ffffff 0%, #d0dcff 50%, #a8b8ee 100%)",
    coreGlow: "0 0 10px 5px rgba(210,225,255,0.95), 0 0 28px 12px rgba(180,200,255,0.55), 0 0 70px 28px rgba(150,175,255,0.22)",
    coreGlowBig: "0 0 16px 8px rgba(225,235,255,1), 0 0 46px 20px rgba(190,210,255,0.75), 0 0 100px 45px rgba(165,190,255,0.35)",
    bgTint: "#040612",
  },
};

export const MUSICAS_ESTRELLA: Record<MusicaEstrella, { label: string; emoji: string; desc: string }> = {
  cosmica:   { label: "Cósmica",   emoji: "🌌", desc: "Profunda y misteriosa"   },
  romantica: { label: "Romántica", emoji: "🎵", desc: "Cálida y relajante"      },
  serena:    { label: "Serena",    emoji: "🌙", desc: "Silenciosa, contemplativa" },
  magica:    { label: "Mágica",    emoji: "✨", desc: "Destellos y campanillas"  },
};

export const FUENTES_ESTRELLA: Record<FuenteEstrella, { label: string; sample: string; desc: string; fontFamily: string }> = {
  sans: {
    label: "Moderna",
    sample: "Aa",
    desc: "Limpia y minimalista",
    fontFamily: "inherit",
  },
  serif: {
    label: "Elegante",
    sample: "Aa",
    desc: "Clásica y atemporal",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  cursiva: {
    label: "Cursiva",
    sample: "Hola",
    desc: "Romántica y fluida",
    fontFamily: "'Dancing Script', cursive",
  },
};

export const COLORES_TEXTO: Record<ColorTexto, { label: string; desc: string; value: string; swatch: string }> = {
  dorado: { label: "Dorado", desc: "Cálido y luminoso", value: "rgba(255,235,140,0.90)", swatch: "#ffd700" },
  blanco: { label: "Blanco", desc: "Puro y etéreo", value: "rgba(255,255,255,0.88)", swatch: "#ffffff" },
  rosado: { label: "Rosado", desc: "Delicado y romántico", value: "rgba(255,182,210,0.90)", swatch: "#ffb6d2" },
  celeste: { label: "Celeste", desc: "Sereno y profundo", value: "rgba(180,215,255,0.90)", swatch: "#b4d7ff" },
  lila: { label: "Lila", desc: "Misterioso y suave", value: "rgba(210,175,255,0.90)", swatch: "#d2afff" },
};
