export interface Restaurante {
  // Campos del backend (nombres reales)
  id_restaurante?: string; // UUID del backend
  nombre: string;
  direccion: string;
  telefono: string;
  email?: string;
  capacidad_maxima?: number;
  horario_apertura?: string;
  horario_cierre?: string;
  activo?: boolean;
  usuario_admin_id?: string;
  fecha_creacion?: string;
  fecha_edicion?: string | null;
  
  // Campos mapeados para compatibilidad (se calculan)
  id?: string | number; // Alias de id_restaurante
  capacidad?: number; // Alias de capacidad_maxima
  tipo_cocina?: string; // Campo opcional que puede no venir del backend
  
  [key: string]: any; // Para permitir campos adicionales
}

