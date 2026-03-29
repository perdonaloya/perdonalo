"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CATEGORIAS } from "@/lib/data";
import { Tienda, Solicitud } from "@/types";

type Tab = "solicitudes" | "tiendas" | "logs";

interface Log {
  id: string;
  operacion_id: string;
  tipo: string;
  evento: string;
  mensaje: string;
  ip?: string;
  referencia_id?: string;
  datos?: Record<string, unknown>;
  created_at: string;
}

interface Operacion {
  operacion_id: string;
  tipo: string;
  ip?: string;
  referencia_id?: string;
  inicio: string;
  resultado: string;
  eventos: Log[];
}

const EVENTO_BADGE: Record<string, string> = {
  iniciando: "bg-blue-100 text-blue-800",
  ejecutando: "bg-yellow-100 text-yellow-800",
  exito: "bg-green-100 text-green-800",
  fallido: "bg-red-100 text-red-800",
};

const ESTADO_BADGE: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  aprobada: "bg-green-100 text-green-800",
  rechazada: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [errorAuth, setErrorAuth] = useState("");
  const [tab, setTab] = useState<Tab>("solicitudes");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [operacionExpandida, setOperacionExpandida] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [accionando, setAccionando] = useState<string | null>(null);

  const headers = useCallback(() => ({
    "Content-Type": "application/json",
    "x-admin-secret": sessionStorage.getItem("admin_secret") ?? "",
  }), []);

  const cargarSolicitudes = useCallback(async () => {
    const res = await fetch("/api/admin/solicitudes", { headers: headers() });
    if (res.ok) setSolicitudes(await res.json());
  }, [headers]);

  const cargarTiendas = useCallback(async () => {
    const res = await fetch("/api/admin/tiendas", { headers: headers() });
    if (res.ok) setTiendas(await res.json());
  }, [headers]);

  const cargarLogs = useCallback(async () => {
    const res = await fetch("/api/admin/logs", { headers: headers() });
    if (res.ok) setLogs(await res.json());
  }, [headers]);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret");
    if (saved) {
      setAutenticado(true);
      setSecret(saved);
    }
  }, []);

  useEffect(() => {
    if (!autenticado) return;
    setCargando(true);
    Promise.all([cargarSolicitudes(), cargarTiendas(), cargarLogs()]).finally(() => setCargando(false));
  }, [autenticado, cargarSolicitudes, cargarTiendas, cargarLogs]);

  const login = async () => {
    // Verificamos haciendo una llamada real al API
    const res = await fetch("/api/admin/solicitudes", {
      headers: { "x-admin-secret": secret },
    });
    if (res.ok) {
      sessionStorage.setItem("admin_secret", secret);
      setAutenticado(true);
      setErrorAuth("");
    } else {
      setErrorAuth("Contraseña incorrecta.");
    }
  };

  const aprobar = async (id: string) => {
    setAccionando(id);
    await fetch(`/api/admin/solicitudes/${id}/aprobar`, { method: "POST", headers: headers() });
    await cargarSolicitudes();
    await cargarTiendas();
    setAccionando(null);
  };

  const rechazar = async (id: string) => {
    setAccionando(id);
    await fetch(`/api/admin/solicitudes/${id}/rechazar`, { method: "POST", headers: headers() });
    await cargarSolicitudes();
    setAccionando(null);
  };

  const toggleActiva = async (tienda: Tienda) => {
    setAccionando(tienda.id);
    await fetch(`/api/admin/tiendas/${tienda.id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ activa: !tienda.activa }),
    });
    await cargarTiendas();
    setAccionando(null);
  };

  // Pantalla de login
  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-xl font-bold text-foreground">Panel Admin</h1>
          <Input
            type="password"
            placeholder="Contraseña"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="mb-3"
          />
          {errorAuth && <p className="mb-3 text-sm text-destructive">{errorAuth}</p>}
          <Button onClick={login} className="w-full">Entrar</Button>
        </div>
      </div>
    );
  }

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Panel Admin · perdónalo.cl</h1>
          <button
            onClick={() => { sessionStorage.removeItem("admin_secret"); setAutenticado(false); }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("solicitudes")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === "solicitudes"
                ? "bg-primary text-primary-foreground"
                : "bg-white border border-border text-foreground hover:bg-muted"
            }`}
          >
            Solicitudes {pendientes.length > 0 && `(${pendientes.length} pendientes)`}
          </button>
          <button
            onClick={() => setTab("tiendas")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === "tiendas"
                ? "bg-primary text-primary-foreground"
                : "bg-white border border-border text-foreground hover:bg-muted"
            }`}
          >
            Tiendas ({tiendas.length})
          </button>
          <button
            onClick={() => { setTab("logs"); cargarLogs(); }}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === "logs"
                ? "bg-primary text-primary-foreground"
                : "bg-white border border-border text-foreground hover:bg-muted"
            }`}
          >
            Logs ({logs.length})
          </button>
        </div>

        {cargando ? (
          <div className="py-16 text-center text-muted-foreground text-sm">Cargando...</div>
        ) : (
          <>
            {/* Tab Solicitudes */}
            {tab === "solicitudes" && (
              <div className="space-y-4">
                {solicitudes.length === 0 && (
                  <p className="text-muted-foreground text-sm">No hay solicitudes aún.</p>
                )}
                {solicitudes.map((s) => (
                  <div key={s.id} className="rounded-2xl border border-border bg-white overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 p-5 pb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xl">{CATEGORIAS[s.categoria]?.emoji}</span>
                          <h2 className="font-bold text-lg text-foreground">{s.nombre}</h2>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTADO_BADGE[s.estado]}`}>
                            {s.estado}
                          </span>
                          {s.delivery && (
                            <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-semibold">
                              🛵 Delivery
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {CATEGORIAS[s.categoria]?.label} · Solicitud recibida el{" "}
                          {new Date(s.created_at).toLocaleDateString("es-CL", {
                            day: "numeric", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {s.estado === "pendiente" && (
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" onClick={() => aprobar(s.id)} disabled={accionando === s.id}>
                            {accionando === s.id ? "..." : "✓ Aprobar"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => rechazar(s.id)} disabled={accionando === s.id}>
                            ✕ Rechazar
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                      {/* Tienda */}
                      <div className="p-4 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tienda</p>
                        {s.descripcion && <p className="text-sm text-foreground leading-relaxed">{s.descripcion}</p>}
                        {s.direccion && (
                          <p className="text-sm text-muted-foreground">📍 {s.direccion}{s.comuna ? `, ${s.comuna}` : ""}</p>
                        )}
                        {s.horario && (
                          <p className="text-sm text-muted-foreground">🕐 {s.horario}</p>
                        )}
                        {!s.descripcion && !s.direccion && !s.horario && (
                          <p className="text-xs text-muted-foreground italic">Sin datos adicionales</p>
                        )}
                      </div>

                      {/* Contacto público */}
                      <div className="p-4 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contacto público</p>
                        {s.whatsapp ? (
                          <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-green-700 hover:underline">
                            <span>💬</span> {s.whatsapp}
                          </a>
                        ) : <p className="text-xs text-muted-foreground italic">Sin WhatsApp</p>}
                        {s.instagram && (
                          <a href={`https://instagram.com/${s.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-pink-700 hover:underline">
                            <span>📸</span> {s.instagram}
                          </a>
                        )}
                        {s.web && (
                          <a href={s.web} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-blue-700 hover:underline truncate">
                            <span>🌐</span> {s.web}
                          </a>
                        )}
                      </div>

                      {/* Contacto privado */}
                      <div className="p-4 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dueño / Representante</p>
                        {s.nombre_contacto && (
                          <p className="text-sm font-medium text-foreground">👤 {s.nombre_contacto}</p>
                        )}
                        {s.email_contacto && (
                          <a href={`mailto:${s.email_contacto}`}
                            className="flex items-center gap-1.5 text-sm text-blue-700 hover:underline">
                            <span>✉️</span> {s.email_contacto}
                          </a>
                        )}
                        {s.rut ? (
                          <p className="text-sm text-muted-foreground font-mono">🪪 RUT: {s.rut}</p>
                        ) : (
                          <p className="text-xs text-destructive italic">Sin RUT</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Logs */}
            {tab === "logs" && (() => {
              const operaciones: Operacion[] = [];
              const mapa: Record<string, Operacion> = {};
              [...logs].reverse().forEach((log) => {
                if (!log.operacion_id) return;
                if (!mapa[log.operacion_id]) {
                  mapa[log.operacion_id] = {
                    operacion_id: log.operacion_id,
                    tipo: log.tipo,
                    ip: log.ip,
                    referencia_id: log.referencia_id,
                    inicio: log.created_at,
                    resultado: "en curso",
                    eventos: [],
                  };
                  operaciones.push(mapa[log.operacion_id]);
                }
                mapa[log.operacion_id].eventos.push(log);
                if (log.evento === "exito" || log.evento === "fallido") {
                  mapa[log.operacion_id].resultado = log.evento;
                }
                if (log.referencia_id) mapa[log.operacion_id].referencia_id = log.referencia_id;
              });
              operaciones.reverse();

              const TIPO_LABEL: Record<string, string> = {
                carta_digital: "Carta digital",
                pago_carta: "Pago carta",
              };

              return (
                <div className="rounded-2xl border border-border bg-white overflow-hidden">
                  {operaciones.length === 0 && (
                    <p className="text-muted-foreground text-sm p-6">No hay logs aún.</p>
                  )}

                  {/* Cabecera tabla */}
                  {operaciones.length > 0 && (
                    <div className="grid grid-cols-6 gap-2 px-4 py-2 border-b border-border bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span>Estado</span>
                      <span>Producto</span>
                      <span className="col-span-2">ID Transacción</span>
                      <span>IP</span>
                      <span>Fecha</span>
                    </div>
                  )}

                  {operaciones.map((op) => (
                    <div key={op.operacion_id} className="border-b border-border last:border-0">
                      {/* Fila principal */}
                      <button
                        className="w-full grid grid-cols-6 gap-2 px-4 py-3 text-left hover:bg-muted/20 transition-colors items-center"
                        onClick={() => setOperacionExpandida(operacionExpandida === op.operacion_id ? null : op.operacion_id)}
                      >
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit ${EVENTO_BADGE[op.resultado] ?? "bg-gray-100 text-gray-700"}`}>
                          {op.resultado}
                        </span>
                        <span className="text-xs text-foreground">{TIPO_LABEL[op.tipo] ?? op.tipo}</span>
                        <span className="col-span-2 font-mono text-xs text-muted-foreground truncate">
                          {op.operacion_id}
                        </span>
                        <span className="text-xs text-muted-foreground">{op.ip ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(op.inicio).toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </button>

                      {/* Detalle expandido */}
                      {operacionExpandida === op.operacion_id && (
                        <div className="bg-muted/20 px-6 py-4 border-t border-border">
                          {/* Resumen */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">ID referencia</p>
                              <p className="text-xs font-mono text-foreground">{op.referencia_id ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Producto</p>
                              <p className="text-xs text-foreground">{TIPO_LABEL[op.tipo] ?? op.tipo}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">IP</p>
                              <p className="text-xs text-foreground">{op.ip ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Monto</p>
                              <p className="text-xs text-foreground">
                                {(() => {
                                  const evConMonto = op.eventos.find(e => e.datos?.monto != null);
                                  return evConMonto?.datos?.monto ? `$${Number(evConMonto.datos.monto).toLocaleString("es-CL")} CLP` : "—";
                                })()}
                              </p>
                            </div>
                          </div>

                          {/* Timeline de eventos */}
                          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Flujo de eventos</p>
                          <div className="space-y-0">
                            {op.eventos.map((ev, i) => (
                              <div key={ev.id} className="flex gap-3">
                                <div className="flex flex-col items-center shrink-0">
                                  <span className={`rounded-full w-2.5 h-2.5 mt-1 shrink-0 border-2 border-white ${
                                    ev.evento === "exito" ? "bg-green-500" :
                                    ev.evento === "fallido" ? "bg-red-500" :
                                    ev.evento === "ejecutando" ? "bg-yellow-500" : "bg-blue-400"
                                  }`} />
                                  {i < op.eventos.length - 1 && <div className="w-px flex-1 min-h-[16px] bg-border my-0.5" />}
                                </div>
                                <div className="pb-3 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${EVENTO_BADGE[ev.evento] ?? "bg-gray-100 text-gray-700"}`}>
                                      {ev.evento}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {new Date(ev.created_at).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground mt-0.5">{ev.mensaje}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Tab Tiendas */}
            {tab === "tiendas" && (
              <div className="space-y-3">
                {tiendas.length === 0 && (
                  <p className="text-muted-foreground text-sm">No hay tiendas aún.</p>
                )}
                {tiendas.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{CATEGORIAS[t.categoria]?.emoji}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{t.nombre}</p>
                        <p className="text-xs text-muted-foreground">{t.comuna}{t.direccion ? ` · ${t.direccion}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`text-xs cursor-pointer ${t.plan === "pro" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        onClick={() => {
                          setAccionando(t.id);
                          fetch(`/api/admin/tiendas/${t.id}`, {
                            method: "PATCH",
                            headers: headers(),
                            body: JSON.stringify({ plan: t.plan === "pro" ? "gratis" : "pro" }),
                          }).then(() => cargarTiendas()).finally(() => setAccionando(null));
                        }}
                      >
                        {t.plan === "pro" ? "Pro ⭐" : "Gratis"}
                      </Badge>
                      <Badge variant={t.activa ? "default" : "secondary"} className="text-xs">
                        {t.activa ? "Activa" : "Inactiva"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActiva(t)}
                        disabled={accionando === t.id}
                      >
                        {accionando === t.id ? "..." : t.activa ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
