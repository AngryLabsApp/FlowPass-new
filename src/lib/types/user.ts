export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  plan: string;
  estado: string;
  clases_tomadas: number;
  limite_clases: number;
  monto: number;
  medio_de_pago: string | null;
  codigo_ingreso: string;
  fecha_inicio_plan: string;   // puedes usar Date si parseas
  fecha_alta: string;          // idem
  proxima_fecha_pago: string;  // idem
  cumpleanos: string | null;
  dias_de_gracia: number;
  notificar: string;           // quizá más adelante convenga un enum: "Si" | "No"
  estado_pago: string;         // idem: "Pagado" | "Pendiente"
  patologias: string;
  identificacion: string;
  direccion: string;
  de_viaje: string;            // idem: "Si" | "No"
  is_plan_partner: boolean;
  is_plan_principal: boolean;
  partner_id: string | null;
  partner_nombre: string | null;
  partner_apellidos: string | null;
  partner_clases_tomadas: number | null;
  partner_limite_clases: number | null;
  partner_estado_pago: string | null;
  partner_estado: string | null;
  partner_dias_de_gracia: number | null;
  partner_monto: number | null;
  partner_fecha_inicio_plan: string | null;  // idem
  partner_proxima_fecha_pago: string | null; // idem
}
