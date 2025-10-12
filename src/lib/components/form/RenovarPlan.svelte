<script lang="ts">
  import { GET_ESTADO_PAGOS } from "$lib/catalog/estados_pagos";
  import { METODOS_DE_PAGO } from "$lib/catalog/metodos_pago";
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import { Button, Card, Label, Input, Select } from "flowbite-svelte";
  import { getCachedPlanes } from "$lib/services/api/planes";
  import { MapPlanCatalog } from "$lib/utils/utils";

  const getPlan = (plan: string) => {
    return PLANES.find((item) => item.value == plan);
  };

  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();

  const PLANES = getCachedPlanes();
  const PLANES_CATAOGS = MapPlanCatalog(PLANES, true);
  let requiere_partner_code = $state(getPlan(user.plan)?.partners || false);

  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.PLAN, value: user.plan || "" },
    { key: UserKeys.MONTO, value: user.monto || 0 },
    { key: UserKeys.DIAS_DE_GRACIA, value: 0 },
    { key: UserKeys.MEDIO_DE_PAGO, value: user.medio_de_pago || "" },
    { key: UserKeys.ESTADO_PAGO, value: user.estado_pago || "" },
    { key: UserKeys.PARTNER_CODE, value: "" },
  ]);
  const onUpdated = () => {
    console.log("entroo");
    closeForm(true);
  };
  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });

  const onChangePlan = () => {
    const plan_value = updateItemValues[0].value;
    const plan_selected = getPlan(plan_value as string);
    if (plan_selected) {
      updateItemValues[1].value = plan_selected.amount;
      requiere_partner_code = plan_selected.partners;
    }
  };
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form
    class="flex flex-col space-y-6"
    onsubmit={(e) => actions.onUpdatePlanForm(updateItemValues, user.id, e)}
  >
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Renovar Plan
    </h3>
    <Label class="space-y-2">
      <span>Plan</span>
      <Select
        size="md"
        items={PLANES_CATAOGS}
        placeholder="Selecciona..."
        onchange={() => onChangePlan()}
        required
        bind:value={updateItemValues[0].value}
      />
    </Label>

    <Label class="space-y-2">
      <span>Monto de pago</span>
      <Input
        type="number"
        name="monto"
        placeholder="0.0"
        required
        bind:value={updateItemValues[1].value}
      />
    </Label>

    <Label class="space-y-2">
      <span>Días de gracia</span>
      <Input
        type="number"
        name="dias_gracia"
        placeholder="0"
        bind:value={updateItemValues[2].value}
      />
    </Label>

    <Label class="space-y-2">
      <span>Método de pago</span>
      <Select
        size="md"
        items={METODOS_DE_PAGO}
        placeholder="Selecciona..."
        bind:value={updateItemValues[3].value}
      />
    </Label>
    <Label class="space-y-2">
      <span>Estado de pago</span>
      <Select
        size="md"
        items={GET_ESTADO_PAGOS()}
        placeholder="Selecciona..."
        bind:value={updateItemValues[4].value}
        required
      />
    </Label>

    {#if requiere_partner_code}
      <Label class="space-y-2">
        <span>Código de ingreso de pareja a vincular</span>
        <Input
          type="text"
          name="partner_code"
          placeholder="0000"
          bind:value={updateItemValues[5].value}
          required
        />
      </Label>
    {/if}
    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
