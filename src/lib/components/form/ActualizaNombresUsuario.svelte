<script lang="ts">
  import type { FormProps } from "$lib/catalog/form_component_catalog";
  import { UserKeys } from "$lib/enums/user_keys";
  import {
    useFormUpdateHook,
    type UpdateFormItem,
  } from "$lib/hooks/useFormUpdate.svelte";
  import { Button, Card, Label, Input } from "flowbite-svelte";

  let { user, setLoadingModal, setToast, closeForm }: FormProps = $props();

  // Aquí definimos 2 items: NOMBRE y APELLIDOS
  let updateItemValues: UpdateFormItem[] = $state([
    { key: UserKeys.NOMBRE, value: user.nombre || "" },
    { key: UserKeys.APELLIDOS, value: user.apellidos || "" },
  ]);

  const onUpdated = () => {
    // Actualizas directamente el user local
    user.nombre = updateItemValues[0].value as string;
    user.apellidos = updateItemValues[1].value as string;

    closeForm(false); // Cierra el formulario
  };

  const actions = useFormUpdateHook({ setLoadingModal, setToast, onUpdated });
</script>

<Card class="p-4 sm:p-6 md:p-8">
  <form
    class="flex flex-col space-y-6"
    onsubmit={(e) =>
      actions.onUpdateSingleForm(updateItemValues, user.id, e)
    }
  >
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      Actualizar nombre(s) y apellido(s)
    </h3>

    <!-- Nombre -->
    <Label class="space-y-2">
      <span class="text-sm font-medium text-gray-700">Nombre(s)</span>
      <Input
        type="text"
        name="nombre"
        required
        bind:value={updateItemValues[0].value}
      />
    </Label>

    <!-- Apellidos -->
    <Label class="space-y-2">
      <span class="text-sm font-medium text-gray-700">Apellido(s)</span>
      <Input
        type="text"
        name="apellidos"
        required
        bind:value={updateItemValues[1].value}
      />
    </Label>

    <Button type="submit" class="w-full">Guardar cambios</Button>
  </form>
</Card>
