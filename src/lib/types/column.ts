export type Column<T> = {
  header: string;
  /** clave directa en el objeto (ej. 'nombre', 'plan') */
  key?: keyof T;
  /** tipo de render básico */
  type?: "text" | "date" | "status" | "title";
  /** clase opcional para la celda */
  class?: string;
  /** si necesitas un valor custom (gana sobre key) */
  accessor?: (row: T) => unknown;
};
