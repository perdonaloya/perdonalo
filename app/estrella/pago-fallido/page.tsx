"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContenidoPagoFallido() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to bottom, #020209 0%, #0a0a2e 60%, #0d0a1f 100%)" }}
    >
      <div className="text-center px-6 max-w-sm">
        <p className="text-5xl mb-4">❌</p>
        <h1 className="text-2xl font-bold text-white mb-2">Pago rechazado</h1>
        <p className="text-white/50 text-sm mb-8">
          El pago no pudo procesarse. No se realizó ningún cobro.
          {id && " Puedes intentarlo de nuevo."}
        </p>
        <Link
          href="/estrella"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Intentar de nuevo
        </Link>
      </div>
    </div>
  );
}

export default function EstrellasPagoFallidoPage() {
  return (
    <Suspense>
      <ContenidoPagoFallido />
    </Suspense>
  );
}
