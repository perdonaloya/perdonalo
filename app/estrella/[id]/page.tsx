import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";
import EstrellaView from "./EstrellaView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: estrella } = await supabaseAdmin
    .from("estrellas")
    .select("para, de, nombre_estrella, pagada")
    .eq("id", id)
    .single();

  if (!estrella || !estrella.pagada) {
    return { title: "perdonaloya.cl — Regalos digitales con corazón" };
  }

  const title = `${estrella.de} dedicó la estrella "${estrella.nombre_estrella}" para ${estrella.para} ✨`;
  const description = `Alguien dedicó una estrella en el firmamento especialmente para ${estrella.para}. Ábrela en perdonaloya.cl`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/logo.png", width: 512, height: 512, alt: "perdonaloya.cl" }],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: { index: false, follow: false },
  };
}

export default async function EstrellaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: estrella } = await supabaseAdmin
    .from("estrellas")
    .select("para, de, nombre_estrella, pagada, created_at")
    .eq("id", id)
    .single();

  const jsonLd = estrella?.pagada
    ? {
        "@context": "https://schema.org",
        "@type": "Message",
        name: `Estrella "${estrella.nombre_estrella}" de ${estrella.de} para ${estrella.para}`,
        sender: { "@type": "Person", name: estrella.de },
        recipient: { "@type": "Person", name: estrella.para },
        dateCreated: estrella.created_at,
        provider: {
          "@type": "Organization",
          name: "perdonaloya.cl",
          url: "https://perdonaloya.cl",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <EstrellaView />
    </>
  );
}
