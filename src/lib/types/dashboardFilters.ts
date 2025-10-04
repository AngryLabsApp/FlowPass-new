export interface DashboardFilters {
  search?: string;
  estado?: string;
  plan?: string;
  page?: number;
  sort:string;
}

export interface PagosFilters {
  search?: string;
  estado_pago?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  type?:string;
  }