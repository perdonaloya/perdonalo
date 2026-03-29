"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CATEGORIAS } from "@/lib/data";
import { Categoria, Tienda } from "@/types";
import type { UserLocation } from "@/components/MapaTiendas";
import { Navbar } from "@/components/Navbar";
import { ComunaCombobox } from "@/components/ComunaCombobox";

const MapaTiendas = dynamic(() => import("@/components/MapaTiendas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl bg-muted text-muted-foreground text-sm">
      Cargando mapa...
    </div>
  ),
});

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistancia(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function Estrellas({ valor, total }: { valor: number | null | undefined; total?: number }) {
  if (!valor) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
      {"★".repeat(Math.round(valor))}{"☆".repeat(5 - Math.round(valor))}
      <span className="text-muted-foreground font-normal">
        {valor.toFixed(1)}{total ? ` (${total})` : ""}
      </span>
    </span>
  );
}

type Ordenar = "relevancia" | "cercanas" | "calificacion" | "az";

const ORDENAR_LABELS: Record<Ordenar, string> = {
  relevancia: "Relevancia",
  cercanas: "Más cercanas",
  calificacion: "Mejor calificadas",
  az: "A → Z",
};

export default function ExplorarPage() {
  const router = useRouter();
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [cargandoTiendas, setCargandoTiendas] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria | "todas">("todas");
  const [comunaActiva, setComunaActiva] = useState("");
  const [soloDelivery, setSoloDelivery] = useState(false);
  const [soloDestacadas, setSoloDestacadas] = useState(false);
  const [calMinima, setCalMinima] = useState(0);
  const [ordenar, setOrdenar] = useState<Ordenar>("relevancia");

  // Ubicación
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [direccion, setDireccion] = useState("");
  const [cargandoUbic, setCargandoUbic] = useState(false);
  const [errorUbic, setErrorUbic] = useState("");

  useEffect(() => {
    fetch("/api/tiendas")
      .then((res) => res.json())
      .then((data) => setTiendas(data))
      .finally(() => setCargandoTiendas(false));
  }, []);

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) { setErrorUbic("Tu navegador no soporta geolocalización."); return; }
    setCargandoUbic(true);
    setErrorUbic("");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setCargandoUbic(false); },
      () => { setErrorUbic("No se pudo obtener tu ubicación."); setCargandoUbic(false); }
    );
  };

  const buscarDireccion = async () => {
    if (!direccion.trim()) return;
    setCargandoUbic(true);
    setErrorUbic("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion + ", Santiago, Chile")}&format=json&limit=1`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await res.json();
      if (data[0]) setUserLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      else setErrorUbic("No se encontró esa dirección.");
    } catch { setErrorUbic("Error al buscar la dirección."); }
    finally { setCargandoUbic(false); }
  };

  const tiendasFiltradas = useMemo(() => {
    return tiendas
      .filter((t) => {
        if (busqueda.trim()) {
          const q = busqueda.toLowerCase();
          const coincide =
            t.nombre.toLowerCase().includes(q) ||
            t.descripcion?.toLowerCase().includes(q) ||
            t.comuna?.toLowerCase().includes(q);
          if (!coincide) return false;
        }
        if (categoriaActiva !== "todas" && t.categoria !== categoriaActiva) return false;
        if (comunaActiva && t.comuna !== comunaActiva) return false;
        if (soloDelivery && !t.delivery) return false;
        if (soloDestacadas && t.plan !== "pro") return false;
        if (calMinima > 0 && (t.calificacion_promedio ?? 0) < calMinima) return false;
        return true;
      })
      .map((t) => ({
        ...t,
        distancia: userLocation && t.lat && t.lng
          ? haversine(userLocation.lat, userLocation.lng, t.lat, t.lng)
          : null,
      }))
      .sort((a, b) => {
        switch (ordenar) {
          case "cercanas":
            if (a.distancia !== null && b.distancia !== null) return a.distancia - b.distancia;
            if (a.distancia !== null) return -1;
            if (b.distancia !== null) return 1;
            return 0;
          case "calificacion":
            return (b.calificacion_promedio ?? 0) - (a.calificacion_promedio ?? 0);
          case "az":
            return a.nombre.localeCompare(b.nombre);
          default: // relevancia: pro primero, luego por calificación
            if (a.plan === "pro" && b.plan !== "pro") return -1;
            if (b.plan === "pro" && a.plan !== "pro") return 1;
            return (b.calificacion_promedio ?? 0) - (a.calificacion_promedio ?? 0);
        }
      });
  }, [tiendas, busqueda, categoriaActiva, comunaActiva, soloDelivery, soloDestacadas, calMinima, ordenar, userLocation]);

  const [showFiltros, setShowFiltros] = useState(false);
  const [showMapa, setShowMapa] = useState(false);

  const filtrosAvanzadosActivos = [soloDelivery, soloDestacadas, calMinima > 0, !!comunaActiva]
    .filter(Boolean).length;

  const hayFiltrosActivos = busqueda || categoriaActiva !== "todas" || comunaActiva ||
    soloDelivery || soloDestacadas || calMinima > 0;

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaActiva("todas");
    setComunaActiva("");
    setSoloDelivery(false);
    setSoloDestacadas(false);
    setCalMinima(0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar>
        <Button asChild><Link href="/recomiendame">Ayúdame a elegir ✨</Link></Button>
      </Navbar>

      <div className="mx-auto max-w-5xl px-6 pt-4">
        <Link href="/" className="text-lg text-muted-foreground hover:text-foreground transition-colors">←</Link>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Tiendas en Santiago</h1>
          <p className="mt-1 text-muted-foreground">Encuentra el regalo perfecto entre todas las tiendas.</p>
        </div>

        {/* ── Filtros ───────────────────────────────────────────── */}
        <div className="mb-6 space-y-3">

          {/* Fila 1: búsqueda + botones */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
              <Input
                placeholder="Buscar tienda..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filtros avanzados toggle */}
            <button
              onClick={() => setShowFiltros((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                showFiltros || filtrosAvanzadosActivos > 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-foreground hover:bg-muted"
              }`}
            >
              Filtros
              {filtrosAvanzadosActivos > 0 && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-primary text-xs font-bold">
                  {filtrosAvanzadosActivos}
                </span>
              )}
              <span className="text-xs opacity-60">{showFiltros ? "▲" : "▼"}</span>
            </button>

            {/* Mapa toggle */}
            <button
              onClick={() => setShowMapa((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                showMapa
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-foreground hover:bg-muted"
              }`}
            >
              🗺 Mapa
            </button>
          </div>

          {/* Fila 2: categorías */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaActiva("todas")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                categoriaActiva === "todas"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-foreground hover:bg-muted"
              }`}
            >
              Todas
            </button>
            {Object.entries(CATEGORIAS).map(([key, { label, emoji }]) => (
              <button
                key={key}
                onClick={() => setCategoriaActiva(key as Categoria)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  categoriaActiva === key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-foreground hover:bg-muted"
                }`}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Panel avanzado colapsable */}
          {showFiltros && (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSoloDelivery((v) => !v)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    soloDelivery
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white text-foreground hover:bg-muted"
                  }`}
                >
                  🚚 Con delivery
                </button>

                <button
                  onClick={() => setSoloDestacadas((v) => !v)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    soloDestacadas
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white text-foreground hover:bg-muted"
                  }`}
                >
                  ⭐ Destacadas
                </button>

                {[4, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCalMinima(calMinima === n ? 0 : n)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      calMinima === n
                        ? "border-amber-400 bg-amber-50 text-amber-700"
                        : "border-border bg-white text-foreground hover:bg-muted"
                    }`}
                  >
                    {n}+ ★
                  </button>
                ))}

                <div className="hidden sm:block h-6 w-px bg-border" />

                <ComunaCombobox value={comunaActiva} onChange={setComunaActiva} />

                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value as Ordenar)}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {(Object.entries(ORDENAR_LABELS) as [Ordenar, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              {filtrosAvanzadosActivos > 0 && (
                <button
                  onClick={() => {
                    setComunaActiva("");
                    setSoloDelivery(false);
                    setSoloDestacadas(false);
                    setCalMinima(0);
                  }}
                  className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Limpiar filtros avanzados
                </button>
              )}
            </div>
          )}

          {/* Panel de mapa colapsable */}
          {showMapa && (
            <div className="rounded-2xl border border-border p-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" onClick={usarMiUbicacion} disabled={cargandoUbic} className="shrink-0">
                  {cargandoUbic ? "Buscando..." : "📍 Mi ubicación"}
                </Button>
                <div className="flex flex-1 gap-2">
                  <Input
                    placeholder="Ingresa una dirección en Santiago..."
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && buscarDireccion()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={buscarDireccion} disabled={cargandoUbic || !direccion.trim()}>
                    Buscar
                  </Button>
                </div>
              </div>
              {errorUbic && <p className="text-sm text-destructive">{errorUbic}</p>}
              {userLocation && (
                <p className="text-xs text-muted-foreground">
                  Tiendas ordenadas por distancia · círculo = 2 km
                </p>
              )}
              <MapaTiendas tiendas={tiendas} userLocation={userLocation} />
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm text-muted-foreground">
              {cargandoTiendas
                ? "Cargando..."
                : `${tiendasFiltradas.length} ${tiendasFiltradas.length === 1 ? "tienda" : "tiendas"} encontradas`}
            </p>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-xs text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Grid de tiendas */}
        {cargandoTiendas ? (
          <div className="py-16 text-center text-muted-foreground text-sm">Cargando tiendas...</div>
        ) : tiendasFiltradas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-2">No hay tiendas con esos filtros.</p>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiendasFiltradas.map((tienda) => {
              const cat = CATEGORIAS[tienda.categoria];
              return (
                <div
                  key={tienda.id}
                  onClick={() => router.push(`/tiendas/${tienda.id}`)}
                  className={`flex flex-col rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer ${
                    tienda.plan === "pro"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-2xl">{cat?.emoji}</span>
                      <h2 className="mt-1 font-semibold text-foreground leading-snug">{tienda.nombre}</h2>
                      <Estrellas valor={tienda.calificacion_promedio} total={tienda.total_resenas} />
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {tienda.plan === "pro" && (
                        <Badge className="text-xs bg-primary text-primary-foreground">⭐ Destacada</Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">{tienda.comuna}</Badge>
                      {tienda.distancia !== null && (
                        <span className="text-xs font-medium text-primary">
                          {formatDistancia(tienda.distancia)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges delivery / horario */}
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {tienda.delivery && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">🚚 Delivery</span>
                    )}
                    {tienda.horario && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">🕐 {tienda.horario}</span>
                    )}
                  </div>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {tienda.descripcion}
                  </p>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {tienda.whatsapp && (
                      <a
                        href={`https://wa.me/${tienda.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full">WhatsApp</Button>
                      </a>
                    )}
                    {tienda.instagram && (
                      <a
                        href={`https://instagram.com/${tienda.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button size="sm" variant="outline" className="w-full">Instagram</Button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
