import type { Payment } from "./pagos";
import type { User } from "./user";


// src/lib/types/user.ts
export interface getUsersResponse { total: number; users: User[] }

export interface getPagosTotalByMonthResponse { total: number }