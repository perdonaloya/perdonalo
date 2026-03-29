import Link from "next/link";

export default function PagoCanceladoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6 max-w-sm">
        <p className="text-5xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago cancelado</h1>
        <p className="text-gray-500 text-sm mb-8">
          Cancelaste el pago. No se realizó ningún cobro.
        </p>
        <Link
          href="/carta"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Crear un nuevo regalo
        </Link>
      </div>
    </div>
  );
}
