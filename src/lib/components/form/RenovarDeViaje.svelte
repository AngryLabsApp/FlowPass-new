
<script lang="ts">
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { SI_NO_CATALOG } from "$lib/catalog/si_no_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import { Button, Card, Label, Input, Select } from "flowbite-svelte";

  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();

  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.DE_VIAJE, value: user.de_viaje || "" },
  ]);
  const onUpdated = () => {
    user.de_viaje = updateItemValues[0].value as string;
    closeForm();
  };
  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form
    class="flex flex-col space-y-6"
    onsubmit={(e) => actions.onUpdateSingleForm(updateItemValues, user.id, e)}
  >
    <h3 class="text-xl font-medium text-gray-900 dark:text-white"> ¿Está de viaje?</h3>
    <Label class="space-y-2">
      <Select
        size="md"
        items={SI_NO_CATALOG}
        placeholder="Selecciona..."
        required
        bind:value={updateItemValues[0].value}
      />
    </Label>

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
