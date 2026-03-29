import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

const pasos = [
  {
    numero: "01",
    titulo: "Cuéntanos qué pasó",
    descripcion: "Describe tu cagada o elige una opción. Sin juicios, aquí todos hemos estado.",
  },
  {
    numero: "02",
    titulo: "Analizamos la gravedad",
    descripcion: "Te decimos qué tan grave fue y qué tipo de gesto necesitas para arreglarlo.",
  },
  {
    numero: "03",
    titulo: "Haz el gesto",
    descripcion: "Envía una carta animada o dedícale una estrella. En minutos, desde donde estés.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar>
        {/* <Button variant="ghost" asChild><Link href="/explorar">Ver tiendas</Link></Button> */}
        <Button variant="ghost" data-variant="ghost" asChild><Link href="/carta">💝 Carta</Link></Button>
        <Button variant="ghost" data-variant="ghost" asChild><Link href="/estrella">✨ Estrella</Link></Button>
        <Button data-variant="default" asChild><Link href="/recomiendame">La cagué</Link></Button>
      </Navbar>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <Badge className="mb-6 bg-accent text-accent-foreground hover:bg-accent">Chile</Badge>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            ¿La cagaste?<br />
            <span className="text-primary">Nosotros te salvamos.</span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Cuéntanos qué pasó y te ayudamos a encontrar el gesto perfecto.
            Una carta animada o una estrella dedicada — en minutos, desde donde estés.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/recomiendame">😬 La cagué — ayúdame</Link>
            </Button>
            {/* <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/obsequios">💕 Quiero regalar algo</Link>
            </Button> */}
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/estrella">✨ Dedícale una estrella</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Regalos digitales */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl grid gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-3xl border border-primary/20 bg-white p-10 shadow-sm">
            <div>
              <p className="text-3xl mb-3">💝</p>
              <h2 className="text-2xl font-semibold text-foreground">Carta animada digital</h2>
              <p className="mt-2 text-muted-foreground">
                Un mensaje personalizado con animación que pueden guardar para siempre. Desde $1.990 CLP.
              </p>
            </div>
            <Button size="lg" className="mt-6 w-full sm:w-auto self-start" asChild>
              <Link href="/carta">Crear carta →</Link>
            </Button>
          </div>

          <div
            className="flex flex-col justify-between rounded-3xl p-10 shadow-sm"
            style={{ background: "linear-gradient(135deg, #03030f 0%, #0a0a2e 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div>
              <p className="text-3xl mb-3">✨</p>
              <h2 className="text-2xl font-semibold text-white">Dedícale una estrella</h2>
              <p className="mt-2 text-white/50">
                Un cielo nocturno con una estrella que lleva su nombre y un código secreto. Solo ella puede abrirla.
              </p>
            </div>
            <Button size="lg" className="mt-6 w-full sm:w-auto self-start" variant="outline" asChild
              style={{ borderColor: "rgba(255,220,90,0.4)", color: "rgba(255,235,140,0.9)", background: "rgba(255,220,90,0.08)" }}
            >
              <Link href="/estrella">Dedicar estrella →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground">
            ¿Cómo funciona?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {pasos.map((paso) => (
              <div key={paso.numero} className="flex flex-col items-start">
                <span className="mb-4 text-4xl font-bold text-primary/20">{paso.numero}</span>
                <h3 className="mb-2 font-semibold text-foreground">{paso.titulo}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary px-6 py-16 text-center text-primary-foreground">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold">El tiempo corre.</h2>
          <p className="mb-8 text-primary-foreground/80">
            Cuanto antes actúes, mejor. Encuentra el gesto que necesitas hoy.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/recomiendame">Empezar ahora</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground space-y-3">
        <p>perdonaloya.cl — Chile · 2026</p>
        {/* <p>
          <Link href="/para-tiendas" className="hover:text-foreground transition-colors underline underline-offset-4">
            ¿Tienes una tienda? Únete a perdonaloya.cl →
          </Link>
        </p> */}
        <div className="flex justify-center gap-4 text-xs">
          <Link href="/terminos" className="hover:text-foreground transition-colors">Términos y condiciones</Link>
          <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
          <Link href="/reembolsos" className="hover:text-foreground transition-colors">Reembolsos</Link>
        </div>
      </footer>
    </div>
  );
}
