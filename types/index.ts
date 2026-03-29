export type Categoria = "floristeria" | "chocolateria" | "peluches" | "regalos" | "joyeria" | "desayunos" | "otros";

export interface Tienda {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  comuna: string;
  whatsapp?: string;
  instagram?: string;
  web?: string;
  logo?: string;
  direccion?: string;
  lat?: number;
  lng?: number;
  plan?: "gratis" | "pro";
  activa: boolean;
  delivery?: boolean;
  horario?: string;
  calificacion_promedio?: number | null;
  total_resenas?: number;
}

export interface Producto {
  id: string;
  tiendaId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  nivelCagada: 1 | 2 | 3 | 4 | 5;
  activo: boolean;
}

export interface Resena {
  id: string;
  tienda_id: string;
  nombre_autor?: string;
  calificacion: number;
  comentario?: string;
  created_at: string;
}

export interface Carta {
  id: string;
  para: string;
  de: string;
  mensaje: string;
  tema: string;
  pagada: boolean;
  email_comprador?: string;
  created_at: string;
}

export interface Solicitud {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  comuna?: string;
  whatsapp?: string;
  instagram?: string;
  web?: string;
  nombre_contacto?: string;
  email_contacto?: string;
  direccion?: string;
  rut?: string;
  horario?: string;
  delivery?: boolean;
  estado: "pendiente" | "aprobada" | "rechazada";
  created_at: string;
}
