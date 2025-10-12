<script lang="ts">
  import { GET_ESTADO_PAGOS } from "$lib/catalog/estados_pagos";
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import { Button, Card, Label, Select } from "flowbite-svelte";
  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();

  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.ESTADO_PAGO, value: user.estado_pago || "" },
  ]);
  const onUpdated = () => {
    user.estado_pago = updateItemValues[0].value as string;
    closeForm(false);
  };
  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form
    class="flex flex-col space-y-6"
    onsubmit={(e) => actions.onUpdateSingleForm(updateItemValues, user.id, e)}
  >
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Estado pago
    </h3>
    <Label class="space-y-2">
      <Select
        size="md"
        items={GET_ESTADO_PAGOS()}
        placeholder="Selecciona..."
        bind:value={updateItemValues[0].value}
        required
      />
    </Label>

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
