import MercadoPagoConfig from "mercadopago";

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Usa sandbox_init_point para tokens TEST-, init_point para producción
export const isSandbox = process.env.MP_ACCESS_TOKEN?.startsWith("TEST-") ?? true;

export const PRECIO_CARTA = 1990;
export const PRECIO_ESTRELLA = 2990;
