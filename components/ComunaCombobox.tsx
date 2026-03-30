"use client";

import { useState, useRef, useEffect } from "react";
import { COMUNAS_SANTIAGO } from "@/lib/data";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;

}

export function ComunaCombobox({ value, onChange, placeholder = "📍 Todas las comunas" }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtradas = COMUNAS_SANTIAGO.filter((c) =>
    c.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
        setBusqueda("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus en el input al abrir
  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  const seleccionar = (comuna: string) => {
    onChange(comuna);
    setAbierto(false);
    setBusqueda("");
  };

  const limpiar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setAbierto(false);
    setBusqueda("");
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          value
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-white text-foreground hover:bg-muted"
        }`}
      >
        <span>{value || placeholder}</span>
        {value ? (
          <span
            onClick={limpiar}
            className="ml-0.5 opacity-70 hover:opacity-100 text-xs leading-none"
            aria-label="Limpiar"
          >
            ✕
          </span>
        ) : (
          <span className="opacity-50 text-xs">▾</span>
        )}
      </button>

      {/* Dropdown */}
      {abierto && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-white shadow-lg">
          {/* Búsqueda */}
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar comuna..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Lista */}
          <div className="max-h-52 overflow-y-auto py-1">
            {/* Opción "Todas" */}
            <button
              type="button"
              onClick={() => seleccionar("")}
              className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                !value ? "font-medium text-primary" : "text-foreground"
              }`}
            >
              Todas las comunas
            </button>

            {filtradas.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">Sin resultados</p>
            ) : (
              filtradas.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => seleccionar(c)}
                  className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                    value === c ? "font-medium text-primary" : "text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
