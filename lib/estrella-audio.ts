import type { MusicaEstrella } from "./estrella-config";

// ─── Tracks MP3 (en /public/audio/) ──────────────────────────────────────────
const TRACKS: Partial<Record<MusicaEstrella, string>> = {
  cosmica:   "/audio/melancolic.mp3",
  romantica: "/audio/romantic.mp3",
  serena:    "/audio/serena.mp3",
  magica:    "/audio/estrella.mp3",
};

// ─── Player MP3 con fade ──────────────────────────────────────────────────────
function iniciarMP3(src: string): () => void {
  const audio = new Audio(src);
  audio.loop   = true;
  audio.volume = 0;
  audio.play().catch(() => {});

  // Fade-in suave: ~9 segundos hasta volumen 0.6
  const fadeIn = setInterval(() => {
    const v = Math.min(audio.volume + 0.008, 0.60);
    audio.volume = v;
    if (v >= 0.60) clearInterval(fadeIn);
  }, 120);

  return () => {
    clearInterval(fadeIn);
    const fadeOut = setInterval(() => {
      const v = Math.max(audio.volume - 0.05, 0);
      audio.volume = v;
      if (v <= 0) { clearInterval(fadeOut); audio.pause(); }
    }, 50);
  };
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Inicia el audio ambiente en bucle. Devuelve una función para detenerlo.
 * - cosmica / romantica / serena → MP3 de /public/audio/
 * - magica → wind chimes sintetizados
 */
export function iniciarAmbient(musica: MusicaEstrella, _ctx: AudioContext): () => void {
  const src = TRACKS[musica];
  if (src) return iniciarMP3(src);
  return () => {};
}

/**
 * Toca un preview de ~5 segundos. Devuelve una función para detenerlo antes.
 * No necesita AudioContext externo.
 */
export function crearPreviewAudio(musica: MusicaEstrella): () => void {
  const src = TRACKS[musica];
  if (!src) return () => {};

  const audio = new Audio(src);
  audio.volume = 0.65;
  audio.play().catch(() => {});

  // Fade-out a los 4 segundos
  const fadeTimeout = setTimeout(() => {
    const fadeOut = setInterval(() => {
      const v = Math.max(audio.volume - 0.065, 0);
      audio.volume = v;
      if (v <= 0) { clearInterval(fadeOut); audio.pause(); }
    }, 50);
  }, 4000);

  return () => { clearTimeout(fadeTimeout); audio.pause(); };
}
