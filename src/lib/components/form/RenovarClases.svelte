<script lang="ts">
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import { Button, Label, Input, ButtonGroup } from "flowbite-svelte";
  import IngresosCalendar from "$lib/components/calendar/ingresosCalendar.svelte";
  import TableIngresos from "$lib/components/form/UltimosIngresos.svelte";
  import { CalendarMonthSolid, TableRowSolid } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import type { QueryParams } from "$lib/types/queryparams";
  import {
    deleteIngreso,
    getIngresos,
    updateOrCreateIngreso,
  } from "$lib/services/api/ingreso";
  import type {
    GetIngresosResponse,
    IngresosHistory,
  } from "$lib/types/ingresoResponse";
  import { Sheet, CalendarDays } from "@lucide/svelte";

  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();
  let type = $state("calendar");
  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.CLASES_TOMADAS, value: user.clases_tomadas || 0 },
    { key: UserKeys.LIMITE_CLASES, value: user.limite_clases || 0 },
  ]);
  const onUpdated = () => {
    refreshValues();
    closeForm(true);
  };

  const refreshValues = () => {
    user.clases_tomadas = updateItemValues[0].value as number;
    user.limite_clases = updateItemValues[1].value as number;
  };

  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });
  let loading = $state(false);
  let currentAbort: AbortController | null = null;
  let ingresos: GetIngresosResponse = $state({ ingresos: [], total: 0 });
  let local_props = { user, setLoadingModal, setToast, closeForm };
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
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      if (currentAbort === abort) loading = false;
    }
  };

  onMount(async () => {
    await loadIngresos();
  });

  const changeType = (_type: string) => {
    type = _type;
  };

  const createUpdateIngreso = async (
    ingreso: IngresosHistory
  ): Promise<IngresosHistory> => {
    setLoadingModal(true, "Registrando nuevo ingreso...");
    const response = (await updateOrCreateIngreso(ingreso)) as IngresosHistory;
    setLoadingModal(false, "");
    updateItemValues[0].value = response.clases_tomadas;
    refreshValues();

    return response;
  };

  const onDeleteIngreso = async (ingreso_id: string): Promise<any> => {
    setLoadingModal(true, "Eliminando registro...");
    const response = await deleteIngreso(ingreso_id);
    setLoadingModal(false, "");
    if (response.clases_tomadas) {
      updateItemValues[0].value = response.clases_tomadas;
    }
    refreshValues();
    return response;
  };
</script>

<form
  class="flex flex-col space-y-6 w-full"
  onsubmit={(e) => actions.onUpdateSingleForm(updateItemValues, user.id, e)}
>
  <div class="flex justify-between items-center">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">Clases</h3>

    <ButtonGroup>
      <Button outline color="dark" onclick={() => changeType("calendar")}>
        <CalendarDays class="me-2 h-4 w-4" />
        Calendario
      </Button>
      <Button outline color="dark" onclick={() => changeType("table")}>
        <Sheet class="me-2 h-4 w-4" />
        Tabla
      </Button>
    </ButtonGroup>
  </div>

  <Label class="space-y-2">
    <span>Clases realizadas</span>
    <Input
      type="number"
      name="clases_realizadas"
      placeholder="0"
      required
      bind:value={updateItemValues[0].value as number}
    />
  </Label>

  <Label class="space-y-2">
    <span>Limite de clases</span>
    <Input
      type="number"
      name="limite_calses"
      placeholder="0"
      bind:value={updateItemValues[1].value as number}
    />
  </Label>

  <Button type="submit" class="w-full">Guardar cambios</Button>
</form>
{#if type == "calendar"}
  <IngresosCalendar
    {...local_props}
    {ingresos}
    {loading}
    {createUpdateIngreso}
    {onDeleteIngreso}
  />
{:else if type == "table"}
  <TableIngresos {...local_props}></TableIngresos>
{/if}
