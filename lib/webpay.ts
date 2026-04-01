import { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } from "transbank-sdk";

const isProduction = process.env.TRANSBANK_ENV === "production";

export const PRECIO_CARTA = 1990;
export const PRECIO_ESTRELLA = 2990;

export function getWebpay() {
  if (isProduction) {
    return new WebpayPlus.Transaction(
      new Options(
        process.env.TRANSBANK_COMMERCE_CODE!,
        process.env.TRANSBANK_API_KEY!,
        Environment.Production
      )
    );
  }
  return new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    )
  );
}
