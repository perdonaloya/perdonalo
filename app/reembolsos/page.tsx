import { Navbar } from "@/components/Navbar";

export default function ReembolsosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar maxWidth="max-w-2xl" />

      <div className="mx-auto max-w-2xl px-6 py-12 space-y-8 text-sm text-foreground leading-relaxed">
        <div>
          <h1 className="text-2xl font-bold mb-1">Política de reembolsos</h1>
          <p className="text-muted-foreground text-xs">Última actualización: febrero 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">Regalos digitales</h2>
          <p>Los regalos digitales (cartas animadas) son productos de entrega inmediata. Una vez generado el enlace y completado el pago, el producto ha sido entregado.</p>
          <p>De acuerdo con la Ley del Consumidor (Ley 19.496), el derecho a retracto no aplica para bienes digitales que han sido descargados o activados con el consentimiento del usuario.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">Cuándo sí hacemos reembolso</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Si el pago fue procesado pero el regalo no se generó correctamente</li>
            <li>Si hubo un cobro duplicado por error técnico</li>
            <li>Si el contenido del regalo no corresponde a lo ingresado en el formulario</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">Cómo solicitar un reembolso</h2>
          <p><a href="https://wa.me/56962121964" className="underline underline-offset-4 hover:text-primary transition-colors">Escríbenos por WhatsApp</a> dentro de las 48 horas siguientes al pago, indicando:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>El enlace de tu regalo (ej: perdonalo.cl/carta/xxx)</li>
            <li>El motivo de la solicitud</li>
          </ul>
          <p>Respondemos en menos de 24 horas hábiles.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">Directorio de tiendas</h2>
          <p>perdónalo.cl es un directorio gratuito para los usuarios. No cobramos por explorar tiendas ni por ver sus perfiles, por lo que no aplica política de reembolso en esa sección.</p>
        </section>
      </div>
    </div>
  );
}
