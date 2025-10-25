export interface IngresoResponse {
  error: boolean;
  reason: string;
  user?: IngresoUser;
}

export interface IngresoUser{
    nombre: string;
    apellidos: string;
    clases_tomadas: number;
    limite_clases: number;
    fecha_inicio_plan: string;
    proxima_fecha_pago: string;
    estado: string;
    partner_nombre: string;
    partner_apellido: string;
}

export interface IngresosHistory {
    clases_tomadas: number;
    created_at: string;
    id: string;
    pago_id: string;
    plan_id: string;
    tipo: string;
}

export interface GetIngresosResponse {
  total: number;
  ingresos: IngresosHistory[];
}
