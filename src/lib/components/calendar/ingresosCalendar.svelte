<script lang="ts">
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import CalendarSkeleton from "$lib/components/calendar/skeletonCalendar.svelte";
  import type {
    GetIngresosResponse,
    IngresosHistory,
  } from "$lib/types/ingresoResponse";
  import { Calendar, DayGrid, Interaction } from "@event-calendar/core";
  import "@event-calendar/core/index.css";
  import { Button, Input, Label, Modal, Skeleton } from "flowbite-svelte";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc";
  import timezone from "dayjs/plugin/timezone";
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";

  dayjs.extend(utc);
  dayjs.extend(timezone);

  let {
    user,
    ingresos,
    loading,
    createUpdateIngreso,
    onDeleteIngreso,
  }: FormProps & {
    ingresos: GetIngresosResponse;
    loading: boolean;
    createUpdateIngreso: (ingreso: IngresosHistory) => Promise<IngresosHistory>;
    onDeleteIngreso: (ingreso_id: string) => Promise<any>;
  } = $props();

  let local_loading = true;
  let eventIdSelected = $state("");
  let openEditEventModal = $state(false);
  let openLimitEventModal = $state(false);

  let ingresos_calendar: any[] = $state([]);

  const getItemCalendarByTipe = (ingreso: IngresosHistory) => {
    const fecha = dayjs(ingreso.check_in).tz("America/Lima");
    const formated = fecha.format("YYYY-MM-DD");
    const title =
      ingreso.tipo == "MANUAL" || ingreso.tipo == "SELF"
        ? "Ingreso"
        : "Edicion";
    const color = title == "Ingreso" ? "#3b82f6" : "#22c55e";

    return {
      allDay: true, // ⬅️ explícito, evita interpretaciones raras

      backgroundColor: color,
      borderColor: color,
      textColor: "white",
      id: ingreso.id,
      start: formated,
      end: formated,
      title: title,
    };
  };

  const loadIngresos = () => {
    if (ingresos.total > 0) {
      ingresos_calendar = ingresos.ingresos.map((ingreso) => {
        const clone = { ...ingreso };

        return {
          ...getItemCalendarByTipe(clone),
        };
      });
      options.events = ingresos_calendar;
    }
  };

  function normalizeDate(date: string): string {
    // toma solo la parte YYYY-MM-DD
    return date.split("T")[0];
  }

  const canCreateNewIngreso = () => {
    if (user.clases_tomadas >= user.limite_clases) {
      openLimitEventModal = true;
      return false;
    }
    return true;
  };

  const onDeleteEvent = async () => {
    openEditEventModal = false;
    const response = await onDeleteIngreso(eventIdSelected);
    if (!response.success) throw "DELETE_INGRESO_ERROR";

    options.events = options.events.filter(
      (e: any) => e.id !== eventIdSelected
    );
    eventIdSelected = "";
    openEditEventModal = false;
  };

  let options = $state({
    view: "dayGridMonth",
    locale: "es-PE",
    selectable: true,
    events: [] as any,

    // 🟢 Click en un día → agregar otro evento, incluso si ya hay otros
    async dateClick(info: any) {
      if (!canCreateNewIngreso()) return;

      const date = normalizeDate(info.dateStr);
      const fechaLima = dayjs.tz(info.dateStr, "YYYY-MM-DD", "America/Lima");
      const fechaUTC = fechaLima.toISOString();
      const newIngreso: IngresosHistory = {
        member_id: user.id,
        clases_tomadas: user.clases_tomadas + 1,
        created_at: "",
        check_in: fechaUTC,
        limite_clases: user.limite_clases,
        id: "",
        pago_id: "",
        plan_id: "",
        tipo: "MANUAL",
      };
      const ingreso: IngresosHistory = await createUpdateIngreso(newIngreso);
      if (!ingreso.id) throw "ERROR";

      options.events = [
        ...options.events,
        {
          ...getItemCalendarByTipe(ingreso),
        },
      ];
    },

    eventClick(info: any) {
      const id = info.event.id;
      eventIdSelected = id;
      openEditEventModal = true;
    },
  });
  $effect(() => {
    if (local_loading != loading) {
      local_loading = loading;
      console.log(ingresos);
      loadIngresos();
    }
  });
</script>

{#if loading}
  <CalendarSkeleton />
{:else}
  <div class="w-full">
    <Calendar
      plugins={[DayGrid, Interaction]}
      {options}
      class="border rounded-lg shadow"
    />
  </div>
{/if}

<Modal bind:open={openEditEventModal} size="xs" permanent>
  <div class="text-center">
    <ExclamationCircleOutline
      class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
    />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      ¿Estás seguro de que deseas eliminar este registro?
    </h3>
    <div class="space-x-2">
      <Button onclick={() => onDeleteEvent()} value="yes" color="red"
        >Sí, eliminar</Button
      >
      <Button
        onclick={() => {
          openEditEventModal = false;
        }}
        value="no"
        color="alternative">No, Cancelar</Button
      >
    </div>
  </div>
</Modal>

<Modal bind:open={openLimitEventModal} size="xs" permanent>
  <div class="text-center">
    <ExclamationCircleOutline
      class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
    />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Has alcanzado el límite de clases para este plan. Puedes aumentar el
      límite o renovar el plan del alumno para continuar.
    </h3>
    <div class="space-x-2">
      <Button
        onclick={() => {
          openLimitEventModal = false;
        }}
        value="yes"
        color="red">Cerrar</Button
      >
    </div>
  </div>
</Modal>
