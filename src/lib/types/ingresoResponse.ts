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