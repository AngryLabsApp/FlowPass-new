<script lang="ts">
    import { send_code } from "$lib/services/api/notifications";
    import { Button } from "flowbite-svelte";
    import { WhatsappSolid } from "flowbite-svelte-icons";

    let { user, setLoadingModal, setToast } = $props();

    const onClick = async () => {
        try {
            setLoadingModal(true, "Enviando codigo...");
            const response = await send_code(user.id);

            setToast("El código de ingreso se envió con éxito.", true);
        } catch (err: any) {
            let error_message = err.message;
            let text =
                "Hubo un problema al enviar el codigo. Reintenta en unos segundos.";
            switch (error_message) {
                case "USER_NOT_FOUND":
                case "ERROR_SENDING_MESSAGE":
                    break;
                case "INVALID_PHONE":
                    text = "El número de teléfono no es válido.";
                    break;
            }
            setToast(text, false);
        } finally {
            setLoadingModal(false);
        }
    };
</script>

<Button color="green" class="flex p-1.5 w-fit gap-1" onclick={() => onClick()} size="xs" disabled={user.notificar == "No"}>
    <WhatsappSolid size="sm" /> Enviar código
</Button>
