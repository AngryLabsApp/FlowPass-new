// src/lib/catalog/form_component_catalog.ts
 import RenovarPlan from "$lib/components/form/RenovarPlan.svelte";
import { UserKeys } from "$lib/enums/user_keys";


// Flowbite-Svelte (ajusta según lo que ya uses en tu proyecto)
import { Input } from "flowbite-svelte";

/**
 * Estructura de un item de catálogo de field -> componente.
 * Puedes extender con 'schema', 'validators', 'transform', etc. si lo necesitas.
 */
export type FormFieldCatalogItem = {
  component: any;
  /** Props por defecto que recibirá el componente (placeholder, disabled, etc.) */
  props?: Record<string, unknown>;
};

/**
 * Catálogo centralizado: key -> componente + props por defecto.
 * Nota: Las opciones (p.ej. de <Select/>) normalmente se pasan en runtime,
 * pero puedes fijar algunas por defecto aquí si te sirve.
 */
export const FORM_COMPONENT_CATALOG: Partial<Record<UserKeys, FormFieldCatalogItem>> = {
    // === PLAN_INFO ===
    [UserKeys.PLAN]: {
        component: RenovarPlan,
        props: {},
    },
    [UserKeys.CLASES_RESTANTES]: {
        component: Input,
        props: { type: "number", min: 0, placeholder: "Selecciona un plan" },
    },

};

/**
 * Helper para obtener el item del catálogo por key.
 * Si no hay entrada definida, devuelve un fallback básico de Input.
 */
export function getFieldComponent(
  key: UserKeys
): FormFieldCatalogItem {
  const item = FORM_COMPONENT_CATALOG[key];
  if (item) return item;
  return { component: Input, props: { placeholder: String(key) } };
}
