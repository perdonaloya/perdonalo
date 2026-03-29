"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContenidoPagoFallido() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6 max-w-sm">
        <p className="text-5xl mb-4">❌</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago no completado</h1>
        <p className="text-gray-500 text-sm mb-8">
          Hubo un problema con el pago. No se realizó ningún cobro.
        </p>
        <div className="flex flex-col gap-3">
          {id && (
            <Link
              href={`/carta?retry=${id}`}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all"
            >
              Intentar de nuevo
            </Link>
          )}
          <Link
            href="/"
            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PagoFallidoPage() {
  return (
    <Suspense>
      <ContenidoPagoFallido />
    </Suspense>
  );
}
