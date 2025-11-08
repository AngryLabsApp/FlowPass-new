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
    user.cumpleanos ? new Date(user.cumpleanos + "T00:00:00") : undefined
  );
  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.CUMPLEANOS, value: user.cumpleanos || "" },
  ]);
  const onUpdated = () => {
    user.cumpleanos = updateItemValues[0].value as string;
    closeForm();
  };
  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });

  const onChangeDate = () => {
    const date = fmtDateToString(selectedDate as Date);
    updateItemValues[0].value = date;
  };
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form
    class="flex flex-col space-y-6"
    onsubmit={(e) => actions.onUpdateSingleForm(updateItemValues, user.id, e)}
  >
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Fecha de cumpleaños
    </h3>
    <Label class="space-y-2">
      <Datepicker
        class="w-full"
        onchange={() => onChangeDate()}
        onselect={() => onChangeDate()}
        bind:value={selectedDate}
        required
      />
    </Label>
    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
