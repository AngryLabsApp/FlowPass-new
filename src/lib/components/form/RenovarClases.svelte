<script lang="ts">
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import type { User } from "$lib/types/user";
  import { Button, Card, Label, Input } from "flowbite-svelte";

  let { user, setLoadingModal, setToast, closeForm } = $props<{
    user: User;
    setLoadingModal: (loading: boolean, title?: string) => void;
    setToast: (title: string, success: boolean) => void;
    closeForm: () => void;
  }>();

  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.CLASES_TOMADAS, value: user.clases_tomadas || 0 },
    { key: UserKeys.LIMITE_CLASES, value: user.limite_clases || 0 },
  ]);
  const onUpdated = () => {
    user.clases_tomadas = updateItemValues[0].value;
    user.limite_clases = updateItemValues[1].value;
    closeForm();
  };
  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form class="flex flex-col space-y-6" action="/">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">Clases</h3>

    <Label class="space-y-2">
      <span>Clases realizadas</span>
      <Input
        type="number"
        name="clases_realizadas"
        placeholder="0"
        required
        bind:value={updateItemValues[0].value}
      />
    </Label>

    <Label class="space-y-2">
      <span>Limite de clases</span>
      <Input
        type="number"
        name="limite_calses"
        placeholder="0"
        bind:value={updateItemValues[1].value}
      />
    </Label>

    <Button
      onclick={() => actions.onUpdateSingleForm(updateItemValues, user.id)}
      class="w-full">Guardar cambios</Button
    >
  </form>
</Card>
