import Link from "next/link";

export default function EstrellasPagoCanceladoPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to bottom, #020209 0%, #0a0a2e 60%, #0d0a1f 100%)" }}
    >
      <div className="text-center px-6 max-w-sm">
        <p className="text-5xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-white mb-2">Pago cancelado</h1>
        <p className="text-white/50 text-sm mb-8">
          Cancelaste el pago. No se realizó ningún cobro.
        </p>
        <Link
          href="/estrella"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Dedicar una estrella
        </Link>
      </div>
    </div>
  );
}
