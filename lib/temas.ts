export const TEMAS = {
  rosa: {
    emoji: "🌹",
    nombre: "Rosa que florece",
    ocasion: "Disculpa · Amor",
    preview: "from-rose-500 to-pink-800",
  },
  "buenos-dias": {
    emoji: "☀️",
    nombre: "Buenos días",
    ocasion: "Cualquier día",
    preview: "from-amber-300 to-orange-500",
  },
  carta: {
    emoji: "💌",
    nombre: "Carta secreta",
    ocasion: "Romance",
    preview: "from-pink-300 to-rose-500",
  },
  mariposas: {
    emoji: "🦋",
    nombre: "Mariposas",
    ocasion: "Gracias · Cariño",
    preview: "from-violet-300 to-purple-600",
  },
  petals: {
    emoji: "🌸",
    nombre: "Lluvia de pétalos",
    ocasion: "Aniversario",
    preview: "from-pink-200 to-fuchsia-500",
  },
  cumpleanos: {
    emoji: "🎂",
    nombre: "Cumpleaños",
    ocasion: "Cumpleaños",
    preview: "from-yellow-300 to-pink-500",
  },
  "dia-madres": {
    emoji: "🌷",
    nombre: "Día de las Madres",
    ocasion: "Día de la Madre",
    preview: "from-rose-200 to-amber-300",
  },
} as const;

export type TemaKey = keyof typeof TEMAS;
