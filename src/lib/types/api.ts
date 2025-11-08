import type { Payment } from "./pagos";
import type { User } from "./user";
import type { UserBirthday } from "./userBirthday";


// src/lib/types/user.ts
export interface getUsersResponse { total: number; users: User[] }
export interface getUsersBirthdayResponse { total: number; users: UserBirthday[] }
export interface getPagosResponse { total: number; pagos: Payment[] }
export interface getPagosTotalByMonthResponse { total: number }