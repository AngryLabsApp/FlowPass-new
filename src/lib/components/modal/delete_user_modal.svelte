<script lang="ts">
  import { UserKeys } from "$lib/enums/user_keys";
  import { useUi } from "$lib/hooks/useUIFunctions.svelte";
  import { deleteUser } from "$lib/services/api/users";
  import type { User } from "$lib/types/user";
  import { toTitleCase } from "$lib/utils/utils";
  import { TriangleAlert } from "@lucide/svelte";
  import { Button, Modal, P } from "flowbite-svelte";
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  let {
    openModal = $bindable(false),
    user,
    onDeleted,
  } = $props<{
    openModal: boolean;
    user: User;
    onDeleted: (type?: UserKeys) => void;
  }>();

  const { setLoadingModal, setToast } = useUi();

  const onCLickDelete = async () => {
    setLoadingModal(true, "Eliminando Usuario");
    openModal = false;

    try {
      const response = await deleteUser(user.id);
      setToast("Se elimino el usuario con exito!", true);
      onDeleted(UserKeys.DELETE);
    } catch (error) {
      setToast(
        "Hubo un problema al eliminar. Reintenta en unos segundos.",
        false
      );
    } finally {
      setLoadingModal(false);
    }
  };
</script>

<Modal form bind:open={openModal} size="xs" permanent>
  <div class="flex flex-col items-center text-center">
    <!-- Icono de advertencia -->
    <div class="p-2 bg-red-50 rounded-full">
      <TriangleAlert size={28} class="text-red-500" />
    </div>

    <!-- Texto -->
    <div class="mt-3 flex flex-col gap-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        ¿Eliminar al alumno {toTitleCase(user.nombre)}
        {toTitleCase(user.apellidos)}?
      </h3>

      <p
        class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto"
      >
        Esta acción también eliminará todos los pagos registrados para este
        alumno y no podrá deshacerse.
      </p>
    </div>

    <!-- Acciones -->
    <div class="flex flex-col sm:flex-row gap-2 mt-5 w-full">
      <Button class="w-full" color="red" onclick={() => onCLickDelete()}>
        Eliminar alumno
      </Button>

      <Button
        class="w-full"
        color="alternative"
        onclick={() => (openModal = false)}
      >
        Cancelar
      </Button>
    </div>
  </div>
</Modal>
