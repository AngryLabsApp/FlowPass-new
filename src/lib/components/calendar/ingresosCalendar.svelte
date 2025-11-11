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
  import { CircleAlert } from "@lucide/svelte";
  import type { Plan } from "$lib/types/planes";

  dayjs.extend(utc);
  dayjs.extend(timezone);

  let {
    user,
    ingresos,
    loading,
    createUpdateIngreso,
    onDeleteIngreso,
    plan,
  }: FormProps & {
    plan: Plan;
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
    if (plan?.ilimitado) return true;
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
      (e: any) => e.id !== eventIdSelected,
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
      loadIngresos();
    }
  });
</script>

{#if loading}
  <CalendarSkeleton />
{:else}
  <div class="w-full">
    <div
      class="flex items-center gap-1 text-amber-600 text-xs mb-2 bg-amber-50 px-2 py-1 rounded-md border border-amber-600 w-fit"
    >
      <span class="rounded-full bg-amber-400 w-2 h-2"></span>
      Los ingresos del calendario se guardan automáticamente
    </div>

    <Calendar
      plugins={[DayGrid, Interaction]}
      {options}
      class="border rounded-lg shadow"
    />
  </div>
{/if}

<Modal bind:open={openEditEventModal} size="xs" permanent>
  <div class="flex flex-col items-center text-center">
    <!-- Icono de advertencia -->
    <div class="p-2 bg-yellow-100 rounded-full">
      <CircleAlert size={28} class="text-yellow-500" />
    </div>

    <!-- Texto -->
    <div class="mt-3 flex flex-col gap-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        ¿Eliminar este registro de ingreso?
      </h3>

      <p
        class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto"
      >
        Esta acción eliminará de forma permanente este registro de asistencia.
        No podrás deshacerlo.
      </p>
    </div>

    <!-- Acciones -->
    <div class="flex flex-col sm:flex-row gap-2 mt-5 w-full">
      <Button class="w-full" color="red" onclick={() => onDeleteEvent()}>
        Eliminar registro
      </Button>

      <Button
        class="w-full"
        color="alternative"
        onclick={() => (openEditEventModal = false)}
      >
        Cancelar
      </Button>
    </div>
  </div>
</Modal>

<Modal bind:open={openLimitEventModal} size="xs" permanent>
  <div class="flex flex-col items-center text-center">
    <!-- Icono de advertencia -->
    <div class="p-2 bg-yellow-100 rounded-full">
      <CircleAlert size={28} class="text-yellow-500" />
    </div>

    <!-- Texto -->
    <div class="mt-3 flex flex-col gap-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Límite de clases alcanzado
      </h3>

      <p
        class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto"
      >
        Este alumno ha llegado al límite de clases de su plan. Puedes aumentar
        el límite o renovar el plan para continuar registrando asistencias.
      </p>
    </div>

    <!-- Acciones -->
    <div class="flex flex-col sm:flex-row gap-2 mt-5 w-full">
      <Button
        class="w-full"
        color="alternative"
        onclick={() => (openLimitEventModal = false)}
      >
        Entendido
      </Button>
    </div>
  </div>
</Modal>
