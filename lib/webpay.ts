import {
  WebpayPlus,
  Options,
  Environment,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
} from "transbank-sdk";

// En producción reemplazar con:
// commerceCode: process.env.TBK_COMMERCE_CODE!
// apiKey: process.env.TBK_API_KEY!
// environment: Environment.Production

export const webpayTx = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  )
);

export const PRECIO_CARTA = 1990;
export const PRECIO_ESTRELLA = 1990;
