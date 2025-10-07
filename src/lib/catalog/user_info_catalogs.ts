import type { CatalogItem } from "$lib/types/catalogItem";
import {
  ClockOutline,
  CheckPlusCircleOutline,
  UserSettingsOutline,
  CalendarMonthOutline,
  GiftBoxOutline,
  ChartMixedDollarOutline,
  FingerprintOutline,
  ProfileCardOutline,
  PhoneOutline,
  EnvelopeOutline,
  AddressBookOutline,
  CakeCandlesOutline,
  BellActiveAltOutline,
  HeartOutline,
  MugHotOutline,
  CreditCardOutline,
  DollarOutline,
} from "flowbite-svelte-icons";

export const PLAN_INFO: CatalogItem[] = [
  {
    label: "Plan",
    key: "plan",
    icon: ClockOutline,
    editable: false,
    edit_only_with_plan: true,
  },
  {
    label: "Clases realizadas",
    key: "clases_restantes",
    icon: CheckPlusCircleOutline,
    editable: true,
    edit_only_with_plan: true,
  },
  {
    label: "Estado",
    key: "estado",
    icon: UserSettingsOutline,
    editable: true,
    edit_only_with_plan: true,
  },
  {
    label: "Inicio del plan",
    key: "fecha_inicio_plan",
    icon: CalendarMonthOutline,
    editable: true,
    edit_only_with_plan: true,
  },
  {
    label: "Próximo pago",
    key: "proxima_fecha_pago",
    icon: ChartMixedDollarOutline,
    editable: false,
  },
  {
    label: "Días de cortesía",
    key: "dias_de_gracia",
    icon: GiftBoxOutline,
    editable: false,
  },
];

export const DATOS_INFO: CatalogItem[] = [
  {
    label: "Codigo de ingreso",
    key: "codigo_ingreso",
    icon: FingerprintOutline,
    editable: false,
  },
  {
    label: "DNI/Pasaporte/CE",
    key: "identificacion",
    icon: ProfileCardOutline,
    editable: true,
  },
  {
    label: "Teléfono",
    key: "telefono",
    icon: PhoneOutline,
    editable: true,
  },
  {
    label: "Email",
    key: "email",
    icon: EnvelopeOutline,
    editable: true,
  },
  {
    label: "Dirección",
    key: "direccion",
    icon: AddressBookOutline,
    editable: true,
  },
  {
    label: "Cumpleaños",
    key: "cumpleanos",
    icon: CakeCandlesOutline,
    editable: true,
  },
  {
    label: "Notificar",
    key: "notificar",
    icon: BellActiveAltOutline,
    editable: true,
  },
  {
    label: "Enfermedad / Patología",
    key: "patologias",
    icon: HeartOutline,
    editable: true,
  },
  {
    label: "¿Está de viaje?",
    key: "de_viaje",
    icon: MugHotOutline,
    editable: true,
  },
];

export const PAGO_INFO: CatalogItem[] = [
  {
    label: "Método de pago ",
    key: "medio_de_pago",
    icon: CreditCardOutline,
    editable: false,
  },
  {
    label: "Monto",
    key: "monto",
    icon: DollarOutline,
    editable: false,
  },
  {
    label: "Estado del pago",
    key: "estado_pago",
    icon: UserSettingsOutline,
    editable: true,
    edit_only_with_plan: true,
  },
];
