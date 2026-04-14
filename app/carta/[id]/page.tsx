import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";
import CartaView from "./CartaView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: carta } = await supabaseAdmin
    .from("cartas")
    .select("para, de, pagada")
    .eq("id", id)
    .single();

  if (!carta || !carta.pagada) {
    return { title: "perdonaloya.cl — Regalos digitales con corazón" };
  }

  const title = `${carta.de} te envió una carta 💝`;
  const description = `Abre la carta animada que ${carta.de} preparó especialmente para ti en perdonaloya.cl`;

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

export default async function CartaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: carta } = await supabaseAdmin
    .from("cartas")
    .select("para, de, pagada, created_at")
    .eq("id", id)
    .single();

  const jsonLd = carta?.pagada
    ? {
        "@context": "https://schema.org",
        "@type": "Message",
        name: `Carta de ${carta.de} para ${carta.para}`,
        sender: { "@type": "Person", name: carta.de },
        recipient: { "@type": "Person", name: carta.para },
        dateCreated: carta.created_at,
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
      <CartaView />
    </>
  );
}
