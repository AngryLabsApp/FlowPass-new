export interface Payment {
  gym_id: string;
  pago_id: string;
  fecha_pago: string;           // ISO date string
  latest_created_at: string;    // ISO date string
  plan: string;
  monto: number;
  estado_pago: string;          // Podrías tipar como union: "Pagado" | "Pendiente" | "Fallido"
  member_id: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  full_name: string;
  codigo_ingreso: string;
  email: string;
  medio_de_pago: string;        // Ej: "Plin", "Yape", "Tarjeta", etc.
}
