<script lang="ts">
  import { GET_ESTADO_PLANES } from "$lib/catalog/estados_planes";
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import { Button, Card, Label, Input, Select } from "flowbite-svelte";
  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();

  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.ESTADO, value: user.estado || "" },
    { key: UserKeys.DIAS_EXTRA, value: "" },
  ]);
  const onUpdated = () => {
    user.estado = updateItemValues[0].value as string;
    closeForm(true);
  };
  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form
    class="flex flex-col space-y-6"
    onsubmit={(e) => actions.onUpdateSingleForm(updateItemValues, user.id, e)}
  >
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Estado del Plan
    </h3>
    <Label class="space-y-2">
      <span>Estado</span>
      <Select
        size="md"
        items={GET_ESTADO_PLANES()}
        bind:value={updateItemValues[0].value}
        placeholder="Selecciona..."
        required
      />
    </Label>

    <Label class="space-y-2">
      <span>Agregar días extra</span>
      <Input
        type="number"
        name="dias_extra"
        placeholder="0"
        bind:value={updateItemValues[1].value as number}
      />
    </Label>

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
