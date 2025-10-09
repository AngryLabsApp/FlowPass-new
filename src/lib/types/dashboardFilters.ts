export interface DashboardFilters {
  search?: string | Date;
  estado?: string | Date;
  plan?: string | Date;
  page?: number;
  sort: string | Date;
}

export interface PagosFilters {
  search?: string | Date;
  estado_pago?: string | Date;
  start_date?: string;
  end_date?: string;
  page?: number;
  type?: string;
}
