import { Navbar } from "@/components/Navbar";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar maxWidth="max-w-2xl" />

      <div className="mx-auto max-w-2xl px-6 py-12 space-y-8 text-sm text-foreground leading-relaxed">
        <div>
          <h1 className="text-2xl font-bold mb-1">Términos y condiciones</h1>
          <p className="text-muted-foreground text-xs">Última actualización: febrero 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">1. Descripción del servicio</h2>
          <p>perdonaloya.cl es un directorio digital de tiendas de regalos en Santiago de Chile y una plataforma para enviar regalos digitales animados personalizados. No somos intermediarios en las transacciones entre usuarios y tiendas.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">2. Uso del sitio</h2>
          <p>Al usar perdonaloya.cl aceptas no utilizar el sitio para fines ilícitos, no reproducir el contenido sin autorización y no intentar vulnerar la seguridad de la plataforma.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">3. Regalos digitales</h2>
          <p>Los regalos digitales (cartas animadas) son productos de entrega inmediata. Al completar el pago, el enlace único se genera y activa de forma instantánea. El precio incluye IVA.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">4. Tiendas registradas</h2>
          <p>Las tiendas que aparecen en el directorio son revisadas manualmente antes de ser publicadas. perdonaloya.cl no garantiza la disponibilidad, precios ni calidad de los productos ofrecidos por cada tienda. La relación comercial es directamente entre el usuario y la tienda.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">5. Propiedad intelectual</h2>
          <p>El diseño, nombre, logo y animaciones de perdonaloya.cl son propiedad de sus creadores. Los mensajes personales escritos por los usuarios son de su exclusiva autoría.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">6. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán publicados en esta página.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">7. Contacto</h2>
          <p>Para consultas <a href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER}`} className="underline underline-offset-4 hover:text-primary transition-colors">escríbenos por WhatsApp</a>.</p>
        </section>
      </div>
    </div>
  );
}
