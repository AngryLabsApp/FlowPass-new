import { UserKeys } from "$lib/enums/user_keys";
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
import WAButton from "$lib/components/button/whatsapp_button.svelte";

export const PLAN_INFO: CatalogItem[] = [
  {
    label: "Plan",
    key: UserKeys.PLAN,
    icon: ClockOutline,
    editable: false,
    edit_only_with_plan: true,
  },
  {
    label: "Clases realizadas",
    key: UserKeys.CLASES_RESTANTES,
    icon: CheckPlusCircleOutline,
    editable: true,
    edit_only_with_plan: true,
  },
  {
    label: "Estado",
    key: UserKeys.ESTADO,
    icon: UserSettingsOutline,
    editable: true,
    edit_only_with_plan: true,
  },
  {
    label: "Inicio del plan",
    key: UserKeys.FECHA_INICIO_PLAN,
    icon: CalendarMonthOutline,
    editable: true,
    edit_only_with_plan: true,
  },
  {
    label: "Próximo pago",
    key: UserKeys.PROXIMA_FECHA_PAGO,
    icon: ChartMixedDollarOutline,
    editable: false,
  },
  {
    label: "Días de cortesía",
    key: UserKeys.DIAS_DE_GRACIA,
    icon: GiftBoxOutline,
    editable: false,
  },
];

export const DATOS_INFO: CatalogItem[] = [
  {
    label: "Código de ingreso",
    key: UserKeys.CODIGO_INGRESO,
    icon: FingerprintOutline,
    editable: false,
    actionComponent:WAButton
  },
  {
    label: "DNI/Pasaporte/CE",
    key: UserKeys.IDENTIFICACION,
    icon: ProfileCardOutline,
    editable: true,
  },
  {
    label: "Teléfono",
    key: UserKeys.TELEFONO,
    icon: PhoneOutline,
    editable: true,
  },
  {
    label: "Email",
    key: UserKeys.EMAIL,
    icon: EnvelopeOutline,
    editable: true,
  },
  {
    label: "Dirección",
    key: UserKeys.DIRECCION,
    icon: AddressBookOutline,
    editable: true,
  },
  {
    label: "Cumpleaños",
    key: UserKeys.CUMPLEANOS,
    icon: CakeCandlesOutline,
    editable: true,
  },
  {
    label: "Notificar",
    key: UserKeys.NOTIFICAR,
    icon: BellActiveAltOutline,
    editable: true,
  },
  {
    label: "Enfermedad / Patología",
    key: UserKeys.PATOLOGIAS,
    icon: HeartOutline,
    editable: true,
  },
  {
    label: "¿Está de viaje?",
    key: UserKeys.DE_VIAJE,
    icon: MugHotOutline,
    editable: true,
  },
];

export const PAGO_INFO: CatalogItem[] = [
  {
    label: "Método de pago",
    key: UserKeys.MEDIO_DE_PAGO,
    icon: CreditCardOutline,
    editable: false,
  },
  {
    label: "Monto",
    key: UserKeys.MONTO,
    icon: DollarOutline,
    editable: false,
  },
  {
    label: "Estado del pago",
    key: UserKeys.ESTADO_PAGO,
    icon: UserSettingsOutline,
    editable: true,
    edit_only_with_plan: true,
  },
];