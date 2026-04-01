import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://perdonaloya.cl";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/carta`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/estrella`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/terminos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
