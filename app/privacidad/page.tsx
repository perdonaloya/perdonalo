import { Navbar } from "@/components/Navbar";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar maxWidth="max-w-2xl" />

      <div className="mx-auto max-w-2xl px-6 py-12 space-y-8 text-sm text-foreground leading-relaxed">
        <div>
          <h1 className="text-2xl font-bold mb-1">Política de privacidad</h1>
          <p className="text-muted-foreground text-xs">Última actualización: febrero 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">1. Datos que recopilamos</h2>
          <p>Recopilamos únicamente los datos necesarios para operar el servicio:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Nombre y email de contacto de tiendas que solicitan registro</li>
            <li>Nombres y mensajes ingresados al crear un regalo digital</li>
            <li>Datos de pago (procesados por Mercado Pago, no los almacenamos)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">2. Cómo usamos tus datos</h2>
          <p>Los datos recopilados se usan exclusivamente para:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Evaluar y gestionar solicitudes de tiendas</li>
            <li>Generar y entregar regalos digitales personalizados</li>
            <li>Comunicarnos contigo sobre tu cuenta o solicitud</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">3. Compartir información</h2>
          <p>No vendemos ni cedemos tus datos personales a terceros. Los datos de pago son procesados directamente por Mercado Pago bajo sus propias políticas de privacidad.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">4. Seguridad</h2>
          <p>Almacenamos los datos en servidores seguros (Supabase). El acceso está protegido y limitado al equipo de perdonaloya.cl.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">5. Tus derechos (Ley 19.628)</h2>
          <p>Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Para ejercer estos derechos <a href={process.env.NEXT_PUBLIC_WHATSAPP_URL} className="underline underline-offset-4 hover:text-primary transition-colors">contáctanos por WhatsApp</a>.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">6. Cookies</h2>
          <p>El sitio no utiliza cookies de seguimiento ni publicidad. Solo se usan cookies técnicas esenciales para el funcionamiento del sitio.</p>
        </section>
      </div>
    </div>
  );
}
