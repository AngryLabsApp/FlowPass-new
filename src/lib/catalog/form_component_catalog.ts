// src/lib/catalog/form_component_catalog.ts
import RenovarPlan from "$lib/components/form/RenovarPlan.svelte";
import RenovarClases from "$lib/components/form/RenovarClases.svelte";
import EstadoPLan from "$lib/components/form/ActualizaEstadoPlan.svelte";
import RenovarRechaPLan from "$lib/components/form/RenovarFechaPlan.svelte";
import RenovarIdentificacion from "$lib/components/form/RenovarIdentificacion.svelte";
import RenovarEmail from "$lib/components/form/RenovarEmail.svelte";
import RenovarTelefono from "$lib/components/form/RenovarTelefono.svelte";
import RenovarNotificar from "$lib/components/form/RenovarNotificacion.svelte";
import RenovarCumple from "$lib/components/form/RenovarCumple.svelte";
import RenovarDireccion from "$lib/components/form/RenovarDireccion.svelte";
import { UserKeys } from "$lib/enums/user_keys";
import RenovarDeViaje from "$lib/components/form/RenovarDeViaje.svelte";
import RenovarPatologia from "$lib/components/form/RenovarEnfermedad.svelte";
import RenovarEstadoPago from "$lib/components/form/RenovarEstadoPago.svelte";

// Flowbite-Svelte (ajusta según lo que ya uses en tu proyecto)
import { Input } from "flowbite-svelte";
import type { User } from "$lib/types/user";


/**
 * Estructura de un item de catálogo de field -> componente.
 * Puedes extender con 'schema', 'validators', 'transform', etc. si lo necesitas.
 */
export type FormFieldCatalogItem = {
  component: any;
  /** Props por defecto que recibirá el componente (placeholder, disabled, etc.) */
  props?: FormProps;
};

export interface FormProps {
  user?: User,
  setLoadingModal?: (loading: boolean, title?: string) => void,
  setToast?: (title: string, success: boolean) => void,
  closeForm?: () => void,
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
    props: {

    },
  },
  [UserKeys.CLASES_RESTANTES]: {
    component: RenovarClases,
    props: {},
  },
  [UserKeys.ESTADO]: {
    component: EstadoPLan,
    props: {},
  },
  [UserKeys.FECHA_INICIO_PLAN]: {
    component: RenovarRechaPLan,
    props: {},
  },
  [UserKeys.IDENTIFICACION]: {
    component: RenovarIdentificacion,
    props: {},
  },
  [UserKeys.TELEFONO]: {
    component: RenovarTelefono,
    props: {},
  },
  [UserKeys.EMAIL]: {
    component: RenovarEmail,
    props: {},
  },
  [UserKeys.DIRECCION]: {
    component: RenovarDireccion,
    props: {},
  },
  [UserKeys.CUMPLEANOS]: {
    component: RenovarCumple,
    props: {},
  },
  [UserKeys.NOTIFICAR]: {
    component: RenovarNotificar,
    props: {},
  },
  [UserKeys.DE_VIAJE]: {
    component: RenovarDeViaje,
    props: {},
  },
  [UserKeys.PATOLOGIAS]: {
    component: RenovarPatologia,
    props: {},
  },
  [UserKeys.ESTADO_PAGO]: {
    component: RenovarEstadoPago,
    props: {},
  },
};

/**
 * Helper para obtener el item del catálogo por key.
 * Si no hay entrada definida, devuelve un fallback básico de Input.
 */
export function getFieldComponent(
  key: UserKeys,
  user: User,
  setLoadingModal: (loading: boolean, title?: string) => void,
  setToast: (title: string, success: boolean) => void,
  closeForm: () => void,
): FormFieldCatalogItem {
  const item = FORM_COMPONENT_CATALOG[key];
  if (item) {
    item.props = {
      user,
      setLoadingModal,
      setToast,
      closeForm
    };
    return item
  };
  return { component: Input, props: {} };
}
