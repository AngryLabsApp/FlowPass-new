<script lang="ts">
  import type { IngresoUser } from "$lib/types/ingresoResponse";
  import { toTitleCase } from "$lib/utils/utils";
  import { Badge, Modal } from "flowbite-svelte";
  let { openModal = $bindable(false), user } = $props<{
    openModal: boolean;
    user: IngresoUser;
  }>();
</script>

<Modal open={openModal} placement={"center"} class="bg-green-100 ">
  <figure
    class="bg-green-100 flex flex-col items-center justify-center rounded-t-lg p-8 text-center md:rounded-t-none md:rounded-tl-lg dark:border-gray-700 dark:bg-gray-800"
  >
    <blockquote class="mx-auto mb-4 max-w-2xl text-gray-500 dark:text-gray-400">
      <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">
        ¡Bienvenido {toTitleCase(user.nombre)}
        {toTitleCase(user.apellidos)}!
      </h1>
      <p class="my-4 font-light text-2xl">Disfruta de tu clase</p>

      <Badge color="secondary" class="text-3xl">
        Clase {user.clases_tomadas ?? "-"}
        {user.limite_clases ? "/" + user.limite_clases : ""}</Badge
      >
    </blockquote>
    <figcaption
      class="flex items-center justify-center space-x-3 rtl:space-x-reverse"
    >
      <div class="space-y-0.5 text-left font-medium dark:text-white text-2xl" >
        <div>¡Gracias!</div>
      </div>
    </figcaption>
  </figure>
</Modal>
