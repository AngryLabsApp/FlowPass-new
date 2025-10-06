<script lang="ts">
  import type { IngresoUser } from "$lib/types/ingresoResponse";
  import { toTitleCase } from "$lib/utils/utils";
  import { Badge, Modal } from "flowbite-svelte";
  let { openModal = $bindable(false), user } = $props<{
    openModal: boolean;
    user: IngresoUser;
  }>();
</script>

<Modal open={openModal} placement={"center"}>
  <figure
    class="flex flex-col items-center justify-center rounded-t-lg bg-white p-8 text-center md:rounded-t-none md:rounded-tl-lg dark:border-gray-700 dark:bg-gray-800"
  >
    <blockquote class="mx-auto mb-4 max-w-2xl text-gray-500 dark:text-gray-400">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        ¡Bienvenido {toTitleCase(user.nombre)}
        {toTitleCase(user.apellidos)}!
      </h3>
      <p class="my-4 font-light">Disfruta de tu clase</p>

      <Badge color="green">
        Clase {user.clases_tomadas ?? "-"}
        {user.limite_clases ? "/" + user.limite_clases : ""}</Badge
      >
    </blockquote>
    <figcaption
      class="flex items-center justify-center space-x-3 rtl:space-x-reverse"
    >
      <div class="space-y-0.5 text-left font-medium dark:text-white">
        <div>¡Gracias!</div>
      </div>
    </figcaption>
  </figure>
</Modal>
