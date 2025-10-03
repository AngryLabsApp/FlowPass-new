<script lang="ts">
  import type { User } from "$lib/types/user";
  import { Accordion, AccordionItem } from "flowbite-svelte";
  import { fmtDate, formatMemberSince, toTitleCase } from "$lib/utils/utils";
  import { Button, Modal, type ModalProps, P } from "flowbite-svelte";

  let { openModal = $bindable(false), user } = $props<{
    openModal: boolean;
    user: User;
  }>();
  let size: ModalProps["size"] = $state("lg"); // Set default value

  const formated_user = $derived.by<User>(() => {
    if (!user?.id) return {} as User;

    const format = { ...user } as User;

    format.full_name =
      `${toTitleCase(user?.nombre ?? "")} ${toTitleCase(user?.apellidos ?? "")}`.trim();

    format.id = user.id ?? "";
    format.codigo_ingreso = (user.codigo_ingreso ?? "").replace(/^c-/i, "");
    format.fecha_alta = formatMemberSince(user.fecha_alta);
    format.clases_restantes = `${user.clases_tomadas}/${user.limite_clases}`;
    format.fecha_inicio_plan = fmtDate(user.fecha_inicio_plan);
    format.proxima_fecha_pago = fmtDate(user.proxima_fecha_pago);
    format.cumpleanos = fmtDate(user.cumpleanos);
    format.notificar = user.notificar ?? "No";
    format.patologias = user?.patologias?.length ? user.patologias : "-";

    return format;
  });

  const planInfo = [
    { label: "Plan", key: "plan" },
    { label: "Clases realizadas", key: "clases_restantes" },
    { label: "Estado", key: "estado" },
    { label: "Inicio del plan", key: "fecha_inicio_plan" },
    { label: "Próximo pago", key: "proxima_fecha_pago" },
    { label: "Días de cortesía", key: "dias_de_gracia" },
  ];

  const datosInfo = [
    { label: "Codigo de ingreso", key: "codigo_ingreso" },
    { label: "DNI/Pasaporte/CE", key: "identificacion" },
    { label: "Teléfono", key: "telefono" },
    { label: "Email", key: "email" },
    { label: "Dirección", key: "direccion" },
    { label: "Cumpleaños", key: "cumpleanos" },
    { label: "Notificar", key: "notificar" },
    { label: "Enfermedad / Patología", key: "patologias" },
    { label: "¿Está de viaje?", key: "de_viaje" },
  ];

  const pagoInfo = [
    { label: "Método de pago ", key: "medio_de_pago" },
    { label: "Monto", key: "monto" },
    { label: "Estado del pago", key: "estado_pago" },
  ];
</script>

<Modal title={formated_user.full_name} bind:open={openModal} {size}>
  {#if user.id && user.id.length > 0}
    <Accordion multiple>
      <AccordionItem open>
        {#snippet header()}
          Plan actual
        {/snippet}
        <!-- GRID responsivo -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6"
        >
          {#each planInfo as item}
            <div class="space-y-1">
              <div
                class="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold"
              >
                <span class="shrink-0">⛔</span>
                <span>{item.label}</span>
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {formated_user[item.key as keyof User] || "-"}
              </div>
            </div>
          {/each}
        </div>
      </AccordionItem>
      <AccordionItem open>
        {#snippet header()}
          Datos personales
        {/snippet}
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6"
        >
          {#each datosInfo as item}
            <div class="space-y-1">
              <div
                class="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold"
              >
                <span class="shrink-0">⛔</span>
                <span>{item.label}</span>
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {formated_user[item.key as keyof User] || "-"}
              </div>
            </div>
          {/each}
        </div>
      </AccordionItem>
      <AccordionItem open>
        {#snippet header()}
          Detalle del ultimo pago
        {/snippet}
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6"
        >
          {#each pagoInfo as item}
            <div class="space-y-1">
              <div
                class="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold"
              >
                <span class="shrink-0">⛔</span>
                <span>{item.label}</span>
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {formated_user[item.key as keyof User] || "-"}
              </div>
            </div>
          {/each}
        </div>
      </AccordionItem>
    </Accordion>
  {/if}

  {#snippet footer()}
    <Button type="submit">Registrar ingreso</Button>
    <Button type="submit" color="alternative">Renovar plan</Button>
  {/snippet}
</Modal>
