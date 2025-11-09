<script lang="ts">
    import { UserKeys } from "$lib/enums/user_keys";
    import { useUi } from "$lib/hooks/useUIFunctions.svelte";
    import { deleteUser } from "$lib/services/api/users";
    import type { User } from "$lib/types/user";
    import { toTitleCase } from "$lib/utils/utils";
    import { Button, Modal, P } from "flowbite-svelte";
    import { ExclamationCircleOutline } from "flowbite-svelte-icons";
    let {
        openModal = $bindable(false),
        user,
        onDeleted,
    } = $props<{
        openModal: boolean;
        user: User;
        onDeleted: (type?:UserKeys) => void;
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
                false,
            );
        } finally {
            setLoadingModal(false);
        }
    };
</script>

<Modal form bind:open={openModal} size="xs" permanent>
    <div class="text-center">
        <ExclamationCircleOutline
            class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
        />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            ¿Seguro que quieres eliminar al alumno {toTitleCase(user.nombre)}
            {toTitleCase(user.apellidos)}?
        </h3>
        <div class="space-x-2">
            <Button value="yes" color="red" onclick={() => onCLickDelete()}
                >Si</Button
            >
            <Button onclick={() => (openModal = false)} color="alternative"
                >No, cancelar</Button
            >
        </div>
    </div>
</Modal>
