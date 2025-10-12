<script lang="ts">
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import { fmtDateToString } from "$lib/utils/utils";
  import { Button, Card, Label, Datepicker } from "flowbite-svelte";

  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();

  let selectedDate = $state<Date | undefined>(
    user.fecha_inicio_plan
      ? new Date(user.fecha_inicio_plan + "T00:00:00")
      : undefined,
  );
  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.FECHA_INICIO_PLAN, value: user.fecha_inicio_plan || "" },
  ]);
  const onUpdated = () => {
    // user.estado = updateItemValues[0].value as string;
    closeForm(true);
    user.fecha_inicio_plan;
  };
  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });

  const onChangeDate = () => {
    const date = fmtDateToString(selectedDate as Date);
    updateItemValues[0].value = date;
  };
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form class="flex flex-col space-y-6" action="/">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Inicio de plan
    </h3>
    <Label class="space-y-2">
      <span>Fecha inicio</span>
      <Datepicker
        class="w-full"
        onchange={() => onChangeDate()}
        onselect={() => onChangeDate()}
        bind:value={selectedDate}
        required
      />
    </Label>
    <Button
      onclick={() => actions.onUpdateSingleForm(updateItemValues, user.id)}
      class="w-full">Guardar cambios</Button
    >
  </form>
</Card>
