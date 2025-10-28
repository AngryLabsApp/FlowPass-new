<script lang="ts">
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { getIngresos, updateIngresoById } from "$lib/services/api/ingreso";
  import {
    CheckInType,
    type ColorCheckInType,
    type GetIngresosResponse,
    type IngresosHistory,
  } from "$lib/types/ingresoResponse";
  import type { QueryParams } from "$lib/types/queryparams";

  import {
    Button,
    Card,
    Label,
    Input,
    Select,
    Listgroup,
    ListgroupItem,
    ListPlaceholder,
    Indicator,
    Badge,
    Tooltip,
    Accordion,
    AccordionItem,
    Datepicker,
    Timepicker,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { Clock, Info } from "@lucide/svelte";
  import { ClockOutline } from "flowbite-svelte-icons";

  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();
  let loading = $state(false);

  let currentAbort: AbortController | null = null;
  let ingresos: GetIngresosResponse = $state({ ingresos: [], total: 0 });
  let update_ingresos: { date: Date; time: string }[] = $state([]);

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function identifyTypeOfCheckIngreso(ingreso: CheckInType): string {
    switch (ingreso) {
      case CheckInType.UPDATE:
        return "Editado";
      case CheckInType.MANUAL:
        return "Por admin";
      case CheckInType.SELF:
        return "Por código";
      default:
        return "";
    }
  }

  function colorPerTypeOfCheckin(ingreso: CheckInType): ColorCheckInType {
    switch (ingreso) {
      case CheckInType.UPDATE: // Ingreso editado por admin
        return "amber";
      case CheckInType.MANUAL: // Ingreso por admin
        return "purple";
      case CheckInType.SELF: // Ingreso por codigo
        return "green";
      default:
        return "gray";
    }
  }

  function identifyCheckIngresoLabel(ingreso: CheckInType): string {
    switch (ingreso) {
      case CheckInType.UPDATE:
        return "Ingreso y/o límite editado";
      case CheckInType.MANUAL:
      case CheckInType.SELF:
        return "Ingreso registrado";
      default:
        return "";
    }
  }

  function toLimaDate(dateUTC: string | Date): Date {
    const date = new Date(dateUTC);
    const limaString = date.toLocaleString("en-US", {
      timeZone: "America/Lima",
    });
    return new Date(limaString);
  }

  function getLimaDayNumber(dateUTC: string | Date): number {
    return toLimaDate(dateUTC).getDate();
  }

  function getLimaMonthYear(dateUTC: string | Date): string {
    const date = toLimaDate(dateUTC);

    const month = date.toLocaleString("es-PE", {
      month: "long",
      timeZone: "America/Lima",
    });
    const year = date.getFullYear();

    return capitalize(`${month} ${year}`);
  }

  function getLimaWeekday(dateUTC: string | Date): string {
    const weekday = toLimaDate(dateUTC).toLocaleDateString("es-PE", {
      weekday: "long",
    });
    return capitalize(weekday);
  }

  function getLimaTime(dateUTC: string | Date): string {
    return toLimaDate(dateUTC).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const updateIngreso = async (ingreso: IngresosHistory, i: number) => {
    const [horas, minutos] = update_ingresos[i].time.split(":").map(Number);
    const new_date = update_ingresos[i].date;
    new_date.setHours(horas, minutos, 0, 0);
    loading = true;
    await updateIngresoById(ingreso.id, new_date);
    await loadIngresos();
  };
  const loadIngresos = async () => {
    currentAbort?.abort();
    const abort = new AbortController();
    currentAbort = abort;

    const query_params: QueryParams = {
      id: user.id,
      size: 20,
      page: 1,
      field1: "pago_id",
      value1: user.pago_id?.toString() || "",
    };
    try {
      loading = true;
      const data = await getIngresos(abort, query_params);
      if (currentAbort !== abort) return;
      ingresos = data;
      if (ingresos.total > 0) {
        update_ingresos = ingresos.ingresos.map((ingreso) => {
          const fecha = toLimaDate(ingreso.check_in);
          const horas = fecha.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // formato 24h
          });
          return {
            date: fecha,
            time: horas,
          };
        });
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      if (currentAbort === abort) loading = false;
    }
  };
  onMount(async () => {
    await loadIngresos();
  });
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <div class="flex flex-col justify-start mb-3">
    <h3
      class="text-md sm:text-xl font-medium text-gray-900 dark:text-white mb-1"
    >
      Últimos ingresos
    </h3>
    <Badge color="gray" class="flex gap-1 w-fit text-gray-500">
      <Info size="12" />
      Ingresos correspondientes al plan actual</Badge
    >
  </div>

  {#if loading}
    <ListPlaceholder />
  {:else if ingresos.total > 0}
    <!--
    <Listgroup active class="w-full">
      {#each ingresos.ingresos as ingreso}
        <ListgroupItem class="gap-2 text-base font-semibold">
          <div class="  w-full flex justify-between">
            <div class="flex gap-2 px-2 items-center">
              <div class="text-2xl">{getLimaDayNumber(ingreso.check_in)}</div>
              <div class="">
                <div class="text-sm">
                  {getLimaMonthYear(ingreso.check_in)}
                </div>
                <div class="text-xs">{getLimaWeekday(ingreso.check_in)}</div>
              </div>
            </div>

            <div class="flex flex-col items-end">
              <div class="flex gap-2 items-center">
                <Clock size="16" />
                <p>{getLimaTime(ingreso.check_in)}</p>
              </div>
              <div class="flex gap-1 items-center text-xs">
                <Indicator
                  size="xs"
                  color={colorPerTypeOfCheckin(ingreso.tipo as CheckInType)}
                />
                <div>
                  {identifyTypeOfCheckIngreso(ingreso.tipo as CheckInType)}
                </div>
                <Info size="14" absoluteStrokeWidth={true} strokeWidth={2} />
                <Tooltip trigger="click" arrow={false}
                  >{identifyCheckIngresoLabel(ingreso.tipo as CheckInType)}: {ingreso.clases_tomadas}/{ingreso.limite_clases}</Tooltip
                >
              </div>
            </div>
          </div>
        </ListgroupItem>
      {/each}
    </Listgroup>
-->
    <Accordion class="w-full ">
      {#each ingresos.ingresos as ingreso, i}
        <AccordionItem class="[&>button>svg]:hidden " headerClass="py-2">
          {#snippet header()}
            <div class="  w-full flex justify-between">
              <div class="flex gap-2 px-2 items-center">
                <div class="text-2xl">
                  {getLimaDayNumber(ingreso.check_in)}
                </div>
                <div class="">
                  <div class="text-sm">
                    {getLimaMonthYear(ingreso.check_in)}
                  </div>
                  <div class="text-xs">
                    {getLimaWeekday(ingreso.check_in)}
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-end">
                <div class="flex gap-2 items-center">
                  <Clock size="16" />
                  <p>{getLimaTime(ingreso.check_in)}</p>
                </div>
                <div class="flex gap-1 items-center text-xs">
                  <Indicator
                    size="xs"
                    color={colorPerTypeOfCheckin(ingreso.tipo as CheckInType)}
                  />
                  <div>
                    {identifyTypeOfCheckIngreso(ingreso.tipo as CheckInType)}
                  </div>
                  <Info size="14" absoluteStrokeWidth={true} strokeWidth={2} />
                  <Tooltip trigger="click" arrow={false}
                    >{identifyCheckIngresoLabel(ingreso.tipo as CheckInType)}: {ingreso.clases_tomadas}/{ingreso.limite_clases}</Tooltip
                  >
                </div>
              </div>
            </div>
          {/snippet}
          Fecha
          <Label class="space-y-2">
            <Datepicker
              class="w-full"
              onchange={() => {}}
              onselect={() => {}}
              bind:value={update_ingresos[i].date}
              required
            />
          </Label>

          Hora:
          <Label class="space-y-2">
            <Timepicker
              Icon={ClockOutline}
              iconClass="text-red-500"
              bind:value={update_ingresos[i].time}
            />
          </Label>
          <Button pill onclick={() => updateIngreso(ingreso, i)}>Guardar</Button
          >
        </AccordionItem>
      {/each}
    </Accordion>
  {:else}
    <p class="text-gray-500 mt-4">No se encontraron ingresos recientes.</p>
  {/if}
</Card>
