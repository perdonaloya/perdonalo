"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Tienda } from "@/types";
import { CATEGORIAS } from "@/lib/data";

const iconos: Record<string, L.DivIcon> = {};

function getIcono(categoria: string): L.DivIcon {
  if (!iconos[categoria]) {
    const emoji = CATEGORIAS[categoria]?.emoji ?? "📍";
    iconos[categoria] = L.divIcon({
      html: `<div style="font-size:24px;line-height:1;">${emoji}</div>`,
      className: "",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  }
  return iconos[categoria];
}

const iconoUsuario = L.divIcon({
  html: `<div style="font-size:22px;line-height:1;">📌</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Componente interno que vuela al cambiar ubicación
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

interface Props {
  tiendas: Tienda[];
  userLocation?: UserLocation | null;
}

export default function MapaTiendas({ tiendas, userLocation }: Props) {
  const tiendasConCoordenadas = tiendas.filter((t) => t.lat && t.lng);

  return (
    <MapContainer
      center={[-33.43, -70.62]}
      zoom={12}
      style={{ height: "420px", width: "100%", borderRadius: "1rem" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de tiendas */}
      {tiendasConCoordenadas.map((tienda) => (
        <Marker
          key={tienda.id}
          position={[tienda.lat!, tienda.lng!]}
          icon={getIcono(tienda.categoria)}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold">{tienda.nombre}</p>
              <p className="text-xs text-gray-500">{tienda.comuna}</p>
              {tienda.whatsapp && (
                <a
                  href={`https://wa.me/${tienda.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-xs font-medium text-green-600 hover:underline"
                >
                  WhatsApp →
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Ubicación del usuario */}
      {userLocation && (
        <>
          <FlyTo lat={userLocation.lat} lng={userLocation.lng} />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={iconoUsuario}>
            <Popup>
              <p className="font-semibold text-sm">Tu ubicación</p>
            </Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={2000}
            pathOptions={{ color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.07, weight: 1.5 }}
          />
        </>
      )}
    </MapContainer>
  );
}
