export interface Plan {
  id: string;
  value: string;
  label: string;
  amount: number;
  partners: boolean;
  ilimitado: boolean;
  neverExpires: boolean;
  dias_mes: number;
  limite_clases: number;
  is_free: boolean;
  updated_at: string;  // ISO date string
  created_at: string;  // ISO date string
  order: number;
}