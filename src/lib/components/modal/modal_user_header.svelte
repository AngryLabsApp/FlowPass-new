<script lang="ts">
  import { Pencil } from "@lucide/svelte";
  import { Badge } from "flowbite-svelte";
  import {
    ExclamationCircleOutline,
    UsersOutline,
  } from "flowbite-svelte-icons";
  import { toTitleCase } from "$lib/utils/utils";
  import type { User } from "$lib/types/user";

  export let formated_user: User;
  export let getUserInitials: (name: string, lastname: string) => string;
</script>

<div class="flex items-center gap-3 flex-wrap">
  <!-- Avatar + editar -->
  <div class="relative flex items-center">
    <div
      class="border border-green-700 w-12 h-12 rounded-full flex justify-center items-center bg-green-200 text-green-800"
    >
      {getUserInitials(formated_user.nombre, formated_user.apellidos)}
    </div>

    <button
      aria-label="Editar nombre del usuario"
      onclick={() => console.log("abrir form de editar nombre!")}
      class="absolute -right-1 -bottom-1 flex items-center justify-center w-5 h-5 rounded-full
             bg-white shadow-md cursor-pointer transition-all duration-200
             hover:bg-gray-100 hover:shadow-xl hover:scale-110"
    >
      <Pencil size={10} class="text-gray-700" />
    </button>
  </div>

  <!-- Nombre + fecha -->
  <div>
    <div class="font-semibold">{formated_user.full_name}</div>
    <div class="text-xs text-gray-400">{formated_user.fecha_alta}</div>
  </div>

  <!-- Badges -->
  {#if formated_user.is_plan_partner}
    {#if formated_user.is_plan_principal}
      <Badge large color="green">Principal</Badge>
    {/if}

    <Badge large color="gray">
      <UsersOutline />
      Compañero:
      {toTitleCase(formated_user.partner_nombre || "")}
      {toTitleCase(formated_user.partner_apellidos || "")}
    </Badge>
  {/if}

  {#if formated_user?.clases_tomadas >= formated_user?.limite_clases}
    <Badge large color="yellow">
      <ExclamationCircleOutline />
      Límite de clases alcanzado ({formated_user.clases_tomadas}/{formated_user.limite_clases})
    </Badge>
  {/if}
</div>
