import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/estrella/pago-exitoso", "/carta/pago-exitoso"] },
    sitemap: "https://perdonaloya.cl/sitemap.xml",
  };
}
